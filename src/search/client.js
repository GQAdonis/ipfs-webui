// The HTTP client of the whole-node search routes of `ipfs mcp`
// (kubo mcp/contract/routes/index.json): GET /index/status and POST /index/search.
// The bearer goes in the Authorization header only: never in a URL, a cookie, a
// log line or an error. Nothing here reads or writes storage. Every body is
// untrusted; it is checked field by field and anything unexpected is dropped, not
// passed on. Hit text stays a plain string for the page to render as text.

import { SearchError } from './errors.js'
import { markSessionExpired } from '../agent-chat/session.js'
import { isKind, isSource } from './content-kinds.js'
import { plainText } from './plain-text.js'

export const ROUTES = Object.freeze({ search: '/index/search', status: '/index/status' })

const MAX_QUERY = 2000
const MAX_RETRY_AFTER_S = 3600
const MAX_HOSTS = 20
const BULK_STATES = Object.freeze(['running', 'paused', 'completed', 'cancelled', 'failed'])

/** @param {unknown} v @returns {v is Record<string, any>} */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)
/** @param {unknown} v */
const count = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0)

/**
 * @typedef {Object} BulkRun
 * @property {string} state running | paused | completed | cancelled | failed
 * @property {string} startedBy
 * @property {number} filesSeen
 * @property {number} filesIndexed
 * @property {number} filesSkipped
 * @property {number} chunksIndexed
 * @property {number} bytesRead
 * @property {Record<string, number>} skippedByReason
 * @property {string} lastError
 *
 * @typedef {Object} IndexStatus
 * @property {boolean} configured an index exists: enabled, and the mode is not "disabled"
 * @property {boolean} enabled
 * @property {string} mode disabled | embedded | remote
 * @property {boolean | undefined} storeReachable
 * @property {string} model
 * @property {number | undefined} dimensions
 * @property {number} indexedCids
 * @property {number} chunkCount
 * @property {BulkRun | undefined} bulkRun
 *
 * @typedef {Object} Hit
 * @property {string} cid
 * @property {string} path
 * @property {number} chunkIndex
 * @property {number} score
 * @property {string} text
 * @property {import('./content-kinds.js').Kind | undefined} kind
 * @property {import('./content-kinds.js').Source | undefined} source
 * @property {string} mimeType
 * @property {string} describedBy
 *
 * @typedef {Object} SearchRequest
 * @property {string} query
 * @property {number} [topK]
 * @property {readonly string[]} [kinds]
 * @property {readonly string[]} [sources]
 */

/** @param {unknown} raw @returns {BulkRun | undefined} */
function readBulkRun (raw) {
  if (!isObject(raw) || typeof raw.state !== 'string') return undefined
  /** @type {Record<string, number>} */
  const skippedByReason = {}
  if (isObject(raw.skipped_by_reason)) {
    for (const [reason, n] of Object.entries(raw.skipped_by_reason)) {
      if (/^[a-z_]{1,40}$/.test(reason)) skippedByReason[reason] = count(n)
    }
  }
  return {
    state: BULK_STATES.includes(raw.state) ? raw.state : 'unknown',
    startedBy: plainText(raw.started_by, 200),
    filesSeen: count(raw.files_seen),
    filesIndexed: count(raw.files_indexed),
    filesSkipped: count(raw.files_skipped),
    chunksIndexed: count(raw.chunks_indexed),
    bytesRead: count(raw.bytes_read),
    skippedByReason,
    lastError: plainText(raw.last_error, 500)
  }
}

/**
 * @param {unknown} raw
 * @returns {IndexStatus}
 */
export function readStatus (raw) {
  if (!isObject(raw) || typeof raw.enabled !== 'boolean') {
    throw new SearchError('protocol', 'The node answered with something that is not an index status.')
  }
  const mode = typeof raw.mode === 'string' ? raw.mode : 'disabled'
  return {
    configured: raw.enabled && mode !== 'disabled',
    enabled: raw.enabled,
    mode,
    storeReachable: typeof raw.store_reachable === 'boolean' ? raw.store_reachable : undefined,
    model: plainText(raw.model, 200),
    dimensions: typeof raw.dimensions === 'number' && raw.dimensions > 0 ? Math.floor(raw.dimensions) : undefined,
    indexedCids: count(raw.indexed_cids),
    chunkCount: count(raw.chunk_count),
    bulkRun: readBulkRun(raw.bulk_run)
  }
}

/** @param {unknown} raw @returns {Hit | undefined} */
function readHit (raw) {
  if (!isObject(raw) || typeof raw.cid !== 'string' || raw.cid === '' || typeof raw.text !== 'string') return undefined
  // A CID is base32/base58 text; anything else would be a path-injection into the links built from it.
  if (!/^[A-Za-z0-9]{10,200}$/.test(raw.cid)) return undefined
  return {
    cid: raw.cid,
    path: plainText(raw.path, 4096),
    chunkIndex: count(raw.chunk_index),
    score: typeof raw.score === 'number' && Number.isFinite(raw.score) ? raw.score : 0,
    text: plainText(raw.text),
    kind: isKind(raw.kind) ? raw.kind : undefined,
    source: isSource(raw.source) ? raw.source : undefined,
    mimeType: plainText(raw.mime_type ?? raw.mime, 200),
    describedBy: plainText(raw.described_by, 200)
  }
}

/**
 * @param {unknown} raw
 * @returns {{ model: string, results: Hit[] }}
 */
export function readSearch (raw) {
  if (!isObject(raw) || !Array.isArray(raw.results)) {
    throw new SearchError('protocol', 'The node answered with something that is not a search result.')
  }
  /** @type {Hit[]} */
  const results = []
  for (const item of raw.results) {
    const hit = readHit(item)
    if (hit) results.push(hit)
  }
  return { model: plainText(raw.model, 200), results }
}

/** @param {Response} res @returns {number | undefined} */
function retryAfterOf (res) {
  const n = Number(res.headers?.get?.('retry-after'))
  return Number.isFinite(n) && n > 0 ? Math.min(Math.ceil(n), MAX_RETRY_AFTER_S) : undefined
}

/**
 * The answer of a mounted route that is not 2xx. 401, 403 and 404 from the
 * authentication, origin and mount layers are plain text or empty; the
 * ToolError shape applies to what the route produces while serving.
 *
 * @param {Response} res
 * @returns {Promise<SearchError>}
 */
async function errorFromResponse (res) {
  const status = res.status
  /** @type {any} */
  let body
  try {
    body = await res.json()
  } catch (_) {
    body = undefined
  }
  const error = isObject(body) && isObject(body.error) ? body.error : undefined
  const code = typeof error?.code === 'string' ? error.code : ''
  const details = error && isObject(error.details) ? error.details : undefined
  if (status === 404) return new SearchError('not_configured', 'The node does not serve the search routes.', { status })
  if (status === 401) return new SearchError('unauthenticated', 'The node did not accept the access token.', { status })
  if (status === 403) {
    if (code === 'egress_not_acknowledged') {
      const hosts = details && Array.isArray(details.missing_hosts)
        ? details.missing_hosts.filter((/** @type {unknown} */ h) => typeof h === 'string').slice(0, MAX_HOSTS).map((/** @type {string} */ h) => plainText(h, 253))
        : []
      return new SearchError('egress', 'The access token is not allowed to send content to the embedding hosts.', { status, hosts })
    }
    return new SearchError('forbidden', 'The access token may not search.', { status })
  }
  if (status === 429) return new SearchError('rate_limited', 'Too many searches.', { status, retryAfter: retryAfterOf(res) })
  if (status === 503 || code === 'index_unavailable') return new SearchError('unavailable', 'The index is unavailable.', { status, retryAfter: retryAfterOf(res) })
  if (status === 400) return new SearchError('invalid', 'The search request was refused.', { status })
  return new SearchError('internal', 'The node failed to answer.', { status })
}

/**
 * @param {Object} options
 * @param {string} options.root the listener origin plus any path prefix (the chat endpoint without /agui)
 * @param {() => string | undefined | Promise<string | undefined>} [options.getToken] called per request; unused in session mode
 * @param {boolean} [options.session] session mode (console-session-auth): same-origin cookie, no Authorization header
 * @param {typeof fetch} [options.fetch] test seam
 */
export function createSearchClient ({ root, getToken = () => undefined, session = false, fetch: fetchImpl }) {
  const doFetch = fetchImpl ?? ((/** @type {any[]} */ ...a) => /** @type {any} */ (globalThis.fetch)(...a))

  /**
   * @param {string} method
   * @param {string} path
   * @param {{ body?: unknown, signal?: AbortSignal }} [opts]
   */
  async function request (method, path, opts = {}) {
    const { body, signal } = opts
    signal?.throwIfAborted()
    const token = session ? undefined : await getToken()
    // Credential providers can retire their capture while awaited (for example Desktop rotation).
    // A stale request must not reach fetch, including fetch implementations that ignore abort.
    signal?.throwIfAborted()
    if (!session && !token) throw new SearchError('unauthenticated', 'No access token is set.')
    /** @type {Record<string, string>} */
    const headers = { accept: 'application/json', ...(!session && { authorization: `Bearer ${token}` }) }
    if (body !== undefined) headers['content-type'] = 'application/json'
    let res
    try {
      res = await doFetch(root + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: session ? 'same-origin' : 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        mode: 'cors',
        signal
      })
    } catch (e) {
      signal?.throwIfAborted()
      if (/** @type {any} */ (e)?.name === 'AbortError') throw e
      throw new SearchError('network', 'Cannot reach the node.')
    }
    signal?.throwIfAborted()
    if (!res.ok) {
      if (session && res.status === 401) markSessionExpired()
      const error = await errorFromResponse(res)
      signal?.throwIfAborted()
      throw error
    }
    try {
      const value = await res.json()
      signal?.throwIfAborted()
      return value
    } catch (_) {
      signal?.throwIfAborted()
      throw new SearchError('protocol', 'The node answered with something that is not JSON.')
    }
  }

  return {
    /** @param {{ signal?: AbortSignal }} [opts] @returns {Promise<IndexStatus>} */
    async status (opts = {}) {
      return readStatus(await request('GET', ROUTES.status, { signal: opts.signal }))
    },
    /**
     * @param {SearchRequest} req
     * @param {{ signal?: AbortSignal }} [opts]
     */
    async search (req, opts = {}) {
      const query = req.query.trim().slice(0, MAX_QUERY)
      /** @type {Record<string, unknown>} */
      const body = { query, top_k: req.topK ?? 20 }
      if (req.kinds && req.kinds.length > 0) body.kinds = [...req.kinds]
      if (req.sources && req.sources.length > 0) body.sources = [...req.sources]
      return readSearch(await request('POST', ROUTES.search, { body, signal: opts.signal }))
    }
  }
}
