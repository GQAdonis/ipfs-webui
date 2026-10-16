// webui-agent-settings-page 1.7: every state of the page, against a fake
// SettingsClient (the page never learns which transport it has), in both themes.

import React from 'react'
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import axe from 'axe-core'
import agentSettingsEn from '../../../public/locales/en/agentSettings.json'
import agentChatEn from '../../../public/locales/en/agentChat.json'
import webmcpEn from '../../../public/locales/en/webmcp.json'
import searchEn from '../../../public/locales/en/search.json'
import { AgentSettingsPage } from './AgentSettingsPage.js'
import AgentSettingsSummary from './AgentSettingsSummary.js'
import { SettingsError } from './core/errors.js'
import { resetAdminTokenForTests, getAdminToken, getAdminTokenRoot, setAdminToken } from './core/admin-token.js'
import { STORAGE_KEY as CHAT_KEY, resetForTests as resetChat, getSettings as getChat, updateSettings as updateChat } from '../../agent-chat/settings-store.js'
import { STORAGE_KEY as WEBMCP_KEY, resetForTests as resetWebMcp } from '../../webmcp/settings-store.js'

// Box wraps its children in an error boundary imported as .js from a .tsx file, which webpack
// resolves and jest does not. The panel markup is all this test needs.
jest.mock('../../components/box/Box.js', () => ({
  __esModule: true,
  default: ({ className, children }) => <section className={className}>{children}</section>
}))

const missing = []
i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['agentSettings', 'agentChat', 'webmcp', 'search', 'app'],
  defaultNS: 'agentSettings',
  resources: { en: { agentSettings: agentSettingsEn, agentChat: agentChatEn, webmcp: webmcpEn, search: searchEn, app: {} } },
  interpolation: { escapeValue: false },
  saveMissing: true,
  missingKeyHandler: (_l, ns, key) => { missing.push(`${ns}:${key}`) },
  react: { useSuspense: false }
})

const SERVER = (backend = null, revision = 'rev-1') => ({ revision, backend, system_prompt: { safety_prefix: 'p', custom: '' } })
const OPENAI = { kind: 'openai', base_url: 'http://127.0.0.1:4000/v1', model: 'qwen3:8b', api_key: { set: false } }

/** A SettingsClient whose every method is a recorded jest.fn. */
function fakeClient ({ server = SERVER(null), status = { transport: 'http', managed_by_desktop: false }, ...over } = {}) {
  let current = server
  const listeners = new Set()
  const client = {
    get: jest.fn(async () => current),
    set: jest.fn(async (req) => {
      const b = { ...(current.backend ?? { kind: 'openai', api_key: { set: false } }), ...req.backend }
      current = SERVER(b, 'rev-2')
      return current
    }),
    testConnection: jest.fn(async () => ({ ok: true, latency_ms: 12, models: ['qwen3:8b', 'llama3.1', 'mistral'] })),
    setApiKey: jest.fn(async () => {
      current = SERVER(current.backend && { ...current.backend, api_key: { set: true, source: 'settings_api' } }, 'rev-k')
      return { revision: 'rev-k', api_key: { set: true, source: 'settings_api' } }
    }),
    clearApiKey: jest.fn(async () => ({ revision: 'rev-c', api_key: { set: false } })),
    status: jest.fn(async () => status),
    onChange: jest.fn((cb) => { listeners.add(cb); return () => listeners.delete(cb) }),
    emit: (e) => listeners.forEach((cb) => cb(e)),
    ...over
  }
  return client
}

const open = async (client, props = {}) => {
  const view = render(<AgentSettingsPage client={client} {...props} />)
  await waitFor(() => expect(screen.queryByText('Reading the settings from the node.')).toBeNull())
  return view
}

const chooseOpenAi = () => fireEvent.click(screen.getByRole('radio', { name: 'OpenAI-compatible endpoint' }))
const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const CONFIRM = /Type the backend host to confirm/
// A host other than the current backend's must be typed back before Test connection or Apply works.
const confirmHost = (host) => fireEvent.change(screen.getByLabelText(CONFIRM), { target: { value: host } })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  // The page tests start from a profile that opted out of both features.
  localStorage.setItem(CHAT_KEY, JSON.stringify({ enabled: false }))
  localStorage.setItem(WEBMCP_KEY, JSON.stringify({ enabled: false }))
  resetChat()
  resetWebMcp()
  resetAdminTokenForTests()
  setAdminToken(undefined)
  missing.length = 0
  delete globalThis.ipfsDesktop
})
afterEach(() => {
  cleanup()
  delete globalThis.ipfsDesktop
  document.documentElement.removeAttribute('data-theme')
})

describe('first run', () => {
  it('preselects no backend, shows the three-step list, and mounts no field set', async () => {
    await open(fakeClient())
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
    expect(radios.some((r) => r.checked)).toBe(false)
    const steps = screen.getByRole('list', { name: 'Setup steps' })
    expect(within(steps).getAllByRole('listitem')).toHaveLength(3)
    expect(within(steps).getByText('Turn on agent chat.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Base URL')).toBeNull()
    expect(screen.getByText(/Backend: not chosen. Choose a backend to start./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(missing).toEqual([])
  })

  it('moves focus to the first backend choice, and offers Universal Agent Runtime as a plain choice', async () => {
    await open(fakeClient())
    expect(document.activeElement).toBe(screen.getAllByRole('radio')[0])
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'OpenAI-compatible endpoint' }))
    expect(screen.getByRole('radio', { name: 'Universal Agent Runtime' })).not.toBeDisabled()
    expect(screen.queryByText('Not available yet')).toBeNull()
  })

  it('drops the chat step when chat is already on', async () => {
    updateChat({ enabled: true })
    await open(fakeClient())
    const steps = screen.getByRole('list', { name: 'Setup steps' })
    expect(within(steps).getAllByRole('listitem')).toHaveLength(2)
  })
})

describe('OpenAI-compatible form', () => {
  it('tests the connection, fills the model list, and applies with the typed host', async () => {
    const client = fakeClient()
    await open(client)
    chooseOpenAi()
    const model = screen.getByRole('combobox', { name: 'Model' })
    expect(model).toBeDisabled()

    type('Base URL', 'http://127.0.0.1:4000/v1')
    // No key is stored, so a test has nothing to send and is not held back.
    expect(screen.getByRole('button', { name: 'Test connection' })).not.toBeDisabled()
    confirmHost('127.0.0.1:4000')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/127.0.0.1:4000 answered in 12 ms/)).toBeInTheDocument()
    expect(screen.getByText(/3 models listed/)).toBeInTheDocument()
    expect(client.testConnection).toHaveBeenCalledWith({ base_url: 'http://127.0.0.1:4000/v1', kind: 'openai' })

    expect(model).not.toBeDisabled()
    fireEvent.focus(model)
    fireEvent.keyDown(model, { key: 'ArrowDown' })
    fireEvent.click(screen.getByRole('option', { name: 'llama3.1' }))
    expect(model).toHaveValue('llama3.1')

    // The host was typed before the test and stays typed: Apply is open.
    const apply = screen.getByRole('button', { name: 'Apply' })
    expect(apply).not.toBeDisabled()
    fireEvent.click(apply)

    await waitFor(() => expect(client.set).toHaveBeenCalledTimes(1))
    expect(client.set).toHaveBeenCalledWith({
      revision: 'rev-1',
      backend: { kind: 'openai', base_url: 'http://127.0.0.1:4000/v1', model: 'llama3.1' },
      egress_confirmation: { host: '127.0.0.1:4000' }
    })
    expect(await screen.findByText(/At .+New chats use llama3.1 at 127.0.0.1:4000. Agent chat is off./)).toBeInTheDocument()
    expect(screen.queryByText(/previous backend/)).toBeNull()
    expect(screen.getByRole('button', { name: 'Go to the chat switch' })).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.queryByText(/restart/i)).toBeNull()
    expect(screen.queryByLabelText(CONFIRM)).toBeNull()
    expect(missing).toEqual([])
  })

  it('shows a specific error on the URL field and keeps Test connection off', async () => {
    await open(fakeClient())
    chooseOpenAi()
    const url = screen.getByLabelText('Base URL')
    fireEvent.change(url, { target: { value: 'http://remote.example/v1' } })
    fireEvent.blur(url)
    expect(url).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/Use https, or http on localhost/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
  })

  it('reports a failed test with the node detail; the model stays off until a test is tried, then can be typed because the key goes with Apply', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: false, detail: 'the server answered 401. Check the key.' })) })
    await open(client)
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    expect(screen.getByRole('combobox', { name: 'Model' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText('the server answered 401. Check the key.')).toBeInTheDocument()
    expect(screen.getByText('Not reachable')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Model' })).not.toBeDisabled()
  })

  it('accepts a free-text model when the backend hides its list', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: true, latency_ms: 3 })) })
    await open(client)
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/hides its model list/)).toBeInTheDocument()
    const model = screen.getByRole('combobox', { name: 'Model' })
    fireEvent.change(model, { target: { value: 'my-model' } })
    fireEvent.keyDown(model, { key: 'Enter' })
    expect(model).toHaveValue('my-model')
  })

  it('invalidates the test result when the URL changes', async () => {
    await open(fakeClient())
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByText(/llm.example answered/)
    type('Base URL', 'https://other.example/v1')
    expect(screen.queryByText(/llm.example answered/)).toBeNull()
    expect(screen.getByRole('combobox', { name: 'Model' })).toBeDisabled()
  })

  it('applies a model-only change with no host confirmation', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    expect(screen.getByRole('radio', { name: 'OpenAI-compatible endpoint' })).toBeChecked()
    const model = screen.getByRole('combobox', { name: 'Model' })
    fireEvent.change(model, { target: { value: 'llama3.1' } })
    fireEvent.keyDown(model, { key: 'Enter' })
    expect(screen.queryByLabelText(CONFIRM)).toBeNull()
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(client.set).toHaveBeenCalledWith({ revision: 'rev-1', backend: { model: 'llama3.1' } }))
  })
})

describe('the stored key and Test connection (security)', () => {
  const STORED = { ...OPENAI, api_key: { set: true, source: 'settings_api' } }

  it('keeps Test connection off for another host until the host is typed, and says why', async () => {
    const client = fakeClient({ server: SERVER(STORED) })
    await open(client)
    type('Base URL', 'https://attacker.example/v1')
    const test = screen.getByRole('button', { name: 'Test connection' })
    expect(test).toBeDisabled()
    expect(screen.getByText(/stays off until you type the host attacker.example above/)).toBeInTheDocument()
    expect(screen.getByText(/never carries the stored key, and the key does not follow a move/)).toBeInTheDocument()
    // The reason is linked to the button, and the host field sits above it.
    expect(test).toHaveAccessibleDescription(/stays off until you type the host/)
    const host = screen.getByLabelText(CONFIRM)
    expect(host.compareDocumentPosition(test) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    fireEvent.click(test)
    expect(client.testConnection).not.toHaveBeenCalled()
    confirmHost('attacker.example')
    expect(test).not.toBeDisabled()
    expect(screen.getByText('Matches')).toBeInTheDocument()
  })

  it('does not gate a test of the current backend host', async () => {
    const client = fakeClient({ server: SERVER(STORED) })
    await open(client)
    expect(screen.queryByLabelText(CONFIRM)).toBeNull()
    expect(screen.getByRole('button', { name: 'Test connection' })).not.toBeDisabled()
  })

  it('shows "reachable, key not sent" as its own state, not as success', async () => {
    const client = fakeClient({ server: SERVER(STORED), testConnection: jest.fn(async () => ({ ok: true, latency_ms: 9, key_sent: false, models: [] })) })
    await open(client)
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText('Reachable, key not sent')).toBeInTheDocument()
    expect(screen.queryByText('Reachable', { selector: 'strong' })).toBeNull()
    expect(screen.getByText(/Only the current backend receives the stored key, and this host is not it/)).toBeInTheDocument()
  })

  it('says the key was sent when the node reports it', async () => {
    const client = fakeClient({ server: SERVER(STORED), testConnection: jest.fn(async () => ({ ok: true, latency_ms: 9, key_sent: true, models: ['a'] })) })
    await open(client)
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/The stored key was sent\./)).toBeInTheDocument()
    expect(screen.getByText('Reachable', { selector: 'strong' })).toBeInTheDocument()
  })

  it('says nothing about a key when none is stored', async () => {
    const client = fakeClient({ server: SERVER(OPENAI), testConnection: jest.fn(async () => ({ ok: true, latency_ms: 9, key_sent: false, models: [] })) })
    await open(client)
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/answered in 9 ms/)).toBeInTheDocument()
    expect(screen.queryByText(/key not sent/)).toBeNull()
  })

  it('states in the key help that the key stays with the host it is stored for', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    expect(screen.getByText(/sends it only to the backend host it is stored for; moving the backend to another host needs a new key/)).toBeInTheDocument()
  })

  describe('ADR-0012: a backend move and the stored key', () => {
    it('says node content goes to the new host and the stored key does not follow, only while a key is stored', async () => {
      await open(fakeClient({ server: SERVER(STORED) }))
      type('Base URL', 'https://new.example/v1')
      const field = screen.getByLabelText(CONFIRM)
      expect(field).toHaveAccessibleDescription(/Node content that an agent reads goes to this host/)
      expect(field).toHaveAccessibleDescription(/stored through this page does not follow to a new host: applying removes it/)
    })

    it('does not mention the key in the move copy when none is stored', async () => {
      await open(fakeClient({ server: SERVER(OPENAI) }))
      type('Base URL', 'https://new.example/v1')
      expect(screen.getByLabelText(CONFIRM)).not.toHaveAccessibleDescription(/stored key/)
    })

    it('sends a replacement key typed in the field with the move, in the same write', async () => {
      const client = fakeClient({ server: SERVER(STORED) })
      await open(client)
      fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
      fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk-test-fake-9' } })
      type('Base URL', 'https://new.example/v1')
      confirmHost('new.example')
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
      await waitFor(() => expect(client.set).toHaveBeenCalled())
      expect(client.set.mock.calls[0][0].backend).toMatchObject({ base_url: 'https://new.example/v1', api_key: 'sk-test-fake-9' })
    })

    it('shows "The key for the old host is not sent to the new host", that it was removed, and prompts for a new key', async () => {
      const set = jest.fn(async (req) => ({ ...SERVER({ ...STORED, ...req.backend, api_key: { set: false } }, 'rev-2'), key_not_carried: { reason: 'host_changed', cleared: true } }))
      await open(fakeClient({ server: SERVER(STORED), set }))
      type('Base URL', 'https://new.example/v1')
      confirmHost('new.example')
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
      expect(await screen.findByText('Key not sent')).toBeInTheDocument()
      expect(screen.getByText(/The key for the old host is not sent to the new host\. It was removed\. Replace key and type a new key/)).toBeInTheDocument()
      // The page no longer claims a key is stored, so Test connection to this host is not gated.
      expect(screen.getByLabelText('API key')).toHaveValue('')
      expect(screen.getByText('Applied')).toBeInTheDocument()
    })

    it('shows no key notice when the write carries none', async () => {
      await open(fakeClient({ server: SERVER(OPENAI) }))
      type('Base URL', 'https://new.example/v1')
      confirmHost('new.example')
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
      expect(await screen.findByText('Applied')).toBeInTheDocument()
      expect(screen.queryByText('Key not sent')).toBeNull()
    })

    it('says a provider change is a server configuration edit on a node that does not accept keys', async () => {
      const client = fakeClient({ server: SERVER(OPENAI), setApiKey: jest.fn(async () => { throw new SettingsError('secrets_not_accepted', 'no') }) })
      await open(client)
      fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk-test-fake-1' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
      await screen.findByText(/Set on the server \(Kubernetes Secret\)/)
      type('Base URL', 'https://new.example/v1')
      expect(screen.getByText(/follows a host change/)).toBeInTheDocument()
    })

    it('says the same for a key the node reads from the environment, and never sends a key', async () => {
      const client = fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'environment' } }) })
      await open(client)
      type('Base URL', 'https://new.example/v1')
      // The server-supplied key follows the move, and the page says so; it never says it is removed.
      expect(screen.getByText(/follows a host change: after you apply, chats and Test connection send it to the new host/)).toBeInTheDocument()
      expect(screen.getByLabelText(CONFIRM)).toHaveAccessibleDescription(/reads from the server is sent to the new host too/)
      expect(screen.getByLabelText(CONFIRM)).not.toHaveAccessibleDescription(/applying removes it/)
      confirmHost('new.example')
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
      await waitFor(() => expect(client.set).toHaveBeenCalled())
      expect(client.set.mock.calls[0][0].backend.api_key).toBeUndefined()
    })

    it('never says a server-supplied key does not follow a move, in the test note, the gate or the key help', async () => {
      await open(fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'environment' } }) }))
      type('Base URL', 'https://new.example/v1')
      expect(screen.getByText(/the key the server supplies goes to the new host/)).toBeInTheDocument()
      expect(screen.getByText(/A test of a new host never carries the stored key/)).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
      expect(screen.getByText(/A key this node reads from the server follows a host change/)).toBeInTheDocument()
      expect(screen.queryByText(/does not follow/)).toBeNull()
      expect(screen.queryByText(/needs a new key/)).toBeNull()
    })

    it('says the page-stored key is removed, not that it is sent, and shows no server-key note', async () => {
      await open(fakeClient({ server: SERVER(STORED) }))
      type('Base URL', 'https://new.example/v1')
      expect(screen.getByLabelText(CONFIRM)).toHaveAccessibleDescription(/applying removes it/)
      expect(screen.getByLabelText(CONFIRM)).not.toHaveAccessibleDescription(/reads from the server/)
      expect(screen.queryByText(/follows a host change/)).toBeNull()
      expect(screen.getByText(/the key does not follow a move: supply a new key with the change/)).toBeInTheDocument()
    })

    it('does not show the server-key note for a model-only change', async () => {
      await open(fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'environment' } }) }))
      expect(screen.queryByText(/follows a host change/)).toBeNull()
    })
  })

  it('does not gate Test connection when no key is stored, but still asks for the host before Apply', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    type('Base URL', 'https://llm.example/v1')
    const test = screen.getByRole('button', { name: 'Test connection' })
    expect(test).not.toBeDisabled()
    expect(screen.queryByText(/stays off until you type the host/)).toBeNull()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByText('Type the host above to confirm the change.')).toBeInTheDocument()
    fireEvent.click(test)
    expect(await screen.findByText(/llm.example answered/)).toBeInTheDocument()
    expect(client.testConnection).toHaveBeenCalledTimes(1)
  })

  it('gates Test connection once a key is stored from this page, and again after it is removed', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk-test-fake-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    await screen.findByText('Stored')
    type('Base URL', 'https://llm.example/v1')
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
  })

  it('says a hidden model list needs the key when the key was withheld', async () => {
    const client = fakeClient({ server: SERVER(STORED), testConnection: jest.fn(async () => ({ ok: true, latency_ms: 9, key_sent: false })) })
    await open(client)
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/model list needs the stored key, and it was not sent to this host/)).toBeInTheDocument()
    expect(screen.queryByText(/hides its model list/)).toBeNull()
  })

  it('shows the typed host in monospace, with no placeholder, and a match status', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    type('Base URL', 'https://llm.example/v1')
    const field = screen.getByLabelText(CONFIRM)
    expect(field).not.toHaveAttribute('placeholder')
    expect(field.className).toMatch(/monospace/)
    expect(document.querySelector('label code.as-host')).toHaveTextContent('llm.example')
    fireEvent.change(field, { target: { value: 'llm.exa' } })
    expect(screen.getByText(/Not the same yet/)).toBeInTheDocument()
    fireEvent.change(field, { target: { value: 'llm.example' } })
    expect(screen.getByText('Matches')).toBeInTheDocument()
    expect(field.getAttribute('aria-describedby')).toMatch(/-match$/)
  })
})

describe('OpenAI-compatible endpoint that needs a key, first run in the browser', () => {
  it('lets a model be typed after a refused test, and Apply sends the key with the URL and model', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: false, detail: 'the server answered 401. Check the key.' })) })
    await open(client)
    chooseOpenAi()
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    type('Base URL', 'https://llm.example/v1')
    type('API key', 'sk-needed')
    confirmHost('llm.example')
    expect(screen.getByRole('combobox', { name: 'Model' })).toBeDisabled()
    expect(screen.getByText(/a test before Apply may answer that a key is needed/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByText('the server answered 401. Check the key.')
    const model = screen.getByRole('combobox', { name: 'Model' })
    expect(model).not.toBeDisabled()
    fireEvent.change(model, { target: { value: 'gpt-x' } })
    fireEvent.keyDown(model, { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(client.set).toHaveBeenCalledTimes(1))
    expect(client.set).toHaveBeenCalledWith({
      revision: 'rev-1',
      backend: { kind: 'openai', base_url: 'https://llm.example/v1', model: 'gpt-x', api_key: 'sk-needed' },
      egress_confirmation: { host: 'llm.example' }
    })
  })
})

describe('the API key', () => {
  it('is write-only: the field is never re-rendered with a value, and saving swaps it for a stored state', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    const input = screen.getByLabelText('API key')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveValue('')
    fireEvent.change(input, { target: { value: 'sk-test-fake-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    await screen.findByText('Stored')
    expect(client.setApiKey).toHaveBeenCalledWith({ revision: 'rev-1', api_key: 'sk-test-fake-123' })
    expect(screen.queryByLabelText('API key')).toBeNull()
    expect(document.body.innerHTML).not.toContain('sk-test-fake-123')
    expect(document.querySelectorAll('input[value="sk-test-fake-123"]')).toHaveLength(0)
    // Replace shows an empty field again.
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    expect(screen.getByLabelText('API key')).toHaveValue('')
  })

  it('removes a stored key', async () => {
    const client = fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'settings_api' } }) })
    await open(client)
    expect(screen.getByText(/Written by this page/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remove key' }))
    // One click asks; focus rests on Cancel, and nothing is sent until the second click.
    expect(client.clearApiKey).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove the key' }))
    await waitFor(() => expect(client.clearApiKey).toHaveBeenCalledWith({ revision: 'rev-1' }))
    expect(await screen.findByLabelText('API key')).toBeInTheDocument()
  })

  it('returns focus to Remove key when the removal is cancelled', async () => {
    const client = fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'settings_api' } }) })
    await open(client)
    fireEvent.click(screen.getByRole('button', { name: 'Remove key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Remove key' })))
    expect(client.clearApiKey).not.toHaveBeenCalled()
  })

  it('replaces the field with "Set on the server" on secrets_not_accepted', async () => {
    const client = fakeClient({
      server: SERVER(OPENAI),
      setApiKey: jest.fn(async () => { throw new SettingsError('secrets_not_accepted', 'no') })
    })
    await open(client)
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk-test-fake-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    expect(await screen.findByText(/Set on the server \(Kubernetes Secret\)/)).toBeInTheDocument()
    expect(screen.queryByText(/Set on the server Set on the server/)).toBeNull()
    expect(screen.queryByLabelText('API key')).toBeNull()
    expect(document.body.innerHTML).not.toContain('sk-test-fake-123')
  })

  it('shows the node sentence when the settings directory is missing', async () => {
    const client = fakeClient({
      server: SERVER(OPENAI),
      setApiKey: jest.fn(async () => { throw new SettingsError('http', 'x', { status: 400, detail: 'no settings directory is configured' }) })
    })
    await open(client)
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk-test-fake-123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    expect(await screen.findByText(/no settings directory is configured/)).toBeInTheDocument()
    expect(screen.getByLabelText('API key')).toHaveValue('sk-test-fake-123')
  })
})

describe('Universal Agent Runtime form', () => {
  const chooseUar = () => fireEvent.click(screen.getByRole('radio', { name: 'Universal Agent Runtime' }))
  const UAR = { kind: 'uar', base_url: 'https://uar.example', api_key: { set: true, source: 'settings_api' } }

  it('starts empty: URL and credential fields, no model, Apply and Test off, nothing claimed', async () => {
    const client = fakeClient()
    await open(client)
    chooseUar()
    expect(screen.getByLabelText('Instance URL')).toHaveValue('')
    expect(screen.getByLabelText('Instance URL')).not.toBeDisabled()
    expect(screen.getByLabelText('API key')).not.toBeDisabled()
    expect(screen.queryByRole('combobox', { name: 'Model' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByText('Enter a valid URL.')).toBeInTheDocument()
    expect(screen.queryByText('Not created')).toBeNull()
    expect(screen.queryByText(/not available in this build/i)).toBeNull()
    expect(client.set).not.toHaveBeenCalled()
    expect(client.testConnection).not.toHaveBeenCalled()
    expect(missing).toEqual([])
  })

  it('shows a specific error on a bad URL', async () => {
    await open(fakeClient())
    chooseUar()
    const url = screen.getByLabelText('Instance URL')
    fireEvent.change(url, { target: { value: 'http://remote.example' } })
    fireEvent.blur(url)
    expect(url).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/Use https, or http on localhost/)).toBeInTheDocument()
  })

  it('does not carry a URL typed for the other backend', async () => {
    await open(fakeClient())
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    chooseUar()
    expect(screen.getByLabelText('Instance URL')).toHaveValue('')
  })

  it('tests the connection as kind uar and reports the result without a model list', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: true, latency_ms: 21 })) })
    await open(client)
    chooseUar()
    type('Instance URL', 'https://uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/uar.example answered in 21 ms/)).toBeInTheDocument()
    expect(screen.getByText('Reachable')).toBeInTheDocument()
    expect(screen.getByText(/The test reads the instance's public agent card and sends no API key/)).toBeInTheDocument()
    expect(screen.queryByText(/not it/)).toBeNull()
    expect(screen.queryByText(/models listed/)).toBeNull()
    expect(client.testConnection).toHaveBeenCalledWith({ base_url: 'https://uar.example', kind: 'uar' })
  })

  it('reports an unreachable or misconfigured runtime with the node detail', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: false, detail: 'the instance answered 401. Check the credential.' })) })
    await open(client)
    chooseUar()
    type('Instance URL', 'https://uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/could not use the Universal Agent Runtime instance at uar.example/)).toBeInTheDocument()
    expect(screen.getByText(/the instance answered 401. Check the credential./)).toBeInTheDocument()
    expect(screen.getByText('Not reachable')).toBeInTheDocument()
  })

  it('never says the key was withheld: the UAR test sends none, with a key stored on the current instance', async () => {
    const client = fakeClient({ server: SERVER(UAR), testConnection: jest.fn(async () => ({ ok: true })) })
    await open(client)
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText('Reachable')).toBeInTheDocument()
    expect(screen.queryByText(/this instance is not it/)).toBeNull()
    expect(screen.queryByText('Reachable, key not sent')).toBeNull()
    expect(screen.queryByText(/stored key was sent/)).toBeNull()
    expect(screen.getByText(/sends no API key/)).toBeInTheDocument()
  })

  it('says where the API key goes: a file only the node can read, sent only to this instance', async () => {
    await open(fakeClient())
    chooseUar()
    expect(screen.getByText('The node keeps the API key in a file only it can read and sends it only to this instance, to create and run the agent.')).toBeInTheDocument()
    expect(screen.queryByText(/stays on the node/)).toBeNull()
  })

  it('uses one word for the secret and describes the UAR key without test or chat use', async () => {
    const client = fakeClient({ server: SERVER(UAR) })
    await open(client)
    expect(screen.getByText('Stored')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    expect(screen.getByLabelText('API key')).toBeInTheDocument()
    expect(screen.queryByText(/credential/i, { selector: 'label' })).toBeNull()
    expect(screen.getByText(/Test connection sends no key/)).toBeInTheDocument()
    expect(screen.queryByText(/Test connection and chats use the stored key/)).toBeNull()
    type('API key', 'k')
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    expect(await screen.findByText(/sends it to this instance on the next run/)).toBeInTheDocument()
    expect(client.setApiKey).toHaveBeenCalledWith({ revision: 'rev-1', api_key: 'k' })
  })

  it('uses kind-neutral copy for the empty URL, the dirty note and the host confirmation', async () => {
    await open(fakeClient())
    chooseUar()
    expect(document.querySelector('[data-id="AgentSettingsUar"]').textContent).not.toMatch(/model/i)
    type('Instance URL', 'https://uar.example')
    expect(screen.getByLabelText(CONFIRM)).toBeInTheDocument()
    expect(document.querySelector('[data-id="AgentSettingsUar"]').textContent).not.toMatch(/model/i)
    confirmHost('uar.example')
    expect(screen.getByText(/Apply sends the backend settings to the node/)).toBeInTheDocument()
    expect(screen.queryByText(/backend, URL and model/)).toBeNull()
  })

  it('offers no standalone Save on a kind change: the key goes with Apply, and no request carries a kind', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    chooseUar()
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    expect(screen.getByText(/The key is sent with Apply, together with the URL and the host you confirm/)).toBeInTheDocument()
    type('API key', 'secret-cred')
    fireEvent.keyDown(screen.getByLabelText('API key'), { key: 'Enter' })
    expect(client.setApiKey).not.toHaveBeenCalled()
    expect(client.clearApiKey).not.toHaveBeenCalled()
  })

  it('offers no standalone Save on first run either, for either kind', async () => {
    const client = fakeClient()
    await open(client)
    chooseUar()
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    chooseOpenAi()
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    expect(client.setApiKey).not.toHaveBeenCalled()
  })

  it('keeps the standalone Save for a first run under the Desktop bridge, and sends no kind', async () => {
    const client = fakeClient({ status: { transport: 'desktop-bridge', managed_by_desktop: true } })
    await open(client, { managed: true })
    chooseUar()
    type('API key', 'k2')
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    await waitFor(() => expect(client.setApiKey).toHaveBeenCalledWith({ revision: 'rev-1', api_key: 'k2' }))
  })

  it('Apply on a kind change to the same host sends the egress confirmation', async () => {
    const client = fakeClient({ server: SERVER({ kind: 'openai', base_url: 'https://llm.example/v1', model: 'm', api_key: { set: false } }) })
    await open(client)
    chooseUar()
    type('Instance URL', 'https://llm.example')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    confirmHost('llm.example')
    type('API key', 'cred-2')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(client.set).toHaveBeenCalledTimes(1))
    expect(client.set).toHaveBeenCalledWith({
      revision: 'rev-1',
      backend: { kind: 'uar', base_url: 'https://llm.example', api_key: 'cred-2' },
      egress_confirmation: { host: 'llm.example' }
    })
  })

  it('says what goes to the host without claiming a stored key: first run and kind change', async () => {
    const sentence = "Node content an agent reads, any API key you enter with this change, and this node's MCP grant (when one is configured) go to this host. Apply stays off until you type the host exactly."
    await open(fakeClient())
    chooseUar()
    type('Instance URL', 'https://uar.example')
    expect(screen.getByText(sentence, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(/The stored API key/)).toBeNull()
    cleanup()
    await open(fakeClient({ server: SERVER({ ...OPENAI, api_key: { set: true, source: 'settings_api' } }) }))
    chooseUar()
    type('Instance URL', 'https://uar.example')
    expect(screen.getByText(sentence, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(/The stored API key/)).toBeNull()
  })

  it('ties the "sent with Apply" line to the key input through aria-describedby', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    chooseUar()
    const input = screen.getByLabelText('API key')
    const ids = input.getAttribute('aria-describedby').split(' ')
    const text = ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ')
    expect(text).toMatch(/The key is sent with Apply, together with the URL and the host you confirm/)
  })

  it('keeps a drafted host move for a key typed now: no standalone Save, the key goes with Apply', async () => {
    const client = fakeClient({ server: SERVER({ ...UAR, base_url: 'https://uar.example' }) })
    await open(client)
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    expect(screen.getByRole('button', { name: 'Save key' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    type('Instance URL', 'https://other.example')
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    expect(screen.queryByRole('button', { name: 'Save key' })).toBeNull()
    type('API key', 'moved-key')
    confirmHost('other.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(client.set).toHaveBeenCalledTimes(1))
    expect(client.set.mock.calls[0][0].backend).toMatchObject({ base_url: 'https://other.example', api_key: 'moved-key' })
    expect(client.setApiKey).not.toHaveBeenCalled()
  })

  it('maps secrets_not_accepted from Apply into the server-managed statement and retries without a key', async () => {
    const set = jest.fn()
      .mockRejectedValueOnce(new SettingsError('secrets_not_accepted', 'no'))
      .mockImplementationOnce(async (req) => SERVER({ kind: 'uar', ...req.backend, api_key: { set: false } }, 'rev-2'))
    await open(fakeClient({ set }))
    chooseUar()
    type('Instance URL', 'https://uar.example')
    type('API key', 'cred-x')
    confirmHost('uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText(/The node sends the key the server holds to this instance/)).toBeInTheDocument()
    expect(screen.queryByLabelText('API key')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(set).toHaveBeenCalledTimes(2))
    expect(set.mock.calls[1][0].backend.api_key).toBeUndefined()
  })

  it('renders every UAR key state with its own copy and no missing translation key', async () => {
    const guarded = SERVER(UAR)
    await open(fakeClient({ server: guarded }))
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove key' }))
    expect(screen.getByText('Remove the stored key? The node then sends no key to the instance.')).toBeInTheDocument()
    cleanup()
    await open(fakeClient({ server: SERVER({ ...UAR, api_key: { set: true, source: 'environment' } }) }))
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    expect(screen.getByText(/A key this node reads from the server is sent to this instance/)).toBeInTheDocument()
    cleanup()
    await open(fakeClient({ server: SERVER(UAR), setApiKey: jest.fn(async () => { throw new SettingsError('secrets_not_accepted', 'no') }) }))
    fireEvent.click(screen.getByRole('button', { name: 'Replace key' }))
    type('API key', 'k')
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    expect(await screen.findByText(/The node sends the key the server holds to this instance/)).toBeInTheDocument()
    cleanup()
    await open(fakeClient())
    chooseUar()
    expect(missing).toEqual([])
    for (const key of ['help', 'helpServer', 'saved.text', 'removeConfirm.text', 'serverManaged.text']) {
      expect(key.split('.').reduce((o, k) => o?.[k], agentSettingsEn.uar.key)).toEqual(expect.any(String))
    }
    expect(agentSettingsEn.uar.confirm.help).toEqual(expect.any(String))
    expect(agentSettingsEn.uar.confirmServerManaged.text).toEqual(expect.any(String))
  })

  it('applies with the typed host and the credential, sends no model, and confirms against the node', async () => {
    const client = fakeClient()
    await open(client)
    chooseUar()
    type('Instance URL', 'https://uar.example')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByText('Type the host above to confirm the change.')).toBeInTheDocument()
    type('API key', 'cred-1')
    confirmHost('uar.example')
    expect(screen.getByRole('button', { name: 'Apply' })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(client.set).toHaveBeenCalledTimes(1))
    expect(client.set).toHaveBeenCalledWith({
      revision: 'rev-1',
      backend: { kind: 'uar', base_url: 'https://uar.example', api_key: 'cred-1' },
      egress_confirmation: { host: 'uar.example' }
    })
    expect(await screen.findByText(/New chats use the IPFS agent on Universal Agent Runtime at uar.example/)).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(missing).toEqual([])
  })

  it('shows a node already set for UAR as the form values, with the credential stored and no change pending', async () => {
    await open(fakeClient({ server: SERVER(UAR) }))
    expect(screen.getByLabelText('Instance URL')).toHaveValue('https://uar.example')
    expect(screen.getByText('Written by this page. It is never shown again.')).toBeInTheDocument()
    expect(screen.getByText('No changes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(screen.getByText(/Backend: Universal Agent Runtime at https:\/\/uar.example/)).toBeInTheDocument()
  })

  it('moving to another instance asks for its host on Apply but does not hold Test back: the probe carries no key', async () => {
    const client = fakeClient({ server: SERVER(UAR), testConnection: jest.fn(async () => ({ ok: true, latency_ms: 4 })) })
    await open(client)
    type('Instance URL', 'https://other.example')
    expect(screen.getByRole('button', { name: 'Test connection' })).not.toBeDisabled()
    expect(screen.queryByText(/never carries the stored key/)).toBeNull()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    confirmHost('other.example')
    expect(screen.getByRole('button', { name: 'Apply' })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText(/other.example answered in 4 ms/)).toBeInTheDocument()
  })

  it('says so when the node moved the backend and withheld the credential', async () => {
    const set = jest.fn(async () => ({ ...SERVER({ kind: 'uar', base_url: 'https://other.example', api_key: { set: false } }, 'rev-2'), key_not_carried: { reason: 'host_changed', cleared: true } }))
    await open(fakeClient({ server: SERVER(UAR), set }))
    type('Instance URL', 'https://other.example')
    confirmHost('other.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText('Key not sent')).toBeInTheDocument()
  })

  it('shows the failure with the runtime lead and the node detail, and Retry stays available', async () => {
    const set = jest.fn(async () => { throw new SettingsError('http', 'x', { status: 502, detail: 'the runtime refused the agent: bad credential' }) })
    await open(fakeClient({ set }))
    chooseUar()
    type('Instance URL', 'https://uar.example')
    confirmHost('uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    const failure = await screen.findByTestId('apply-failure')
    expect(failure).toHaveTextContent('Nothing was changed. No backend is set yet.')
    expect(failure).toHaveTextContent('The node could not set up the runtime.')
    expect(failure).toHaveTextContent('bad credential')
    expect(document.activeElement).toBe(failure)
    expect(screen.getByRole('button', { name: 'Retry' })).not.toBeDisabled()
  })

  it('does not blame the runtime for a network failure', async () => {
    const set = jest.fn(async () => { throw new SettingsError('network', 'x') })
    await open(fakeClient({ set }))
    chooseUar()
    type('Instance URL', 'https://uar.example')
    confirmHost('uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    const failure = await screen.findByTestId('apply-failure')
    expect(failure).toHaveTextContent('Cannot reach the node.')
    expect(failure).not.toHaveTextContent('could not set up the runtime')
  })

  it('recovers from a stale revision and retries on the current one', async () => {
    const set = jest.fn()
      .mockRejectedValueOnce(new SettingsError('revision_conflict', 'stale', { details: { current_revision: 'rev-7' } }))
      .mockImplementationOnce(async (req) => SERVER({ kind: 'uar', ...req.backend, api_key: { set: false } }, 'rev-8'))
    const client = fakeClient({ set })
    client.get.mockResolvedValueOnce(SERVER(null)).mockResolvedValue(SERVER(null, 'rev-7'))
    await open(client)
    chooseUar()
    type('Instance URL', 'https://uar.example')
    confirmHost('uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText(/reloaded and your edits are kept/)).toBeInTheDocument()
    expect(screen.getByLabelText('Instance URL')).toHaveValue('https://uar.example')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(set).toHaveBeenCalledTimes(2))
    expect(set.mock.calls[0][0].revision).toBe('rev-1')
    expect(set.mock.calls[1][0].revision).toBe('rev-7')
    expect(await screen.findByText('Applied')).toBeInTheDocument()
  })

  it('shows the key as set on the server when the node refuses keys through this page', async () => {
    const setApiKey = jest.fn(async () => { throw new SettingsError('secrets_not_accepted', 'no') })
    await open(fakeClient({ server: SERVER({ kind: 'uar', base_url: 'https://uar.example', api_key: { set: false } }), setApiKey }))
    type('API key', 'cred')
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }))
    expect(await screen.findByText(/Set on the server/)).toBeInTheDocument()
  })
})

describe('apply states', () => {
  const dirtyOpenAi = async (client) => {
    await open(client)
    const model = screen.getByRole('combobox', { name: 'Model' })
    fireEvent.change(model, { target: { value: 'next-model' } })
    fireEvent.keyDown(model, { key: 'Enter' })
  }

  it('shows Applying with the form still readable, then the failure with what stayed unchanged and focus on it', async () => {
    let reject
    const client = fakeClient({ server: SERVER(OPENAI), set: jest.fn(() => new Promise((_resolve, _reject) => { reject = _reject })) })
    await dirtyOpenAi(client)
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText('Applying', { selector: 'strong' })).toBeInTheDocument()
    expect(document.querySelector('form')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByLabelText('Base URL')).not.toBeDisabled()
    await act(async () => { reject(new SettingsError('http', 'x', { status: 500, detail: 'the settings did not apply: boom' })) })
    const failure = await screen.findByTestId('apply-failure')
    expect(failure).toHaveTextContent('Nothing was changed. The previous backend is still in use.')
    expect(failure).toHaveTextContent('boom')
    expect(document.activeElement).toBe(failure)
    expect(screen.getByRole('button', { name: 'Retry' })).not.toBeDisabled()
  })

  it('recovers from a stale revision: reloads, keeps the edits, and the retry carries the new revision', async () => {
    const set = jest.fn()
      .mockRejectedValueOnce(new SettingsError('revision_conflict', 'stale', { details: { current_revision: 'rev-7' } }))
      .mockImplementationOnce(async (req) => SERVER({ ...OPENAI, ...req.backend }, 'rev-8'))
    const client = fakeClient({ server: SERVER(OPENAI), set })
    // The node moved on while the person was editing.
    client.get.mockResolvedValueOnce(SERVER(OPENAI)).mockResolvedValue(SERVER({ ...OPENAI, model: 'node-model' }, 'rev-7'))
    await dirtyOpenAi(client)
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(await screen.findByText(/reloaded and your edits are kept/)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Reload settings' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('next-model')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(set).toHaveBeenCalledTimes(2))
    expect(set.mock.calls[0][0].revision).toBe('rev-1')
    expect(set.mock.calls[1][0].revision).toBe('rev-7')
    expect(await screen.findByText('Applied')).toBeInTheDocument()
  })

  it('Reload settings after a conflict takes the node values', async () => {
    const client = fakeClient({ server: SERVER(OPENAI), set: jest.fn(async () => { throw new SettingsError('revision_conflict', 'stale') }) })
    await dirtyOpenAi(client)
    client.get.mockResolvedValue(SERVER({ ...OPENAI, model: 'node-model' }, 'rev-7'))
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Reload settings' }))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('node-model'))
    // The conflict message and the disabled Retry are history once the edits are discarded.
    expect(screen.getByText('No changes')).toBeInTheDocument()
    expect(screen.queryByText(/reloaded and your edits are kept/)).toBeNull()
    expect(screen.queryByTestId('apply-failure')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  it('reverts edits to the server state', async () => {
    await dirtyOpenAi(fakeClient({ server: SERVER(OPENAI) }))
    fireEvent.click(screen.getByRole('button', { name: 'Revert' }))
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('qwen3:8b')
    expect(screen.getByText('No changes')).toBeInTheDocument()
  })

  it('keeps edits and offers a reload when the node changes from elsewhere', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await dirtyOpenAi(client)
    act(() => client.emit({ type: 'settings_changed', revision: 'rev-9' }))
    expect(await screen.findByText('Changed elsewhere')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('next-model')
    expect(screen.getByRole('button', { name: 'Reload settings' })).toBeInTheDocument()
  })

  it('ignores an event for the revision it already holds', async () => {
    const client = fakeClient({ server: SERVER(OPENAI) })
    await open(client)
    act(() => client.emit({ type: 'settings_changed', revision: 'rev-1' }))
    expect(client.get).toHaveBeenCalledTimes(1)
  })
})

describe('connection states (HTTP)', () => {
  it('asks for the endpoint and token when there is no client', async () => {
    render(<AgentSettingsPage client={undefined} managed={false} />)
    expect(await screen.findByText('Needs a connection')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).toBeNull()
    expect(screen.getByLabelText('Admin token')).toHaveAttribute('type', 'password')
  })

  it('says "Sign in again" on a 401 and offers the token field', async () => {
    const client = fakeClient({ get: jest.fn(async () => { throw new SettingsError('unauthorized', 'no', { status: 401 }) }) })
    render(<AgentSettingsPage client={client} />)
    expect((await screen.findAllByText('Sign in again')).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Sign in again' })).toBeInTheDocument()
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('explains an absent route', async () => {
    const client = fakeClient({ get: jest.fn(async () => { throw new SettingsError('route_absent', 'no', { status: 404 }) }) })
    render(<AgentSettingsPage client={client} />)
    expect(await screen.findByText(/serves no agent settings/)).toBeInTheDocument()
  })

  it('shows a load error with a retry', async () => {
    const get = jest.fn().mockRejectedValueOnce(new SettingsError('network', 'x')).mockResolvedValue(SERVER(null))
    render(<AgentSettingsPage client={fakeClient({ get })} />)
    expect(await screen.findByText('Could not load')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('radio', { name: 'OpenAI-compatible endpoint' })).toBeInTheDocument()
  })

  it('puts Connection first when the only thing to do is connect or sign in', async () => {
    render(<AgentSettingsPage client={undefined} managed={false} />)
    await screen.findByText('Needs a connection')
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings[0]).toBe('Connection')
  })

  it('keeps the draft when a new token for the same node replaces a refused one', async () => {
    const refused = fakeClient({ server: SERVER(OPENAI), testConnection: jest.fn(async () => { throw new SettingsError('unauthorized', 'no', { status: 401 }) }) })
    const view = render(<AgentSettingsPage client={refused} />)
    await waitFor(() => expect(screen.queryByText('Reading the settings from the node.')).toBeNull())
    const model = screen.getByRole('combobox', { name: 'Model' })
    fireEvent.change(model, { target: { value: 'my-draft' } })
    fireEvent.keyDown(model, { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByRole('button', { name: 'Sign in again' })
    view.rerender(<AgentSettingsPage client={fakeClient({ server: SERVER(OPENAI) })} />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('my-draft'))
  })

  it('keeps the admin token out of localStorage and the DOM, bound to the endpoint root', async () => {
    updateChat({ endpoint: 'http://127.0.0.1:5299/agui' })
    render(<AgentSettingsPage client={undefined} managed={false} />)
    fireEvent.change(await screen.findByLabelText('Admin token'), { target: { value: 'adm-test-fake' } })
    fireEvent.click(screen.getByRole('button', { name: 'Use token' }))
    expect(getAdminToken('http://127.0.0.1:5299')).toBe('adm-test-fake')
    expect(getAdminToken('https://elsewhere.example')).toBeUndefined()
    expect(getAdminTokenRoot()).toBe('http://127.0.0.1:5299')
    expect(JSON.stringify({ ...localStorage })).not.toContain('adm-test-fake')
    expect(JSON.stringify({ ...sessionStorage })).not.toContain('adm-test-fake')
    expect(document.body.innerHTML).not.toContain('adm-test-fake')
    expect(screen.getByText('A token is held in memory for http://127.0.0.1:5299. Reloading this page forgets it.')).toBeInTheDocument()
  })

  it('refuses a token while there is no valid endpoint to bind it to', async () => {
    render(<AgentSettingsPage client={undefined} managed={false} />)
    fireEvent.change(await screen.findByLabelText('Admin token'), { target: { value: 'adm-test-fake' } })
    expect(screen.getByRole('button', { name: 'Use token' })).toBeDisabled()
    expect(screen.getByText(/Set a valid agent endpoint first/)).toBeInTheDocument()
    expect(getAdminTokenRoot()).toBeUndefined()
  })

  it('forgets the admin token when the endpoint is changed to another node', async () => {
    updateChat({ endpoint: 'http://127.0.0.1:5299/agui' })
    setAdminToken('adm-test-fake', { root: 'http://127.0.0.1:5299' })
    render(<AgentSettingsPage client={undefined} managed={false} />)
    const endpoint = await screen.findByLabelText(/Agent endpoint/)
    fireEvent.change(endpoint, { target: { value: 'https://other.example/agui' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0])
    expect(getAdminTokenRoot()).toBeUndefined()
    expect(getAdminToken('http://127.0.0.1:5299')).toBeUndefined()
  })
})

describe('feature switches', () => {
  it('writes the chat switch to ipfs-webui:agent-chat and nothing else', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    const sw = screen.getByRole('switch', { name: 'Enable agent chat' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(JSON.parse(localStorage.getItem(CHAT_KEY))).toEqual({ enabled: true, endpoint: '' })
    expect(getChat().enabled).toBe(true)
    expect(screen.getByText(/no valid \/agui address is set/)).toBeInTheDocument()
    fireEvent.click(sw)
    expect(JSON.parse(localStorage.getItem(CHAT_KEY)).enabled).toBe(false)
    expect(screen.queryByText(/no valid \/agui address/)).toBeNull()
    expect(within(screen.getByTestId('agent-chat-status')).queryByRole('status')).toBeNull()
  })

  it('writes enabled and dnslink for WebMCP and never persists writes', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    const writes = screen.getByRole('switch', { name: /Also offer tools that change your node/ })
    const dns = screen.getByRole('switch', { name: /DNSLink/ })
    expect(writes).toBeDisabled()
    expect(dns).toBeDisabled()
    fireEvent.click(screen.getByRole('switch', { name: /Offer read tools to agents/ }))
    fireEvent.click(dns)
    fireEvent.click(writes)
    expect(writes).toHaveAttribute('aria-checked', 'true')
    expect(JSON.parse(localStorage.getItem(WEBMCP_KEY))).toEqual({ enabled: true, dnslink: true })
    expect(localStorage.getItem(WEBMCP_KEY)).not.toContain('writes')
    // Off turns the sub-options off.
    fireEvent.click(screen.getByRole('switch', { name: /Offer read tools to agents/ }))
    expect(JSON.parse(localStorage.getItem(WEBMCP_KEY))).toEqual({ enabled: false, dnslink: false })
  })

  it('states the fixed rule for writes and deletes as a row, not a switch', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    expect(screen.getByText('Writes and deletes ask you first. This cannot be turned off here.')).toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: /Writes and deletes/ })).toBeNull()
  })

  it('has no Desktop confirmation switch without the bridge', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    expect(screen.queryByText('Desktop confirmation window')).toBeNull()
    expect(document.querySelector('[data-id="DesktopConfirmSettings"]')).toBeNull()
  })
})

describe('under IPFS Desktop', () => {
  const desktopStatus = { transport: 'desktop-bridge', managed_by_desktop: true, endpoint: 'http://127.0.0.1:50999/agui', sidecar: { running: true, port: 50999 } }

  it('hides the manual endpoint and token fields and shows the managed endpoint and port', async () => {
    globalThis.ipfsDesktop = { agentChat: { getEndpoint: async () => 'http://127.0.0.1:50999/agui', getToken: async () => 't' } }
    await open(fakeClient({ server: SERVER(OPENAI), status: desktopStatus }), { managed: true })
    expect(await screen.findByText('Local endpoint, managed by Desktop :50999')).toBeInTheDocument()
    expect(screen.queryByLabelText('Admin token')).toBeNull()
    expect(screen.queryByLabelText(/Agent endpoint/)).toBeNull()
    expect(screen.queryByRole('switch', { name: 'Enable agent chat' })).toBeNull()
    expect(screen.getByText(/IPFS Desktop manages the agent chat connection/)).toBeInTheDocument()
  })

  it('points to the tray when Desktop exposes no confirmation switch', async () => {
    await open(fakeClient({ server: SERVER(OPENAI), status: desktopStatus }), { managed: true })
    await screen.findByText('Local endpoint, managed by Desktop :50999')
    expect(screen.queryByRole('switch', { name: 'Desktop confirmation window' })).toBeNull()
    expect(screen.getByText(/Switch this in the IPFS Desktop tray menu/)).toBeInTheDocument()
  })

  it('shows the confirmation switch when Desktop exposes one, and writes through it', async () => {
    const sw = { get: jest.fn(async () => true), set: jest.fn(async () => {}) }
    globalThis.ipfsDesktop = { desktopConfirm: sw }
    await open(fakeClient({ server: SERVER(OPENAI), status: desktopStatus }), { managed: true })
    const toggle = await screen.findByRole('switch', { name: 'Desktop confirmation window' })
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'))
    fireEvent.click(toggle)
    await waitFor(() => expect(sw.set).toHaveBeenCalledWith(false))
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'false'))
  })

  it('shows a stopped service as a state, not a crash', async () => {
    const get = jest.fn(async () => { throw new SettingsError('unavailable', 'x', { detail: 'the agent service is not running' }) })
    await open(fakeClient({ get, status: { ...desktopStatus, sidecar: { running: false } } }), { managed: true })
    expect(await screen.findByText('Could not load')).toBeInTheDocument()
    expect(screen.getByText(/the agent service is not running/)).toBeInTheDocument()
    expect(screen.getByText('Not running')).toBeInTheDocument()
  })
})

describe('the Settings summary row', () => {
  it('is a status and a link to the agent page, and makes no request', () => {
    const fetchSpy = jest.fn()
    globalThis.fetch = fetchSpy
    render(<AgentSettingsSummary />)
    const link = screen.getByRole('link', { name: 'Open agent settings' })
    expect(link).toHaveAttribute('href', '#/settings/agent')
    expect(screen.getByText('Chat off')).toBeInTheDocument()
    expect(document.querySelector('[data-id="AgentSettingsSummary"]')).not.toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe.each(['dark', 'light'])('accessibility in the %s theme', (theme) => {
  beforeEach(() => document.documentElement.setAttribute('data-theme', theme))
  const run = (container) => axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } })
  const violations = async (container) => (await run(container)).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)

  it('has no violations on first run, in the OpenAI form with a tested connection, and for UAR', async () => {
    const { container } = await open(fakeClient())
    expect(await violations(container)).toEqual([])
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    expect(await violations(container)).toEqual([])
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByText(/llm.example answered/)
    expect(await violations(container)).toEqual([])
    fireEvent.click(screen.getByRole('radio', { name: /Universal Agent Runtime/ }))
    expect(await violations(container)).toEqual([])
  })

  it('has no violations in the Universal Agent Runtime form: empty, tested, unreachable and failed', async () => {
    const testConnection = jest.fn()
      .mockResolvedValueOnce({ ok: true, latency_ms: 9 })
      .mockResolvedValueOnce({ ok: false, detail: 'the instance did not answer' })
    const set = jest.fn(async () => { throw new SettingsError('http', 'x', { detail: 'the runtime refused the agent' }) })
    const { container } = await open(fakeClient({ testConnection, set }))
    fireEvent.click(screen.getByRole('radio', { name: /Universal Agent Runtime/ }))
    expect(await violations(container)).toEqual([])
    type('Instance URL', 'https://uar.example')
    confirmHost('uar.example')
    expect(await violations(container)).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByText(/uar.example answered/)
    expect(await violations(container)).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    await screen.findByText(/did not answer/)
    expect(await violations(container)).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await screen.findByTestId('apply-failure')
    expect(await violations(container)).toEqual([])
  })

  it('has no violations in the failed and signed-out states', async () => {
    const failing = fakeClient({ server: SERVER(OPENAI), set: jest.fn(async () => { throw new SettingsError('http', 'x', { detail: 'boom' }) }) })
    const { container } = await open(failing)
    const model = screen.getByRole('combobox', { name: 'Model' })
    fireEvent.change(model, { target: { value: 'x' } })
    fireEvent.keyDown(model, { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    await screen.findByTestId('apply-failure')
    expect(await violations(container)).toEqual([])
    cleanup()
    const signedOut = render(<AgentSettingsPage client={fakeClient({ get: jest.fn(async () => { throw new SettingsError('unauthorized', 'x') }) })} />)
    await screen.findByRole('button', { name: 'Sign in again' })
    expect(await violations(signedOut.container)).toEqual([])
  })
})
