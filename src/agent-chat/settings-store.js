// Settings for the agent chat. Not secret: the switch and the endpoint, kept in
// localStorage like the Web UI's other preferences. The token is secret: by operator
// decision (2026-10-10) it is saved in localStorage in this browser profile, under its
// own key, apart from the settings. It is never part of the settings object, a URL,
// an attribute or a log line. Switching the chat off, or "Forget token", removes it.
// If storage is blocked the token lasts for the page only. The switch is ON and the
// endpoint empty by default (the fork's agent features ship enabled, AGENTS.md User
// Agency); the launcher still shows nothing until a valid /agui endpoint exists. A stored
// `enabled: false` is the person's choice and always wins: only an absent key takes the
// default (see boot.js, decision D18).

export const STORAGE_KEY = 'ipfs-webui:agent-chat'
export const TOKEN_STORAGE_KEY = 'ipfs-webui:agent-chat:token'

/** @typedef {{ enabled: boolean, endpoint: string }} AgentChatSettings */

/** @type {AgentChatSettings} */
export const DEFAULTS = Object.freeze({ enabled: true, endpoint: '' })

/** @type {Set<() => void>} */
const listeners = new Set()
/** @type {string | undefined} */
let token

function readToken () {
  try {
    const raw = globalThis.localStorage?.getItem(TOKEN_STORAGE_KEY)
    return typeof raw === 'string' && raw !== '' ? raw : undefined
  } catch (_) {
    return undefined
  }
}

function writeToken (value) {
  try {
    if (value === undefined) globalThis.localStorage?.removeItem(TOKEN_STORAGE_KEY)
    else globalThis.localStorage?.setItem(TOKEN_STORAGE_KEY, value)
  } catch (_) {
    // Storage may be blocked; the token then lasts for this page only.
  }
}

function read () {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    return Object.freeze({
      enabled: typeof parsed?.enabled === 'boolean' ? parsed.enabled : DEFAULTS.enabled,
      endpoint: typeof parsed?.endpoint === 'string' ? parsed.endpoint : ''
    })
  } catch (_) {
    return DEFAULTS
  }
}

let snapshot = read()
token = readToken()

function emit () {
  listeners.forEach((fn) => fn())
}

export function getSettings () {
  return snapshot
}

/** @param {Partial<AgentChatSettings>} patch */
export function updateSettings (patch) {
  const next = Object.freeze({ ...snapshot, ...patch })
  snapshot = next
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (_) {
    // Storage may be blocked; the settings then last for this page only.
  }
  if (!next.enabled) forgetToken()
  else emit()
}

export function getToken () {
  return token
}

/** @param {string | undefined} value */
export function setToken (value) {
  token = typeof value === 'string' && value !== '' ? value : undefined
  writeToken(token)
  emit()
}

/** Remove the token from memory and from storage. */
export function forgetToken () {
  setToken(undefined)
}

/** @param {() => void} fn */
export function subscribe (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Re-read storage into memory, as a reload does (boot calls it after the migration). */
export function reload () {
  token = readToken()
  snapshot = read()
  emit()
}

/** Test seam. */
export const resetForTests = reload
