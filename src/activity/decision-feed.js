import { decisionProjectionFromObservation } from '@gqadonis/ipfs-mcp-ui'
import { createDecisionReadClient, DecisionReadError } from '../agent-chat/decisions-client.js'
import { clearDecisionGraph, createDecisionGraph, replaceDecisionGraph, replaceDecisionDetail, removeDecisionDetail } from './decision-graph.js'

const MAX_PAGES = 4
const MAX_HINTS = 128
const MAX_PROJECTION_BYTES = 4 * 1048576
const STALE = Symbol('stale-read')
function validated (observation) {
  const result = decisionProjectionFromObservation(observation)
  if (!result.ok) throw new DecisionReadError('protocol')
  // Keep the client's deeply frozen canonical observation, never a lossy presentation fallback.
  return observation
}
const needsDetail = observation => observation.approval_state !== 'pending' || observation.execution !== undefined
const failureKind = error => error instanceof DecisionReadError ? error.kind : 'network'

/** One application-owned readonly stream/snapshot reconciler; no network work until start(). */
export function createDecisionFeed ({ connectionStore, enabled = true, makeClient = createDecisionReadClient, now = Date.now, schedule = setTimeout, cancelScheduled = clearTimeout } = {}) {
  let active = false; let disposed = false; let switchedOn = enabled
  let capture, client, lifetime, streamAbort, readAbort, unsubscribeConnection
  let serial = 0; let graphSerial = 0; let loading = false; let requested = false; let force = false
  const hints = new Set(); const hintedIds = new Set()
  let reconnectDelay = 1000; let retryTimer; let reconcileTimer
  const listeners = new Set(); const observed = new Map(); const manualReads = new Map()
  const abortManualReads = () => { manualReads.forEach(owner => owner.abort()); manualReads.clear() }
  let snapshot = fresh(connectionStore.getSnapshot().generation, switchedOn ? 'idle' : 'disabled')
  function fresh (generation, status, epoch) {
    return Object.freeze({ generation, epoch, status, graph: createDecisionGraph(), scopeKey: `${generation}:${++graphSerial}`, fresh: false, complete: false, hasMore: false, truncated: false, historyUnavailable: false })
  }
  const emit = patch => { snapshot = Object.freeze({ ...snapshot, ...patch }); listeners.forEach(listener => listener()) }
  const current = ticket => active && !disposed && ticket === serial && capture?.isCurrent() && !lifetime?.signal.aborted
  const clearTimers = () => { if (retryTimer !== undefined) cancelScheduled(retryTimer); if (reconcileTimer !== undefined) cancelScheduled(reconcileTimer); retryTimer = reconcileTimer = undefined }
  function retire () {
    ++serial
    abortManualReads(); observed.clear()
    clearTimers()
    lifetime?.abort(); streamAbort?.abort(); readAbort?.abort()
    lifetime = streamAbort = readAbort = undefined
    capture = client = undefined
    loading = requested = force = false
    hints.clear(); hintedIds.clear()
    clearDecisionGraph(snapshot.graph)
  }
  function rotateEpoch (epoch) {
    if (snapshot.epoch === epoch) return
    abortManualReads(); observed.clear()
    clearDecisionGraph(snapshot.graph)
    const next = fresh(snapshot.generation, 'loading', epoch)
    snapshot = Object.freeze({ ...next, historyUnavailable: snapshot.epoch !== undefined || snapshot.historyUnavailable })
    listeners.forEach(listener => listener())
  }
  function showFailure (error, ticket, fromStream = false) {
    if (!current(ticket)) return
    const kind = failureKind(error)
    const terminal = ['unauthenticated', 'forbidden', 'unavailable', 'no-token'].includes(kind)
    if (terminal || fromStream || kind === 'rate-limited') {
      abortManualReads()
      readAbort?.abort()
      if (reconcileTimer !== undefined) cancelScheduled(reconcileTimer)
      reconcileTimer = undefined; requested = false; force = false; hints.clear(); hintedIds.clear()
    }
    if (terminal) {
      streamAbort?.abort(); readAbort?.abort(); clearTimers()
      observed.clear(); abortManualReads(); clearDecisionGraph(snapshot.graph)
    }
    const status = kind === 'no-token' ? 'unauthenticated' : terminal ? kind : kind === 'rate-limited' ? 'rate-limited' : fromStream ? 'reconnecting' : 'error'
    emit({ status, fresh: false, complete: false, error: Object.freeze({ kind, status: error.status, retryAt: error.retryAt }), ...(kind === 'unavailable' && { historyUnavailable: true }) })
    if (terminal) return
    if (kind === 'rate-limited') {
      streamAbort?.abort(); readAbort?.abort()
      const delay = error.retryAt - now()
      if (Number.isFinite(delay)) retryTimer = schedule(() => { retryTimer = undefined; if (current(ticket)) connect(ticket) }, Math.max(0, delay))
    } else if (fromStream) {
      const delay = reconnectDelay
      reconnectDelay = Math.min(30000, reconnectDelay * 2)
      retryTimer = schedule(() => { retryTimer = undefined; if (current(ticket)) connect(ticket) }, delay)
    }
  }
  function invalidate (revision, id, always = false) {
    if (revision !== undefined) hints.add(revision)
    if (id !== undefined) hintedIds.add(id)
    if (hints.size > MAX_HINTS || hintedIds.size > MAX_HINTS) { hints.clear(); hintedIds.clear(); force = true }
    if (always) force = true
    if (!loading && !force && snapshot.fresh && hints.size === 1 && hints.has(snapshot.revision)) { hints.clear(); hintedIds.clear(); return }
    requested = true
    const status = snapshot.status === 'reconnecting' ? 'reconnecting' : 'loading'
    if (snapshot.fresh || snapshot.complete || snapshot.status !== status) emit({ fresh: false, complete: false, status })
    queueReconcile()
  }
  function queueReconcile (delay = 24) {
    if (['unauthenticated', 'forbidden', 'unavailable', 'rate-limited'].includes(snapshot.status)) return
    if (loading || reconcileTimer !== undefined || !active || !client || !lifetime || lifetime.signal.aborted) return
    const ticket = serial
    reconcileTimer = schedule(() => { reconcileTimer = undefined; if (current(ticket)) void reconcile(ticket) }, delay)
  }
  async function terminalDetails (rows, metadata, ticket, signal) {
    const output = new Array(rows.length)
    let next = 0; let unavailable = false; let limited = false; let bytes = 0
    const retain = (index, observation) => {
      const size = new TextEncoder().encode(JSON.stringify(observation)).length
      if (bytes + size > MAX_PROJECTION_BYTES) { limited = true; return }
      bytes += size; output[index] = validated(observation)
    }
    const worker = async () => {
      while (next < rows.length) {
        if (!current(ticket) || signal.aborted || snapshot.epoch !== metadata.server_epoch) throw STALE
        const index = next++; const record = rows[index]
        if (!needsDetail(record)) { retain(index, record); continue }
        let detail
        try { detail = await client.item(record.id, { signal }) } catch (error) {
          if (failureKind(error) === 'unavailable' && current(ticket) && !signal.aborted) { unavailable = true; continue }
          throw error
        }
        if (!current(ticket) || signal.aborted || snapshot.epoch !== metadata.server_epoch) throw STALE
        if (detail.item.id !== record.id) throw new DecisionReadError('protocol')
        if (detail.server_epoch !== metadata.server_epoch) { rotateEpoch(detail.server_epoch); throw STALE }
        if (detail.revision !== metadata.revision || detail.history_started_at !== metadata.history_started_at) throw STALE
        retain(index, detail.item)
      }
    }
    await Promise.all(Array.from({ length: Math.min(4, rows.length) }, worker))
    return { rows: output.filter(Boolean), unavailable, limited }
  }
  async function load (ticket, signal, mayRestart = true) {
    if (!current(ticket) || signal.aborted) throw STALE
    let cursor; let metadata; let hasMore = false; let nextCursor
    const rows = []; const ids = new Set(); const cursors = new Set()
    for (let page = 0; page < MAX_PAGES; page++) {
      let response
      const requestedEpoch = snapshot.epoch
      try { response = await client.list({ limit: 100, ...(cursor && { cursor }), signal }) } catch (error) {
        if (!current(ticket) || signal.aborted) throw STALE
        if (cursor && failureKind(error) === 'cursor' && mayRestart) return load(ticket, signal, false)
        throw error
      }
      if (!current(ticket) || signal.aborted) throw STALE
      if (snapshot.epoch !== requestedEpoch && response.server_epoch !== snapshot.epoch) throw STALE
      if (!metadata) {
        metadata = response
        rotateEpoch(response.server_epoch)
      } else if (response.server_epoch !== metadata.server_epoch || response.revision !== metadata.revision || response.history_started_at !== metadata.history_started_at) {
        if (mayRestart) return load(ticket, signal, false)
        throw new DecisionReadError('protocol')
      }
      for (const record of response.items) {
        if (ids.has(record.id)) throw new DecisionReadError('protocol')
        ids.add(record.id); rows.push(validated(record))
      }
      hasMore = response.page.has_more
      nextCursor = response.page.next_cursor
      if (!hasMore) break
      if (cursors.has(nextCursor)) throw new DecisionReadError('protocol')
      cursors.add(nextCursor); cursor = nextCursor
    }
    const details = await terminalDetails(rows, metadata, ticket, signal)
    return { metadata, rows: details.rows, hasMore, nextCursor, historyUnavailable: details.unavailable, limited: details.limited }
  }
  async function reconcile (ticket) {
    if (!current(ticket) || loading || snapshot.error?.retryAt > now()) return
    loading = true; requested = false; force = false; hints.clear(); hintedIds.clear()
    const mine = new AbortController()
    readAbort = mine
    const abort = () => mine.abort()
    lifetime.signal.addEventListener('abort', abort, { once: true })
    emit({ status: 'loading', fresh: false, complete: false, error: undefined })
    try {
      const result = await load(ticket, mine.signal)
      if (!current(ticket) || mine.signal.aborted) return
      const dirty = force || [...hints].some(revision => revision !== result.metadata.revision)
      if (dirty) { requested = true; return }
      hints.clear(); hintedIds.clear(); requested = false
      observed.clear(); result.rows.forEach(observation => observed.set(observation.id, observation))
      replaceDecisionGraph(snapshot.graph, result.rows, result)
      reconnectDelay = 1000
      emit({ status: 'ready', fresh: !result.historyUnavailable, complete: !result.hasMore && !result.historyUnavailable && !result.limited, hasMore: result.hasMore, truncated: result.hasMore || result.limited, revision: result.metadata.revision, historyStartedAt: result.metadata.history_started_at, retention: result.metadata.retention, historyUnavailable: snapshot.historyUnavailable || result.historyUnavailable, error: undefined })
    } catch (error) {
      if (!current(ticket) || mine.signal.aborted) return
      if (error === STALE) { requested = true; mine.abort() } else showFailure(error, ticket)
    } finally {
      lifetime?.signal.removeEventListener('abort', abort)
      if (readAbort === mine) readAbort = undefined
      if (ticket === serial) { loading = false; if (requested) queueReconcile(250) }
    }
  }
  function connect (ticket) {
    if (!current(ticket)) return
    streamAbort?.abort()
    const mine = new AbortController()
    streamAbort = mine
    const abort = () => mine.abort()
    lifetime.signal.addEventListener('abort', abort, { once: true })
    emit({ status: snapshot.epoch ? 'reconnecting' : 'connecting', fresh: false, complete: false, error: undefined })
    // Initial marker is emitted only after the server has subscribed this stream. No list read before it.
    void client.events({
      signal: mine.signal,
      onEvent: event => {
        if (!current(ticket) || mine.signal.aborted) return
        if (event.type === 'snapshot') { if (snapshot.epoch !== undefined && snapshot.epoch !== event.data.server_epoch) readAbort?.abort(); rotateEpoch(event.data.server_epoch); invalidate(event.data.revision, undefined, true) } else invalidate(event.data.revision, event.data.id)
      }
    }).then(() => {
      if (current(ticket) && !mine.signal.aborted) showFailure(new DecisionReadError('network'), ticket, true)
    }, error => {
      if (current(ticket) && !mine.signal.aborted) showFailure(error, ticket, true)
    }).finally(() => lifetime?.signal.removeEventListener('abort', abort))
  }
  function sync () {
    if (!active || disposed) return
    const connection = connectionStore.getSnapshot()
    // Ready resolution within one generation is also a meaningful transport transition.
    const selected = switchedOn && connection.status === 'ready' ? connectionStore.capture() : null
    if (capture && selected && capture.generation === selected.generation && capture.signal === selected.signal && capture.isCurrent()) return
    retire()
    snapshot = fresh(connection.generation, !switchedOn ? 'disabled' : selected ? 'connecting' : connection.status)
    listeners.forEach(listener => listener())
    if (!selected) return
    capture = selected; lifetime = new AbortController()
    const ticket = serial
    const abort = () => {
      if (ticket !== serial) return
      // Synchronous host retirement clears the old graph before replacement subscribers run.
      retire()
      snapshot = fresh(connectionStore.getSnapshot().generation, 'connecting')
      listeners.forEach(listener => listener())
    }
    selected.signal.addEventListener('abort', abort, { once: true })
    lifetime.signal.addEventListener('abort', () => selected.signal.removeEventListener('abort', abort), { once: true })
    if (selected.signal.aborted || !selected.isCurrent()) { abort(); return }
    try { client = makeClient({ capture: selected, now }) } catch (error) { showFailure(error, ticket); return }
    connect(ticket)
  }
  const api = Object.freeze({
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    start () {
      if (disposed || active) return () => {}
      active = true
      unsubscribeConnection = connectionStore.subscribe(sync)
      sync()
      return api.stop
    },
    stop () {
      if (!active) return
      active = false; unsubscribeConnection?.(); unsubscribeConnection = undefined
      retire()
      snapshot = fresh(connectionStore.getSnapshot().generation, switchedOn ? 'idle' : 'disabled')
      listeners.forEach(listener => listener())
    },
    setEnabled (value) { if (disposed || value === switchedOn) return; switchedOn = value; if (active) sync() },
    refresh () {
      if (!active || !capture?.isCurrent() || snapshot.error?.retryAt > now()) return
      if (['unauthenticated', 'forbidden', 'unavailable'].includes(snapshot.status)) { retire(); sync(); return }
      invalidate(undefined, undefined, true)
    },
    async readDecision (id, options) {
      const result = await api.readDecisionResult(id, options)
      return result.kind === 'observation' ? result.ingress : undefined
    },
    async readDecisionResult (id, { signal } = {}) {
      const ticket = serial; const epoch = snapshot.epoch; const revision = snapshot.revision; const generation = snapshot.generation
      if (!current(ticket) || !snapshot.fresh || !client || signal?.aborted) return Object.freeze({ kind: 'stale' })
      if (manualReads.has(id) || manualReads.size >= 4) return Object.freeze({ kind: 'busy' })
      const mine = new AbortController()
      manualReads.set(id, mine)
      const hostSignal = lifetime.signal
      const abort = () => mine.abort()
      hostSignal.addEventListener('abort', abort, { once: true }); signal?.addEventListener('abort', abort, { once: true })
      if (signal?.aborted) mine.abort()
      try {
        const detail = await client.item(id, { signal: mine.signal })
        if (!current(ticket) || mine.signal.aborted || snapshot.epoch !== epoch || snapshot.revision !== revision || !snapshot.fresh) return Object.freeze({ kind: 'stale' })
        if (detail.item.id !== id) throw new DecisionReadError('protocol')
        if (detail.server_epoch !== epoch) { rotateEpoch(detail.server_epoch); invalidate(detail.revision, id, true); return Object.freeze({ kind: 'stale' }) }
        if (detail.history_started_at !== snapshot.historyStartedAt) throw new DecisionReadError('protocol')
        if (detail.revision !== revision) { invalidate(detail.revision, id); return Object.freeze({ kind: 'stale' }) }
        const observation = validated(detail.item)
        const bounded = new Map(observed)
        bounded.set(id, observation)
        const bytes = [...bounded.values()].reduce((sum, record) => sum + new TextEncoder().encode(JSON.stringify(record)).length, 0)
        if (bounded.size > 400 || bytes > MAX_PROJECTION_BYTES) { emit({ truncated: true, complete: false }); return Object.freeze({ kind: 'error', reason: 'projection-limit' }) }
        observed.set(id, observation)
        replaceDecisionDetail(snapshot.graph, observation)
        return Object.freeze({ kind: 'observation', ingress: Object.freeze({ generation: snapshot.generation, serverEpoch: epoch, observation }) })
      } catch (error) {
        if (!current(ticket) || mine.signal.aborted || snapshot.epoch !== epoch || snapshot.revision !== revision || !snapshot.fresh) return Object.freeze({ kind: 'stale' })
        if (failureKind(error) === 'unavailable' && error.status === 404) { observed.delete(id); removeDecisionDetail(snapshot.graph, id); emit({ historyUnavailable: true, fresh: false, complete: false }); invalidate(undefined, id, true); return Object.freeze({ kind: 'missing', generation, serverEpoch: epoch, decisionId: id }) }
        showFailure(error, ticket)
        return Object.freeze({ kind: 'error', reason: failureKind(error) })
      } finally {
        hostSignal.removeEventListener('abort', abort); signal?.removeEventListener('abort', abort)
        if (manualReads.get(id) === mine) manualReads.delete(id)
      }
    },
    getValidated (id) {
      if (!snapshot.fresh || !capture?.isCurrent()) return undefined
      // Trusted ingress is private: graph patches/replacements and copied cards cannot mint it.
      const observation = observed.get(id)
      return observation ? Object.freeze({ generation: snapshot.generation, serverEpoch: snapshot.epoch, observation }) : undefined
    },
    dispose () { if (disposed) return; api.stop(); disposed = true; clearDecisionGraph(snapshot.graph); emit({ status: 'disposed', fresh: false, complete: false }); listeners.clear() }
  })
  return api
}
