// webui-vector-search 1.1 and 1.6: the nav entry and the route exist only when the node
// answers GET /index/status with a configured index, and only while search.enabled is on.
import { createAvailabilityStore, availabilityStore, isNavVisible } from './availability-store.js'
import { reply, CONFIGURED } from './test-helpers.js'
import { updateSettings as updateChat, resetForTests as resetChat, STORAGE_KEY as CHAT_KEY, TOKEN_STORAGE_KEY, setToken } from '../agent-chat/settings-store.js'
import { updateSettings as updateSearch, resetForTests as resetSearch, STORAGE_KEY as SEARCH_KEY } from './settings-store.js'

const ENDPOINT = 'http://127.0.0.1:5050/agui'
let fetchMock

const settle = async (store) => {
  // Let the async probe finish.
  for (let i = 0; i < 10; i++) await Promise.resolve()
  return store.getState()
}

beforeEach(() => {
  localStorage.clear()
  resetChat()
  resetSearch()
  availabilityStore.resetForTests()
  fetchMock = jest.fn(async () => reply(200, CONFIGURED))
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
