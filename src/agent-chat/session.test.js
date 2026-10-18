// console-session-auth, group 3 (kubo openspec/changes/console-session-auth/specs/webui-console-session):
// detection (3.1), no stored credentials (3.2), same-origin calls without Authorization (3.3),
// the sign-in-again, step-up and sign-out states (3.4). The session route is a recorded fake fetch;
// no network is used. The disabled state (the route answers 404) is the first describe block.

import React from 'react'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import agentChatEn from '../../public/locales/en/agentChat.json'
import { AgentChatLauncher, SessionBanner, SessionPanel } from './index.js'
import { STORAGE_KEY, TOKEN_STORAGE_KEY, getSettings, getToken, resetForTests as resetChat, setToken } from './settings-store.js'
import { API_ADDRESS_KEY, bootSession, purgeStoredCredentials } from './session-boot.js'
import { apiAddressHasCredential } from './api-address.js'
import { getSession, isSessionMode, markSessionExpired, probeSession, readReport, resetSessionForTests, revalidateSession, signInAgain, signOut } from './session.js'
import { getAdminToken, resetAdminTokenForTests, setAdminToken } from '../settings/agent/core/admin-token.js'
import { createHttpSettingsClient } from '../settings/agent/core/http-client.js'
import { createSearchClient } from '../search/client.js'
import { resolveConnection } from '../search/connection.js'
import { toSettingsError } from '../settings/agent/core/errors.js'

i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['agentChat', 'app'],
  defaultNS: 'agentChat',
  resources: { en: { agentChat: agentChatEn, app: {} } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

const ORIGIN = 'http://localhost'
const SEEDED_TOKEN = 'seeded-chat-token-0123456789'
const SEEDED_PASSWORD = 'seeded-password-xyz'

const REPORT = Object.freeze({
  principals: [{ name: 'console-ui', kind: 'ui' }, { name: 'operator', kind: 'admin' }],
  email: 'ada@example.org',
  exp: 1900000000,
  admin: 'ok'
})

/** A fetch that answers /auth/session with the given status and body, and records every call. */
const fakeFetch = (status, body) => jest.fn(async () => ({ status, json: async () => body }))

const everythingStored = () => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  resetSessionForTests()
  resetChat()
  resetAdminTokenForTests()
})

afterEach(() => {
  cleanup()
  document.querySelectorAll('ipfs-agent-chat').forEach((el) => el.remove())
  delete globalThis.ipfsDesktop
})

describe('3.1 detection: the route answering 404 leaves the token path untouched', () => {
  it('stays out of session mode, makes one same-origin request, and keeps the saved token', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, SEEDED_TOKEN)
    localStorage.setItem(API_ADDRESS_KEY, JSON.stringify('https://user:' + SEEDED_PASSWORD + '@node.example'))
    resetChat()
    const fetchImpl = fakeFetch(404, undefined)

    const entered = await bootSession({ fetch: fetchImpl })

    expect(entered).toBe(false)
    expect(isSessionMode()).toBe(false)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(fetchImpl.mock.calls[0][0]).toBe(`${ORIGIN}/auth/session`)
    expect(fetchImpl.mock.calls[0][1]).toMatchObject({ method: 'GET', credentials: 'same-origin' })
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(SEEDED_TOKEN)
    expect(localStorage.getItem(API_ADDRESS_KEY)).toContain(SEEDED_PASSWORD)
    expect(getToken()).toBe(SEEDED_TOKEN)
    // The existing token behaviour still works.
    setToken('another')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('another')
  })

  it.each([
    ['401', 401, REPORT],
    ['403', 403, REPORT],
    ['500', 500, REPORT],
    ['a redirect, seen as status 0', 0, undefined],
    ['a body that is not a report', 200, { hello: 'world' }],
    ['an unknown principal kind', 200, { ...REPORT, principals: [{ name: 'x', kind: 'root' }] }],
    ['a non-integer exp', 200, { ...REPORT, exp: 'soon' }],
    ['an unknown admin state', 200, { ...REPORT, admin: 'yes' }]
  ])('does not enter session mode on %s', async (_label, status, body) => {
    const entered = await bootSession({ fetch: fakeFetch(status, body) })
    expect(entered).toBe(false)
    expect(isSessionMode()).toBe(false)
  })

  it('does not enter session mode when the request fails or hangs past the timeout', async () => {
    expect(await bootSession({ fetch: jest.fn(async () => { throw new TypeError('network') }) })).toBe(false)
    const hangs = jest.fn((_url, init) => new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new Error('aborted')))))
    expect(await bootSession({ fetch: hangs, timeoutMs: 10 })).toBe(false)
    expect(isSessionMode()).toBe(false)
  })

  it('asks nothing of the origin under IPFS Desktop', async () => {
    globalThis.ipfsDesktop = { agentChat: { getEndpoint: async () => '', getToken: async () => '' } }
    const fetchImpl = fakeFetch(200, REPORT)
    expect(await bootSession({ fetch: fetchImpl })).toBe(false)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('asks nothing of a page that is not served over http(s)', async () => {
    const fetchImpl = fakeFetch(200, REPORT)
    expect(await probeSession({ fetch: fetchImpl, location: { origin: 'null', protocol: 'file:' } })).toBeUndefined()
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('a 200 report switches to session mode and keeps only the displayed fields', async () => {
    const fetchImpl = fakeFetch(200, { ...REPORT, sub: 'must-be-dropped', token: 'must-be-dropped', extra: 1 })
    expect(await bootSession({ fetch: fetchImpl })).toBe(true)
    expect(isSessionMode()).toBe(true)
    const { report, expired } = getSession()
    expect(expired).toBe(false)
    expect(report).toEqual(REPORT)
    expect(JSON.stringify(report)).not.toContain('must-be-dropped')
  })

  it('readReport rejects an empty principal list', () => {
    expect(readReport({ ...REPORT, principals: [] })).toBeUndefined()
  })
})

describe('3.2 session mode deletes and never writes a credential', () => {
  const seed = () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, SEEDED_TOKEN)
    localStorage.setItem(API_ADDRESS_KEY, JSON.stringify({
      url: 'https://console.example/',
      headers: { authorization: 'Basic ' + btoa('user:' + SEEDED_PASSWORD) }
    }))
    setAdminToken('seeded-admin-token-777', { root: ORIGIN, remember: true })
  }

  it('deletes the saved chat token, the credentialed API address and the admin token', async () => {
    seed()
    resetChat()
    expect(getToken()).toBe(SEEDED_TOKEN)

    await bootSession({ fetch: fakeFetch(200, REPORT) })

    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(API_ADDRESS_KEY)).toBeNull()
    expect(getToken()).toBeUndefined()
    expect(getAdminToken(ORIGIN)).toBeUndefined()
    const stored = everythingStored()
    expect(stored).not.toContain(SEEDED_TOKEN)
    expect(stored).not.toContain(SEEDED_PASSWORD)
    expect(stored).not.toContain('seeded-admin-token-777')
    expect(stored).not.toContain(btoa('user:' + SEEDED_PASSWORD))
  })

  it.each([
    ['a URL string with userinfo', JSON.stringify('https://user:pw@console.example'), true],
    ['an options object whose url has userinfo', JSON.stringify({ url: 'https://user:pw@console.example/' }), true],
    ['an options object with an authorization header', JSON.stringify({ url: 'https://console.example/', headers: { Authorization: 'Basic eA==' } }), true],
    ['a bare URL string with userinfo', 'https://user:pw@console.example', true],
    ['a plain URL', JSON.stringify('https://console.example/'), false],
    ['a multiaddr', JSON.stringify('/ip4/127.0.0.1/tcp/5001'), false],
    ['options without credentials', JSON.stringify({ host: 'console.example', port: '443' }), false]
  ])('classifies %s', (_label, raw, expected) => {
    expect(apiAddressHasCredential(raw)).toBe(expected)
  })

  it('keeps an API address that holds no credential', async () => {
    localStorage.setItem(API_ADDRESS_KEY, JSON.stringify('https://console.example/'))
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    expect(localStorage.getItem(API_ADDRESS_KEY)).toBe(JSON.stringify('https://console.example/'))
  })

  it('purgeStoredCredentials survives blocked storage', () => {
    const spy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
    expect(() => purgeStoredCredentials()).not.toThrow()
    spy.mockRestore()
  })

  it('writes no credential afterwards: setToken and setAdminToken are no-ops', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    setToken('late-token-abc')
    setAdminToken('late-admin-abc', { root: ORIGIN, remember: true })
    expect(getToken()).toBeUndefined()
    expect(getAdminToken(ORIGIN)).toBeUndefined()
    expect(everythingStored()).not.toContain('late-')
  })

  it('points the chat at the page origin whatever endpoint was saved', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: true, endpoint: 'https://elsewhere.example/agui' }))
    resetChat()
    expect(getSettings().endpoint).toBe('https://elsewhere.example/agui')
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    expect(getSettings().endpoint).toBe(`${ORIGIN}/agui`)
    expect(getSettings().enabled).toBe(true)
  })

  it('a switched-off chat stays off in session mode', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: false }))
    resetChat()
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    expect(getSettings().enabled).toBe(false)
  })
})

describe('3.3 same-origin calls with no Authorization header', () => {
  const okJson = (body) => ({ ok: true, status: 200, headers: { get: () => null }, json: async () => body })

  it('the settings client sends same-origin credentials and no Authorization, and needs no token', async () => {
    const fetchImpl = jest.fn(async () => okJson({ revision: 'r1', system_prompt: { safety_prefix: 'p', custom: '' } }))
    const client = createHttpSettingsClient({ root: ORIGIN, getToken: () => 'must-not-be-used', session: true, fetch: fetchImpl })
    await client.get()
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe(`${ORIGIN}/agent/settings`)
    expect(init.credentials).toBe('same-origin')
    expect(Object.keys(init.headers).map((h) => h.toLowerCase())).not.toContain('authorization')
  })

  it('the settings client keeps the bearer path outside session mode', async () => {
    const fetchImpl = jest.fn(async () => okJson({ revision: 'r1', system_prompt: { safety_prefix: 'p', custom: '' } }))
    await createHttpSettingsClient({ root: ORIGIN, getToken: () => 'tok', fetch: fetchImpl }).get()
    expect(fetchImpl.mock.calls[0][1].credentials).toBe('omit')
    expect(fetchImpl.mock.calls[0][1].headers.authorization).toBe('Bearer tok')
  })

  it('the search client sends same-origin credentials and no Authorization', async () => {
    const fetchImpl = jest.fn(async () => okJson({ enabled: true, mode: 'embedded' }))
    await createSearchClient({ root: ORIGIN, session: true, fetch: fetchImpl }).status()
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe(`${ORIGIN}/index/status`)
    expect(init.credentials).toBe('same-origin')
    expect(Object.keys(init.headers).map((h) => h.toLowerCase())).not.toContain('authorization')
  })

  it('the search connection is the page origin with no token in session mode', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    const connection = await resolveConnection()
    expect(connection).toMatchObject({ ok: true, root: ORIGIN, session: true })
    expect(await connection.getToken()).toBeUndefined()
  })

  it('the search connection is unchanged outside session mode', async () => {
    const connection = await resolveConnection({ settings: { endpoint: 'http://127.0.0.1:9/agui' }, token: undefined })
    expect(connection).toEqual({ ok: false, reason: 'no-token' })
  })

  it('a 401 from the settings or search client marks the session expired', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    const res401 = jest.fn(async () => ({ ok: false, status: 401, text: async () => '', headers: { get: () => null } }))
    await expect(createHttpSettingsClient({ root: ORIGIN, getToken: () => undefined, session: true, fetch: res401 }).get()).rejects.toMatchObject({ kind: 'unauthorized' })
    expect(getSession().expired).toBe(true)

    await bootSession({ fetch: fakeFetch(200, REPORT) }) // a fresh report clears the flag only through revalidate
    markSessionExpired()
    await expect(createSearchClient({ root: ORIGIN, session: true, fetch: res401 }).status()).rejects.toMatchObject({ kind: 'unauthenticated' })
    expect(getSession().expired).toBe(true)
  })

  it('a plain 403 is "forbidden" in session mode and unchanged ("http") in token mode', async () => {
    const res403 = jest.fn(async () => ({ ok: false, status: 403, text: async () => 'Forbidden', headers: { get: () => null } }))
    await expect(createHttpSettingsClient({ root: ORIGIN, getToken: () => undefined, session: true, fetch: res403 }).get()).rejects.toMatchObject({ kind: 'forbidden' })
    await expect(createHttpSettingsClient({ root: ORIGIN, getToken: () => 'tok', fetch: res403 }).get()).rejects.toMatchObject({ kind: 'http' })
  })

  it('the launcher gives the element session mode, not a token', async () => {
    class StubChat extends HTMLElement {
      static tokens = []
      static sessions = []
      get token () { return undefined }
      set token (v) { StubChat.tokens.push(v) }
      get session () { return false }
      set session (v) { StubChat.sessions.push(v) }
      toggle () {}
    }
    if (!customElements.get('ipfs-agent-chat')) customElements.define('ipfs-agent-chat', StubChat)
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    render(<AgentChatLauncher loadIsland={async () => {}} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Agent chat' })) })
    const el = document.querySelector('ipfs-agent-chat')
    expect(el.getAttribute('endpoint')).toBe(`${ORIGIN}/agui`)
    expect(StubChat.sessions).toContain(true)
    expect(StubChat.tokens).toEqual([])
  })
})

describe('3.4 states: sign in again, step-up, signed in as, sign out', () => {
  it('shows "Signed in as", the sign-out action and the separate know-me.tools note', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    render(<SessionPanel />)
    expect(screen.getAllByRole('status').some((el) => el.textContent === 'Signed in as ada@example.org.')).toBe(true)
    expect(screen.getByText(/does not sign you out of know-me\.tools/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sign in again' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('says so when the token has no email', async () => {
    const { email, ...noEmail } = REPORT
    expect(email).toBeDefined()
    await bootSession({ fetch: fakeFetch(200, noEmail) })
    render(<SessionPanel />)
    expect(screen.getAllByRole('status').some((el) => el.textContent === 'Signed in to this console.')).toBe(true)
  })

  it('sign out is a top-level navigation to /oauth2/logout', () => {
    const assign = jest.fn()
    signOut({ assign })
    expect(assign).toHaveBeenCalledWith('/oauth2/logout')
  })

  it('sign in again is a top-level navigation to the current page (a reload: the app is hash-routed)', () => {
    const reload = jest.fn()
    signInAgain({ reload })
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('the banner renders nothing outside session mode and while the sign-in is good', async () => {
    const { container, unmount } = render(<SessionBanner />)
    expect(container).toBeEmptyDOMElement()
    unmount()
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    const second = render(<SessionBanner />)
    expect(second.container).toBeEmptyDOMElement()
  })

  it('a 401 shows "Sign in again" and does not retry with a stored credential', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    const fetchImpl = jest.fn()
    globalThis.fetch = fetchImpl
    render(<SessionBanner />)
    act(() => { markSessionExpired() })
    expect(screen.getByRole('alert')).toHaveTextContent('Your sign-in has ended')
    expect(screen.getByRole('button', { name: 'Sign in again' })).toBeInTheDocument()
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('the island reports a 401 by event and the banner follows', async () => {
    await bootSession({ fetch: fakeFetch(200, REPORT) })
    render(<SessionBanner />)
    act(() => { document.dispatchEvent(new CustomEvent('ipfs-agent-chat-session-expired')) })
    expect(screen.getByRole('button', { name: 'Sign in again' })).toBeInTheDocument()
  })

  it('a re-check that answers 401 marks the session expired; a fresh report clears a stale step-up', async () => {
    await bootSession({ fetch: fakeFetch(200, { ...REPORT, admin: 'step_up_required' }) })
    expect(getSession().report.admin).toBe('step_up_required')
    await revalidateSession({ fetch: fakeFetch(200, REPORT) })
    expect(getSession().report.admin).toBe('ok')
    await revalidateSession({ fetch: fakeFetch(401, undefined) })
    expect(getSession().expired).toBe(true)
    await revalidateSession({ fetch: fakeFetch(500, undefined) })
    expect(getSession().expired).toBe(true)
  })

  it('revalidate outside session mode asks nothing', async () => {
    const fetchImpl = fakeFetch(200, REPORT)
    await revalidateSession({ fetch: fetchImpl })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('the panel explains step-up and offers the sign-out that starts a fresh login', async () => {
    await bootSession({ fetch: fakeFetch(200, { ...REPORT, admin: 'step_up_required' }) })
    render(<SessionPanel phase='step-up' />)
    expect(screen.getByText(/recent sign-in with a second factor/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sign in again' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Sign out and verify again' })).toBeInTheDocument()
  })

  it('a 403 step_up_required body is a step_up_required settings error', () => {
    const error = toSettingsError({ error: { code: 'step_up_required', message: 'verify again' } })
    expect(error.kind).toBe('step_up_required')
  })
})
