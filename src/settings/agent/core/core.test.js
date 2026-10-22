import { vi } from 'vitest'
// The transport-free parts of the Agent settings page: URL rules, the form
// reducer, the admin token store, the HTTP client against a fake fetch, and
// the Desktop bridge wrapper.

import { validateBackendUrl, hostOf, settingsRootFromEndpoint } from './url.js'
import { reducer, INITIAL_STATE, draftFromServer, buildSetRequest, confirmation, applyBlockers, isDirty, keyStored } from './form.js'
import { readShape } from './read-shape.js'
import { ADMIN_TOKEN_SESSION_KEY, getAdminToken, getAdminTokenRoot, setAdminToken, setAdminTokenRemembered, forgetAdminToken, forgetAdminTokenUnless, resetAdminTokenForTests } from './admin-token.js'
import { createHttpSettingsClient } from './http-client.js'
import { createDesktopSettingsClient, getDesktopConfirmSwitch } from './desktop-client.js'
import { SettingsError, toSettingsError } from './errors.js'

const SERVER = (backend = null, revision = 'rev-1') => ({ revision, backend, system_prompt: { safety_prefix: 'p', custom: '' } })
const OPENAI = { kind: 'openai', base_url: 'https://llm.example/v1', model: 'm1', api_key: { set: true, source: 'settings_api' } }

describe('url rules', () => {
  it.each([
    ['https://llm.example/v1', true],
    ['http://127.0.0.1:4000/v1', true],
    ['http://localhost:4000', true],
    ['http://[::1]:4000/v1', true],
    ['http://llm.example/v1', false],
    ['https://user:pw@llm.example/v1', false],
    ['https://llm.example/v1?key=1', false],
    ['https://llm.example/v1#x', false],
    ['ftp://llm.example', false],
    ['not a url', false],
    ['', false]
  ])('%s -> %s', (input, ok) => {
    expect(validateBackendUrl(input).ok).toBe(ok)
  })

  it('compares hosts the way the server does, with a non-default port', () => {
    expect(hostOf('https://LLM.example/v1')).toBe('llm.example')
    expect(hostOf('http://127.0.0.1:4000/v1')).toBe('127.0.0.1:4000')
    expect(hostOf('nope')).toBe('')
  })

  it('derives the settings root from the chat endpoint, with a path prefix, and refuses anything else', () => {
    expect(settingsRootFromEndpoint('http://127.0.0.1:5050/agui')).toBe('http://127.0.0.1:5050')
    expect(settingsRootFromEndpoint('https://ipfs.example/mcp/agui')).toBe('https://ipfs.example/mcp')
    expect(settingsRootFromEndpoint('http://remote.example/agui')).toBeUndefined()
    expect(settingsRootFromEndpoint('https://ipfs.example/other')).toBeUndefined()
    expect(settingsRootFromEndpoint('')).toBeUndefined()
  })
})

describe('form reducer', () => {
  const loaded = (server) => reducer(INITIAL_STATE, { type: 'loaded', server })

  it('selects no backend on first run', () => {
    const s = loaded(SERVER(null))
    expect(s.phase).toBe('ready')
    expect(s.draft).toEqual({ kind: '', baseUrl: '', model: '' })
    expect(isDirty(s)).toBe(false)
    expect(applyBlockers(s)).toContain('nothing-chosen')
  })

  it('builds a first-run request with the kind, URL and model, and the typed egress host', () => {
    let s = loaded(SERVER(null))
    s = reducer(s, { type: 'kind', kind: 'openai' })
    s = reducer(s, { type: 'base-url', value: 'https://llm.example/v1' })
    s = reducer(s, { type: 'model', value: 'm1' })
    expect(confirmation(s)).toMatchObject({ required: true, host: 'llm.example', matches: false, sendsEgressConfirmation: true })
    expect(applyBlockers(s)).toContain('confirm')
    s = reducer(s, { type: 'confirm-text', value: 'LLM.example' })
    expect(applyBlockers(s)).toEqual([])
    expect(buildSetRequest(s)).toEqual({
      revision: 'rev-1',
      backend: { kind: 'openai', base_url: 'https://llm.example/v1', model: 'm1' },
      egress_confirmation: { host: 'llm.example' }
    })
  })

  it('sends only the model, with no confirmation, when only the model changes', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'model', value: 'm2' })
    expect(confirmation(s).required).toBe(false)
    expect(buildSetRequest(s)).toEqual({ revision: 'rev-1', backend: { model: 'm2' } })
  })

  it('requires the host again when the host changes, and changing the URL clears the typed text', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'base-url', value: 'https://other.example/v1' })
    s = reducer(s, { type: 'confirm-text', value: 'other.example' })
    expect(confirmation(s).matches).toBe(true)
    s = reducer(s, { type: 'base-url', value: 'https://third.example/v1' })
    expect(s.confirmText).toBe('')
    expect(confirmation(s).matches).toBe(false)
  })

  it('builds a uar request with no model, and the typed host as egress confirmation', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'kind', kind: 'uar' })
    // A URL typed for the OpenAI-compatible backend is not carried to the runtime.
    expect(s.draft).toEqual({ kind: 'uar', baseUrl: '', model: '' })
    expect(applyBlockers(s)).toContain('url')
    expect(applyBlockers(s)).not.toContain('model')
    s = reducer(s, { type: 'base-url', value: 'https://uar.example' })
    expect(applyBlockers(s)).toContain('confirm')
    s = reducer(s, { type: 'confirm-text', value: 'uar.example' })
    s = reducer(s, { type: 'key-draft', value: 'cred' })
    expect(applyBlockers(s)).toEqual([])
    expect(buildSetRequest(s)).toEqual({
      revision: 'rev-1',
      backend: { kind: 'uar', base_url: 'https://uar.example', api_key: 'cred' },
      egress_confirmation: { host: 'uar.example' }
    })
  })

  it('ignores the key and URL the node holds for the other kind', () => {
    let s = loaded(SERVER(OPENAI))
    expect(keyStored(s)).toBe(true)
    s = reducer(s, { type: 'kind', kind: 'uar' })
    expect(keyStored(s)).toBe(false)
    s = reducer(s, { type: 'kind', kind: 'openai' })
    expect(s.draft).toEqual(draftFromServer(s.server))
    expect(keyStored(s)).toBe(true)
  })

  it('drops a finished test when the kind changes', () => {
    let s = loaded(SERVER(null))
    s = reducer(s, { type: 'kind', kind: 'openai' })
    s = reducer(s, { type: 'base-url', value: 'https://x.example' })
    s = reducer(s, { type: 'test-finished', url: 'https://x.example', result: { ok: true } })
    s = reducer(s, { type: 'kind', kind: 'uar' })
    expect(s.test.state).toBe('idle')
  })

  it('keeps edits when the server changes under them and flags it', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'model', value: 'mine' })
    s = reducer(s, { type: 'loaded', server: SERVER({ ...OPENAI, model: 'theirs' }, 'rev-9'), keepEdits: true })
    expect(s.draft.model).toBe('mine')
    expect(s.elsewhere).toBe(true)
    expect(draftFromServer(s.server).model).toBe('theirs')
  })

  it('keeps an edit made during an apply as unsaved after the apply lands', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'model', value: 'm2' })
    const submitted = s.draft
    s = reducer(s, { type: 'apply-started' })
    s = reducer(s, { type: 'model', value: 'm3' })
    s = reducer(s, { type: 'apply-succeeded', server: SERVER({ ...OPENAI, model: 'm2' }, 'rev-2'), submitted, at: '2026-10-14T14:02:00.000Z' })
    expect(s.draft.model).toBe('m3')
    expect(isDirty(s)).toBe(true)
    expect(s.apply.state).toBe('applied')
  })
})

describe('412 recovery and the host gate (reducer)', () => {
  const loaded = (server) => reducer(INITIAL_STATE, { type: 'loaded', server })
  it('marks a stale revision as changed elsewhere and keeps the edits through the reload', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'model', value: 'mine' })
    s = reducer(s, { type: 'apply-failed', failure: { kind: 'revision_conflict', message: 'stale' }, at: 't' })
    expect(s.elsewhere).toBe(true)
    s = reducer(s, { type: 'loaded', server: SERVER({ ...OPENAI, model: 'theirs' }, 'rev-9'), keepEdits: true })
    expect(s.server.revision).toBe('rev-9')
    expect(s.draft.model).toBe('mine')
    expect(s.elsewhere).toBe(true)
    expect(buildSetRequest(s).revision).toBe('rev-9')
  })

  it('asks for the host again when the node moved to another host under the edits', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'base-url', value: 'https://new.example/v1' })
    s = reducer(s, { type: 'confirm-text', value: 'new.example' })
    s = reducer(s, { type: 'loaded', server: SERVER({ ...OPENAI, base_url: 'https://moved.example/v1' }, 'rev-9'), keepEdits: true })
    expect(s.confirmText).toBe('')
    s = reducer(s, { type: 'confirm-text', value: 'new.example' })
    s = reducer(s, { type: 'loaded', server: SERVER({ ...OPENAI, base_url: 'https://moved.example/v1', model: 'x' }, 'rev-10'), keepEdits: true })
    expect(s.confirmText).toBe('new.example')
  })

  it('holds Test connection back for any host other than the current backend until it is typed', () => {
    let s = loaded(SERVER(OPENAI))
    expect(confirmation(s).testAllowed).toBe(true)
    s = reducer(s, { type: 'base-url', value: 'https://attacker.example/v1' })
    expect(confirmation(s)).toMatchObject({ gatesTest: true, testAllowed: false })
    s = reducer(s, { type: 'confirm-text', value: 'attacker.example' })
    expect(confirmation(s).testAllowed).toBe(true)
    s = reducer(s, { type: 'base-url', value: OPENAI.base_url })
    expect(confirmation(s)).toMatchObject({ gatesTest: false, testAllowed: true })
  })

  it('does not gate the first test when no key is stored, but Apply still sends the host', () => {
    let s = loaded(SERVER(null))
    s = reducer(s, { type: 'kind', kind: 'openai' })
    s = reducer(s, { type: 'base-url', value: 'https://llm.example/v1' })
    expect(confirmation(s)).toMatchObject({ required: true, gatesTest: false, testAllowed: true, sendsEgressConfirmation: true })
  })

  it('gates the test of a new host only while a key is stored', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'base-url', value: 'https://new.example/v1' })
    expect(confirmation(s)).toMatchObject({ gatesTest: true, testAllowed: false })
    s = reducer(s, { type: 'confirm-text', value: 'new.example' })
    expect(confirmation(s)).toMatchObject({ gatesTest: true, testAllowed: true })
    const cleared = reducer(s, { type: 'key-cleared', revision: 'r2' })
    expect(confirmation(cleared)).toMatchObject({ gatesTest: false, testAllowed: true })
  })

  it('drops a finished apply message when Reload settings discards the edits, and keeps it when edits are kept', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'model', value: 'next-model' })
    s = reducer(s, { type: 'apply-failed', at: 't', failure: { kind: 'revision_conflict', message: 'stale' } })
    expect(s.apply.state).toBe('failed')
    const kept = reducer(s, { type: 'loaded', server: SERVER(OPENAI, 'rev-7'), keepEdits: true })
    expect(kept.apply.state).toBe('failed')
    const discarded = reducer(s, { type: 'loaded', server: SERVER(OPENAI, 'rev-7'), keepEdits: false })
    expect(discarded.apply.state).toBe('idle')
    expect(discarded.elsewhere).toBe(false)
  })

  it('reads key_not_carried from the write response and nothing else unknown', () => {
    const read = readShape({ revision: 'r', backend: null, system_prompt: {}, key_not_carried: { reason: 'host_changed', cleared: true, extra: 1 }, other: 1 })
    expect(read.key_not_carried).toEqual({ reason: 'host_changed', cleared: true })
    expect(read).not.toHaveProperty('other')
    expect(readShape({ revision: 'r', backend: null, system_prompt: {} })).not.toHaveProperty('key_not_carried')
    expect(readShape({ revision: 'r', backend: null, system_prompt: {}, key_not_carried: { reason: 'unknown', cleared: true } })).not.toHaveProperty('key_not_carried')
  })

  it('records the notice on a successful move, drops the staged key, and sends a typed key in the same write', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'key-saved', revision: 'r1', apiKey: { set: true, source: 'settings_api' } })
    s = reducer(s, { type: 'base-url', value: 'https://new.example/v1' })
    s = reducer(s, { type: 'key-draft', value: 'sk-test-fake-2' })
    expect(buildSetRequest(s).backend.api_key).toBe('sk-test-fake-2')
    s = reducer(s, { type: 'key-draft', value: '' })
    expect(buildSetRequest(s).backend).not.toHaveProperty('api_key')
    const server = { ...SERVER({ kind: 'openai', base_url: 'https://new.example/v1', model: 'm1', api_key: { set: false } }, 'r2'), key_not_carried: { reason: 'host_changed', cleared: true } }
    const done = reducer(s, { type: 'apply-succeeded', server, submitted: s.draft, at: 't' })
    expect(done.apply.applied.keyNotCarried).toEqual({ cleared: true })
    expect(done.key.stagedThisSession).toBe(false)
    expect(keyStored(done)).toBe(false)
  })

  it('records whether the stored key was sent', () => {
    let s = loaded(SERVER(OPENAI))
    s = reducer(s, { type: 'test-finished', url: 'u', result: { ok: true, key_sent: true } })
    expect(s.test.keySent).toBe(true)
    s = reducer(s, { type: 'test-finished', url: 'u', result: { ok: true } })
    expect(s.test.keySent).toBe(false)
  })
})

describe('admin token store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetAdminTokenForTests()
  })

  const ROOT_A = 'http://127.0.0.1:5299'
  const ROOT_B = 'https://other.example/api'

  it('holds the token in memory and writes no storage by default', () => {
    setAdminToken('adm-secret', { root: ROOT_A })
    expect(getAdminToken(ROOT_A)).toBe('adm-secret')
    expect(sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY)).toBeNull()
    expect(JSON.stringify({ ...localStorage })).not.toContain('adm-secret')
  })

  it('binds the token to the root it was entered for and refuses every other root', () => {
    setAdminToken('adm-secret', { root: ROOT_A })
    expect(getAdminTokenRoot()).toBe(ROOT_A)
    expect(getAdminToken(ROOT_B)).toBeUndefined()
    expect(getAdminToken(undefined)).toBeUndefined()
    expect(getAdminToken('http://127.0.0.1:5299/other')).toBeUndefined()
  })

  it('holds no token without a root', () => {
    setAdminToken('adm-secret')
    expect(getAdminTokenRoot()).toBeUndefined()
    expect(getAdminToken(ROOT_A)).toBeUndefined()
  })

  it('forgets the token when the endpoint moves to another root, and keeps it for the same root', () => {
    setAdminToken('adm-secret', { root: ROOT_A })
    forgetAdminTokenUnless(ROOT_A)
    expect(getAdminToken(ROOT_A)).toBe('adm-secret')
    forgetAdminTokenUnless(ROOT_B)
    expect(getAdminToken(ROOT_A)).toBeUndefined()
    expect(getAdminTokenRoot()).toBeUndefined()
  })

  it('keeps the token and its root for the tab only when asked, never in localStorage', () => {
    setAdminToken('adm-secret', { root: ROOT_A })
    setAdminTokenRemembered(true)
    expect(JSON.parse(sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY))).toEqual({ token: 'adm-secret', root: ROOT_A })
    resetAdminTokenForTests()
    expect(getAdminToken(ROOT_A)).toBe('adm-secret')
    expect(getAdminToken(ROOT_B)).toBeUndefined()
    setAdminTokenRemembered(false)
    expect(sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY)).toBeNull()
    expect(localStorage.length).toBe(0)
    forgetAdminToken()
    expect(getAdminToken(ROOT_A)).toBeUndefined()
  })

  it('drops the unbound token an earlier version left in session storage', () => {
    sessionStorage.setItem('ipfs-webui:agent-settings:admin-token:v1', 'old-bare-token')
    resetAdminTokenForTests()
    expect(sessionStorage.getItem('ipfs-webui:agent-settings:admin-token:v1')).toBeNull()
    expect(getAdminTokenRoot()).toBeUndefined()
  })
})

describe('HTTP client', () => {
  const ROOT = 'http://127.0.0.1:5299'
  const json = (status, body, headers = {}) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (k) => headers[k.toLowerCase()] ?? null },
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body))
  })
  const make = (handler, token = 'tok') => {
    const fetch = vi.fn(async (url, init) => handler(new URL(url), init))
    return { fetch, client: createHttpSettingsClient({ root: ROOT, getToken: () => token, fetch, now: () => Date.parse('2026-10-14T12:00:00Z') }) }
  }

  it('reads with the admin bearer in a header and nothing in the URL', async () => {
    const { fetch, client } = make(() => json(200, SERVER(OPENAI)))
    const got = await client.get()
    expect(got.revision).toBe('rev-1')
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${ROOT}/agent/settings`)
    expect(init.headers.authorization).toBe('Bearer tok')
    expect(url).not.toContain('tok')
    expect(init.credentials).toBe('omit')
  })

  it('never returns a key field even if the server sent one', async () => {
    const { client } = make(() => json(200, { ...SERVER({ ...OPENAI, api_key: { set: true, source: 'file', value: 'leak' } }), api_key: 'leak' }))
    const got = await client.get()
    expect(JSON.stringify(got)).not.toContain('leak')
  })

  it('writes with If-Match and records the apply for status()', async () => {
    const { fetch, client } = make((u, init) => json(200, SERVER({ ...OPENAI, model: JSON.parse(init.body).backend.model }, 'rev-2')))
    const res = await client.set({ revision: 'rev-1', backend: { model: 'm2' } })
    expect(res.backend.model).toBe('m2')
    const init = fetch.mock.calls[0][1]
    expect(init.method).toBe('PUT')
    expect(init.headers['if-match']).toBe('"rev-1"')
    expect(JSON.parse(init.body)).toEqual({ backend: { model: 'm2' } })
    const status = await client.status()
    expect(status).toMatchObject({ transport: 'http', managed_by_desktop: false, revision: 'rev-2', applied: { ok: true, at: '2026-10-14T12:00:00.000Z' } })
  })

  it('maps the closed error codes and the transport states', async () => {
    const cases = [
      [401, '', 'unauthorized'],
      [404, '', 'route_absent'],
      [412, { error: { code: 'revision_conflict', message: 'stale', details: { current_revision: 'r9' } } }, 'revision_conflict'],
      [409, { error: { code: 'egress_confirmation_required', message: 'x', details: { host: 'h' } } }, 'egress_confirmation_required'],
      [403, { error: { code: 'secrets_not_accepted', message: 'x' } }, 'secrets_not_accepted'],
      [503, { error: { code: 'backend_not_configured', message: 'x' } }, 'backend_not_configured'],
      [400, 'no settings directory is configured', 'http']
    ]
    for (const [status, body, kind] of cases) {
      const { client } = make(() => json(status, body))
      await expect(client.get()).rejects.toMatchObject({ kind, status: status === 400 ? 400 : status })
    }
    const { client } = make(() => json(400, 'no settings directory is configured'))
    await expect(client.get()).rejects.toMatchObject({ detail: 'no settings directory is configured' })
  })

  it('reports no admin token as not_configured without calling the network', async () => {
    const { fetch, client } = make(() => json(200, {}), '')
    await expect(client.get()).rejects.toMatchObject({ kind: 'not_configured' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('tests a connection then lists models through the model-list route', async () => {
    const { fetch, client } = make((u) => (u.pathname.endsWith('/test-connection') ? json(200, { ok: true }) : json(200, { models: [{ id: 'a' }, { id: 'b' }] })))
    const res = await client.testConnection({ base_url: 'https://llm.example/v1', kind: 'openai' })
    expect(res).toMatchObject({ ok: true, models: ['a', 'b'] })
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ base_url: 'https://llm.example/v1', kind: 'openai' })
    expect(new URL(fetch.mock.calls[1][0]).searchParams.get('base_url')).toBe('https://llm.example/v1')
  })

  it('passes key_sent through, reading an absent field as not sent', async () => {
    const a = make((u) => (u.pathname.endsWith('/test-connection') ? json(200, { ok: true, key_sent: true }) : json(200, { models: [] })))
    expect((await a.client.testConnection({ base_url: 'https://llm.example/v1' })).key_sent).toBe(true)
    const b = make((u) => (u.pathname.endsWith('/test-connection') ? json(200, { ok: true }) : json(200, { models: [] })))
    expect((await b.client.testConnection({ base_url: 'https://llm.example/v1' })).key_sent).toBe(false)
  })

  it('returns the detail of a failed probe and skips the model list', async () => {
    const { fetch, client } = make(() => json(200, { ok: false, detail: 'the server answered 401' }))
    const res = await client.testConnection({ base_url: 'https://llm.example/v1' })
    expect(res).toMatchObject({ ok: false, detail: 'the server answered 401' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('leaves the model list absent when the backend hides it', async () => {
    const { client } = make((u) => (u.pathname.endsWith('/test-connection') ? json(200, { ok: true }) : json(200, { ok: false, detail: 'no list' })))
    const res = await client.testConnection({ base_url: 'https://llm.example/v1' })
    expect(res.ok).toBe(true)
    expect(res.models).toBeUndefined()
  })

  it('writes the key through a backend.api_key field and reports presence only', async () => {
    const { fetch, client } = make(() => json(200, SERVER(null, 'rev-3')))
    const res = await client.setApiKey({ revision: 'rev-2', api_key: 'sk-test-fake', kind: 'openai' })
    expect(res).toEqual({ revision: 'rev-3', api_key: { set: true, source: 'settings_api' } })
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ backend: { api_key: 'sk-test-fake', kind: 'openai' } })
    expect(JSON.stringify(res)).not.toContain('sk-test-fake')
    const cleared = await client.clearApiKey({ revision: 'rev-3' })
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ backend: { api_key: null } })
    expect(cleared.api_key).toEqual({ set: false })
  })

  it('delivers change events from the SSE stream and stops on unsubscribe', async () => {
    const enc = new TextEncoder()
    const chunks = [enc.encode(': keepalive\n\n'), enc.encode('data: {"type":"settings_changed","revision":"r5"}\n\n')]
    let cancelled = false
    const body = {
      getReader: () => ({
        read: async () => (chunks.length ? { done: false, value: chunks.shift() } : new Promise(() => {})),
        cancel: async () => { cancelled = true }
      })
    }
    const fetch = vi.fn(async () => ({ ok: true, status: 200, headers: { get: () => null }, body }))
    const client = createHttpSettingsClient({ root: ROOT, getToken: () => 'tok', fetch, sleep: () => new Promise(() => {}) })
    const seen = []
    const off = client.onChange((e) => seen.push(e))
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(seen).toEqual([{ type: 'settings_changed', revision: 'r5' }])
    expect(fetch.mock.calls[0][1].headers.authorization).toBe('Bearer tok')
    off()
    await new Promise((resolve) => setTimeout(resolve, 5))
    expect(cancelled).toBe(true)
  })
})

describe('Desktop bridge client', () => {
  const bridge = (over = {}) => ({
    get: vi.fn(async () => SERVER(OPENAI)),
    set: vi.fn(async () => SERVER(OPENAI, 'rev-2')),
    testConnection: vi.fn(async () => ({ ok: true })),
    setApiKey: vi.fn(async () => ({ revision: 'r', api_key: { set: true, source: 'settings_api' } })),
    clearApiKey: vi.fn(async () => ({ revision: 'r', api_key: { set: false } })),
    status: vi.fn(async () => ({ transport: 'desktop-bridge', managed_by_desktop: true, endpoint: 'http://127.0.0.1:50999/agui', sidecar: { running: true, port: 50999 } })),
    onChange: vi.fn(() => () => {}),
    ...over
  })

  it('is absent without the bridge, or with a partial one', () => {
    expect(createDesktopSettingsClient({})).toBeUndefined()
    expect(createDesktopSettingsClient({ ipfsDesktop: { agentSettings: { get () {} } } })).toBeUndefined()
  })

  it('passes calls through and reads the contract error shape from a rejection', async () => {
    const b = bridge({ set: vi.fn(async () => { throw { error: { code: 'revision_conflict', message: 'stale' } } }) }) // eslint-disable-line no-throw-literal
    const client = createDesktopSettingsClient({ ipfsDesktop: { agentSettings: b } })
    expect((await client.get()).revision).toBe('rev-1')
    await expect(client.set({ revision: 'x', backend: { model: 'm' } })).rejects.toMatchObject({ kind: 'revision_conflict' })
  })

  it('turns a plain Error (Touch ID declined and the like) into an error state with its sentence', async () => {
    const b = bridge({ set: vi.fn(async () => { throw new Error('Touch ID was declined') }) })
    const client = createDesktopSettingsClient({ ipfsDesktop: { agentSettings: b } })
    const err = await client.set({ revision: 'x', backend: { model: 'm' } }).catch((e) => e)
    expect(err).toBeInstanceOf(SettingsError)
    expect(err).toMatchObject({ kind: 'unavailable', detail: 'Touch ID was declined' })
  })

  it('offers the guarded confirmation switch only when Desktop exposes it', async () => {
    expect(getDesktopConfirmSwitch({ ipfsDesktop: { agentSettings: bridge() } })).toBeUndefined()
    const sw = { get: async () => true, set: async () => {} }
    const wrapper = getDesktopConfirmSwitch({ ipfsDesktop: { desktopConfirm: sw } })
    expect(await wrapper.get()).toBe(true)
    await wrapper.set(false)
  })

  it('normalises anything unrecognised without echoing it', () => {
    const e = toSettingsError('sk-test-fake leaked')
    expect(e.kind).toBe('unavailable')
    expect(e.message).not.toContain('sk-test')
  })
})
