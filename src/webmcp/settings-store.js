// Settings for WebMCP tools. `enabled` is ON by default (the fork's agent features ship
// enabled, AGENTS.md User Agency) but only registers the READ tools, and only in a browser
// that has WebMCP. `dnslink` and `writes` are off by default.
//
// A stored `enabled: false` is the person's choice and always wins; only an absent key takes
// the default (decision D18, see ../agent-chat/boot.js).
//
//   enabled  register the read tools with document.modelContext
//   dnslink  let read tools resolve DNSLink names (domains). IPNS names that are libp2p
//            keys resolve without it
//   writes   also register the tools that change the node; each call asks the person first
//
// `enabled` and `dnslink` are kept in localStorage for this origin. `writes` is NOT: it
// lasts for this page load only and is off after every reload. Same-origin content (a
// path gateway serves many sites on one origin) can write localStorage, and a stored
// "writes on" would let it switch writes on before the person looked (security R13 L3).
// `writes` and `dnslink` only count while `enabled` is on, and turning `enabled` off turns
// both off, so switching the feature on again never brings them back silently.

export const STORAGE_KEY = 'ipfs-webui:webmcp'

/** @typedef {{ enabled: boolean, dnslink: boolean, writes: boolean }} WebMcpSettings */

/** @type {WebMcpSettings} */
export const DEFAULTS = Object.freeze({ enabled: true, dnslink: false, writes: false })

/** @type {Set<() => void>} */
const listeners = new Set()

/** @returns {WebMcpSettings} */
function read () {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    const enabled = typeof parsed?.enabled === 'boolean' ? parsed.enabled : DEFAULTS.enabled
    return Object.freeze({ enabled, dnslink: enabled && parsed?.dnslink === true, writes: false })
  } catch (_) {
    return DEFAULTS
  }
}

let snapshot = read()

/** @returns {WebMcpSettings} */
export function getSettings () {
  return snapshot
}

/** @param {Partial<WebMcpSettings>} patch */
export function updateSettings (patch) {
  const enabled = (patch.enabled ?? snapshot.enabled) === true
  const next = Object.freeze({
    enabled,
    dnslink: enabled && (patch.dnslink ?? snapshot.dnslink) === true,
    writes: enabled && (patch.writes ?? snapshot.writes) === true
  })
  snapshot = next
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify({ enabled: next.enabled, dnslink: next.dnslink }))
  } catch (_) {
    // Storage may be blocked; the settings then last for this page only.
  }
  listeners.forEach((fn) => fn())
}

/** @param {() => void} fn */
export function subscribe (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Re-read storage into memory, as a reload does (boot calls it after the migration). */
export function reload () {
  snapshot = read()
  listeners.forEach((fn) => fn())
}

/** Test seam. */
export const resetForTests = reload
