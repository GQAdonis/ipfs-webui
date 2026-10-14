import React from 'react'
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import agentChatEn from '../../public/locales/en/agentChat.json'
import { AgentChatLauncher, AgentChatSettings } from './index.js'
import { validateEndpoint } from './endpoint.js'
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
  resetForTests()
  StubChat.instances = []
  StubChat.tokens = []
  StubChat.providers = []
  fetchSpy = jest.fn(() => Promise.reject(new Error('no network expected')))
  globalThis.fetch = fetchSpy
  loader = jest.fn(async () => { defineStub() })
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

describe('agent chat switched off (default)', () => {
  it('is off by default with no endpoint', () => {
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

  it('the Settings switch is unchecked by default and the page loads nothing', () => {
    render(<AgentChatSettings />)
    expect(screen.getByRole('checkbox', { name: /enable agent chat/i })).not.toBeChecked()
    expect(loader).not.toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(screen.getByText(/agent\.origin_allowlist/)).toBeInTheDocument()
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
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      setToken('page-only')
      expect(getToken()).toBe('page-only')
    } finally { spy.mockRestore() }
  })

  it('does not throw when reading storage is blocked', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      expect(() => resetForTests()).not.toThrow()
      expect(getToken()).toBeUndefined()
    } finally { spy.mockRestore() }
  })
})

describe('agent chat Settings', () => {
  it('turns the chat on and keeps the token in its own key, apart from the settings', () => {
    render(<AgentChatSettings />)
    fireEvent.click(screen.getByRole('checkbox', { name: /enable agent chat/i }))
    expect(getSettings().enabled).toBe(true)

    fireEvent.change(screen.getByLabelText(/agent endpoint/i), { target: { value: ENDPOINT } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0])
    expect(getSettings().endpoint).toBe(ENDPOINT)

    fireEvent.change(screen.getByLabelText(/access token/i), { target: { value: 'sekret' } })
    expect(screen.getByLabelText(/access token/i)).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: 'Set token' }))
    expect(getToken()).toBe('sekret')
    expect(screen.getByRole('status')).toHaveTextContent(/token is saved/i)
    expect(screen.getByLabelText(/access token/i)).toHaveValue('')

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(JSON.parse(stored)).toEqual({ enabled: true, endpoint: ENDPOINT })
    expect(stored).not.toContain('sekret')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('sekret')
    expect(JSON.stringify({ ...sessionStorage })).not.toContain('sekret')
  })

  it('refuses an invalid endpoint with an announced error', () => {
    render(<AgentChatSettings />)
    const input = screen.getByLabelText(/agent endpoint/i)
    fireEvent.change(input, { target: { value: 'http://remote.example/agui' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0])
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent(/https, or http on localhost/i)
    expect(getSettings().endpoint).toBe('')
  })

  it('forgets the stored token on request', () => {
    setToken('abc')
    render(<AgentChatSettings />)
    expect(screen.getByRole('status')).toHaveTextContent(/saved in this browser profile/i)
    fireEvent.click(screen.getByRole('button', { name: 'Forget token' }))
    expect(getToken()).toBeUndefined()
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
    expect(screen.getByRole('button', { name: 'Forget token' })).toBeDisabled()
  })

  it('disables Forget token when no token is stored', () => {
    render(<AgentChatSettings />)
    expect(screen.getByRole('button', { name: 'Forget token' })).toBeDisabled()
  })
})

describe('agent chat under the IPFS Desktop bridge', () => {
  const BRIDGE_ENDPOINT = 'http://127.0.0.1:50999/agui'
  let bridge
  beforeEach(() => {
    bridge = Object.freeze({ getEndpoint: jest.fn(async () => BRIDGE_ENDPOINT), getToken: jest.fn(async () => 'desktop-token') })
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

  it('sets tokenProvider to the bridge getToken and never sets token', async () => {
    setToken('typed-token')
    render(<AgentChatLauncher loadIsland={loader} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Agent chat' }))
    await waitFor(() => expect(chatElements()).toHaveLength(1))
    expect(StubChat.providers.length).toBeGreaterThan(0)
    expect(StubChat.providers.every((p) => p === bridge.getToken)).toBe(true)
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

  it('hides the endpoint and token fields in Settings and shows the managed note', () => {
    render(<AgentChatSettings />)
    expect(screen.getByText(/IPFS Desktop manages the agent chat connection/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Agent endpoint (/agui URL)')).toBeNull()
    expect(document.getElementById('agent-chat-token')).toBeNull()
    expect(document.getElementById('agent-chat-toggle')).toBeNull()
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

  it('shows the endpoint and token fields in Settings', () => {
    render(<AgentChatSettings />)
    expect(screen.getByLabelText('Agent endpoint (/agui URL)')).toBeInTheDocument()
    expect(document.getElementById('agent-chat-token')).not.toBeNull()
  })
})
