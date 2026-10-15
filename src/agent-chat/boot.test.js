/* eslint-env jest */
import * as chat from './settings-store.js'
import * as webmcp from '../webmcp/settings-store.js'
import { migrateAgentDefaults } from './boot.js'

beforeEach(() => {
  localStorage.clear()
  chat.reload()
  webmcp.reload()
})

describe('migrateAgentDefaults (D18: absent keys only)', () => {
  it('leaves an empty profile alone and both features take the shipped default on', () => {
    expect(migrateAgentDefaults()).toEqual([false, false])
    expect(localStorage.length).toBe(0)
    expect(chat.getSettings().enabled).toBe(true)
    expect(webmcp.getSettings()).toEqual({ enabled: true, dnslink: false, writes: false })
  })

  it('fills only a missing enabled key, keeping the rest of the stored object', () => {
    localStorage.setItem(chat.STORAGE_KEY, JSON.stringify({ endpoint: 'http://127.0.0.1:1/agui' }))
    localStorage.setItem(webmcp.STORAGE_KEY, JSON.stringify({ dnslink: true }))
    expect(migrateAgentDefaults()).toEqual([true, true])
    expect(JSON.parse(localStorage.getItem(chat.STORAGE_KEY))).toEqual({ enabled: true, endpoint: 'http://127.0.0.1:1/agui' })
    expect(JSON.parse(localStorage.getItem(webmcp.STORAGE_KEY))).toEqual({ enabled: true, dnslink: true })
  })

  it('never touches a stored enabled: false, and the stores still read false', () => {
    localStorage.setItem(chat.STORAGE_KEY, JSON.stringify({ enabled: false, endpoint: '' }))
    localStorage.setItem(webmcp.STORAGE_KEY, JSON.stringify({ enabled: false, dnslink: false }))
    expect(migrateAgentDefaults()).toEqual([false, false])
    expect(JSON.parse(localStorage.getItem(chat.STORAGE_KEY))).toEqual({ enabled: false, endpoint: '' })
    expect(JSON.parse(localStorage.getItem(webmcp.STORAGE_KEY))).toEqual({ enabled: false, dnslink: false })
    expect(chat.getSettings().enabled).toBe(false)
    expect(webmcp.getSettings().enabled).toBe(false)
  })

  it('never stores or enables writes', () => {
    localStorage.setItem(webmcp.STORAGE_KEY, JSON.stringify({ writes: true }))
    migrateAgentDefaults()
    expect(webmcp.getSettings().writes).toBe(false)
    expect(webmcp.getSettings().enabled).toBe(true)
  })

  it('ignores unreadable and non-object values', () => {
    localStorage.setItem(chat.STORAGE_KEY, '{not json')
    localStorage.setItem(webmcp.STORAGE_KEY, '[1]')
    expect(migrateAgentDefaults()).toEqual([false, false])
    expect(localStorage.getItem(chat.STORAGE_KEY)).toBe('{not json')
  })

  it('survives blocked storage', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      expect(migrateAgentDefaults()).toEqual([false, false])
    } finally {
      spy.mockRestore()
    }
  })
})

// The real startup path: src/index.js with its heavy collaborators stubbed. The stores are
// evaluated before the migration runs, as in the browser; a stored opt-out must survive.
describe('app boot through src/index.js', () => {
  const stubs = () => {
    jest.doMock('react-dom', () => ({ render: jest.fn() }))
    jest.doMock('./../App.js', () => () => null)
    jest.doMock('../bundles/index.js', () => () => ({}))
    jest.doMock('../lib/bundle-cache.js', () => ({ getAll: async () => ({}) }))
    jest.doMock('../i18n.js', () => ({}))
    jest.doMock('../lib/dnd-backend.js', () => ({}))
    jest.doMock('../helpers/context-bridge.jsx', () => ({ ContextBridgeProvider: ({ children }) => children }), { virtual: true })
    jest.doMock('ipld-explorer-components/providers', () => ({ HeliaProvider: ({ children }) => children, ExploreProvider: ({ children }) => children }), { virtual: true })
    jest.doMock('redux-bundler-react', () => ({ Provider: ({ children }) => children }))
    jest.doMock('react-dnd', () => ({ DndProvider: ({ children }) => children }))
    jest.doMock('react-i18next', () => ({ I18nextProvider: ({ children }) => children }))
    for (const css of ['./../index.css', 'react-virtualized/styles.css', '../promethity/fonts.css', '../promethity/tokens.css', '../promethity/theme-overrides.css', '../promethity/components.css']) {
      jest.doMock(css, () => ({}), { virtual: true })
    }
  }

  const boot = async (webmcpStored, chatStored) => {
    jest.resetModules()
    localStorage.clear()
    if (webmcpStored !== undefined) localStorage.setItem('ipfs-webui:webmcp', JSON.stringify(webmcpStored))
    if (chatStored !== undefined) localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify(chatStored))
    stubs()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    require('../index.js')
    await new Promise((resolve) => setTimeout(resolve, 0))
    return { chat: require('./settings-store.js'), webmcp: require('../webmcp/settings-store.js') }
  }

  afterEach(() => {
    jest.restoreAllMocks()
    jest.dontMock('react-dom')
  })

  it('keeps a stored enabled: false for both features', async () => {
    const stores = await boot({ enabled: false, dnslink: false }, { enabled: false, endpoint: '' })
    expect(stores.chat.getSettings().enabled).toBe(false)
    expect(stores.webmcp.getSettings().enabled).toBe(false)
    expect(JSON.parse(localStorage.getItem('ipfs-webui:webmcp')).enabled).toBe(false)
    expect(JSON.parse(localStorage.getItem('ipfs-webui:agent-chat')).enabled).toBe(false)
  })

  it('fills the absent keys and turns both on for a profile that never chose', async () => {
    const stores = await boot({ dnslink: true }, { endpoint: 'http://127.0.0.1:1/agui' })
    expect(stores.chat.getSettings().enabled).toBe(true)
    expect(stores.webmcp.getSettings()).toEqual({ enabled: true, dnslink: true, writes: false })
    expect(JSON.parse(localStorage.getItem('ipfs-webui:webmcp')).enabled).toBe(true)
  })

  it('turns both on for an empty profile and leaves writes off', async () => {
    const stores = await boot(undefined, undefined)
    expect(stores.chat.getSettings().enabled).toBe(true)
    expect(stores.webmcp.getSettings()).toEqual({ enabled: true, dnslink: false, writes: false })
  })
})
