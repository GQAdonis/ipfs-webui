import { vi } from 'vitest'
// webui-vector-search 1.1 and 1.6: the nav entry and the route exist only when the node
// answers GET /index/status with a configured index, and only while search.enabled is on.
import { createAvailabilityStore, availabilityStore, isNavVisible } from './availability-store.js'
import { reply, CONFIGURED } from './test-helpers.js'
import { updateSettings as updateChat, resetForTests as resetChat, STORAGE_KEY as CHAT_KEY, TOKEN_STORAGE_KEY, setToken } from '../agent-chat/settings-store.js'
import { updateSettings as updateSearch, resetForTests as resetSearch, STORAGE_KEY as SEARCH_KEY } from './settings-store.js'
import { createConnectionStore, getConnectionStore } from '../agent-chat/connection-store.js'

const ENDPOINT = 'http://127.0.0.1:5050/agui'
let fetchMock

const settle = async (store) => {
  // Let the async probe finish.
  // Drain the asynchronous endpoint + credential + response chain before observing readiness.
  await new Promise(resolve => setTimeout(resolve, 0))
  return store.getState()
}

beforeEach(() => {
  localStorage.clear()
  resetChat()
  resetSearch()
  availabilityStore.resetForTests()
  fetchMock = vi.fn(async () => reply(200, CONFIGURED))
  globalThis.fetch = fetchMock
  updateChat({ enabled: true, endpoint: ENDPOINT })
  setToken('tok-secret-1')
})

afterEach(() => { delete globalThis.fetch })

const probe = async (impl) => {
  fetchMock.mockImplementation(impl)
  const store = createAvailabilityStore()
  const stop = store.start()
  const state = await settle(store)
  stop()
  return state
}

describe('navigation entry', () => {
  it('is shown for a configured index', async () => {
    const state = await probe(async () => reply(200, CONFIGURED))
    expect(state.phase).toBe('available')
    expect(isNavVisible(state)).toBe(true)
    expect(fetchMock.mock.calls[0][0]).toBe('http://127.0.0.1:5050/index/status')
  })

  it('is hidden for 404', async () => {
    const state = await probe(async () => reply(404))
    expect(state.phase).toBe('unconfigured')
    expect(isNavVisible(state)).toBe(false)
  })

  it('is hidden for not_configured (enabled false, mode disabled)', async () => {
    const state = await probe(async () => reply(200, { enabled: false, mode: 'disabled', auto: false }))
    expect(state.phase).toBe('unconfigured')
    expect(isNavVisible(state)).toBe(false)
  })

  it('is hidden for a network failure', async () => {
    const state = await probe(async () => { throw new TypeError('Failed to fetch') })
    expect(state.phase).toBe('unconfigured')
    expect(isNavVisible(state)).toBe(false)
  })

  it('stays shown for 401 and 403 so the page can say what to do', async () => {
    for (const status of [401, 403]) {
      const state = await probe(async () => reply(status))
      expect(state.phase).toBe('denied')
      expect(isNavVisible(state)).toBe(true)
    }
  })
})

describe('nothing is sent', () => {
  it('without a chat endpoint', async () => {
    updateChat({ endpoint: '' })
    const state = await probe(async () => reply(200, CONFIGURED))
    expect(state.phase).toBe('unconnected')
    expect(state.connection).toBe('no-endpoint')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('without a token', async () => {
    setToken(undefined)
    const state = await probe(async () => reply(200, CONFIGURED))
    expect(state.connection).toBe('no-token')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('while search.enabled is off', async () => {
    updateSearch({ enabled: false })
    const state = await probe(async () => reply(200, CONFIGURED))
    expect(state.phase).toBe('disabled')
    expect(isNavVisible(state)).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('turning search off after it was available hides the entry and stops probing', async () => {
    const store = createAvailabilityStore()
    const stop = store.start()
    await settle(store)
    expect(isNavVisible(store.getState())).toBe(true)
    fetchMock.mockClear()
    updateSearch({ enabled: false })
    await settle(store)
    expect(store.getState().phase).toBe('disabled')
    await store.refresh()
    expect(fetchMock).not.toHaveBeenCalled()
    stop()
  })
})

describe('credentials', () => {
  it('adds no new localStorage key and writes the token nowhere new', async () => {
    const before = Object.keys(localStorage).sort()
    await probe(async () => reply(200, CONFIGURED))
    expect(Object.keys(localStorage).sort()).toEqual(before)
    expect(before.sort()).toEqual([CHAT_KEY, TOKEN_STORAGE_KEY].sort())
    // The only key that holds the token is the chat's own; the search setting key is absent until changed.
    expect(localStorage.getItem(SEARCH_KEY)).toBeNull()
    for (const key of Object.keys(localStorage)) {
      if (key !== TOKEN_STORAGE_KEY) expect(localStorage.getItem(key)).not.toContain('tok-secret-1')
    }
    expect(Object.keys(sessionStorage)).toEqual([])
  })

  it('sends the chat token as a bearer header only', async () => {
    await probe(async () => reply(200, CONFIGURED))
    const [url, init] = fetchMock.mock.calls[0]
    expect(init.headers.authorization).toBe('Bearer tok-secret-1')
    expect(url).not.toContain('tok-secret-1')
  })

  it('under Desktop takes the endpoint and token from the bridge', async () => {
    updateChat({ endpoint: '' })
    setToken(undefined)
    globalThis.ipfsDesktop = { agentChat: { getEndpoint: async () => 'http://127.0.0.1:6060/agui', getToken: async () => 'bridge-token' } }
    try {
      // The frozen Desktop bridge normally exists before boot; this test installs it later.
      getConnectionStore().refresh()
      const state = await probe(async () => reply(200, CONFIGURED))
      expect(state.phase).toBe('available')
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe('http://127.0.0.1:6060/index/status')
      expect(init.headers.authorization).toBe('Bearer bridge-token')
    } finally {
      delete globalThis.ipfsDesktop
    }
  })
})

const deferred = () => {
  let resolve
  const promise = new Promise(_resolve => { resolve = _resolve })
  return { promise, resolve }
}
function lifetimeFixture () {
  let token = 'first-fixture'
  const listeners = new Set()
  const connectionStore = createConnectionStore({
    getBridge: () => undefined,
    getSession: () => undefined,
    getSettings: () => ({ enabled: true, endpoint: ENDPOINT }),
    getToken: () => token,
    subscribeSettings: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    subscribeSession: () => () => {}
  })
  return { connectionStore, rotate () { token = 'second-fixture'; listeners.forEach(fn => fn()) } }
}

describe('capability lifetime', () => {
  it('clears previous counts immediately and reprobes for a new credential on the same root', async () => {
    const f = lifetimeFixture()
    const next = deferred()
    const status = vi.fn().mockResolvedValueOnce({ ...CONFIGURED, configured: true, indexedCids: 12 }).mockImplementationOnce(() => next.promise)
    const store = createAvailabilityStore({ connectionStore: f.connectionStore, makeClient: () => ({ status }) })
    const stop = store.start()
    try {
      await settle(store)
      const oldGeneration = store.getState().generation
      expect(store.getState().status.indexedCids).toBe(12)
      f.rotate()
      expect(store.getState().status).toBeUndefined()
      await settle(store)
      expect(status).toHaveBeenCalledTimes(2)
      expect(store.getState()).toMatchObject({ phase: 'checking', generation: f.connectionStore.getSnapshot().generation })
      expect(store.getState().generation).not.toBe(oldGeneration)
      next.resolve({ ...CONFIGURED, configured: true, indexedCids: 2 })
      await settle(store)
      expect(store.getState().status.indexedCids).toBe(2)
    } finally { stop(); f.connectionStore.dispose() }
  })

  it('aborts old probes and ignores answers even if their client ignores abort', async () => {
    const f = lifetimeFixture()
    const old = deferred()
    const next = deferred()
    const signals = []
    const status = vi.fn(({ signal }) => { signals.push(signal); return signals.length === 1 ? old.promise : next.promise })
    const store = createAvailabilityStore({ connectionStore: f.connectionStore, makeClient: () => ({ status }) })
    const stop = store.start()
    try {
      await settle(store)
      f.rotate()
      expect(signals[0].aborted).toBe(true)
      await settle(store)
      old.resolve({ ...CONFIGURED, configured: true, indexedCids: 999 })
      await settle(store)
      expect(store.getState().status).toBeUndefined()
      next.resolve({ ...CONFIGURED, configured: true, indexedCids: 1 })
      await settle(store)
      expect(store.getState().status.indexedCids).toBe(1)
    } finally { stop(); f.connectionStore.dispose() }
  })

  it('fences a late resolver before it can start an obsolete request', async () => {
    const old = deferred()
    const resolve = vi.fn().mockImplementationOnce(() => old.promise).mockResolvedValueOnce({ ok: true, root: 'http://127.0.0.1:6060', getToken: () => 'fixture' })
    const status = vi.fn(async () => ({ ...CONFIGURED, configured: true }))
    const store = createAvailabilityStore({ resolve, makeClient: () => ({ status }) })
    const first = store.sync()
    await store.refresh()
    old.resolve({ ok: true, root: 'http://127.0.0.1:5050', getToken: () => 'retired-fixture' })
    await first
    expect(status).toHaveBeenCalledOnce()
    store.resetForTests()
  })

  it('Search off aborts a pending probe, clears capability and prevents late restoration', async () => {
    const f = lifetimeFixture()
    const pending = deferred()
    let signal
    const status = vi.fn(opts => { signal = opts.signal; return pending.promise })
    const store = createAvailabilityStore({ connectionStore: f.connectionStore, makeClient: () => ({ status }) })
    const stop = store.start()
    try {
      await settle(store)
      updateSearch({ enabled: false })
      expect(signal.aborted).toBe(true)
      expect(store.getState()).toMatchObject({ phase: 'disabled', status: undefined })
      pending.resolve({ ...CONFIGURED, configured: true })
      await settle(store)
      expect(store.getState().phase).toBe('disabled')
      expect(status).toHaveBeenCalledOnce()
    } finally { stop(); f.connectionStore.dispose() }
  })
})
