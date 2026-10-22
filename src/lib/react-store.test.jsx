import { StrictMode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { composeBundles, createSelector } from 'redux-bundler'
import { Provider, connect, createSelectorSubscription } from './react-store.js'
import { ContextBridge, ContextBridgeProvider, useBridgeSelector } from '../helpers/context-bridge.js'

function counterStore () {
  return composeBundles({
    name: 'fixture',
    reducer: (state = { count: 0, other: 0 }, action) => {
      if (action.type === 'INCREMENT') return { ...state, count: state.count + action.amount }
      if (action.type === 'OTHER') return { ...state, other: state.other + 1 }
      return state
    },
    selectCount: state => state.fixture.count,
    selectPair: createSelector('selectCount', count => ({ count })),
    selectUncached: state => ({ count: state.fixture.count }),
    doIncrement: amount => ({ type: 'INCREMENT', amount }),
    doOther: () => ({ type: 'OTHER' })
  })()
}

describe('React 19 Redux Bundler binding', () => {
  it('caches snapshots without subscribing during render or construction', () => {
    const store = counterStore()
    const subscribe = vi.spyOn(store, 'subscribeToSelectors')
    const selected = createSelectorSubscription(store, ['selectCount', 'selectPair'])
    const initial = selected.getSnapshot()
    expect(selected.getSnapshot()).toBe(initial)
    store.doOther()
    expect(selected.getSnapshot()).toBe(initial)
    expect(subscribe).not.toHaveBeenCalled()
    store.doIncrement(2)
    expect(selected.getSnapshot()).toEqual({ count: 2, pair: { count: 2 } })
    expect(selected.getSnapshot()).not.toBe(initial)
    store.destroy()
  })

  it('returns a stable snapshot for a selector that allocates on every read', () => {
    const store = counterStore()
    const selected = createSelectorSubscription(store, ['selectUncached'])
    const initial = selected.getSnapshot()
    expect(selected.getSnapshot()).toBe(initial)
    expect(selected.getSnapshot().uncached).toBe(initial.uncached)
    const notify = vi.fn()
    const unsubscribe = selected.subscribe(notify)
    store.doIncrement(2)
    expect(notify).toHaveBeenCalledTimes(1)
    expect(selected.getSnapshot()).toEqual({ uncached: { count: 2 } })
    const next = selected.getSnapshot()
    expect(selected.getSnapshot()).toBe(next)
    unsubscribe()
    store.destroy()
  })

  it('preserves selector names, prop precedence and stable action identity across own-prop rerenders', () => {
    const store = counterStore()
    const subscribe = vi.spyOn(store, 'subscribeToSelectors')
    const action = vi.spyOn(store, 'action')
    const received = []
    const Counter = connect('selectCount', 'doIncrement', props => {
      received.push(props)
      return <button onClick={() => props.doIncrement(3)}>{props.label}:{props.count}</button>
    })
    const view = render(<Provider store={store}><Counter label='Files' count={900} doIncrement={() => { throw new Error('own prop must not override action') }} /></Provider>)
    const boundAction = received.at(-1).doIncrement
    expect(screen.getByRole('button')).toHaveTextContent('Files:0')
    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(subscribe.mock.calls[0][0]).toEqual(['selectCount'])
    view.rerender(<Provider store={store}><Counter label='Pins' /></Provider>)
    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(received.at(-1).doIncrement).toBe(boundAction)
    fireEvent.click(screen.getByRole('button'))
    expect(action).toHaveBeenCalledWith('doIncrement', [3])
    expect(screen.getByRole('button')).toHaveTextContent('Pins:3')
    const renderCount = received.length
    act(() => store.doOther())
    expect(received).toHaveLength(renderCount)
    view.unmount()
    expect(store.subscriptions.set.size).toBe(0)
    store.destroy()
  })

  it('rebinds on Provider store replacement and cleans up StrictMode subscriptions', () => {
    const first = counterStore()
    const second = counterStore()
    second.doIncrement(8)
    const Counter = connect('selectCount', 'doIncrement', ({ count, doIncrement }) => <button onClick={() => doIncrement(1)}>{count}</button>)
    const view = render(<StrictMode><Provider store={first}><Counter /></Provider></StrictMode>)
    expect(first.subscriptions.set.size).toBe(1)
    view.rerender(<StrictMode><Provider store={second}><Counter /></Provider></StrictMode>)
    expect(first.subscriptions.set.size).toBe(0)
    expect(second.subscriptions.set.size).toBe(1)
    expect(screen.getByRole('button')).toHaveTextContent('8')
    fireEvent.click(screen.getByRole('button'))
    expect(first.selectCount()).toBe(0)
    expect(second.selectCount()).toBe(9)
    view.unmount()
    expect(second.subscriptions.set.size).toBe(0)
    first.destroy()
    second.destroy()
  })

  it('keeps store.action return values and the direct-action fallback', () => {
    const store = counterStore()
    store.doResult = function (value) { return this === store ? value * 2 : -1 }
    delete store.action
    const received = []
    const ActionOnly = connect('doResult', props => {
      received.push(props.doResult)
      return null
    })
    const view = render(<Provider store={store}><ActionOnly /></Provider>)
    expect(received[0](4)).toBe(8)
    expect(store.subscriptions.set.size).toBe(0)
    view.unmount()
    store.destroy()
  })

  it('reconciles an update between initial render and committed subscription', () => {
    const store = counterStore()
    const originalSubscribe = store.subscribeToSelectors
    let first = true
    vi.spyOn(store, 'subscribeToSelectors').mockImplementation((names, listener) => {
      if (first) {
        first = false
        store.doIncrement(1)
      }
      return originalSubscribe(names, listener)
    })
    const Counter = connect('selectCount', ({ count }) => <output>{count}</output>)
    const view = render(<Provider store={store}><Counter /></Provider>)
    expect(screen.getByRole('status')).toHaveTextContent('1')
    view.unmount()
    store.destroy()
  })
})

describe('subscribed context bridge', () => {
  it('uses the provided bridge, retains function values and unsubscribes when keys change or views leave', () => {
    const bridge = new ContextBridge()
    const originalSubscribe = bridge.subscribe.bind(bridge)
    const subscribe = vi.spyOn(bridge, 'subscribe')
    const cleanups = []
    subscribe.mockImplementation((name, listener) => {
      const cleanup = vi.fn(originalSubscribe(name, listener))
      cleanups.push(cleanup)
      return cleanup
    })
    const action = vi.fn(() => 'action value')
    bridge.setContext('action', action)
    bridge.setContext('count', 5)
    function Value ({ name }) {
      const value = useBridgeSelector(name)
      return <output>{typeof value === 'function' ? value() : value ?? 'Not reported'}</output>
    }
    const view = render(<ContextBridgeProvider bridge={bridge}><Value name='action' /></ContextBridgeProvider>)
    expect(screen.getByRole('status')).toHaveTextContent('action value')
    view.rerender(<ContextBridgeProvider bridge={bridge}><Value name='action' /></ContextBridgeProvider>)
    expect(subscribe).toHaveBeenCalledTimes(1)
    view.rerender(<ContextBridgeProvider bridge={bridge}><Value name='count' /></ContextBridgeProvider>)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    act(() => bridge.setContext('count', 6))
    expect(screen.getByRole('status')).toHaveTextContent('6')
    act(() => bridge.clear())
    expect(screen.getByRole('status')).toHaveTextContent('Not reported')
    view.unmount()
    expect(cleanups[1]).toHaveBeenCalledTimes(1)
  })
})
