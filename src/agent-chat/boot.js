// Default-on migration for the agent features (decision D18). Runs once at app boot,
// before the first render.
//
// The fork ships the agent chat and the WebMCP read tools enabled. A profile that already
// holds a settings object without an `enabled` key (it never chose) gets `enabled: true`
// written in, so the stored shape matches the shipped default. A stored `enabled: false`,
// or any stored boolean, is the person's own choice and is never touched, and nothing else
// in the stored object changes. A profile with nothing stored needs no write: the stores
// fall back to the default for an absent key. WebMCP `writes` is per page load and is never
// stored, so no migration can switch it on.

import { STORAGE_KEY as CHAT_KEY, reload as reloadChat } from './settings-store.js'
import { STORAGE_KEY as WEBMCP_KEY, reload as reloadWebMcp } from '../webmcp/settings-store.js'

/**
 * @param {string} key
 * @returns {boolean} whether a value was written
 */
function fillAbsentEnabled (key) {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return false
    if (typeof parsed.enabled === 'boolean') return false
    globalThis.localStorage.setItem(key, JSON.stringify({ ...parsed, enabled: true }))
    return true
  } catch (_) {
    // Blocked or unreadable storage: the stores' own defaults apply for this page.
    return false
  }
}

/** Fill absent `enabled` keys only, then have both stores re-read storage. */
export function migrateAgentDefaults () {
  const wrote = [fillAbsentEnabled(CHAT_KEY), fillAbsentEnabled(WEBMCP_KEY)]
  reloadChat()
  reloadWebMcp()
  return wrote
}
