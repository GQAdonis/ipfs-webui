// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDecisionFeed } from './decision-feed.js'
import { DecisionReadError } from '../agent-chat/decisions-client.js'
import { DECISION_ENTITY, DECISION_LIST } from './decision-graph.js'

const fixture = name => JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/decisions/examples', name), 'utf8'))
const listFixture = fixture('list.json')
const itemFixture = fixture('item.json')
const pendingFixture = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/confirmation/examples/DecisionObservation/activity-pending.json'), 'utf8'))

const clone = value => JSON.parse(JSON.stringify(value))
const pending = (id = 'cf_pending_fixture_1') => ({ ...clone(pendingFixture), id: id.padEnd(19, '_') })
const page = (rows = [pending()], revision = 'rev_one', extra = {}) => ({ ...clone(listFixture), items: rows, revision, page: { has_more: false }, ...extra })
const detail = (record, revision = 'rev_one', extra = {}) => ({ ...clone(itemFixture), item: record, revision, ...extra })
function deferred () { let resolve, reject; const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject }); return { promise, resolve, reject } }
const feeds = []
afterEach(() => { feeds.splice(0).forEach(feed => feed.dispose()) })

function harness ({ list = async () => page(), item = async id => detail(pending(id)), enabled = true } = {}) {
  let selected = { generation: 'auth_one', status: 'ready', root: 'http://127.0.0.1:5050', endpoint: 'http://127.0.0.1:5050/agui', session: false }
  let owner = new AbortController()
  const subscriptions = new Set(); const timers = new Map(); const streams = []
  let nextTimer = 0; let clock = 1000
  const connectionStore = {
    getSnapshot: () => selected,
    subscribe: fn => { subscriptions.add(fn); return () => subscriptions.delete(fn) },
    capture: () => {
      const signal = owner.signal; const generation = selected.generation
      return { ...selected, signal, isCurrent: () => !signal.aborted && selected.generation === generation, getToken: async () => 'fixture' }
    }
  }
  const client = {
    list: vi.fn(list),
    item: vi.fn(item),
    events: vi.fn(options => { const stream = deferred(); streams.push({ ...options, ...stream }); return stream.promise })
  }
  const feed = createDecisionFeed({
    connectionStore,
    enabled,
    makeClient: () => client,
    now: () => clock,
    schedule: (callback, delay) => { const key = ++nextTimer; timers.set(key, { callback, at: clock + delay }); return key },
    cancelScheduled: key => timers.delete(key)
  })
  feeds.push(feed)
  return {
    feed,
    client,
    streams,
    timers,
    subscriptions,
    async tick (milliseconds = 1000) {
      clock += milliseconds
      const ready = [...timers].filter(([, timer]) => timer.at <= clock)
      for (const [key, timer] of ready) { if (!timers.delete(key)) continue; timer.callback() }
      for (let index = 0; index < 30; index++) await Promise.resolve()
    },
    marker (revision = 'rev_one', epoch = listFixture.server_epoch, reason = 'initial') { streams.at(-1).onEvent({ type: 'snapshot', data: { server_epoch: epoch, revision, reason } }) },
    hint (revision, id = 'cf_pending_fixture_1', state = 'succeeded') { streams.at(-1).onEvent({ type: 'changed', data: { id, revision, state } }) },
    replace (generation = 'auth_two') {
      const previous = owner; owner = new AbortController(); selected = { ...selected, generation }
      previous.abort()
      subscriptions.forEach(fn => fn())
    },
    rows: () => Object.values(feed.getSnapshot().graph.getState().entities[DECISION_ENTITY] ?? {}).map(row => row.observation)
  }
}

describe('authenticated decision reconciliation', () => {
  it('constructs without listeners/timers/network and subscribes before any list request', async () => {
    const h = harness()
    expect(h.subscriptions.size).toBe(0); expect(h.timers.size).toBe(0)
    expect(h.client.events).not.toHaveBeenCalled(); expect(h.client.list).not.toHaveBeenCalled()
    h.feed.start()
    expect(h.client.events).toHaveBeenCalledTimes(1)
    await h.tick()
    expect(h.client.list).not.toHaveBeenCalled()
    h.marker(); await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(1)
    expect(h.feed.getSnapshot()).toMatchObject({ status: 'ready', fresh: true, complete: true, hasMore: false })
    expect(h.feed.getSnapshot().graph.getState().lists[DECISION_LIST].total).toBeNull()
  })
  it('coalesces invalidations arriving during the initial read, with opaque equality only', async () => {
    const first = deferred()
    const h = harness({ list: vi.fn().mockReturnValueOnce(first.promise).mockResolvedValue(page([pending()], 'rev_1')) })
    h.feed.start(); h.marker('rev_Z'); await h.tick()
    h.hint('rev_1'); h.hint('rev_1'); h.hint('rev_1')
    expect(h.rows()).toEqual([])
    first.resolve(page([pending()], 'rev_Z')); await h.tick()
    expect(h.feed.getSnapshot().fresh).toBe(false)
    await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(2)
    expect(h.feed.getSnapshot().revision).toBe('rev_1')
    expect(h.feed.getSnapshot().fresh).toBe(true)
    // Lexicographic/numeric ordering would incorrectly suppress this older-looking opaque value.
    h.hint('rev_1'); await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(2)
  })
  it('never converts a succeeded hint into an outcome and fetches protected detail before terminal projection', async () => {
    const held = deferred()
    let response = page()
    const h = harness({ list: async () => response, item: () => held.promise })
    h.feed.start(); h.marker(); await h.tick()
    expect(h.rows()[0].execution).toBeUndefined()
    response = page([clone(itemFixture.item)], 'rev_terminal')
    h.hint('rev_terminal'); await h.tick()
    expect(h.client.item).toHaveBeenCalledWith(itemFixture.item.id, expect.anything())
    expect(h.rows()[0].execution).toBeUndefined()
    expect(h.feed.getValidated('cf_pending_fixture_1')).toBeUndefined()
    held.resolve(detail(clone(itemFixture.item), 'rev_terminal')); await h.tick()
    expect(h.rows()[0].execution.receipt.id).toBe(itemFixture.item.execution.receipt.id)
    expect(h.feed.getValidated(itemFixture.item.id)).not.toHaveProperty('authorization')
  })
  it('clears the old captured graph synchronously on same-endpoint auth replacement and rejects late completion', async () => {
    const late = deferred()
    const h = harness({ list: vi.fn().mockResolvedValueOnce(page()).mockReturnValueOnce(late.promise) })
    h.feed.start(); h.marker(); await h.tick()
    const old = h.feed.getSnapshot().graph
    h.hint('new_revision'); await h.tick()
    h.replace()
    expect(old.getState().entities).toEqual({})
    expect(h.feed.getSnapshot().generation).toBe('auth_two')
    late.resolve(page([pending('cf_private_old')], 'new_revision')); await h.tick()
    expect(h.rows()).toEqual([])
    expect(h.client.events).toHaveBeenCalledTimes(2)
  })
  it('drops the prior epoch and its pending detail404 before exposing a new epoch', async () => {
    const late = deferred()
    const h = harness({ item: () => late.promise })
    h.feed.start(); h.marker(); await h.tick()
    const old = h.feed.getSnapshot().graph
    const request = h.feed.readDecision('cf_pending_fixture_1')
    h.marker('rev_restart', 'epoch_fixture_0002', 'reconcile')
    expect(old.getState().entities).toEqual({})
    expect(h.feed.getSnapshot()).toMatchObject({ epoch: 'epoch_fixture_0002', fresh: false, historyUnavailable: true })
    late.reject(new DecisionReadError('unavailable', { status: 404 }))
    await request
    expect(h.feed.getSnapshot().status).not.toBe('unavailable')
  })
  it.each([400, 409])('discards a stale cursor%d once; a failed fresh first page surfaces', async status => {
    const h = harness({
      list: vi.fn().mockResolvedValueOnce(page([pending()], 'r', { page: { has_more: true, next_cursor: 'cursor_one' } }))
        .mockRejectedValueOnce(new DecisionReadError('cursor', { status }))
        .mockRejectedValueOnce(new DecisionReadError('cursor', { status: 400 }))
    })
    h.feed.start(); h.marker(); await h.tick()
    expect(h.client.list.mock.calls.map(([options]) => options.cursor)).toEqual([undefined, 'cursor_one', undefined])
    expect(h.feed.getSnapshot()).toMatchObject({ status: 'error', fresh: false, error: { kind: 'cursor' } })
    await h.tick(10000)
    expect(h.client.list).toHaveBeenCalledTimes(3)
  })
  it('exposes a local partial projection without asserting a full count or per-identity retention', async () => {
    let number = 0
    const h = harness({ list: async () => page([pending(`cf_${++number}`)], 'same', { page: { has_more: true, next_cursor: `cursor_${number}` } }) })
    h.feed.start(); h.marker(); await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(4)
    expect(h.feed.getSnapshot()).toMatchObject({ fresh: true, complete: false, hasMore: true, truncated: true, retention: { scope: 'server', max_resolved: 200, max_age_seconds: 604800 } })
    expect(h.rows()).toHaveLength(4)
    expect(h.feed.getSnapshot().graph.getState().lists[DECISION_LIST].total).toBeNull()
  })
  it('reconnects with a fresh subscription marker/snapshot and reconciles overflow even at equal revision', async () => {
    const h = harness()
    h.feed.start(); h.marker(); await h.tick()
    h.marker('rev_one', listFixture.server_epoch, 'overflow'); await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(2)
    h.streams[0].resolve(); await h.tick(0)
    expect(h.feed.getSnapshot().fresh).toBe(false)
    await h.tick(1000)
    expect(h.client.events).toHaveBeenCalledTimes(2)
    expect(h.client.list).toHaveBeenCalledTimes(2)
    h.marker(); await h.tick()
    expect(h.client.list).toHaveBeenCalledTimes(3)
  })
  it.each(['unauthenticated', 'forbidden', 'unavailable'])('clears projection on truthful %s without automatic retry or session mutation', async kind => {
    const h = harness()
    h.feed.start(); h.marker(); await h.tick()
    h.streams[0].reject(new DecisionReadError(kind, { status: { unauthenticated: 401, forbidden: 403, unavailable: 404 }[kind] }))
    await h.tick()
    expect(h.rows()).toEqual([])
    expect(h.feed.getSnapshot()).toMatchObject({ status: kind, fresh: false, complete: false })
    await h.tick(100000)
    expect(h.client.events).toHaveBeenCalledTimes(1)
  })
  it('honors429 hold before reconnect, including explicit refresh', async () => {
    const h = harness()
    h.feed.start(); h.streams[0].reject(new DecisionReadError('rate-limited', { status: 429, retryAt: 6000 }))
    await h.tick(0)
    h.feed.refresh(); await h.tick(4999)
    expect(h.client.events).toHaveBeenCalledTimes(1)
    await h.tick(1)
    expect(h.client.events).toHaveBeenCalledTimes(2)
    expect(h.client.list).not.toHaveBeenCalled()
  })
  it('tears down maps, requests, timers and subscription on disable/stop/dispose, with no constructor replay work', async () => {
    const h = harness({ enabled: false })
    h.feed.start(); expect(h.client.events).not.toHaveBeenCalled()
    h.feed.setEnabled(true); h.marker(); await h.tick()
    const old = h.feed.getSnapshot().graph
    h.feed.setEnabled(false)
    expect(old.getState().entities).toEqual({})
    expect(h.streams[0].signal.aborted).toBe(true)
    expect(h.feed.getSnapshot().status).toBe('disabled')
    h.feed.stop()
    expect(h.subscriptions.size).toBe(0)
    expect(h.timers.size).toBe(0)
    h.feed.dispose(); h.feed.start()
    expect(h.feed.getSnapshot().status).toBe('disposed')
    expect(h.client.events).toHaveBeenCalledTimes(1)
  })
})

it('drops a former successful receipt when the full current observation omits it', async () => {
  let current = page([clone(itemFixture.item)])
  const h = harness({ list: async () => current, item: async id => detail(current.items.find(row => row.id === id), current.revision) })
  h.feed.start(); h.marker(); await h.tick()
  expect(h.rows()[0].execution.receipt).toBeDefined()
  current = page([pending(itemFixture.item.id)], 'changed')
  h.hint('changed', itemFixture.item.id); await h.tick()
  expect(h.rows()[0].execution).toBeUndefined()
  expect(h.feed.getValidated(itemFixture.item.id).observation).not.toHaveProperty('resolved_by')
})

it('ignores a stale old-stream401 after a replacement generation has started', async () => {
  const h = harness()
  h.feed.start(); const old = h.streams[0]
  h.replace(); h.marker(); await h.tick()
  const current = h.feed.getSnapshot()
  old.reject(new DecisionReadError('unauthenticated', { status: 401 }))
  await h.tick(0)
  expect(h.feed.getSnapshot()).toBe(current)
  expect(h.feed.getSnapshot().status).toBe('ready')
})

it('keeps validated provenance private when a card or graph row is replaced locally', async () => {
  const h = harness()
  h.feed.start(); h.marker(); await h.tick()
  const original = h.feed.getValidated('cf_pending_fixture_1').observation
  const forged = { ...original, summary: { ...original.summary, text: 'locally replaced text' }, actions: { approve: true, deny: true } }
  h.feed.getSnapshot().graph.getState().replaceEntity(DECISION_ENTITY, original.id, { observation: forged })
  expect(h.feed.getValidated(original.id).observation).toBe(original)
  expect(h.feed.getValidated(original.id).observation.summary.text).not.toBe(forged.summary.text)
  h.feed.getSnapshot().graph.getState().replaceEntity(DECISION_ENTITY, 'cf_not_observed_12345', { observation: forged })
  expect(h.feed.getValidated('cf_not_observed_12345')).toBeUndefined()
})

it('bounds manual detail reads and aborts them before a replacement scope can be populated', async () => {
  const held = deferred()
  const h = harness({ item: () => held.promise })
  h.feed.start(); h.marker(); await h.tick()
  const reads = Array.from({ length: 4 }, (_, index) => h.feed.readDecision(`cf_detail_fixture_${index}`))
  expect(await h.feed.readDecision('cf_detail_fixture_overflow')).toBeUndefined()
  expect(h.client.item).toHaveBeenCalledTimes(4)
  const signals = h.client.item.mock.calls.map(([, options]) => options.signal)
  h.replace()
  expect(signals.every(signal => signal.aborted)).toBe(true)
  held.resolve(detail(pending()))
  expect(await Promise.all(reads)).toEqual([undefined, undefined, undefined, undefined])
  expect(h.rows()).toEqual([])
})

// I/2 consumes these tagged results without turning failed/stale reads into missing history.
describe('protected detail result distinctions', () => {
  it('returns private current ingress and retains the legacy readDecision shape', async () => {
    const h = harness()
    h.feed.start(); h.marker(); await h.tick()
    const result = await h.feed.readDecisionResult('cf_pending_fixture_1')
    expect(result.kind).toBe('observation')
    expect(result.ingress.observation).toBe(h.feed.getValidated('cf_pending_fixture_1').observation)
    expect(await h.feed.readDecision('cf_pending_fixture_1')).toMatchObject({ generation: 'auth_one', serverEpoch: listFixture.server_epoch })
  })
  it('marks only a current protected404 as missing, with the captured scope', async () => {
    const h = harness({ item: async () => { throw new DecisionReadError('unavailable', { status: 404 }) } })
    h.feed.start(); h.marker(); await h.tick()
    expect(await h.feed.readDecisionResult('cf_pending_fixture_1')).toEqual({ kind: 'missing', generation: 'auth_one', serverEpoch: listFixture.server_epoch, decisionId: 'cf_pending_fixture_1' })
    expect(h.feed.getSnapshot()).toMatchObject({ historyUnavailable: true, fresh: false, complete: false })
    expect(h.feed.getValidated('cf_pending_fixture_1')).toBeUndefined()
  })
  it.each(['network', 'unauthenticated', 'forbidden'])('keeps %s distinct from an evicted request', async kind => {
    const h = harness({ item: async () => { throw new DecisionReadError(kind) } })
    h.feed.start(); h.marker(); await h.tick()
    expect(await h.feed.readDecisionResult('cf_pending_fixture_1')).toEqual({ kind: 'error', reason: kind })
  })
  it('separates busy and caller-aborted reads without a missing-history claim', async () => {
    const held = deferred()
    const h = harness({ item: () => held.promise })
    h.feed.start(); h.marker(); await h.tick()
    const abort = new AbortController()
    const reading = h.feed.readDecisionResult('cf_pending_fixture_1', { signal: abort.signal })
    expect(await h.feed.readDecisionResult('cf_pending_fixture_1')).toEqual({ kind: 'busy' })
    abort.abort(); held.resolve(detail(pending()))
    expect(await reading).toEqual({ kind: 'stale' })
    expect(h.feed.getSnapshot().historyUnavailable).toBe(false)
  })
  it('rejects an old404 and a new-revision detail as stale, never missing', async () => {
    const late = deferred()
    const h = harness({ item: vi.fn().mockReturnValueOnce(late.promise).mockResolvedValue(detail(pending(), 'rev_changed')) })
    h.feed.start(); h.marker(); await h.tick()
    const old = h.feed.readDecisionResult('cf_pending_fixture_1')
    h.replace(); h.marker(); await h.tick()
    late.reject(new DecisionReadError('unavailable', { status: 404 }))
    expect(await old).toEqual({ kind: 'stale' })
    expect(h.feed.getSnapshot().historyUnavailable).toBe(false)
    expect(await h.feed.readDecisionResult('cf_pending_fixture_1')).toEqual({ kind: 'stale' })
    expect(h.feed.getSnapshot().historyUnavailable).toBe(false)
  })
})
