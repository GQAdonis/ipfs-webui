import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityView, FeedStatus, HomeInbox } from './DecisionViews.jsx'

const host = vi.hoisted(() => ({ feed: undefined, rows: [], theme: 'light' }))
vi.mock('./DecisionFeedProvider.jsx', () => ({ useDecisionFeed: () => host.feed, useDecisionRows: () => host.rows }))
vi.mock('../promethity/use-theme.js', () => ({ useTheme: () => ({ resolvedTheme: host.theme }) }))
const fixture = name => JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/confirmation/examples/DecisionObservation', name), 'utf8'))
const clone = value => JSON.parse(JSON.stringify(value))
const pending = extra => ({ ...fixture('activity-pending.json'), ...extra })
const native = () => fixture('native-deny-only.json')
const success = () => fixture('node-success.json')
const surface = { kind: 'inbox', instance: 'inbox_fixture_1' }

function owner (observation, { error, missing = false, authorize = false, configured = true } = {}) {
  const review = observation && { generation: 'owner_1', serverEpoch: 'epoch_fixture_0001', decisionId: observation.id, record: JSON.stringify(observation) }
  const state = { selectedId: observation?.id, selection: observation && { generation: review.generation, serverEpoch: review.serverEpoch, observation, review }, busy: false, error, missing }
  const snapshot = { configured, running: false, decisionActions: {} }
  const session = { continueDecision: vi.fn(async () => ({ ok: true })) }
  const adapter = { surface, getSnapshot: () => state, subscribe: () => () => {}, open: vi.fn(async () => true), close: vi.fn(), sessionFor: () => session,
    getContext: () => authorize ? { authorization: { confirmationId: observation.id, tool: observation.summary.tool, source: observation.source, authority: observation.authority.kind,
      effectDigest: observation.effect_digest, resolver: 'agui-interrupt', threadId: 'thread_fixture', interruptId: 'interrupt_fixture', open: true, canApprove: true, canDeny: true } } : undefined }
  const controller = { getSnapshot: () => snapshot, subscribe: () => () => {}, requestFreshProposal: vi.fn(async () => ({ ok: true })) }
  return { adapter, controller, session, state, snapshot }
}
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-20T12:00:05Z'))
  host.theme = 'light'; host.rows = []
  host.feed = { status: 'ready', fresh: true, complete: true, hasMore: false, truncated: false, historyUnavailable: false, historyStartedAt: '2026-10-20T12:00:00Z', retention: { scope: 'server' }, refresh: vi.fn() }
})
afterEach(() => vi.useRealTimers())

describe('bounded current-identity Home and Activity', () => {
  it.each(['light', 'dark'])('renders the shared scoped inbox without inventing a full count in %s', theme => {
    host.theme = theme
    host.rows = Array.from({ length: 8 }, (_, index) => pending({ id: `cf_pending_fixture_${index}` }))
    host.feed.complete = false; host.feed.hasMore = true
    const view = render(<HomeInbox {...owner()} />)
    expect(view.container.querySelector('[data-ipfs-ui]')).toHaveAttribute('data-theme', theme)
    expect(screen.getAllByRole('button', { name: 'Review decision' })).toHaveLength(6)
    expect(screen.getByText(/8 pending observations in loaded records/)).toHaveTextContent('not a complete current-identity count')
    expect(screen.getByText(/2 more pending observations are loaded/)).toBeInTheDocument()
    expect(screen.getByText(/200 resolved records globally/)).toHaveTextContent('not a per-identity allowance')
    expect(screen.getByText(/History started:/)).toHaveTextContent('History resets on server restart')
    expect(screen.getByText(/These are decision observations/)).toHaveTextContent('not durable chat history')
    expect(screen.queryByRole('button', { name: 'Deny' })).toBeNull()
    expect(screen.queryByText('Done')).toBeNull()
  })
  it('claims an empty retained snapshot only when ready, fresh and complete', () => {
    host.feed.complete = false
    const view = render(<HomeInbox {...owner()} />)
    expect(screen.queryByText(/No pending decisions were reported/)).toBeNull()
    host.feed.complete = true; view.rerender(<HomeInbox {...owner()} />)
    expect(screen.getByText(/No pending decisions were reported/)).toBeInTheDocument()
    host.feed.status = 'loading'; host.feed.fresh = false; view.rerender(<HomeInbox {...owner()} />)
    expect(screen.queryByText(/No pending decisions were reported/)).toBeNull()
    expect(screen.queryByText(/0 pending observations/)).toBeNull()
  })
  it('offers detail by ID only; the read-only card cannot submit actions', () => {
    host.rows = [pending()]
    const o = owner()
    render(<HomeInbox {...o} />)
    fireEvent.click(screen.getByRole('button', { name: 'Review decision' }))
    expect(o.adapter.open).toHaveBeenCalledExactlyOnceWith(host.rows[0].id)
    expect(o.session.continueDecision).not.toHaveBeenCalled()
    expect(o.controller.requestFreshProposal).not.toHaveBeenCalled()
  })
  it('groups only reported Activity IDs and reveals only more already-loaded rows', () => {
    host.rows = Array.from({ length: 43 }, (_, index) => pending({ id: `cf_pending_fixture_${index}`, activity_id: index < 2 ? 'act_shared_fixture' : undefined }))
    const o = owner()
    const view = render(<ActivityView {...o} />)
    expect(screen.getAllByRole('heading', { name: 'Activity not reported' })).toHaveLength(38)
    expect(screen.getAllByRole('heading', { name: 'Activity act_shared_fixture' })).toHaveLength(1)
    expect(screen.getByText(/Showing 40 of 43 loaded/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show more loaded observations' }))
    expect(screen.getByText(/Showing 43 of 43 loaded/)).toBeInTheDocument()
    expect(o.adapter.open).not.toHaveBeenCalled(); expect(host.feed.refresh).not.toHaveBeenCalled()
    expect(view.container.querySelectorAll('.iu-approval__actions')).toHaveLength(0)
  })
  it('disables review during reconnect and preserves unknown outcome rather than zero-effect copy', () => {
    host.rows = [pending({ approval_state: 'executed' })]
    host.feed.status = 'reconnecting'; host.feed.fresh = false
    render(<ActivityView {...owner()} />)
    expect(screen.getByText('Reconnecting.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Read current detail' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Check now' })).toBeNull()
    expect(screen.queryByText(/Nothing was changed/)).toBeNull()
    expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
  })
})

describe('truthful shared decision states in current detail', () => {
  const approved = () => pending({ approval_state: 'approved' })
  const cases = [
    ['pending', () => pending(), {}],
    ['waiting_system_prompt', native, {}],
    ['approved', approved, {}],
    ['committed', success, {}],
    ['denied', () => pending({ approval_state: 'denied' }), {}],
    ['expired', () => pending({ expires_at: '2026-10-20T12:00:01Z' }), {}],
    ['invalidated', () => pending(), { error: 'changed' }],
    ['resolved_elsewhere', () => ({ ...approved(), resolved_by: 'agui-interrupt', resolved_surface: { kind: 'chat', instance: 'other_chat_fixture' } }), {}],
    ['uncertain', () => pending({ approval_state: 'executed' }), {}],
    ['needs_resubmit', () => pending(), { error: 'unavailable', missing: true }],
    ['failed_after_approval', () => ({ ...approved(), execution: { state: 'failed', started_at: '2026-10-20T12:00:02Z', completed_at: '2026-10-20T12:00:03Z', error: { code: 'fixture_failure', message: 'The node reported an operation failure.' } } }), {}]
  ]
  it.each(cases)('composes the %s state without adding resolver capability', (phase, record, options) => {
    const o = owner(record(), options)
    render(<HomeInbox {...o} />)
    const dialog = screen.getByRole('dialog', { name: 'Current decision' })
    expect(dialog.querySelector('.iu-approval')).toHaveAttribute('data-phase', phase)
    expect(within(dialog).queryByRole('button', { name: 'Deny' })).toBeNull()
    expect(o.session.continueDecision).not.toHaveBeenCalled()
    if (phase === 'committed') expect(within(dialog).getByText('View receipt')).toBeInTheDocument()
    else expect(within(dialog).queryByText('View receipt')).toBeNull()
  })
  it('does not promote a failed/busy/stale detail read to a missing decision', () => {
    render(<HomeInbox {...owner(pending(), { error: 'refresh-required' })} />)
    const dialog = screen.getByRole('dialog', { name: 'Current decision' })
    expect(dialog.querySelector('.iu-approval')).toHaveAttribute('data-phase', 'pending')
    expect(within(dialog).getByText('Refresh required.')).toBeInTheDocument()
    expect(within(dialog).queryByText(/Can't resume/)).toBeNull()
  })
  it('rejects synthetic answer activation before the shared card can label a request submitted', () => {
    const record = pending({ expires_at: '2026-10-20T13:00:00Z', actions: { approve: true, deny: true, authorized_surface: 'owned_chat', continuation: { method: 'POST', route: '/agui', thread_id: 'thread_fixture', interrupt_id: 'interrupt_fixture' } } })
    const o = owner(record, { authorize: true })
    render(<HomeInbox {...o} />)
    const dialog = screen.getByRole('dialog', { name: 'Current decision' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deny' }))
    expect(within(dialog).getByText('Not answered.')).toBeInTheDocument()
    expect(within(dialog).queryByText(/Request submitted/)).toBeNull()
    expect(o.session.continueDecision).not.toHaveBeenCalled()
    expect(o.controller.requestFreshProposal).not.toHaveBeenCalled()
  })
  it('refreshes unknown outcome through a read only, and asks for a fresh draft without replaying old arguments', async () => {
    const uncertain = owner(pending({ approval_state: 'executed' }))
    const view = render(<HomeInbox {...uncertain} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Check now' })) })
    expect(uncertain.adapter.open).toHaveBeenCalledExactlyOnceWith(uncertain.state.selectedId)
    expect(uncertain.session.continueDecision).not.toHaveBeenCalled()
    const expired = owner(pending({ expires_at: '2026-10-20T12:00:01Z' }))
    view.rerender(<HomeInbox {...expired} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Ask again' })) })
    expect(expired.adapter.close).toHaveBeenCalledTimes(1)
    expect(expired.controller.requestFreshProposal).toHaveBeenCalledExactlyOnceWith({ kind: 'fresh_draft', trigger: 'ask_again' })
    expect(expired.session.continueDecision).not.toHaveBeenCalled()
  })
})

it.each([
  ['loading', 'Refreshing observations'], ['reconnecting', 'Reconnecting'], ['unavailable', 'Decision history unavailable'],
  ['unauthenticated', 'Decision reads need authorization'], ['forbidden', 'Decision reads are not permitted'],
  ['disabled', 'Decision display is off'], ['signing-out', 'Signing out'], ['error', 'Decision observations could not be read']
])('renders truthful %s readiness', (status, label) => {
  render(<FeedStatus feed={{ ...host.feed, status, fresh: false }} now={Date.now()} />)
  expect(screen.getByText(`${label}.`)).toBeInTheDocument()
})
it('keeps Retry-After holds disabled and does not call a console-session expiry operation', () => {
  render(<FeedStatus feed={{ ...host.feed, status: 'rate-limited', error: { retryAt: Infinity } }} now={Date.now()} />)
  fireEvent.click(screen.getByRole('button', { name: 'Refresh observations' }))
  expect(screen.getByRole('button', { name: 'Refresh observations' })).toBeDisabled()
  expect(host.feed.refresh).not.toHaveBeenCalled()
})
