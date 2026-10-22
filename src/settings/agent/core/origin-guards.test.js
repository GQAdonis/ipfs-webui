import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDesktopSettingsClient, getDesktopConfirmSwitch } from './desktop-client.js'
import { createHttpSettingsClient } from './http-client.js'
import { getOriginPolicy } from '../../../agent-chat/origin-policy.js'

function deferred () { let resolve; const promise = new Promise(_resolve => { resolve = _resolve }); return { promise, resolve } }
const location = href => { vi.stubGlobal('location', new URL(href)); getOriginPolicy().refresh() }
afterEach(() => { vi.unstubAllGlobals(); getOriginPolicy().refresh() })
describe('admin consumer origin is checked before credentials and actual dispatch', () => {
  it.each(['https://unconfigured.example/', 'https://arbitrary.example/ipfs/bafyfixture/', 'http://localhost:8080/ipns/name/'])('refuses all requests on %s without acquiring an admin credential', async href => {
    location(href)
    const fetch = vi.fn(); const getToken = vi.fn()
    const client = createHttpSettingsClient({ root: 'https://agent.example', getToken, fetch })
    await expect(client.get()).rejects.toMatchObject({ kind: 'unavailable' })
    await expect(client.testConnection({ base_url: 'https://backend.example' })).rejects.toMatchObject({ kind: 'unavailable' })
    await expect(client.set({ revision: 'rev_one', backend: {} })).rejects.toMatchObject({ kind: 'unavailable' })
    expect(fetch).not.toHaveBeenCalled(); expect(getToken).not.toHaveBeenCalled()
  })
  it('does not dispatch after a credential wait on a newly shared path', async () => {
    location('http://localhost:5001/webui/')
    const held = deferred(); const fetch = vi.fn()
    const client = createHttpSettingsClient({ root: 'https://agent.example', getToken: () => held.promise, fetch })
    const pending = client.testConnection({ base_url: 'https://backend.example' })
    location('http://localhost:5001/ipfs/bafyfixture/'); held.resolve('fixture-admin')
    await expect(pending).rejects.toMatchObject({ kind: 'unavailable' })
    expect(fetch).not.toHaveBeenCalled()
  })
  it('aborts the actual in-flight fetch immediately and ignores an uncooperative late result', async () => {
    location('http://localhost:5001/webui/')
    const held = deferred(); const fetch = vi.fn(() => held.promise)
    const client = createHttpSettingsClient({ root: 'https://agent.example', getToken: () => 'fixture-admin', fetch })
    const pending = client.get()
    await Promise.resolve(); await Promise.resolve()
    const signal = fetch.mock.calls[0][1].signal
    location('http://localhost:5001/ipfs/bafyfixture/')
    expect(signal.aborted).toBe(true)
    held.resolve({ ok: true, json: vi.fn() })
    await expect(pending).rejects.toMatchObject({ kind: 'unavailable' })
  })
  it('keeps a dedicated local page subject to the existing credential and fetch rules', async () => {
    location('http://localhost:5001/webui/')
    const fetch = vi.fn(async () => ({ ok: true, json: async () => ({ ok: false }) }))
    const client = createHttpSettingsClient({ root: 'https://agent.example', getToken: () => 'fixture-admin', fetch })
    expect(await client.testConnection({ base_url: 'https://backend.example' })).toMatchObject({ ok: false })
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', credentials: 'omit', redirect: 'error', headers: { authorization: 'Bearer fixture-admin' } })
    expect(fetch.mock.calls[0][0]).toBe('https://agent.example/agent/settings/test-connection')
  })
})

describe('existing Desktop consumer methods retain a live origin boundary', () => {
  const bridge = () => ({ get: vi.fn(async () => ({})), set: vi.fn(async () => ({})), testConnection: vi.fn(async () => ({})), setApiKey: vi.fn(async () => ({})), clearApiKey: vi.fn(async () => ({})), status: vi.fn(async () => ({})), onChange: vi.fn(() => () => {}) })
  it('recognizes the complete existing file-host settings bridge with agent chat off', async () => {
    const native = bridge()
    vi.stubGlobal('ipfsDesktop', { agentSettings: native })
    location('file:///desktop/webui/index.html')
    expect(getOriginPolicy().getSnapshot()).toEqual({ allowed: true, kind: 'desktop' })
    const client = createDesktopSettingsClient()
    expect(await client.get()).toEqual({})
    expect(native.get).toHaveBeenCalledTimes(1)
  })
  it('cannot bootstrap a remote shared origin from any Desktop-like page global', () => {
    const native = bridge()
    vi.stubGlobal('ipfsDesktop', { agentSettings: native })
    location('https://arbitrary.example/ipfs/bafyfixture/')
    expect(createDesktopSettingsClient()).toBeUndefined()
    expect(native.get).not.toHaveBeenCalled()
  })
  it('rechecks retained settings and native-confirm callbacks before invoking any existing host method', async () => {
    location('http://localhost:5001/webui/')
    const native = bridge(); const confirm = { get: vi.fn(async () => true), set: vi.fn(async () => {}) }
    const client = createDesktopSettingsClient({ ipfsDesktop: { agentSettings: native } })
    const sw = getDesktopConfirmSwitch({ ipfsDesktop: { desktopConfirm: confirm } })
    location('http://localhost:5001/ipfs/bafyfixture/')
    await expect(client.set({ revision: 'rev_one', backend: {} })).rejects.toMatchObject({ kind: 'unavailable' })
    await expect(sw.set(false)).rejects.toMatchObject({ kind: 'unavailable' })
    expect(native.set).not.toHaveBeenCalled(); expect(confirm.set).not.toHaveBeenCalled()
  })
  it('removes the actual host change subscription synchronously and rejects an old callback', () => {
    location('http://localhost:5001/webui/')
    let notifyChange
    const off = vi.fn(); const native = bridge(); const notify = vi.fn()
    native.onChange.mockImplementation(fn => { notifyChange = fn; return off })
    const client = createDesktopSettingsClient({ ipfsDesktop: { agentSettings: native } })
    const stop = client.onChange(notify)
    location('http://localhost:5001/ipns/shared/')
    expect(off).toHaveBeenCalledTimes(1)
    notifyChange({ type: 'settings_changed', revision: 'late_revision' })
    expect(notify).not.toHaveBeenCalled()
    location('http://localhost:5001/webui/')
    notifyChange({ type: 'settings_changed', revision: 'obsolete_after_return' })
    expect(notify).not.toHaveBeenCalled()
    stop(); expect(off).toHaveBeenCalledTimes(1)
  })
})

it('never accepts an already-retired pending host result after returning to a permitted page', async () => {
  location('http://localhost:5001/webui/')
  const held = deferred()
  const native = { get: vi.fn(async () => ({})), set: vi.fn(() => held.promise), testConnection: vi.fn(), setApiKey: vi.fn(), clearApiKey: vi.fn(), status: vi.fn(), onChange: vi.fn() }
  const client = createDesktopSettingsClient({ ipfsDesktop: { agentSettings: native } })
  const pending = client.set({ revision: 'rev_one', backend: {} })
  location('http://localhost:5001/ipns/shared/')
  location('http://localhost:5001/webui/')
  held.resolve({ revision: 'old_result' })
  await expect(pending).rejects.toMatchObject({ kind: 'unavailable' })
  expect(native.set).toHaveBeenCalledTimes(1)
})
