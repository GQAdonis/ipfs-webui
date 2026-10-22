import { DecisionIdSchema, DecisionListQuerySchema, DecisionListResponseSchema, DecisionItemResponseSchema } from '@gqadonis/ipfs-mcp-ui'
import { validateEndpoint } from './endpoint.js'
import { readDecisionEvents } from './decision-sse.js'

const MAX_RESPONSE = 1048576
export class DecisionReadError extends Error {
  constructor (kind, { status, retryAt } = {}) {
    super({ unauthenticated: 'Decision reads require an accepted credential and route grant.', forbidden: 'Decision reads are not permitted for this identity or page.', unavailable: 'Decision history is unavailable here.', cursor: 'Decision pagination must be refreshed.', 'rate-limited': 'The decision subscription limit was reached.', network: 'The decision connection was interrupted.', protocol: 'The decision response could not be validated.', server: 'The node could not provide decision observations.', 'no-token': 'No current credential is available.' }[kind] || 'Decision reads are unavailable.')
    this.name = 'DecisionReadError'; this.kind = kind; this.status = status; this.retryAt = retryAt
  }
}
function freeze (value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) freeze(item)
    Object.freeze(value)
  }
  return value
}
function retryAt (header, now) {
  const numeric = header && /^\d+(?:\.\d+)?$/.test(header.trim())
  const seconds = numeric ? Number(header) : NaN
  if (numeric && !Number.isFinite(seconds)) return Infinity
  const date = header ? Date.parse(header) : NaN
  const delay = Number.isFinite(seconds) ? seconds * 1000 : Number.isFinite(date) ? Math.max(0, date - now) : 5000
  // Excessive/unrepresentable holds never cause an early automatic reconnect.
  return delay <= 86400000 ? now + Math.max(0, delay) : Infinity
}
function linkedSignal (signals) {
  const owner = new AbortController()
  const abort = () => owner.abort()
  for (const signal of signals) {
    if (signal?.aborted) owner.abort()
    else signal?.addEventListener('abort', abort, { once: true })
  }
  return { signal: owner.signal, dispose: () => signals.forEach(signal => signal?.removeEventListener('abort', abort)) }
}
async function boundedJson (response, signal) {
  const length = Number(response.headers.get('content-length'))
  if (Number.isFinite(length) && length > MAX_RESPONSE) throw new DecisionReadError('protocol')
  if (!response.body?.getReader) throw new DecisionReadError('protocol')
  const reader = response.body.getReader()
  const chunks = []
  let bytes = 0
  const abort = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', abort, { once: true })
  try {
    while (true) {
      signal.throwIfAborted()
      const { done, value } = await reader.read()
      signal.throwIfAborted()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_RESPONSE) throw new DecisionReadError('protocol')
      chunks.push(value)
    }
    const joined = new Uint8Array(bytes)
    let at = 0
    for (const chunk of chunks) { joined.set(chunk, at); at += chunk.byteLength }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(joined))
  } catch (error) {
    signal.throwIfAborted()
    throw error instanceof DecisionReadError ? error : new DecisionReadError('protocol')
  } finally {
    signal.removeEventListener('abort', abort)
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

/** Captured trusted root/auth only. All routes are fixed read-only GETs; redirects are refused. */
export function createDecisionReadClient ({ capture, fetch: fetchImpl = globalThis.fetch, now = Date.now }) {
  const checked = validateEndpoint(capture.endpoint)
  if (!checked.ok || checked.value.slice(0, -'/agui'.length) !== capture.root) throw new DecisionReadError('protocol')
  const root = new URL(capture.root)
  if (root.username || root.password || root.search || root.hash || (capture.session && root.origin !== globalThis.location.origin)) throw new DecisionReadError('protocol')
  const current = signal => { signal.throwIfAborted(); if (!capture.isCurrent()) throw new DOMException('Retired connection', 'AbortError') }
  async function request (path, accept, { signal: requested, stream, schema, onEvent, expectedId } = {}) {
    const lifetime = linkedSignal([capture.signal, requested])
    const { signal } = lifetime
    let response
    try {
      current(signal)
      const token = capture.session ? undefined : await capture.getToken()
      current(signal)
      if (!capture.session && !token) throw new DecisionReadError('no-token')
      try {
        response = await fetchImpl(capture.root + path, { method: 'GET', headers: { accept, ...(!capture.session && { authorization: `Bearer ${token}` }) }, credentials: capture.session ? 'same-origin' : 'omit', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-store', mode: 'cors', signal })
      } catch (error) { current(signal); throw new DecisionReadError('network') }
      current(signal)
      if (!response.ok) {
        void response.body?.cancel().catch(() => {})
        const kind = { 400: 'cursor', 401: 'unauthenticated', 403: 'forbidden', 404: 'unavailable', 409: 'cursor', 429: 'rate-limited' }[response.status] || 'server'
        // A decisions401 can mean missing OIDC route opt-in; it is not proof of session expiry.
        throw new DecisionReadError(kind, { status: response.status, ...(response.status === 429 && { retryAt: retryAt(response.headers.get('retry-after'), now()) }) })
      }
      if (stream) {
        if (!/^text\/event-stream(?:;|$)/i.test(response.headers.get('content-type') || '')) throw new DecisionReadError('protocol')
        try { await readDecisionEvents(response.body, { signal, onEvent: event => { current(signal); onEvent(event) } }) } catch (error) { current(signal); throw error instanceof DecisionReadError ? error : new DecisionReadError('protocol') }
        current(signal)
        return
      }
      if (!/^application\/json(?:;|$)/i.test(response.headers.get('content-type') || '')) throw new DecisionReadError('protocol')
      const value = await boundedJson(response, signal)
      current(signal)
      const parsed = schema.safeParse(value)
      if (!parsed.success || (expectedId !== undefined && parsed.data.item?.id !== expectedId)) throw new DecisionReadError('protocol')
      if ('items' in parsed.data && parsed.data.items.some(item => new TextEncoder().encode(JSON.stringify(item)).length > 262144)) throw new DecisionReadError('protocol')
      if ('item' in parsed.data && new TextEncoder().encode(JSON.stringify(parsed.data.item)).length > 262144) throw new DecisionReadError('protocol')
      return freeze(parsed.data)
    } finally {
      lifetime.dispose()
      if (response?.body && !response.body.locked) void response.body.cancel().catch(() => {})
    }
  }
  return Object.freeze({
    list (options = {}) {
      const query = DecisionListQuerySchema.safeParse({ limit: options.limit ?? 100, ...(options.cursor !== undefined && { cursor: options.cursor }) })
      if (!query.success) return Promise.reject(new DecisionReadError('protocol'))
      const params = new URLSearchParams({ limit: String(query.data.limit), ...(query.data.cursor && { cursor: query.data.cursor }) })
      return request(`/decisions?${params}`, 'application/json', { ...options, schema: DecisionListResponseSchema })
    },
    item (id, options = {}) {
      if (!DecisionIdSchema.safeParse(id).success || id === 'events') return Promise.reject(new DecisionReadError('protocol'))
      return request(`/decisions/${encodeURIComponent(id)}`, 'application/json', { ...options, schema: DecisionItemResponseSchema, expectedId: id })
    },
    events (options) { return request('/decisions/events', 'text/event-stream', { ...options, stream: true }) }
  })
}
