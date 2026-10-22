import { vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import agentChatEn from '../../public/locales/en/agentChat.json'
import { AgentChatLauncher } from './index.js'
import { getOriginPolicy } from './origin-policy.js'
import { validateEndpoint } from './endpoint.js'
import { setTheme } from '../promethity/theme.js'
import { STORAGE_KEY, TOKEN_STORAGE_KEY, getSettings, getToken, resetForTests, setToken, updateSettings } from './settings-store.js'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['agentChat', 'app'],
  defaultNS: 'agentChat',
  resources: { en: { agentChat: agentChatEn, app: { actions: { save: 'Save' } } } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

// The island is a vendored asset exercised by the kubo mcp/chat suite. Here a stub
// element stands in for it, so these tests prove what the fork does with it.
class StubChat extends HTMLElement {
  static instances = []
  static tokens = []
  static providers = []
  open = false
  toggles = 0
  connectedCallback () { StubChat.instances.push(this) }
  get token () { return undefined }
  set token (value) { StubChat.tokens.push(value) }
  get tokenProvider () { return undefined }
  set tokenProvider (value) { StubChat.providers.push(value) }
  toggle () {
    this.toggles += 1
    this.open = !this.open
    this.dispatchEvent(new CustomEvent('ipfs-agent-chat-openchange', { detail: { open: this.open } }))
  }
}
const defineStub = () => { if (!customElements.get('ipfs-agent-chat')) customElements.define('ipfs-agent-chat', StubChat) }
const chatElements = () => document.querySelectorAll('ipfs-agent-chat')

const ENDPOINT = 'http://127.0.0.1:43111/agui'
let fetchSpy
let loader

beforeEach(() => {
  localStorage.clear()
  // Most tests start from a profile that opted out; the default-on describe starts empty.
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: false }))
  resetForTests()
  StubChat.instances = []
  StubChat.tokens = []
  StubChat.providers = []
  fetchSpy = vi.fn(() => Promise.reject(new Error('no network expected')))
  globalThis.fetch = fetchSpy
  loader = vi.fn(async () => { defineStub() })
})

afterEach(() => {
  cleanup()
  document.querySelectorAll('ipfs-agent-chat').forEach((el) => el.remove())
})

describe('validateEndpoint', () => {
  it.each([
    ['https://node.example/agui', true],
    ['http://127.0.0.1:1234/agui', true],
    ['http://localhost:1234/agui', true],
    ['http://[::1]:1234/agui', true],
    ['', false],
    ['not a url', false],
    ['http://node.example/agui', false],
    ['https://node.example/other', false],
    ['https://user:pw@node.example/agui', false],
    ['https://node.example/agui?x=1', false],
    ['https://node.example/agui#frag', false]
  ])('%s -> %s', (input, ok) => {
    expect(validateEndpoint(input).ok).toBe(ok)
  })
})

describe('agent chat default on', () => {
  it('is on by default with no endpoint, and shows no launcher until a valid /agui endpoint exists', async () => {
    localStorage.clear()
    resetForTests()
    expect(getSettings()).toEqual({ enabled: true, endpoint: '' })
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    await act(async () => { await Promise.resolve() })
    expect(container).toBeEmptyDOMElement()
    expect(loader).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
    act(() => updateSettings({ endpoint: ENDPOINT }))
    expect(screen.getByRole('button', { name: 'Agent chat' })).toBeInTheDocument()
    expect(loader).not.toHaveBeenCalled()
  })

  it('keeps a stored switch-off across a reload', () => {
    localStorage.clear()
    resetForTests()
    updateSettings({ enabled: false })
    resetForTests()
    expect(getSettings().enabled).toBe(false)
  })
})

describe('agent chat switched off (opted out)', () => {
  it('is off for a profile that stored enabled: false', () => {
    expect(getSettings()).toEqual({ enabled: false, endpoint: '' })
  })

  it('shows no launcher, imports no island, creates no element and makes no request', async () => {
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    await act(async () => { await Promise.resolve() })
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('button')).toBeNull()
    expect(loader).not.toHaveBeenCalled()
    expect(chatElements()).toHaveLength(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('stays inert when an endpoint is stored but the switch is off', async () => {
    updateSettings({ endpoint: ENDPOINT })
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    await act(async () => { await Promise.resolve() })
    expect(container).toBeEmptyDOMElement()
    expect(loader).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('stays inert when the switch is on but there is no valid endpoint', async () => {
    updateSettings({ enabled: true, endpoint: '' })
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    expect(container).toBeEmptyDOMElement()
    act(() => updateSettings({ endpoint: 'http://remote.example/agui' }))
    expect(container).toBeEmptyDOMElement()
    expect(loader).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('agent chat switched on', () => {
  beforeEach(() => updateSettings({ enabled: true, endpoint: ENDPOINT }))

  it('shows the launcher but loads nothing until it is pressed', async () => {
    render(<AgentChatLauncher loadIsland={loader} />)
    expect(screen.getByRole('button', { name: 'Agent chat' })).toHaveAttribute('aria-expanded', 'false')
    expect(loader).not.toHaveBeenCalled()
    expect(chatElements()).toHaveLength(0)
  })

  it('imports the island on press and connects it to the configured /agui URL', async () => {
    setToken('t0ken')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))

    expect(loader).toHaveBeenCalledTimes(1)
    const el = chatElements()[0]
    expect(el.getAttribute('endpoint')).toBe(ENDPOINT)
    expect(el.open).toBe(true)
    expect(StubChat.tokens).toContain('t0ken')
    // The token travels by property only.
    expect(el.hasAttribute('token')).toBe(false)
    expect(document.body.innerHTML).not.toContain('t0ken')
    // The launcher itself never calls the network.
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('toggles the existing element on later presses and mirrors its open state', async () => {
    render(<AgentChatLauncher loadIsland={loader} />)
    const button = screen.getByRole('button', { name: 'Agent chat' })
    fireEvent.click(button)
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    act(() => { chatElements()[0].dispatchEvent(new CustomEvent('ipfs-agent-chat-openchange', { detail: { open: true } })) })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(button)
    expect(loader).toHaveBeenCalledTimes(1)
    expect(chatElements()[0].toggles).toBe(1)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('passes a token entered after the island loaded', async () => {
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    act(() => setToken('later'))
    expect(StubChat.tokens[StubChat.tokens.length - 1]).toBe('later')
  })

  it('removes the element and the launcher when switched off, and forgets the token', async () => {
    setToken('t0ken')
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    act(() => updateSettings({ enabled: false }))
    expect(chatElements()).toHaveLength(0)
    expect(container).toBeEmptyDOMElement()
    expect(getToken()).toBeUndefined()
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
  })

  it('reports a load failure and allows a retry', async () => {
    loader.mockRejectedValueOnce(new Error('offline'))
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be loaded/i)
    expect(chatElements()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(loader).toHaveBeenCalledTimes(2)
  })
})

describe('agent chat token storage', () => {
  it('survives a reload', () => {
    setToken('persisted')
    resetForTests()
    expect(getToken()).toBe('persisted')
  })

  it('stays in memory for the page when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      setToken('page-only')
      expect(getToken()).toBe('page-only')
    } finally { spy.mockRestore() }
  })

  it('does not throw when reading storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      expect(() => resetForTests()).not.toThrow()
      expect(getToken()).toBeUndefined()
    } finally { spy.mockRestore() }
  })
})

describe('agent chat under the IPFS Desktop bridge', () => {
  const BRIDGE_ENDPOINT = 'http://127.0.0.1:50999/agui'
  let bridge
  beforeEach(() => {
    bridge = Object.freeze({ getEndpoint: vi.fn(async () => BRIDGE_ENDPOINT), getToken: vi.fn(async () => 'desktop-token') })
    globalThis.ipfsDesktop = Object.freeze({ agentChat: bridge })
  })
  afterEach(() => { delete globalThis.ipfsDesktop })

  it('is enabled by the bridge alone, with no Settings toggle or endpoint', async () => {
    expect(getSettings().enabled).toBe(false)
    render(<AgentChatLauncher loadIsland={loader} />)
    expect(await screen.findByRole('button', { name: 'Agent chat' })).toBeInTheDocument()
    expect(loader).not.toHaveBeenCalled()
  })

  it('takes the endpoint from the bridge, ignoring a Settings-typed one', async () => {
    updateSettings({ enabled: true, endpoint: 'http://127.0.0.1:1/agui' })
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(chatElements()[0].getAttribute('endpoint')).toBe(BRIDGE_ENDPOINT)
  })

  it('sets an origin-fenced bridge tokenProvider and never sets token', async () => {
    setToken('typed-token')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(StubChat.providers.length).toBeGreaterThan(0)
    expect(bridge.getToken).not.toHaveBeenCalled()
    expect(await StubChat.providers.at(-1)()).toBe('desktop-token')
    expect(bridge.getToken).toHaveBeenCalledTimes(1)
    expect(StubChat.tokens).toEqual([])
    const el = chatElements()[0]
    expect(el.hasAttribute('token')).toBe(false)
    expect(el.hasAttribute('tokenprovider')).toBe(false)
    expect(el.outerHTML).not.toContain('typed-token')
    expect(el.outerHTML).not.toContain('desktop-token')
  })

  it('renders nothing when the bridge endpoint is invalid', async () => {
    bridge.getEndpoint.mockResolvedValue('http://example.com/agui')
    render(<AgentChatLauncher loadIsland={loader} />)
    await waitFor(() => expect(bridge.getEndpoint).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: 'Agent chat' })).toBeNull()
  })

  it('renders nothing when the bridge endpoint call rejects', async () => {
    bridge.getEndpoint.mockRejectedValue(new Error('denied'))
    render(<AgentChatLauncher loadIsland={loader} />)
    await waitFor(() => expect(bridge.getEndpoint).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: 'Agent chat' })).toBeNull()
  })
})

describe('agent chat without the bridge (browser)', () => {
  it('stays off with no bridge and no Settings switch, and sets token not tokenProvider', async () => {
    expect(globalThis.ipfsDesktop).toBeUndefined()
    const { container, unmount } = render(<AgentChatLauncher loadIsland={loader} />)
    expect(container).toBeEmptyDOMElement()
    unmount()
    updateSettings({ enabled: true, endpoint: ENDPOINT })
    setToken('t0ken')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(StubChat.tokens).toContain('t0ken')
    expect(StubChat.providers).toEqual([])
  })
})

describe('launcher and the shell theme (agent-chat-island-integration 1.1, 1.3)', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    updateSettings({ enabled: true, endpoint: ENDPOINT })
  })
  afterEach(() => setTheme('system'))

  it('passes the resolved shell theme to the island on creation and follows a change', async () => {
    setTheme('light')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(chatElements()[0].getAttribute('theme')).toBe('light')
    act(() => setTheme('dark'))
    expect(chatElements()[0].getAttribute('theme')).toBe('dark')
  })

  it('resolves the system choice the way the shell does (dark with no preference)', async () => {
    setTheme('system')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(chatElements()[0].getAttribute('theme')).toBe('dark')
  })

  it('carries no Tachyons class on the launcher, only its own', () => {
    const { container } = render(<AgentChatLauncher loadIsland={loader} />)
    const classes = [...container.querySelectorAll('*')].flatMap((el) => [...el.classList])
    const own = classes.filter((c) => c.startsWith('ac-') || c.startsWith('pm-'))
    expect(classes.filter((c) => !own.includes(c))).toEqual([])
  })

  it('reports a load failure as a status line with a word, not a Tachyons box', async () => {
    loader.mockRejectedValueOnce(new Error('offline'))
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Not loaded')
    expect(alert).toHaveTextContent(/could not be loaded/i)
  })
})

describe('launcher clearance for sticky action areas (round 5 correction H2)', () => {
  const read = () => document.documentElement.style.getPropertyValue('--ac-launcher-clearance')

  it('publishes its height while it shows and removes it on unmount', () => {
    updateSettings({ enabled: true, endpoint: ENDPOINT })
    const view = render(<AgentChatLauncher loadIsland={loader} />)
    expect(read()).toMatch(/^\d+px$/)
    view.unmount()
    expect(read()).toBe('')
  })

  it('publishes nothing while the chat is off (disabled-state)', () => {
    render(<AgentChatLauncher loadIsland={loader} />)
    expect(read()).toBe('')
  })
})

describe('legacy launcher respects the host origin boundary', () => {
  let previous
  beforeEach(() => { previous = location.href })
  afterEach(() => { cleanup(); history.replaceState(null, '', previous); getOriginPolicy().refresh() })
  it('loads no island on a shared path despite stored endpoint and token', () => {
    history.replaceState(null, '', '/ipfs/bafyfixture/'); getOriginPolicy().refresh()
    updateSettings({ enabled: true, endpoint: ENDPOINT }); setToken('fixture-token')
    render(<AgentChatLauncher loadIsland={loader} />)
    expect(screen.queryByRole('button', { name: 'Agent chat' })).toBeNull()
    expect(loader).not.toHaveBeenCalled(); expect(chatElements()).toHaveLength(0)
  })
  it('does not mount after a delayed island load when the current path became shared', async () => {
    let resolve
    const held = new Promise(_resolve => { resolve = _resolve })
    const delayed = vi.fn(() => held)
    updateSettings({ enabled: true, endpoint: ENDPOINT }); setToken('fixture-token')
    render(<AgentChatLauncher loadIsland={delayed} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    history.replaceState(null, '', '/ipns/shared/')
    await act(async () => { defineStub(); resolve(); await held })
    expect(chatElements()).toHaveLength(0)
  })
  it('removes a live element synchronously before replacement origin notification completes', async () => {
    updateSettings({ enabled: true, endpoint: ENDPOINT }); setToken('fixture-token')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    history.replaceState(null, '', '/proxy/ipfs/bafyfixture/')
    act(() => { getOriginPolicy().refresh(); expect(chatElements()).toHaveLength(0) })
    expect(screen.queryByRole('button', { name: 'Agent chat' })).toBeNull()
  })
})

it('does not revive a retired legacy island load just because the page returned to a permitted route', async () => {
  const previous = location.href
  let resolve
  const held = new Promise(_resolve => { resolve = _resolve })
  try {
    updateSettings({ enabled: true, endpoint: ENDPOINT }); setToken('fixture-token')
    render(<AgentChatLauncher loadIsland={() => held} />)
    fireEvent.click(screen.getByRole('button', { name: 'Agent chat' }))
    act(() => { history.replaceState(null, '', '/ipfs/bafyfixture/'); getOriginPolicy().refresh() })
    act(() => { history.replaceState(null, '', previous); getOriginPolicy().refresh() })
    await act(async () => { defineStub(); resolve(); await held })
    expect(chatElements()).toHaveLength(0)
  } finally { cleanup(); history.replaceState(null, '', previous); getOriginPolicy().refresh() }
})
