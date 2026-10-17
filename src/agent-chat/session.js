// Console session mode (kubo ADR-0013, change console-session-auth).
//
// When the Web UI is served from a console whose ingress holds the sign-in as a cookie, the
// ingress forwards a short-lived ID token to `ipfs mcp`, and `GET /auth/session` on the page's
// own origin reports who is signed in. That 200 is the only thing that switches this mode on.
// Every other answer (404 on a loopback node or Desktop, 401, 403, a redirect, a network error,
// an unexpected body) leaves the token behaviour exactly as it was: nothing here runs again.
//
// In session mode the page holds no credential. The report carries no token and no `sub`, and
// this module keeps only the fields it displays: the principal names and kinds, the email for
// "Signed in as", the expiry and the admin step-up state. Nothing here reads or writes storage,
// logs, or puts a value in a URL.
//
// This module imports nothing from the settings stores, so they can ask `isSessionMode()`.

export const SESSION_PATH = '/auth/session'
export const LOGOUT_PATH = '/oauth2/logout'
export const AGUI_PATH = '/agui'

const PROBE_TIMEOUT_MS = 4000
/** How often a session-mode page re-checks that its sign-in is still good. */
export const REVALIDATE_MS = 5 * 60 * 1000

const KINDS = Object.freeze(['human-mcp', 'ui', 'admin'])
const ADMIN_STATES = Object.freeze(['ok', 'step_up_required', 'not_eligible'])

/**
 * @typedef {{ name: string, kind: 'human-mcp' | 'ui' | 'admin' }} SessionPrincipal
 * @typedef {{ principals: readonly SessionPrincipal[], email?: string, exp: number, admin: 'ok' | 'step_up_required' | 'not_eligible' }} SessionReport
 * @typedef {{ report: SessionReport, expired: boolean }} SessionState
 */

/** @type {SessionState | undefined} */
let state
/** @type {Set<() => void>} */
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn())

/** @param {unknown} v @returns {v is Record<string, any>} */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Read a `/auth/session` body field by field. Anything unexpected makes the whole body unusable
 * (and so the page stays out of session mode); fields the page does not need are dropped.
 *
 * @param {unknown} raw
 * @returns {SessionReport | undefined}
 */
export function readReport (raw) {
  if (!isObject(raw)) return undefined
  if (!Array.isArray(raw.principals) || raw.principals.length === 0) return undefined
  /** @type {SessionPrincipal[]} */
  const principals = []
  for (const p of raw.principals) {
    if (!isObject(p) || typeof p.name !== 'string' || p.name === '' || !KINDS.includes(p.kind)) return undefined
    principals.push(Object.freeze({ name: p.name, kind: p.kind }))
  }
  if (!Number.isInteger(raw.exp) || raw.exp < 0) return undefined
  if (!ADMIN_STATES.includes(raw.admin)) return undefined
  /** @type {SessionReport} */
  const report = {
    principals: Object.freeze(principals),
    exp: raw.exp,
    admin: raw.admin,
    ...(typeof raw.email === 'string' && raw.email !== '' && { email: raw.email.slice(0, 320) })
  }
  return Object.freeze(report)
}

/**
 * Ask the page's own origin whether a console session is in effect.
 *
 *   report     200 with a usable body: session mode
 *   'expired'  401: only meaningful to a page already in session mode
 *   undefined  anything else
 *
 * @param {{ fetch?: typeof fetch, location?: { origin: string, protocol: string }, timeoutMs?: number }} [seams] test seams
 * @returns {Promise<SessionReport | 'expired' | undefined>}
 */
export async function probeSession (seams = {}) {
  const { fetch: fetchImpl, location = globalThis.location, timeoutMs = PROBE_TIMEOUT_MS } = seams
  const doFetch = fetchImpl ?? globalThis.fetch?.bind(globalThis)
  if (!doFetch || !location || (location.protocol !== 'https:' && location.protocol !== 'http:')) return undefined
  const controller = typeof AbortController === 'undefined' ? undefined : new AbortController()
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined
  try {
    const res = await doFetch(new URL(SESSION_PATH, location.origin).href, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
      // A redirect to the issuer is not a session report: it is surfaced as an opaque answer, not followed.
      redirect: 'manual',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      ...(controller && { signal: controller.signal })
    })
    if (res.status === 401) return 'expired'
    if (res.status !== 200) return undefined
    return readReport(await res.json())
  } catch (_) {
    return undefined
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}

/** Whether this page is in session mode. */
export const isSessionMode = () => state !== undefined

/** @returns {SessionState | undefined} */
export const getSession = () => state

/** The chat endpoint in session mode: the page's own origin, never a stored address. */
export function getSessionEndpoint (location = globalThis.location) {
  return new URL(AGUI_PATH, location.origin).href
}

/** @param {SessionReport} report */
export function enterSession (report) {
  state = Object.freeze({ report, expired: false })
  emit()
}

/** The ingress or the node refused the sign-in: offer "Sign in again". No-op outside session mode. */
export function markSessionExpired () {
  if (!state || state.expired) return
  state = Object.freeze({ ...state, expired: true })
  emit()
}

/**
 * Re-check the sign-in. A fresh report replaces the old one (so the admin step-up state follows a
 * second-factor sign-in); a 401 marks the session expired; anything else changes nothing.
 *
 * @param {Parameters<typeof probeSession>[0]} [seams]
 */
export async function revalidateSession (seams) {
  if (!state) return
  const answer = await probeSession(seams)
  if (answer === 'expired') markSessionExpired()
  else if (answer !== undefined && state) {
    state = Object.freeze({ report: answer, expired: false })
    emit()
  }
}

/**
 * "Sign in again": a top-level navigation to the current page, so the ingress can redirect to the
 * issuer. The app is hash-routed, so assigning the page's own URL back would be a fragment change that
 * sends nothing; a reload is the navigation that does. No stored credential is retried.
 *
 * @param {{ reload: () => void }} [location]
 */
export function signInAgain (location = globalThis.location) {
  location.reload()
}

/**
 * Sign out of this console. The Kratos session on know-me.tools survives; the UI says so.
 *
 * @param {{ assign: (url: string) => void }} [location]
 */
export function signOut (location = globalThis.location) {
  location.assign(LOGOUT_PATH)
}

/** @param {() => void} fn */
export function subscribeSession (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Test seam. */
export function resetSessionForTests () {
  state = undefined
  emit()
}
