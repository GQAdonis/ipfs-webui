// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DecisionItemResponseSchema, DecisionListResponseSchema } from '@gqadonis/ipfs-mcp-ui'
import { createDecisionReadClient, DecisionReadError } from './decisions-client.js'
import { markSessionExpired, reportUnauthorized } from './session.js'

vi.mock('./session.js', () => ({ markSessionExpired: vi.fn(), reportUnauthorized: vi.fn() }))

const ROOT = 'https://node.example.test/local-mcp'
const TOKEN = 'synthetic_fixture_bearer_only'
const NOW = Date.parse('2026-10-20T12:00:00Z')
const encoder = new TextEncoder()
const cases = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/decisions/fixtures/cases.json'), 'utf8')).schemaCases
const canonical = definition => structuredClone(cases.find(item => item.definition === definition && item.expected).input)
const list = () => canonical('ListResponse')
const item = () => canonical('ItemResponse')
const SNAPSHOT = { server_epoch: 'epoch_fixture_0123456789', revision: 'rev_fixture_1', reason: 'initial' }
const CHANGED = { id: 'cf_3pQm8vK2xR7tLw9a', state: 'succeeded', revision: 'rev_fixture_2' }
const frame = (name, data) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`
const wire = () => frame('ipfs.decisions.snapshot_required', SNAPSHOT) + frame('ipfs.decision.changed', CHANGED)
const json = (value, headers = {}) => new Response(JSON.stringify(value), { headers: { 'content-type': 'application/json', ...headers } })
const sse = (text = wire()) => new Response(text, { headers: { 'content-type': 'text/event-stream; charset=utf-8' } })

function deferred () {
  let resolve
  const promise = new Promise(_resolve => { resolve = _resolve })
  return { promise, resolve }
}
function owner (change = {}) {
  let live = true
  const lifetime = new AbortController()
  const capture = {
    generation: 'connection_fixture_1',
    root: ROOT,
    endpoint: ROOT + '/agui',
    session: false,
    signal: lifetime.signal,
    isCurrent: () => live && !lifetime.signal.aborted,
    getToken: vi.fn(async () => TOKEN),
    ...change
  }
  return { capture, retire (abort = true) { live = false; if (abort) lifetime.abort() } }
}
async function error (promise, kind, extra = {}) {
  let caught
  try { await promise } catch (failure) { caught = failure }
  expect(caught).toBeInstanceOf(DecisionReadError)
  expect(caught).toMatchObject({ kind, ...extra })
  return caught
}

beforeEach(() => vi.stubGlobal('location', { origin: 'https://console.example.test' }))
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

describe('fixed decision read routes and credential boundaries', () => {
  it('uses header-only bearer authentication for fixed GET routes with no cookies, cache or redirects', async () => {
    const current = owner(); const fetch = vi.fn(async () => json(list()))
    const client = createDecisionReadClient({ capture: current.capture, fetch })
    const first = await client.list({ limit: 37, cursor: 'opaque_cursor_fixture_1' })
    expect(first).toEqual(list())
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(ROOT + '/decisions?limit=37&cursor=opaque_cursor_fixture_1')
    expect(url).not.toContain(TOKEN)
    expect(init).toMatchObject({ method: 'GET', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-store', mode: 'cors' })
    expect(new Headers(init.headers).get('authorization')).toBe(`Bearer ${TOKEN}`)
    expect(new Headers(init.headers).get('accept')).toBe('application/json')
    expect(new Headers(init.headers).get('last-event-id')).toBeNull()
    expect(init.body).toBeUndefined()
    expect(Object.isFrozen(client)).toBe(true)
  })

  it('reads a matching detail and returns actual deeply frozen canonical observations', async () => {
    const response = item(); const current = owner(); const fetch = vi.fn(async () => json(response))
    const client = createDecisionReadClient({ capture: current.capture, fetch })
    const value = await client.item(response.item.id)
    expect(fetch.mock.calls[0][0]).toBe(ROOT + '/decisions/' + response.item.id)
    expect(value).toEqual(response)
    for (const part of [value, value.retention, value.item, value.item.summary, value.item.summary.targets, value.item.actions]) expect(Object.isFrozen(part)).toBe(true)
    expect(response.item.id).toBe(value.item.id)
  })

  it('uses only same-origin credentials in console mode and never obtains a bearer', async () => {
    const root = 'https://console.example.test/local-mcp'
    const current = owner({ root, endpoint: root + '/agui', session: true })
    const fetch = vi.fn(async () => json(list()))
    await createDecisionReadClient({ capture: current.capture, fetch }).list()
    expect(current.capture.getToken).not.toHaveBeenCalled()
    expect(fetch.mock.calls[0][0]).toBe(root + '/decisions?limit=100')
    expect(fetch.mock.calls[0][1].credentials).toBe('same-origin')
    expect(new Headers(fetch.mock.calls[0][1].headers).has('authorization')).toBe(false)
  })

  it.each([
    { endpoint: 'http://remote.example.test/agui', root: 'http://remote.example.test' },
    { endpoint: ROOT + '/agui', root: ROOT + '/other' },
    { endpoint: 'https://user:password@example.test/agui', root: 'https://user:password@example.test' },
    { endpoint: ROOT + '/agui?token=fixture', root: ROOT },
    { endpoint: ROOT + '/agui', root: ROOT, session: true },
    { endpoint: undefined }
  ])('refuses an untrusted/inconsistent captured connection before fetching: %j', change => {
    const fetch = vi.fn(); const current = owner(change)
    expect(() => createDecisionReadClient({ capture: current.capture, fetch })).toThrow(DecisionReadError)
    expect(fetch).not.toHaveBeenCalled(); expect(current.capture.getToken).not.toHaveBeenCalled()
  })

  it('reacquires the current bearer per request and refuses an absent credential without a request', async () => {
    const current = owner(); const fetch = vi.fn(async () => json(list()))
    current.capture.getToken.mockResolvedValueOnce('first_synthetic_fixture').mockResolvedValueOnce('second_synthetic_fixture').mockResolvedValueOnce(undefined)
    const client = createDecisionReadClient({ capture: current.capture, fetch })
    await client.list(); await client.list()
    expect(fetch.mock.calls.map(([, init]) => new Headers(init.headers).get('authorization'))).toEqual(['Bearer first_synthetic_fixture', 'Bearer second_synthetic_fixture'])
    await error(client.list(), 'no-token')
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it.each([{ limit: 0 }, { limit: 101 }, { limit: '5' }, { cursor: '' }, { cursor: '../cursor' }, { cursor: 'a'.repeat(2049) }])('refuses an invalid pagination value %j without transport', async options => {
    const current = owner(); const fetch = vi.fn()
    await error(createDecisionReadClient({ capture: current.capture, fetch }).list(options), 'protocol')
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each(['events', '../other', 'cf_fixture/child', 'id?token=fixture', '', 'a'.repeat(129)])('refuses unsafe/reserved detail ID %j', async id => {
    const fetch = vi.fn()
    await error(createDecisionReadClient({ capture: owner().capture, fetch }).item(id), 'protocol')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('does not follow a redirect or expose a low-level fetch error', async () => {
    const fetch = vi.fn(async () => { throw new TypeError('synthetic private network detail') })
    const failure = await error(createDecisionReadClient({ capture: owner().capture, fetch }).list(), 'network')
    expect(failure.message).not.toContain('private network detail')
    expect(fetch.mock.calls[0][1].redirect).toBe('error')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('strict bounded decision responses', () => {
  it.each(['unknown-field', 'invalid-retention', 'invalid-item', 'invalid-page'])('rejects the whole list on %s instead of retaining a partial trusted page', async kind => {
    const value = list()
    if (kind === 'unknown-field') value.total = 200
    if (kind === 'invalid-retention') value.retention.scope = 'identity'
    if (kind === 'invalid-item') value.items.push({ ...value.items[0], execution: { state: 'succeeded' } })
    if (kind === 'invalid-page') value.page = { has_more: true }
    await error(createDecisionReadClient({ capture: owner().capture, fetch: async () => json(value) }).list(), 'protocol')
  })

  it('rejects a structurally valid detail for a different requested ID', async () => {
    const response = item()
    expect(DecisionItemResponseSchema.safeParse(response).success).toBe(true)
    await error(createDecisionReadClient({ capture: owner().capture, fetch: async () => json(response) }).item('cf_otherFixture12345678'), 'protocol')
  })

  it.each([
    () => new Response('not-json', { headers: { 'content-type': 'application/json' } }),
    () => new Response(new Uint8Array([0xff]), { headers: { 'content-type': 'application/json' } }),
    () => new Response(JSON.stringify(list()), { headers: { 'content-type': 'text/html' } }),
    () => new Response(null, { status: 204, headers: { 'content-type': 'application/json' } }),
    () => json(list(), { 'content-length': '1048577' })
  ])('refuses malformed encoding/MIME/body or an oversized declared response', async reply => {
    await error(createDecisionReadClient({ capture: owner().capture, fetch: async () => reply() }).list(), 'protocol')
  })

  it('bounds actual bytes when Content-Length is absent', async () => {
    const bytes = ' '.repeat(1048576) + JSON.stringify(list())
    await error(createDecisionReadClient({ capture: owner().capture, fetch: async () => new Response(bytes, { headers: { 'content-type': 'application/json' } }) }).list(), 'protocol')
  })

  it.each(['list', 'item'])('applies the 256KiB per-observation bound after strict %s parsing', async route => {
    const value = item()
    value.item.summary.targets = Array.from({ length: 16 }, () => ({ kind: 'content', value: '😀'.repeat(4096) }))
    expect(DecisionItemResponseSchema.safeParse(value).success).toBe(true)
    expect(encoder.encode(JSON.stringify(value.item)).byteLength).toBeGreaterThan(262144)
    const response = route === 'item' ? value : { ...list(), items: [value.item] }
    if (route === 'list') expect(DecisionListResponseSchema.safeParse(response).success).toBe(true)
    const client = createDecisionReadClient({ capture: owner().capture, fetch: async () => json(response) })
    await error(route === 'item' ? client.item(value.item.id) : client.list(), 'protocol')
  })
})

describe('route errors stay read-only and bounded', () => {
  it.each([[400, 'cursor'], [409, 'cursor'], [401, 'unauthenticated'], [403, 'forbidden'], [404, 'unavailable'], [500, 'server']])('classifies status %i as %s without parsing private error prose or retrying', async (status, kind) => {
    const body = 'synthetic_private_fixture_body'; const response = new Response(body, { status })
    const text = vi.spyOn(response, 'text'); const jsonBody = vi.spyOn(response, 'json')
    const fetch = vi.fn(async () => response); const current = owner()
    const failure = await error(createDecisionReadClient({ capture: current.capture, fetch }).list({ cursor: 'opaque_fixture_cursor' }), kind, { status })
    expect(text).not.toHaveBeenCalled(); expect(jsonBody).not.toHaveBeenCalled()
    expect(failure.message).not.toContain(body)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(markSessionExpired).not.toHaveBeenCalled(); expect(reportUnauthorized).not.toHaveBeenCalled()
  })

  it('a decisions 401 in console mode does not assert console-session expiry', async () => {
    const root = 'https://console.example.test/mcp'; const current = owner({ session: true, root, endpoint: root + '/agui' })
    await error(createDecisionReadClient({ capture: current.capture, fetch: async () => new Response('', { status: 401 }) }).list(), 'unauthenticated')
    expect(markSessionExpired).not.toHaveBeenCalled(); expect(reportUnauthorized).not.toHaveBeenCalled()
    expect(current.capture.isCurrent()).toBe(true)
  })

  it.each([
    ['5', NOW + 5000], ['2.5', NOW + 2500], [new Date(NOW + 12000).toUTCString(), NOW + 12000],
    [new Date(NOW - 1000).toUTCString(), NOW], [undefined, NOW + 5000], ['not-a-delay', NOW + 5000],
    ['86401', Infinity], ['9'.repeat(400), Infinity]
  ])('retains a safe 429 Retry-After hold for %s without scheduling a retry', async (header, retryAt) => {
    const fetch = vi.fn(async () => new Response('', { status: 429, headers: header === undefined ? {} : { 'retry-after': header } }))
    await error(createDecisionReadClient({ capture: owner().capture, fetch, now: () => NOW }).list(), 'rate-limited', { status: 429, retryAt })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('connection lifetime fences credential, response and event delivery', () => {
  it('refuses a pre-aborted caller without acquiring a credential', async () => {
    const current = owner(); const caller = new AbortController(); const fetch = vi.fn()
    caller.abort()
    await expect(createDecisionReadClient({ capture: current.capture, fetch }).list({ signal: caller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    expect(current.capture.getToken).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled()
  })

  it('does not send a credential that resolves after its capture retired', async () => {
    const credential = deferred(); const current = owner({ getToken: () => credential.promise }); const fetch = vi.fn()
    const pending = createDecisionReadClient({ capture: current.capture, fetch }).list()
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    current.retire(false); credential.resolve(TOKEN)
    await rejected; expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a late fetch response after the current generation changed', async () => {
    const arrived = deferred(); const response = deferred(); const current = owner()
    const fetch = vi.fn(() => { arrived.resolve(); return response.promise })
    const pending = createDecisionReadClient({ capture: current.capture, fetch }).list()
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await arrived.promise; current.retire(false); response.resolve(json(list()))
    await rejected
  })

  it.each(['retire', 'caller-abort'])('fences %s while waiting for the JSON body and releases its reader', async boundary => {
    const reading = deferred(); const current = owner(); const caller = new AbortController(); const cancel = vi.fn()
    let controller
    const body = new ReadableStream({ start (source) { controller = source }, cancel })
    const getReader = body.getReader.bind(body)
    vi.spyOn(body, 'getReader').mockImplementation(() => { reading.resolve(); return getReader() })
    const pending = createDecisionReadClient({ capture: current.capture, fetch: async () => new Response(body, { headers: { 'content-type': 'application/json' } }) }).list({ signal: caller.signal })
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await reading.promise
    if (boundary === 'retire') { current.retire(false); controller.enqueue(encoder.encode(JSON.stringify(list()))); controller.close() } else caller.abort()
    await rejected
    expect(body.locked).toBe(false)
    if (boundary === 'caller-abort') expect(cancel).toHaveBeenCalledTimes(1)
  })

  it('streams authenticated immutable invalidation hints without a run, receipt or resolver request', async () => {
    const current = owner(); const fetch = vi.fn(async () => sse()); const onEvent = vi.fn()
    await createDecisionReadClient({ capture: current.capture, fetch }).events({ onEvent })
    expect(fetch.mock.calls[0][0]).toBe(ROOT + '/decisions/events')
    const init = fetch.mock.calls[0][1]
    expect(init.method).toBe('GET'); expect(init.body).toBeUndefined()
    expect(new Headers(init.headers).get('accept')).toBe('text/event-stream')
    expect(new Headers(init.headers).get('authorization')).toBe(`Bearer ${TOKEN}`)
    expect(new Headers(init.headers).get('last-event-id')).toBeNull()
    expect(onEvent.mock.calls.map(([event]) => event)).toEqual([{ type: 'snapshot', data: SNAPSHOT }, { type: 'changed', data: CHANGED }])
    expect(Object.isFrozen(onEvent.mock.calls[1][0].data)).toBe(true)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('does not deliver another same-chunk hint after its first callback retires the capture', async () => {
    const current = owner(); const received = []
    const pending = createDecisionReadClient({ capture: current.capture, fetch: async () => sse() }).events({ onEvent (event) { received.push(event); current.retire(false) } })
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    expect(received).toEqual([{ type: 'snapshot', data: SNAPSHOT }])
  })

  it.each([() => json(list()), () => sse(frame('ipfs.decision.changed', CHANGED)), () => sse(frame('ipfs.decisions.snapshot_required', { ...SNAPSHOT, actions: { approve: true } }))])('maps invalid stream MIME/first frame/payload to protocol without partial delivery', async reply => {
    const onEvent = vi.fn()
    await error(createDecisionReadClient({ capture: owner().capture, fetch: async () => reply() }).events({ onEvent }), 'protocol')
    expect(onEvent).not.toHaveBeenCalled()
  })
})
