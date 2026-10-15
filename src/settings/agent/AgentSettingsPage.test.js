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
  ns: ['agentSettings', 'agentChat', 'webmcp', 'app'],
  defaultNS: 'agentSettings',
  resources: { en: { agentSettings: agentSettingsEn, agentChat: agentChatEn, webmcp: webmcpEn, app: {} } },
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
const CONFIRM = /Type the model host to confirm/
// A host other than the current backend's must be typed back before Test connection or Apply works.
const confirmHost = (host) => fireEvent.change(screen.getByLabelText(CONFIRM), { target: { value: host } })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
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

  it('moves focus to the first backend that can be used, not to the unavailable one', async () => {
    await open(fakeClient())
    expect(document.activeElement).toBe(screen.getAllByRole('radio')[0])
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'OpenAI-compatible endpoint' }))
    expect(screen.getByRole('radio', { name: /Universal Agent Runtime/ })).toHaveAccessibleName('Universal Agent Runtime Not available yet')
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
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
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

  it('reports a failed test with the node detail and leaves the model field off', async () => {
    const client = fakeClient({ testConnection: jest.fn(async () => ({ ok: false, detail: 'the server answered 401. Check the key.' })) })
    await open(client)
    chooseOpenAi()
    type('Base URL', 'https://llm.example/v1')
    confirmHost('llm.example')
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))
    expect(await screen.findByText('the server answered 401. Check the key.')).toBeInTheDocument()
    expect(screen.getByText('Not reachable')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Model' })).toBeDisabled()
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
    expect(screen.getByText(/stays off until you type the host attacker.example/)).toBeInTheDocument()
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
    expect(screen.getByText(/stored key was withheld/)).toBeInTheDocument()
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

  it('states in the key help that the stored key goes only to a confirmed host', async () => {
    await open(fakeClient({ server: SERVER(OPENAI) }))
    expect(screen.getByText(/sends it only to the current backend host or a host you have confirmed/)).toBeInTheDocument()
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
    expect(client.setApiKey).toHaveBeenCalledWith({ revision: 'rev-1', api_key: 'sk-test-fake-123', kind: 'openai' })
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
    await waitFor(() => expect(client.clearApiKey).toHaveBeenCalledWith({ revision: 'rev-1', kind: 'openai' }))
    expect(await screen.findByLabelText('API key')).toBeInTheDocument()
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

describe('Universal Agent Runtime', () => {
  it('states what is missing, disables every control and cannot be applied', async () => {
    const client = fakeClient()
    await open(client)
    fireEvent.click(screen.getByRole('radio', { name: /Universal Agent Runtime/ }))
    expect(screen.getAllByText('Not available').length).toBeGreaterThan(0)
    const missingList = screen.getByRole('list', { name: 'What is missing' })
    expect(within(missingList).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByLabelText('Instance URL')).toBeDisabled()
    expect(screen.getByLabelText('Access credential')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
    expect(screen.getByText('Nothing was created.', { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(/ready|success/i)).toBeNull()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    expect(client.set).not.toHaveBeenCalled()
    expect(client.testConnection).not.toHaveBeenCalled()
  })

  it('says a node already set for UAR cannot be changed here yet', async () => {
    await open(fakeClient({ server: SERVER({ kind: 'uar', base_url: 'https://uar.example' }) }))
    expect(screen.getByText(/already set for Universal Agent Runtime at https:\/\/uar.example/)).toBeInTheDocument()
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
