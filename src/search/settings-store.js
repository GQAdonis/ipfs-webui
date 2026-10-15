// The Web UI setting `search.enabled`: the off switch of the Search page. It is
// not secret and not a credential, so it lives in localStorage like the other
// Web UI preferences, under its own key. On by default, but it only has effect
// when the node's `ipfs mcp` reports a configured index (availability-store.js).
// A stored `false` is the person's choice and always wins; only an absent key
// takes the default. While it is off nothing under /index/* is requested.

export const STORAGE_KEY = 'ipfs-webui:search'

/** @typedef {{ enabled: boolean }} SearchSettings */

/** @type {SearchSettings} */
export const DEFAULTS = Object.freeze({ enabled: true })

/** @type {Set<() => void>} */
const listeners = new Set()

/** @returns {SearchSettings} */
function read () {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    return Object.freeze({ enabled: typeof parsed?.enabled === 'boolean' ? parsed.enabled : DEFAULTS.enabled })
  } catch (_) {
    return DEFAULTS
  }
}

let snapshot = read()

export function getSettings () {
  return snapshot
}

/** @param {Partial<SearchSettings>} patch */
export function updateSettings (patch) {
  snapshot = Object.freeze({ ...snapshot, ...patch })
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch (_) {
    // Storage may be blocked; the setting then lasts for this page only.
  }
  listeners.forEach((fn) => fn())
}

/** @param {() => void} fn */
export function subscribe (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Test seam: re-read storage, as a reload does. */
export function resetForTests () {
  snapshot = read()
  listeners.forEach((fn) => fn())
}
