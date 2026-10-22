// The admin bearer for the settings route. It is a different credential from the
// chat token (the ui principal's): the admin principal can change the model
// backend, so it is held tighter. It lives in memory and is bound to the one
// settings root it was entered for: asked for any other root it is not handed
// out, and a change of the chat endpoint forgets it. A person may opt in to
// keeping it for this tab with sessionStorage, which is shared by every page of
// the origin, which a reload keeps and closing the tab clears. It is never written to
// localStorage, a URL, a cookie, an attribute or a log line, and nothing outside
// this module reads the storage key.

import { isSessionMode } from '../../../agent-chat/session.js'

export const ADMIN_TOKEN_SESSION_KEY = 'ipfs-webui:agent-settings:admin-token:v2'
// The first version stored the bare token with no root. It is removed, never read.
const LEGACY_SESSION_KEY = 'ipfs-webui:agent-settings:admin-token:v1'

/** @type {Set<() => void>} */
const listeners = new Set()
/** @type {{ token: string, root: string } | undefined} */
let held = readSession()
let remembered = held !== undefined
/** Bumps on every change, so a consumer can tell "a different token" without reading it. */
let version = 0

function readSession () {
  try {
    globalThis.sessionStorage?.removeItem(LEGACY_SESSION_KEY)
    const raw = globalThis.sessionStorage?.getItem(ADMIN_TOKEN_SESSION_KEY)
    if (typeof raw !== 'string' || raw === '') return undefined
    const v = JSON.parse(raw)
    return v && typeof v.token === 'string' && v.token !== '' && typeof v.root === 'string' && v.root !== '' ? { token: v.token, root: v.root } : undefined
  } catch (_) {
    return undefined
  }
}

/** @param {{ token: string, root: string } | undefined} value */
function writeSession (value) {
  try {
    if (value === undefined) globalThis.sessionStorage?.removeItem(ADMIN_TOKEN_SESSION_KEY)
    else globalThis.sessionStorage?.setItem(ADMIN_TOKEN_SESSION_KEY, JSON.stringify(value))
  } catch (_) {
    // Storage may be blocked; the token then lasts for this page only.
  }
}

const emit = () => listeners.forEach((fn) => fn())

/**
 * The token, only for the root it was entered for.
 * @param {string | undefined} root the settings root the request goes to
 */
export const getAdminToken = (root) => (held !== undefined && root !== undefined && held.root === root ? held.token : undefined)
/** The root the held token is bound to, never the token. */
export const getAdminTokenRoot = () => held?.root
export const isAdminTokenRemembered = () => remembered
export const getAdminTokenVersion = () => version

/**
 * @param {string | undefined} value
 * @param {{ remember?: boolean, root?: string }} options root is required to hold a token; remember keeps it for this tab (sessionStorage)
 */
export function setAdminToken (value, { remember = false, root } = {}) {
  // In session mode the cookie session is the credential: no admin token is held or kept.
  if (isSessionMode()) value = undefined
  held = typeof value === 'string' && value !== '' && typeof root === 'string' && root !== '' ? { token: value, root } : undefined
  remembered = held !== undefined && remember
  version += 1
  writeSession(remembered ? held : undefined)
  emit()
}

/**
 * Keep the token in the held token's tab (or stop keeping it) without handing it out.
 * @param {boolean} remember
 */
export function setAdminTokenRemembered (remember) {
  if (held === undefined || isSessionMode()) return
  remembered = remember
  version += 1
  writeSession(remember ? held : undefined)
  emit()
}

export const forgetAdminToken = () => setAdminToken(undefined)

/**
 * Forget the token when the root it is bound to is not the root now in use.
 * @param {string | undefined} root
 */
export function forgetAdminTokenUnless (root) {
  if (held !== undefined && held.root !== root) forgetAdminToken()
}

/** @param {() => void} fn */
export function subscribeAdminToken (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Test seam: drop what is held in memory and re-read the session, as a reload does. */
export function resetAdminTokenForTests () {
  held = readSession()
  remembered = held !== undefined
  version += 1
  emit()
}
