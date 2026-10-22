// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DecisionObservationSchema } from '@gqadonis/ipfs-mcp-ui'
import { AguiError, createChatController } from '@gqadonis/ipfs-agent-chat/react'
import { createInboxDecisionAdapter } from './inbox-adapter.js'

const NOW = Date.parse('2026-10-20T12:00:30Z')
const EXPIRES = '2026-10-20T12:02:00Z'
const DIGEST = `sha256:${'b'.repeat(64)}`
const fixture = name => JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/confirmation/examples/DecisionObservation', name), 'utf8'))
const clone = value => JSON.parse(JSON.stringify(value))
function pending (source = 'kubo', extra = {}) {
  const value = fixture(source === 'kubo' ? 'node-success.json' : 'uar-approval-only.json')
  delete value.execution; delete value.resolved_by; delete value.resolved_surface; delete value.resolved_at
  return DecisionObservationSchema.parse({
    ...value,
    approval_state: 'pending',
    expires_at: EXPIRES,
    summary: { ...value.summary, tool: source === 'kubo' ? 'pin_add' : 'uar:publish', class: 'write' },
    authority: { kind: 'ui', name: 'Fixture owner' },
    ...(source === 'kubo' && { effect_digest: DIGEST }),
    actions: { approve: true, deny: true, authorized_surface: 'owned_chat', continuation: { method: 'POST', route: '/agui', thread_id: 'other_thread_fixture', interrupt_id: 'other_interrupt_fixture' } },
    ...extra
  })
}
function deferred () { let resolve, reject; const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject }); return { promise, resolve, reject } }
async function tick () { for (let index = 0; index < 20; index++) await Promise.resolve() }
const cleanups = []
afterEach(() => { cleanups.splice(0).reverse().forEach(cleanup => cleanup()) })

/** The feed seam represents private validated detail ingress, not a card/entity graph lookup. */
function harness (observation = pending()) {
  let state = { generation: 'owner_fixture_1', status: 'ready', chatEnabled: true }
  let owner = new AbortController(); let epoch = 'epoch_fixture_0123456789'; let clock = NOW
  const connections = new Set(); const feedListeners = new Set(); const privateRows = new Map()
  let feedState = { scopeKey: 'scope_fixture_1' }; let scopeSerial = 1
  const put = (row = observation, options = {}) => {
    const ingress = Object.freeze({ generation: state.generation, serverEpoch: epoch, observation: row, ...options })
    privateRows.set(row.id, ingress)
    return ingress
  }
  put()
  const connectionStore = {
    getSnapshot: () => state,
    subscribe: listener => { connections.add(listener); return () => connections.delete(listener) },
    capture: () => {
      const signal = owner.signal; const generation = state.generation
      return { generation, signal, isCurrent: () => !signal.aborted && state.status === 'ready' && state.generation === generation }
    }
  }
  const feed = {
    getSnapshot: () => feedState,
    subscribe: listener => { feedListeners.add(listener); return () => feedListeners.delete(listener) },
    getValidated: id => privateRows.get(id),
    readDecisionResult: vi.fn(async id => privateRows.has(id) ? { kind: 'observation', ingress: privateRows.get(id) } : { kind: 'missing', generation: state.generation, serverEpoch: epoch, decisionId: id }),
    refresh: vi.fn()
  }
  const adapter = createInboxDecisionAdapter({ feed, connectionStore, now: () => clock })
  const controllers = []
  cleanups.push(() => { controllers.forEach(controller => controller.dispose()); adapter.dispose() })
  function controller (run = async function * (input) {
    yield { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId }
    yield { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId, outcome: { type: 'success' } }
  }) {
    let id = 0
    const client = { run: vi.fn(run) }
    const core = createChatController({
      connection: { generation: state.generation, signal: owner.signal, client },
      ids: { thread: () => `local_thread_${++id}`, run: () => `local_run_${++id}`, message: () => `local_message_${++id}` },
      now: () => clock,
      ...adapter.callbacks
    })
    controllers.push(core)
    return { core, client, session: adapter.sessionFor(core) }
  }
  function request (decision = 'approve', extra = {}) {
    const selection = adapter.getSnapshot().selection
    if (!selection) throw new Error('Fixture selection not opened')
    return { observation: clone(selection.observation), review: selection.review, decision, surface: adapter.surface, ...extra }
  }
  const start = () => adapter.start()
  return {
    adapter,
    feed,
    connectionStore,
    connections,
    feedListeners,
    privateRows,
    put,
    controller,
    request,
    start,
    now: value => { clock = value },
    change: patch => { state = { ...state, ...patch }; connections.forEach(listener => listener()) },
    retire () { owner.abort() },
    replace () {
      const previous = owner
      owner = new AbortController(); state = { ...state, generation: 'owner_fixture_2' }
      privateRows.clear(); previous.abort(); connections.forEach(listener => listener())
    },
    rotateEpoch () {
      epoch = 'epoch_fixture_replaced_1234'; privateRows.clear()
      feedState = { scopeKey: `scope_fixture_${++scopeSerial}` }; feedListeners.forEach(listener => listener())
    }
  }
}

describe('Inbox detail owns no authority before current private ingress', () => {
  it('constructs without reads/subscriptions; start/stop replay and dispose clean up exactly their lifetimes', async () => {
    const h = harness()
    expect(h.connections.size).toBe(0); expect(h.feedListeners.size).toBe(0)
    expect(await h.adapter.open(pending().id)).toBe(false)
    expect(h.feed.readDecisionResult).not.toHaveBeenCalled()
    const stop = h.start()
    expect(h.connections.size).toBe(1); expect(h.feedListeners.size).toBe(1)
    expect(h.feed.readDecisionResult).not.toHaveBeenCalled()
    expect(await h.adapter.open(pending().id)).toBe(true)
    stop()
    expect(h.connections.size).toBe(0); expect(h.feedListeners.size).toBe(0)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
    expect(h.adapter.getSnapshot().selection).toBeUndefined()
    h.start(); expect(h.connections.size).toBe(1)
    h.adapter.dispose(); h.start()
    expect(h.connections.size).toBe(0); expect(h.feedListeners.size).toBe(0)
    expect(await h.adapter.open(pending().id)).toBe(false)
  })

  it('opens only through fresh detail and creates no context from a cached graph/card alone', async () => {
    const h = harness(); h.start()
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
    expect(await h.adapter.open(pending().id)).toBe(true)
    expect(h.feed.readDecisionResult).toHaveBeenCalledTimes(1)
    const context = h.adapter.getContext(pending().id)
    expect(context.observation).toBe(h.privateRows.get(pending().id).observation)
    expect(context.authorization).toMatchObject({ resolver: 'agui-interrupt', canApprove: true, canDeny: true })
    const display = h.adapter.getSnapshot().selection
    expect(display).not.toHaveProperty('authorization')
    h.privateRows.delete(pending().id)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['events', 'https://bad.invalid/decision', '../private', ''])('refuses invalid/reserved locator %s without reading', async id => {
    const h = harness(); h.start()
    expect(await h.adapter.open(id)).toBe(false)
    expect(h.feed.readDecisionResult).not.toHaveBeenCalled()
  })

  it.each(['ui', 'human-mcp', 'a2a', 'uar'])('authority label %s alone never grants continuation', async kind => {
    const h = harness(pending('kubo', { authority: { kind }, actions: { approve: false, deny: false } })); h.start()
    expect(await h.adapter.open(pending().id)).toBe(true)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['human-mcp', 'a2a', 'uar'])('uses actual owned_chat capability rather than an authority-kind allowlist (%s)', async kind => {
    const h = harness(pending('kubo', { authority: { kind } })); h.start()
    await h.adapter.open(pending().id)
    expect(h.adapter.getContext(pending().id)?.authorization.canApprove).toBe(true)
  })

  it.each(['originating_mcp_host', 'native_system_prompt', 'paired_desktop', 'headless_cli', 'backend_host'])('never repurposes %s authority as Inbox continuation', async authorizedSurface => {
    const r = pending()
    r.actions = { ...r.actions, approve: false, deny: true, authorized_surface: authorizedSurface }
    const h = harness(r); h.start(); await h.adapter.open(r.id)
    expect(h.adapter.getContext(r.id)).toBeUndefined()
  })

  it.each(['missing', 'invalid', 'elapsed', 'nonfinite-clock'])('fails closed for %s expiry evidence', async kind => {
    const r = pending()
    if (kind === 'missing') delete r.expires_at
    if (kind === 'invalid') r.expires_at = 'invalid-date'
    if (kind === 'elapsed') r.expires_at = '2026-10-20T12:00:00Z'
    const h = harness(r); if (kind === 'nonfinite-clock') h.now(NaN)
    h.start(); await h.adapter.open(r.id)
    expect(h.adapter.getContext(r.id)).toBeUndefined()
  })
})

describe('reviewed Inbox actions use the existing controller and wire lease', () => {
  it('re-reads protected detail then sends one digest-bound continuation without local chat/history authority', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const before = c.core.getSnapshot().chat
    expect(h.adapter.sessionFor(c.core)).toBe(c.session)
    const request = h.request('deny')
    expect(await c.session.continueDecision(request)).toEqual({ ok: true })
    expect(h.feed.readDecisionResult).toHaveBeenCalledTimes(2)
    expect(c.client.run).toHaveBeenCalledTimes(1)
    const input = c.client.run.mock.calls[0][0]
    expect(input).toMatchObject({
      threadId: 'other_thread_fixture',
      messages: [],
      tools: [],
      context: [],
      resume: [{ interruptId: 'other_interrupt_fixture', status: 'resolved', payload: { approved: false }, reviewed_effect: { effect_digest: DIGEST } }],
      forwardedProps: { ipfs: { surface: h.adapter.surface } }
    })
    expect(input.resume[0].payload).toEqual({ approved: false })
    expect(input.forwardedProps.ipfs).not.toHaveProperty('context')
    expect(input.forwardedProps.ipfs).not.toHaveProperty('a2ui')
    expect(c.core.getSnapshot().chat).toBe(before)
    expect(c.core.getSnapshot().decisionActions[pending().id]).toBe('unknown')
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
    expect(h.feed.refresh).toHaveBeenCalled()
  })

  it('shares the one controller lease and cannot replay an attempted unknown outcome after reopening', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const held = deferred()
    const c = h.controller(async function * () { await held.promise; throw new AguiError('network', 'Synthetic loss') })
    const request = h.request(); const sending = c.session.continueDecision(request)
    await tick()
    expect(c.client.run).toHaveBeenCalledTimes(1)
    expect(await c.core.send('overlapping work')).toEqual({ ok: false, reason: 'busy' })
    expect((await c.session.continueDecision(request)).ok).toBe(false)
    held.resolve(); await sending
    expect(c.core.getSnapshot().decisionActions[pending().id]).toBe('unknown')
    await h.adapter.open(pending().id)
    expect(await c.session.continueDecision(h.request())).toEqual({ ok: false, reason: 'already_answered' })
    expect(c.client.run).toHaveBeenCalledTimes(1)
  })

  it.each(['card', 'review', 'review-generation', 'review-epoch', 'surface', 'surface-kind', 'decision'])('rejects forged %s data with zero transport', async kind => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const request = h.request()
    if (kind === 'card') request.observation.summary.text = 'Locally replaced card'
    if (kind === 'review') request.review = { ...request.review, record: JSON.stringify(request.observation) + ' ' }
    if (kind === 'review-generation') request.review = { ...request.review, generation: 'different_owner_fixture' }
    if (kind === 'review-epoch') request.review = { ...request.review, serverEpoch: 'epoch_different_fixture_123' }
    if (kind === 'surface') request.surface = { ...h.adapter.surface, instance: 'other_inbox_fixture' }
    if (kind === 'surface-kind') request.surface = { ...h.adapter.surface, kind: 'chat' }
    if (kind === 'decision') request.decision = 'execute'
    expect((await c.session.continueDecision(request)).ok).toBe(false)
    expect(c.client.run).not.toHaveBeenCalled()
  })

  it('refuses a changed digest discovered by the mandatory fresh detail read', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const request = h.request()
    h.feed.readDecisionResult.mockImplementationOnce(async () => ({ kind: 'observation', ingress: h.put(pending('kubo', { effect_digest: `sha256:${'c'.repeat(64)}` })) }))
    expect(await c.session.continueDecision(request)).toEqual({ ok: false, reason: 'stale_review' })
    expect(c.client.run).not.toHaveBeenCalled()
    expect(h.adapter.getSnapshot().error).toBe('changed')
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['generation', 'serverEpoch'])('refuses a fresh read carrying replacement %s without mutating the old owner', async field => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const request = h.request()
    h.feed.readDecisionResult.mockImplementationOnce(async () => ({ kind: 'observation', ingress: h.put(pending(), { [field]: field === 'generation' ? 'different_owner_fixture' : 'epoch_different_fixture_123' }) }))
    expect(await c.session.continueDecision(request)).toEqual({ ok: false, reason: 'stale_review' })
    expect(c.client.run).not.toHaveBeenCalled()
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it('rechecks private current context after controller subscribers run and before transport', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const request = h.request()
    c.core.subscribe(() => { if (c.core.getSnapshot().running) h.put(pending('kubo', { effect_digest: `sha256:${'c'.repeat(64)}` })) })
    expect(await c.session.continueDecision(request)).toEqual({ ok: false, reason: 'stale_review' })
    expect(c.client.run).not.toHaveBeenCalled()
  })

  it('Check now remains a protected read and never submits a mutation', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const c = h.controller(); const review = h.request().review
    expect(await c.session.checkDecision(review)).toEqual({ ok: true })
    expect(h.feed.readDecisionResult).toHaveBeenCalledTimes(2)
    expect(c.client.run).not.toHaveBeenCalled()
    h.adapter.close()
    expect(await c.session.checkDecision(review)).toEqual({ ok: false, reason: 'stale_review' })
    expect(h.feed.readDecisionResult).toHaveBeenCalledTimes(2)
  })

  it('honors shared implicit a2a native-prompt requirements without depending on an explicit native flag', async () => {
    const base = pending()
    const r = pending('kubo', { authority: { kind: 'a2a' }, summary: { ...base.summary, tool: 'pin_rm', class: 'destructive' } })
    const h = harness(r); h.start(); await h.adapter.open(r.id)
    expect(h.adapter.getContext(r.id)?.authorization).toMatchObject({ canApprove: false, canDeny: true })
    const c = h.controller()
    expect(await c.session.continueDecision(h.request('approve'))).toEqual({ ok: false, reason: 'not_authorized' })
    expect(c.client.run).not.toHaveBeenCalled()
    expect(await c.session.continueDecision(h.request('deny'))).toEqual({ ok: true })
    expect(c.client.run.mock.calls[0][0].resume[0].payload).toEqual({ approved: false })
  })

  it.each([undefined, DIGEST])('keeps UAR continuation free of invented or echoed Kubo digest (%s)', async digest => {
    const r = pending('uar', digest ? { effect_digest: digest } : {})
    const h = harness(r); h.start(); await h.adapter.open(r.id)
    const c = h.controller()
    expect(await c.session.continueDecision(h.request('approve'))).toEqual({ ok: true })
    expect(c.client.run.mock.calls[0][0].resume).toEqual([{ interruptId: 'other_interrupt_fixture', status: 'resolved', payload: { approved: true } }])
    expect(c.core.getSnapshot().decisionActions[r.id]).toBe('unknown')
  })
})

describe('detail results and retirement cannot manufacture missing records or new authority', () => {
  it.each(['stale', 'busy', 'error'])('%s refresh preserves correction display without asserting missing/resubmit', async kind => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    h.feed.readDecisionResult.mockResolvedValueOnce({ kind, ...(kind === 'error' && { reason: 'network' }) })
    expect(await h.adapter.open(pending().id)).toBe(false)
    expect(h.adapter.getSnapshot()).toMatchObject({ missing: false, error: 'refresh-required' })
    expect(h.adapter.getSnapshot().selection.observation.id).toBe(pending().id)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it('reports missing only from a matching generation/epoch tagged detail result', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const before = h.privateRows.get(pending().id)
    h.feed.readDecisionResult.mockResolvedValueOnce({ kind: 'missing', generation: before.generation, serverEpoch: before.serverEpoch, decisionId: pending().id })
    expect(await h.adapter.open(pending().id)).toBe(false)
    expect(h.adapter.getSnapshot()).toMatchObject({ missing: true, error: 'unavailable' })
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['generation', 'serverEpoch'])('does not treat a foreign missing %s as current absence', async field => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const before = h.privateRows.get(pending().id)
    h.feed.readDecisionResult.mockResolvedValueOnce({ kind: 'missing', generation: before.generation, serverEpoch: before.serverEpoch, decisionId: pending().id, [field]: 'foreign_fixture' })
    await h.adapter.open(pending().id)
    expect(h.adapter.getSnapshot().missing).toBe(false)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['close', 'stop', 'dispose', 'replace', 'rotateEpoch'])('%s clears prepared detail and rejects an uncooperative late open', async action => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const before = h.privateRows.get(pending().id); const late = deferred()
    h.feed.readDecisionResult.mockReturnValueOnce(late.promise)
    const reading = h.adapter.open(pending().id)
    const signal = h.feed.readDecisionResult.mock.calls.at(-1)[1].signal
    if (action === 'replace' || action === 'rotateEpoch') h[action]()
    else h.adapter[action]()
    expect(signal.aborted).toBe(true)
    const cleared = h.adapter.getSnapshot()
    late.resolve({ kind: 'observation', ingress: before })
    expect(await reading).toBe(false)
    expect(h.adapter.getSnapshot()).toBe(cleared)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
  })

  it.each(['replace', 'rotateEpoch', 'close', 'controller-reset'])('%s while a fresh action read waits never reaches transport', async action => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    const before = h.privateRows.get(pending().id); const held = deferred(); const c = h.controller()
    h.feed.readDecisionResult.mockReturnValueOnce(held.promise)
    const continuing = c.session.continueDecision(h.request())
    const signal = h.feed.readDecisionResult.mock.calls.at(-1)[1].signal
    if (action === 'replace' || action === 'rotateEpoch') h[action]()
    else if (action === 'close') h.adapter.close()
    else c.core.reset()
    expect(signal.aborted).toBe(true)
    held.resolve({ kind: 'observation', ingress: before })
    expect((await continuing).ok).toBe(false)
    expect(c.client.run).not.toHaveBeenCalled()
  })

  it('chat off withdraws continuation while decision detail remains readable', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    h.change({ chatEnabled: false })
    expect(await h.adapter.open(pending().id)).toBe(true)
    expect(h.adapter.getSnapshot().selection.observation.id).toBe(pending().id)
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
    const c = h.controller()
    expect((await c.session.continueDecision(h.request())).ok).toBe(false)
    expect(c.client.run).not.toHaveBeenCalled()
  })

  it('authority is withdrawn when private ingress is replaced even before feed scope notification', async () => {
    const h = harness(); h.start(); await h.adapter.open(pending().id)
    h.put(pending())
    expect(h.adapter.getContext(pending().id)).toBeUndefined()
    h.adapter.callbacks.onDecisionInvalidated(pending().id)
    expect(h.feed.refresh).toHaveBeenCalledTimes(1)
  })
})
