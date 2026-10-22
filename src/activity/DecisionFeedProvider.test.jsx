import { StrictMode, useEffect } from 'react'
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createPresentationPolicy } from '../agent-chat/presentation-policy.js'
import { DecisionFeedProvider, DecisionProjectionScope, useDecisionFeed, useDecisionFeedApi, useDecisionRows } from './DecisionFeedProvider.jsx'

function source () {
  let state = Object.freeze({ generation: 'fixture_a', status: 'no-endpoint' })
  const listeners = new Set()
  return {
    getSnapshot: () => state,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    capture: vi.fn(() => null), listeners,
    replace () { state = Object.freeze({ ...state, generation: 'fixture_b' }); listeners.forEach(fn => fn()) }
  }
}

describe('explicit read projection ownership', () => {
  it('uses scoped graph selectors and rotates only domain views; ordinary shell lifetime survives', () => {
    const connectionStore = source()
    const ordinaryMount = vi.fn(), ordinaryUnmount = vi.fn(), domainMount = vi.fn(), domainUnmount = vi.fn()
    function Ordinary () { useEffect(() => { ordinaryMount(); return ordinaryUnmount }, []); return <p>Existing Files owner</p> }
    function Domain () {
      const rows = useDecisionRows()
      const feed = useDecisionFeed()
      useEffect(() => { domainMount(); return domainUnmount }, [])
      return <p data-testid='domain'>{feed.generation}:{rows.length}:{String(feed.complete)}</p>
    }
    const view = render(<DecisionFeedProvider connectionStore={connectionStore}><Ordinary /><DecisionProjectionScope><Domain /></DecisionProjectionScope></DecisionFeedProvider>)
    const mounts = domainMount.mock.calls.length
    expect(screen.getByTestId('domain')).toHaveTextContent('fixture_a:0:false')
    expect(connectionStore.capture).not.toHaveBeenCalled()
    act(() => connectionStore.replace())
    expect(screen.getByTestId('domain')).toHaveTextContent('fixture_b:0:false')
    expect(domainMount.mock.calls.length).toBeGreaterThan(mounts)
    expect(domainUnmount).toHaveBeenCalled()
    expect(ordinaryMount).toHaveBeenCalledTimes(1)
    expect(ordinaryUnmount).not.toHaveBeenCalled()
    view.unmount()
    expect(connectionStore.listeners.size).toBe(0)
    expect(ordinaryUnmount).toHaveBeenCalledTimes(1)
  })
  it('keeps the disabled read feature unsubscribed through StrictMode replay and real cleanup', () => {
    const connectionStore = source()
    const view = render(<StrictMode><DecisionFeedProvider enabled={false} connectionStore={connectionStore}><span>Read feature off</span></DecisionFeedProvider></StrictMode>)
    expect(connectionStore.listeners.size).toBe(0)
    expect(connectionStore.capture).not.toHaveBeenCalled()
    view.unmount()
    expect(connectionStore.listeners.size).toBe(0)
  })
})


it('synchronously stops connection ownership and clears maps on local display off, then captures only the current generation', () => {
  const connectionStore = source()
  const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
  let feed
  function Probe () { feed = useDecisionFeedApi(); return <span>Ordinary route remains mounted</span> }
  const view = render(<DecisionFeedProvider connectionStore={connectionStore} presentationPolicy={policy}><Probe /></DecisionFeedProvider>)
  expect(connectionStore.listeners.size).toBe(1)
  const oldGraph = feed.getSnapshot().graph
  oldGraph.getState().replaceEntity('fixture_local_only', 'row', { label: 'Local teardown fixture' })
  act(() => {
    policy.update({ decisions: false })
    // Assert inside the same update, before any later render/effect can paper over a retained owner.
    expect(connectionStore.listeners.size).toBe(0)
    expect(oldGraph.getState().entities).toEqual({})
    expect(feed.getSnapshot().status).toBe('disabled')
  })
  expect(screen.getByText('Ordinary route remains mounted')).toBeInTheDocument()
  act(() => connectionStore.replace())
  expect(connectionStore.capture).not.toHaveBeenCalled()
  act(() => policy.update({ decisions: true }))
  expect(connectionStore.listeners.size).toBe(1)
  expect(feed.getSnapshot().generation).toBe('fixture_b')
  expect(feed.getSnapshot().graph).not.toBe(oldGraph)
  view.unmount()
  expect(connectionStore.listeners.size).toBe(0)
})
