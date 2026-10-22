import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { createConnectionStore } from '../agent-chat/connection-store.js'
import { resetForTests, updateSettings } from './settings-store.js'
import { INITIAL, useSearch } from './use-search.js'

const deferred = () => {
  let resolve
  const promise = new Promise(_resolve => { resolve = _resolve })
  return { promise, resolve }
}
const settle = async () => { for (let i = 0; i < 10; i++) await Promise.resolve() }
function fixture () {
  let token = 'first-fixture'
  const listeners = new Set()
  const store = createConnectionStore({
    getBridge: () => undefined,
    getSession: () => undefined,
    getSettings: () => ({ endpoint: 'http://127.0.0.1:5050/agui', enabled: true }),
    getToken: () => token,
    subscribeSettings: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    subscribeSession: () => () => {}
  })
  return { store, rotate () { token = 'second-fixture'; listeners.forEach(fn => fn()) } }
}

beforeEach(() => { localStorage.clear(); resetForTests(); updateSettings({ enabled: true }) })

describe('Search query lifetime', () => {
  it('aborts and clears on auth rotation, ignoring an old successful response', async () => {
    const f = fixture()
    const pending = deferred()
    let signal
    const search = vi.fn((_req, opts) => { signal = opts.signal; return pending.promise })
    const makeClient = () => ({ search })
    const { result, unmount } = renderHook(() => useSearch({ connectionStore: f.store, makeClient }))
    let request
    try {
      await act(async () => { request = result.current.run({ query: 'private query' }); await settle() })
      act(() => f.rotate())
      expect(signal.aborted).toBe(true)
      expect(result.current.state).toBe(INITIAL)
      await act(async () => { pending.resolve({ model: 'old model', results: [{ text: 'old result' }] }); await request })
      expect(result.current.state).toBe(INITIAL)
    } finally { unmount(); f.store.dispose() }
  })

  it('clears completed results and never replays them when the new credential has the same endpoint', async () => {
    const f = fixture()
    const search = vi.fn(async () => ({ model: 'fixture-model', results: [{ text: 'fixture-result' }] }))
    const makeClient = () => ({ search })
    const { result, unmount } = renderHook(() => useSearch({ connectionStore: f.store, makeClient }))
    try {
      await act(async () => { await result.current.run({ query: 'fixture' }) })
      expect(result.current.state.results).toHaveLength(1)
      act(() => f.rotate())
      expect(result.current.state).toBe(INITIAL)
      expect(search).toHaveBeenCalledOnce()
    } finally { unmount(); f.store.dispose() }
  })

  it('Search off aborts and resets while the component stays mounted; re-enable does not submit', async () => {
    const f = fixture()
    const pending = deferred()
    let signal
    const search = vi.fn((_req, opts) => { signal = opts.signal; return pending.promise })
    const makeClient = () => ({ search })
    const { result, unmount } = renderHook(() => useSearch({ connectionStore: f.store, makeClient }))
    let request
    try {
      await act(async () => { request = result.current.run({ query: 'fixture' }); await settle() })
      act(() => updateSettings({ enabled: false }))
      expect(signal.aborted).toBe(true)
      expect(result.current.state).toBe(INITIAL)
      await act(async () => { await result.current.run({ query: 'must not send' }) })
      await act(async () => { pending.resolve({ model: 'late', results: [] }); await request })
      act(() => updateSettings({ enabled: true }))
      expect(search).toHaveBeenCalledOnce()
      expect(result.current.state).toBe(INITIAL)
    } finally { unmount(); f.store.dispose() }
  })

  it('does not start a request from a resolver completed after its generation retired', async () => {
    const f = fixture()
    const pending = deferred()
    const search = vi.fn()
    const resolve = () => pending.promise
    const makeClient = () => ({ search })
    const { result, unmount } = renderHook(() => useSearch({ connectionStore: f.store, resolve, makeClient }))
    let request
    try {
      act(() => { request = result.current.run({ query: 'fixture' }) })
      act(() => f.rotate())
      await act(async () => { pending.resolve({ ok: true, root: 'http://127.0.0.1:5050', getToken: () => 'retired' }); await request })
      expect(search).not.toHaveBeenCalled()
      expect(result.current.state).toBe(INITIAL)
    } finally { unmount(); f.store.dispose() }
  })

  it('unmount aborts active work and a late answer cannot restart it', async () => {
    const f = fixture()
    const pending = deferred()
    let signal
    const search = vi.fn((_req, opts) => { signal = opts.signal; return pending.promise })
    const makeClient = () => ({ search })
    const { result, unmount } = renderHook(() => useSearch({ connectionStore: f.store, makeClient }))
    let request
    await act(async () => { request = result.current.run({ query: 'fixture' }); await settle() })
    unmount()
    expect(signal.aborted).toBe(true)
    pending.resolve({ model: 'late', results: [] })
    await request
    expect(search).toHaveBeenCalledOnce()
    f.store.dispose()
  })
})
