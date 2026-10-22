import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPresentationPolicy } from '../agent-chat/presentation-policy.js'
import { DecisionWorkspace } from './DecisionWorkspace.jsx'

const host = vi.hoisted(() => ({ feed: undefined, props: undefined, inbox: vi.fn(), activity: vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }))
vi.mock('./DecisionFeedProvider.jsx', () => ({ useDecisionFeedApi: () => host.feed, DecisionProjectionScope: ({ children }) => children }))
vi.mock('./DecisionViews.jsx', () => ({ HomeInbox: props => { host.inbox(props); return <p>Current Home observations</p> }, ActivityView: props => { host.activity(props); return <p>Current Activity observations</p> } }))
vi.mock('../shell/PraxisWorkspace.jsx', () => ({ PraxisWorkspace: props => {
  host.props = props
  const scope = { controller: {}, generation: 'owner_fixture_1' }
  return <><p>Ordinary IPFS navigation</p>{props.route === '/activity' ? props.application(scope) : props.decisions(scope)}</>
} }))
function deferred () { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
function connection () {
  const listeners = new Set(), lifetime = new AbortController()
  const snapshot = { generation: 'owner_fixture_1', status: 'ready', chatEnabled: true }
  return { listeners, getSnapshot: () => snapshot, subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    capture: () => ({ generation: snapshot.generation, signal: lifetime.signal, isCurrent: () => !lifetime.signal.aborted }) }
}
beforeEach(() => {
  host.inbox.mockClear(); host.activity.mockClear()
  const listeners = new Set()
  host.feed = { listeners, getSnapshot: () => ({ scopeKey: 'scope_fixture_1' }), subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    getValidated: () => undefined, readDecisionResult: vi.fn(), refresh: vi.fn() }
})

describe('local decision presentation off boundary', () => {
  it.each(['/', '/activity'])('mounts no domain view/read owner while off at %s, leaving ordinary navigation', route => {
    const store = connection()
    const policy = createPresentationPolicy({ storage: { getItem: () => JSON.stringify({ decisions: false }), setItem () {} } })
    const view = render(<DecisionWorkspace route={route} connectionStore={store} presentationPolicy={policy} />)
    expect(screen.getByText('Ordinary IPFS navigation')).toBeInTheDocument()
    expect(screen.getByText('presentation.decisions.off')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'presentation.settings' })).toHaveAttribute('href', '#/settings/agent')
    expect(store.listeners.size).toBe(0); expect(host.feed.listeners.size).toBe(0)
    expect(host.inbox).not.toHaveBeenCalled(); expect(host.activity).not.toHaveBeenCalled()
    expect(host.feed.readDecisionResult).not.toHaveBeenCalled()
    act(() => policy.update({ decisions: true }))
    expect(store.listeners.size).toBe(1); expect(host.feed.listeners.size).toBe(1)
    expect(screen.getByText(route === '/' ? 'Current Home observations' : 'Current Activity observations')).toBeInTheDocument()
    act(() => {
      policy.update({ decisions: false })
      expect(store.listeners.size).toBe(0); expect(host.feed.listeners.size).toBe(0)
    })
    expect(screen.queryByText(/Current (Home|Activity) observations/)).toBeNull()
    expect(screen.getByText('Ordinary IPFS navigation')).toBeInTheDocument()
    view.unmount()
    expect(store.listeners.size).toBe(0); expect(host.feed.listeners.size).toBe(0)
  })
  it('aborts a pending detail read synchronously and never revives its context after off', async () => {
    const store = connection(), held = deferred()
    const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
    host.feed.readDecisionResult.mockReturnValue(held.promise)
    render(<DecisionWorkspace route='/' connectionStore={store} presentationPolicy={policy} />)
    let reading
    act(() => { reading = host.props.decisionCallbacks.readDecision('cf_pending_fixture_1') })
    const signal = host.feed.readDecisionResult.mock.calls[0][1].signal
    expect(signal.aborted).toBe(false)
    act(() => {
      policy.update({ decisions: false })
      expect(signal.aborted).toBe(true)
      expect(host.props.decisionCallbacks.getDecisionContext('cf_pending_fixture_1')).toBeUndefined()
    })
    await act(async () => { held.resolve({ kind: 'stale' }); await reading })
    expect(host.props.decisionCallbacks.getDecisionContext('cf_pending_fixture_1')).toBeUndefined()
    expect(host.feed.refresh).not.toHaveBeenCalled()
    expect(screen.queryByText('Current Home observations')).toBeNull()
  })
})
