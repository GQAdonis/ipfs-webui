// Settings for WebMCP tools. All off by default.
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
const DEFAULTS = Object.freeze({ enabled: false, dnslink: false, writes: false })

/** @type {Set<() => void>} */
const listeners = new Set()

/** @returns {WebMcpSettings} */
function read () {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    const enabled = parsed?.enabled === true
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

/** Test seam: drop what is held in memory and re-read storage, as a reload does. */
export function resetForTests () {
  snapshot = read()
  listeners.forEach((fn) => fn())
}
