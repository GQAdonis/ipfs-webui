import { createSearchClient, readStatus, readSearch } from './client.js'
import { isSearchError } from './errors.js'
import { reply, CONFIGURED, hit, RUN, CID_A } from './test-helpers.js'

const ROOT = 'http://127.0.0.1:5050'
const make = (fetch, token = 'tok-123') => createSearchClient({ root: ROOT, getToken: () => token, fetch })
const failsWith = async (promise, kind, extra = {}) => {
  let caught
  try { await promise } catch (e) { caught = e }
  expect(isSearchError(caught)).toBe(true)
  expect(caught.kind).toBe(kind)
  for (const [k, v] of Object.entries(extra)) expect(caught[k]).toEqual(v)
  return caught
}

describe('status', () => {
  it('reads a configured index and its bulk run', async () => {
    const fetch = jest.fn(async () => reply(200, { ...CONFIGURED, bulk_run: RUN }))
    const status = await make(fetch).status()
    expect(status.configured).toBe(true)
    expect(status.indexedCids).toBe(1284)
    expect(status.bulkRun.state).toBe('running')
    expect(status.bulkRun.skippedByReason).toEqual({ too_large: 4, mime_not_allowed: 5 })
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${ROOT}/index/status`)
    expect(init.method).toBe('GET')
    expect(init.headers.authorization).toBe('Bearer tok-123')
    expect(init.credentials).toBe('omit')
    expect(init.redirect).toBe('error')
  })

  it('treats enabled false and mode disabled as not configured', () => {
    expect(readStatus({ enabled: false, mode: 'disabled', auto: false }).configured).toBe(false)
    expect(readStatus({ enabled: true, mode: 'disabled', auto: false }).configured).toBe(false)
  })

  it('refuses a body that is not a status', async () => {
    await failsWith(make(async () => reply(200, { hello: 'world' })).status(), 'protocol')
  })

  it('does not carry the token in the URL', async () => {
    const fetch = jest.fn(async () => reply(200, CONFIGURED))
    await make(fetch).status()
    expect(String(fetch.mock.calls[0][0])).not.toContain('tok-123')
  })

  it('sends nothing without a token', async () => {
    const fetch = jest.fn()
    await failsWith(make(fetch, '').status(), 'unauthenticated')
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('search', () => {
  it('posts the contract body with the chosen filters', async () => {
    const fetch = jest.fn(async () => reply(200, { model: 'bge-m3', results: [hit()] }))
    const out = await make(fetch).search({ query: '  roofer invoice  ', kinds: ['document'], sources: ['extracted', 'ocr'], topK: 7 })
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${ROOT}/index/search`)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ query: 'roofer invoice', top_k: 7, kinds: ['document'], sources: ['extracted', 'ocr'] })
    expect(init.headers['content-type']).toBe('application/json')
    expect(out.results[0]).toMatchObject({ cid: CID_A, kind: 'document', source: 'extracted', chunkIndex: 2 })
  })

  it('omits empty filters, meaning every kind and source', async () => {
    const fetch = jest.fn(async () => reply(200, { model: 'm', results: [] }))
    await make(fetch).search({ query: 'x', kinds: [], sources: [] })
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ query: 'x', top_k: 20 })
  })

  it('drops hits with a malformed CID or no text, and unknown kinds and sources', () => {
    const out = readSearch({
      model: 'm',
      results: [
        hit({ cid: 'x/../../evil' }),
        hit({ text: 5 }),
        hit({ kind: 'weird', source: 'weird' }),
        'nope'
      ]
    })
    expect(out.results).toHaveLength(1)
    expect(out.results[0].kind).toBeUndefined()
    expect(out.results[0].source).toBeUndefined()
  })

  it('keeps markup in hit text as characters and strips bidi controls', () => {
    const out = readSearch({ model: 'm', results: [hit({ text: '<img src=x onerror=alert(1)>‮evil', path: '/a/⁦b.txt' })] })
    expect(out.results[0].text).toBe('<img src=x onerror=alert(1)>evil')
    expect(out.results[0].path).toBe('/a/b.txt')
  })
})

describe('error mapping', () => {
  const search = (fetch) => make(fetch).search({ query: 'q' })

  it('404 is not_configured', async () => { await failsWith(search(async () => reply(404)), 'not_configured') })
  it('401 is unauthenticated', async () => { await failsWith(search(async () => reply(401)), 'unauthenticated') })
  it('403 without a code is forbidden', async () => { await failsWith(search(async () => reply(403)), 'forbidden') })

  it('403 egress_not_acknowledged carries the missing hosts', async () => {
    const body = { error: { code: 'egress_not_acknowledged', message: 'x', retryable: false, details: { missing_hosts: ['embed.example', 'store.example:8000', 5] } } }
    await failsWith(search(async () => reply(403, body)), 'egress', { hosts: ['embed.example', 'store.example:8000'] })
  })

  it('429 reads Retry-After in whole seconds', async () => {
    await failsWith(search(async () => reply(429, { error: { code: 'resource_exhausted', message: 'x', retryable: true } }, { 'Retry-After': '3' })), 'rate_limited', { retryAfter: 3 })
  })

  it('429 without a readable Retry-After still maps', async () => {
    await failsWith(search(async () => reply(429, undefined)), 'rate_limited', { retryAfter: undefined })
  })

  it('503 is unavailable', async () => {
    await failsWith(search(async () => reply(503, { error: { code: 'index_unavailable', message: 'x', retryable: true } }, { 'Retry-After': '5' })), 'unavailable', { retryAfter: 5 })
  })

  it('400 is invalid and 500 is internal', async () => {
    await failsWith(search(async () => reply(400, { error: { code: 'invalid_argument', message: 'x', retryable: false } })), 'invalid')
    await failsWith(search(async () => reply(500)), 'internal')
  })

  it('a thrown fetch is a network error, and the message names no credential', async () => {
    const e = await failsWith(search(async () => { throw new TypeError('Failed to fetch') }), 'network')
    expect(e.message).not.toContain('tok-123')
  })
})
