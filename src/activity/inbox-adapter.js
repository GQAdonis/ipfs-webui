import { AguiMessageSchema, DecisionIdSchema, decisionProjectionFromObservation } from '@gqadonis/ipfs-mcp-ui'

const sameReview = (left, right) => left && right && left.generation === right.generation && left.serverEpoch === right.serverEpoch && left.decisionId === right.decisionId && left.record === right.record
const safeAguiId = id => AguiMessageSchema.safeParse({ id, role: 'user' }).success
const refusal = reason => ({ ok: false, reason })

/** Trusted host ingress only. Cards supply an ID/review, never the authenticated observation/grant. */
export function createInboxDecisionAdapter ({ feed, connectionStore, now = Date.now }) {
  const listeners = new Set(); const sessions = new WeakMap()
  const surface = Object.freeze({ kind: 'inbox', instance: `inbox_${globalThis.crypto.randomUUID().replaceAll('-', '_')}` })
  let state = Object.freeze({ selectedId: undefined, selection: undefined, busy: false, missing: false, error: undefined })
  let active = false; let disposed = false; let sequence = 0; let prepared; let operation; let selectedCapture; let unsubscribe; let unsubscribeFeed; let feedScope
  const emit = patch => { state = Object.freeze({ ...state, ...patch }); listeners.forEach(listener => listener()) }
  function cancel () { ++sequence; operation?.abort(); operation = undefined; prepared = undefined }
  function clear () { cancel(); emit({ selectedId: undefined, selection: undefined, busy: false, missing: false, error: undefined }) }
  function captureCurrent () {
    const facts = connectionStore.getSnapshot()
    if (facts.status !== 'ready') return undefined
    const capture = connectionStore.capture()
    return capture?.isCurrent() ? capture : undefined
  }
  function sync () {
    selectedCapture?.signal.removeEventListener('abort', clear)
    clear()
    selectedCapture = captureCurrent()
    selectedCapture?.signal.addEventListener('abort', clear, { once: true })
  }
  function current (capture, ticket) { return active && !disposed && ticket === sequence && capture.isCurrent() && capture.generation === connectionStore.getSnapshot().generation }
  function display (ingress) {
    const projection = decisionProjectionFromObservation(ingress.observation)
    if (!projection.ok) return undefined
    const review = Object.freeze({ generation: ingress.generation, serverEpoch: ingress.serverEpoch, decisionId: projection.observation.id, record: JSON.stringify(projection.observation) })
    return Object.freeze({ ...ingress, review })
  }
  function context (id) {
    if (!active || disposed || !prepared || prepared.id !== id || !connectionStore.getSnapshot().chatEnabled) return undefined
    const capture = captureCurrent(); const latest = feed.getValidated(id)
    if (!capture || !latest || capture.signal !== prepared.capture.signal || latest.generation !== capture.generation || latest.generation !== prepared.ingress.generation ||
      latest.serverEpoch !== prepared.ingress.serverEpoch || latest.observation !== prepared.ingress.observation) return undefined
    const r = latest.observation; const c = r.actions.continuation
    const nowMs = now(); const expiresMs = Date.parse(r.expires_at)
    if (r.approval_state !== 'pending' || !c || c.method !== 'POST' || c.route !== '/agui' || !safeAguiId(c.thread_id) || !safeAguiId(c.interrupt_id) ||
      r.actions.authorized_surface !== 'owned_chat' || !Number.isFinite(nowMs) || !Number.isFinite(expiresMs) || expiresMs <= nowMs) return undefined
    const projection = decisionProjectionFromObservation(r)
    if (!projection.ok) return undefined
    const native = projection.model.requiresNativePrompt
    const authorization = Object.freeze({
      confirmationId: r.id,
      tool: r.summary.tool,
      source: r.source,
      authority: r.authority.kind,
      ...(r.effect_digest !== undefined && { effectDigest: r.effect_digest }),
      resolver: 'agui-interrupt',
      threadId: c.thread_id,
      interruptId: c.interrupt_id,
      open: true,
      canApprove: !native && r.actions.approve === true && r.actions.authorized_surface === 'owned_chat',
      canDeny: r.actions.deny === true
    })
    if (!authorization.canApprove && !authorization.canDeny) return undefined
    return Object.freeze({ generation: latest.generation, serverEpoch: latest.serverEpoch, observation: latest.observation, authorization })
  }
  async function open (id) {
    if (!active || disposed || !DecisionIdSchema.safeParse(id).success || id === 'events') return false
    const capture = captureCurrent()
    if (!capture) return false
    const before = feed.getValidated(id)
    cancel()
    const ticket = sequence; const mine = new AbortController()
    operation = mine
    emit({ selectedId: id, selection: undefined, busy: true, missing: false, error: undefined })
    try {
      const result = await feed.readDecisionResult(id, { signal: mine.signal })
      const ingress = result.kind === 'observation' ? result.ingress : undefined
      if (!current(capture, ticket) || mine.signal.aborted) return false
      const latest = feed.getValidated(id)
      if (!ingress || !latest || ingress.observation !== latest.observation || ingress.generation !== capture.generation || ingress.serverEpoch !== latest.serverEpoch) {
        emit({ selection: before && display(before), missing: result.kind === 'missing' && result.generation === capture.generation && result.serverEpoch === before?.serverEpoch, error: result.kind === 'missing' ? 'unavailable' : 'refresh-required' })
        return false
      }
      const selection = display(ingress)
      if (!selection) { emit({ error: 'unavailable' }); return false }
      prepared = { id, ingress, capture }
      emit({ selection, error: undefined })
      return true
    } catch {
      if (current(capture, ticket)) emit({ error: 'refresh-required' }); return false
    } finally { if (current(capture, ticket)) { operation = undefined; emit({ busy: false }) } }
  }
  async function continueReviewed (controller, request) {
    if (!active || disposed || state.busy || !state.selection || !['approve', 'deny'].includes(request?.decision) || !request?.surface || request.surface.kind !== surface.kind || request.surface.instance !== surface.instance || !sameReview(request.review, state.selection.review)) return refusal('stale_review')
    const capture = captureCurrent(); const scope = controller.captureLifetime()
    const controllerState = controller.getSnapshot()
    if (!scope.isCurrent() || scope.signal.aborted || !capture || !connectionStore.getSnapshot().chatEnabled || !controllerState.configured || controllerState.disposed || controllerState.generation !== capture.generation || !context(request.review.decisionId)) return refusal('not_authorized')
    const authorized = context(request.review.decisionId)?.authorization
    if (!(request.decision === 'approve' ? authorized?.canApprove : authorized?.canDeny)) return refusal('not_authorized')
    const projection = decisionProjectionFromObservation(request.observation)
    if (!projection.ok || JSON.stringify(projection.observation) !== request.review.record) return refusal('stale_review')
    const ticket = sequence; const mine = new AbortController()
    operation = mine
    const abort = () => mine.abort()
    scope.signal.addEventListener('abort', abort, { once: true })
    emit({ busy: true, error: undefined })
    try {
      // Re-read through the current protected client before every attempted continuation. No card or
      // graph value is accepted as authenticated ingress, even when it looks schema-valid.
      const read = await feed.readDecisionResult(request.review.decisionId, { signal: mine.signal })
      const ingress = read.kind === 'observation' ? read.ingress : undefined
      if (!current(capture, ticket) || mine.signal.aborted || !scope.isCurrent() || scope.generation !== capture.generation) return refusal('stale_review')
      const selection = ingress && display(ingress); const latest = feed.getValidated(request.review.decisionId)
      if (!selection || !latest || latest.observation !== ingress.observation || !sameReview(selection.review, request.review)) {
        prepared = undefined
        emit({ selection: selection ?? state.selection, missing: read.kind === 'missing' && read.generation === capture.generation && read.serverEpoch === request.review.serverEpoch, error: read.kind === 'observation' ? 'changed' : read.kind === 'missing' ? 'unavailable' : 'refresh-required' })
        return refusal('stale_review')
      }
      prepared = { id: request.review.decisionId, ingress, capture }
      if (!context(request.review.decisionId) || !scope.isCurrent()) return refusal('not_authorized')
      // Existing controller rechecks this same private context immediately before its actual transport.
      const result = await controller.continueDecision(request)
      if (current(capture, ticket)) { prepared = undefined; emit({ error: result.ok ? 'attempted' : 'refused' }); feed.refresh() }
      return result
    } catch {
      if (current(capture, ticket)) { prepared = undefined; emit({ error: 'refused' }) }; return refusal('not_authorized')
    } finally {
      scope.signal.removeEventListener('abort', abort)
      if (current(capture, ticket)) { operation = undefined; emit({ busy: false }) }
    }
  }
  const callbacks = Object.freeze({
    getDecisionContext: context,
    readDecision: async id => { await open(id) },
    onDecisionInvalidated: () => { if (!active || disposed) return; prepared = undefined; feed.refresh() }
  })
  const api = Object.freeze({
    surface,
    callbacks,
    getSnapshot: () => state,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    getContext: context,
    open,
    close: clear,
    sessionFor (controller) {
      let session = sessions.get(controller)
      if (!session) {
        session = Object.freeze({
          ...controller,
          continueDecision: request => continueReviewed(controller, request),
          checkDecision: async review => {
            if (!state.selection || !sameReview(review, state.selection.review)) return refusal('stale_review')
            return await open(review.decisionId) ? { ok: true } : refusal('not_authorized')
          }
        })
        sessions.set(controller, session)
      }
      return session
    },
    start () {
      if (disposed || active) return () => {}
      active = true
      unsubscribe = connectionStore.subscribe(sync)
      feedScope = feed.getSnapshot().scopeKey
      unsubscribeFeed = feed.subscribe(() => {
        const next = feed.getSnapshot().scopeKey
        if (next !== feedScope) { feedScope = next; clear() }
      })
      sync()
      return api.stop
    },
    stop () { if (!active) return; active = false; selectedCapture?.signal.removeEventListener('abort', clear); selectedCapture = undefined; unsubscribe?.(); unsubscribe = undefined; unsubscribeFeed?.(); unsubscribeFeed = undefined; clear() },
    dispose () { if (disposed) return; api.stop(); disposed = true; listeners.clear() }
  })
  return api
}
