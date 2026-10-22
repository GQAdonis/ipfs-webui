// The HTTP implementation of SettingsClient (mcp/contract/settings/client): GET
// and PUT on the settings route with the admin bearer, ETag / If-Match for the
// revision, POST test-connection and GET models for the probe, and the SSE
// change stream. The admin token comes from a getter called per request. It
// travels in the Authorization header only: never in a URL, a cookie (credentials
// are omitted), a log line or an error. Nothing here reads or writes storage.
//
// In session mode (console-session-auth) the page's cookie session is the credential: the
// request goes to the page's own origin with same-origin credentials, carries no Authorization
// header, and needs no token. A 401 then means the sign-in ended, and tells the session store.

import { getOriginPolicy } from '../../../agent-chat/origin-policy.js'
import { SettingsError, isServerErrorCode } from './errors.js'
import { readShape } from './read-shape.js'
import { readSse } from './sse.js'
import { markSessionExpired } from '../../../agent-chat/session.js'

export const ROUTES = Object.freeze({
  settings: '/agent/settings',
  testConnection: '/agent/settings/test-connection',
  models: '/agent/settings/models',
  events: '/agent/settings/events'
})

const RECONNECT_MIN_MS = 1000
const RECONNECT_MAX_MS = 30000

/** @param {unknown} v */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * @param {Object} options
 * @param {string} options.root the settings API root: the listener origin plus any path prefix
 * @param {() => string | undefined | Promise<string | undefined>} options.getToken
 * @param {boolean} [options.session] session mode: same-origin cookie, no Authorization header, getToken unused
 * @param {typeof fetch} [options.fetch] test seam
 * @param {() => number} [options.now] test seam, epoch ms
 * @param {(ms: number) => Promise<void>} [options.sleep] test seam for the reconnect wait
 * @returns {import('./types.js').SettingsClient}
 */
export function createHttpSettingsClient ({ root, getToken, session = false, fetch: fetchImpl, now = Date.now, sleep = defaultSleep }) {
  const doFetch = fetchImpl ?? ((/** @type {any[]} */ ...a) => /** @type {any} */ (globalThis.fetch)(...a))
  /** @type {import('./types.js').AppliedRecord | undefined} */
  let applied
  /** @type {string | undefined} */
  let lastRevision

  /**
   * @param {string} method
   * @param {string} path
   * @param {{ body?: unknown, ifMatch?: string, query?: Record<string, string>, signal?: AbortSignal, accept?: string }} opts
   */
  async function request (method, path, { body, ifMatch, query, signal, accept = 'application/json' } = {}) {
    const origin = getOriginPolicy(); const owner = new AbortController()
    const abort = () => owner.abort()
    const check = () => {
      if (!origin.allowsAgent() || owner.signal.aborted) throw new SettingsError('unavailable', 'Agent settings are unavailable on the current page origin or request.')
    }
    const unsubscribeOrigin = origin.subscribe(() => { if (!origin.allowsAgent()) abort() })
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
    try {
      check()
      const token = session ? undefined : await getToken()
      check()
      if (!session && !token) throw new SettingsError('not_configured', 'No admin token is set.')
      const url = new URL(root + path)
      for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v)
      /** @type {Record<string, string>} */
      const headers = { accept, ...(!session && { authorization: `Bearer ${token}` }) }
      if (body !== undefined) headers['content-type'] = 'application/json'
      if (ifMatch !== undefined) headers['if-match'] = `"${ifMatch}"`
      let res
      try {
        res = await doFetch(url.href, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          credentials: session ? 'same-origin' : 'omit',
          redirect: 'error',
          referrerPolicy: 'no-referrer',
          cache: 'no-store',
          mode: 'cors',
          signal: owner.signal
        })
      } catch (_) {
        check()
        throw new SettingsError('network', 'Cannot reach the node. Check that ipfs mcp is running and that this page may connect to it.')
      }
      check()
      if (res.ok) return res
      const failure = await errorFromResponse(res, session)
      check()
      if (session && failure.kind === 'unauthorized') markSessionExpired()
      throw failure
    } finally {
      unsubscribeOrigin()
      signal?.removeEventListener('abort', abort)
    }
  }

  /** @param {Response} res */
  async function json (res) {
    try {
      if (!getOriginPolicy().allowsAgent()) throw new SettingsError('unavailable', 'The page origin is no longer current.')
      const body = await res.json()
      if (!getOriginPolicy().allowsAgent()) throw new SettingsError('unavailable', 'The page origin is no longer current.')
      return body
    } catch (error) {
      if (error instanceof SettingsError) throw error
      throw new SettingsError('protocol', 'The node answered with something that is not JSON.')
    }
  }

  /**
   * @template T
   * @param {() => Promise<T>} op
   * @returns {Promise<T>}
   */
  async function recording (op) {
    try {
      const result = await op()
      applied = { at: new Date(now()).toISOString(), ok: true }
      return result
    } catch (e) {
      applied = { at: new Date(now()).toISOString(), ok: false, error: e instanceof SettingsError ? e.message : 'The change did not apply.' }
      throw e
    }
  }

  /** @param {Response} res */
  async function readSettings (res) {
    const shape = readShape(await json(res), res.headers.get('etag') ?? undefined)
    lastRevision = shape.revision
    return shape
  }

  return {
    async get () {
      return readSettings(await request('GET', ROUTES.settings))
    },

    set (req) {
      const { revision, ...rest } = req
      return recording(async () => readSettings(await request('PUT', ROUTES.settings, { body: rest, ifMatch: revision })))
    },

    async testConnection (req) {
      const started = now()
      const res = await request('POST', ROUTES.testConnection, { body: { base_url: req.base_url, ...(req.kind && { kind: req.kind }) } })
      const body = await json(res)
      const latency = Math.max(0, now() - started)
      if (!isObject(body) || body.ok !== true) {
        const detail = isObject(body) && typeof body.detail === 'string' && body.detail !== '' ? body.detail.slice(0, 2000) : undefined
        return { ok: false, ...(detail && { detail }), latency_ms: latency }
      }
      /** @type {import('./types.js').TestConnectionResult} */
      const result = { ok: true, latency_ms: latency, key_sent: body.key_sent === true }
      try {
        const list = await json(await request('GET', ROUTES.models, { query: { base_url: req.base_url, ...(req.kind && { kind: req.kind }) } }))
        if (isObject(list) && Array.isArray(list.models)) {
          result.models = list.models.flatMap((/** @type {any} */ m) => (isObject(m) && typeof m.id === 'string' && m.id !== '' ? [m.id] : []))
        }
      } catch (e) {
        // The probe passed. A backend that hides its list leaves the model field free text; a
        // lost session is still reported, because the next request would fail the same way.
        if (e instanceof SettingsError && (e.kind === 'unauthorized' || e.kind === 'route_absent')) throw e
      }
      return result
    },

    setApiKey (req) {
      return recording(async () => {
        const shape = await readSettings(await request('PUT', ROUTES.settings, {
          body: { backend: { api_key: req.api_key, ...(req.kind && { kind: req.kind }) } },
          ifMatch: req.revision
        }))
        // With no backend yet the read shape has nowhere to report the key; the write itself is the proof.
        return { revision: shape.revision, api_key: shape.backend?.api_key?.set ? shape.backend.api_key : { set: true, source: /** @type {const} */ ('settings_api') } }
      })
    },

    clearApiKey (req) {
      return recording(async () => {
        const shape = await readSettings(await request('PUT', ROUTES.settings, {
          body: { backend: { api_key: null, ...(req.kind && { kind: req.kind }) } },
          ifMatch: req.revision
        }))
        return { revision: shape.revision, api_key: { set: /** @type {const} */ (false) } }
      })
    },

    async status () {
      return { transport: 'http', managed_by_desktop: false, ...(lastRevision && { revision: lastRevision }), ...(applied && { applied }) }
    },

    onChange (cb) {
      const controller = new AbortController()
      const state = { closed: false }
      const origin = getOriginPolicy()
      let unsubscribeOrigin = () => {}
      const stop = () => { state.closed = true; controller.abort(); unsubscribeOrigin?.() }
      unsubscribeOrigin = origin.subscribe(() => { if (!origin.allowsAgent()) stop() })
      const loop = async () => {
        let delay = RECONNECT_MIN_MS
        while (!state.closed) {
          try {
            const res = await request('GET', ROUTES.events, { signal: controller.signal, accept: 'text/event-stream' })
            if (!res.body) throw new SettingsError('protocol', 'The change stream has no body.')
            delay = RECONNECT_MIN_MS
            await readSse(/** @type {any} */ (res.body), (data) => {
              if (state.closed || !origin.allowsAgent()) { stop(); return }
              const event = parseEvent(data)
              if (event) cb(event)
            }, controller.signal)
          } catch (e) {
            if (state.closed) return
            // A lost session or an absent route will not heal by retrying; the page shows it on its next request.
            if (e instanceof SettingsError && (e.kind === 'unauthorized' || e.kind === 'route_absent' || e.kind === 'not_configured')) { stop(); return }
          }
          if (state.closed) return
          await sleep(delay)
          delay = Math.min(delay * 2, RECONNECT_MAX_MS)
        }
      }
      if (origin.allowsAgent()) void loop()
      else stop()
      return stop
    }
  }
}

/** @param {string} data @returns {import('./types.js').SettingsChangedEvent | undefined} */
function parseEvent (data) {
  try {
    const v = JSON.parse(data)
    if (isObject(v) && v.type === 'settings_changed' && typeof v.revision === 'string' && v.revision !== '') {
      return { type: 'settings_changed', revision: v.revision }
    }
  } catch (_) {
    // A malformed event is dropped.
  }
  return undefined
}

/**
 * @param {Response} res
 * @param {boolean} [session] session mode: a 403 with no contract code is the node saying this account has no admin principal
 */
async function errorFromResponse (res, session = false) {
  if (res.status === 401) return new SettingsError('unauthorized', 'The admin token was refused.', { status: 401 })
  if (res.status === 404) return new SettingsError('route_absent', 'This node has no agent settings.', { status: 404 })
  let text = ''
  try {
    text = await res.text()
  } catch (_) {
    text = ''
  }
  try {
    const body = JSON.parse(text)
    const e = isObject(body) && isObject(body.error) ? body.error : undefined
    if (e && isServerErrorCode(e.code)) {
      return new SettingsError(e.code, typeof e.message === 'string' ? e.message : e.code, {
        status: res.status,
        details: isObject(e.details) ? /** @type {Record<string, unknown>} */ (e.details) : undefined
      })
    }
  } catch (_) {
    // Not the JSON error shape: a plain-text answer from the server.
  }
  if (session && res.status === 403) return new SettingsError('forbidden', 'This account may not change agent settings.', { status: 403 })
  return new SettingsError('http', `The node answered ${res.status}.`, { status: res.status, detail: text.trim() })
}

/** @param {number} ms */
function defaultSleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
