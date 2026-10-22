export const PRESENTATION_STORAGE_KEY = 'ipfs-webui:agent-presentation:v1'

const DEFAULTS = Object.freeze({ decisions: true, a2ui: true, contextReferences: true, runFacts: true })
const FIELDS = Object.freeze(Object.keys(DEFAULTS))

function browserStorage () {
  try { return globalThis.localStorage } catch (_) { return undefined }
}

function booleanFields (value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return {}
  const fields = {}
  for (const key of FIELDS) {
    // Preferences never evaluate caller accessors, inherited values or unrelated fields.
    const field = Object.getOwnPropertyDescriptor(value, key)
    if (field && 'value' in field && typeof field.value === 'boolean') fields[key] = field.value
  }
  return fields
}

/** Local presentation preferences only: never credentials, permissions or server configuration.
 * Construction reads the preference key; it installs no global listeners or feature subscriptions. */
export function createPresentationPolicy ({ storage = browserStorage() } = {}) {
  let saved = {}
  try { saved = booleanFields(JSON.parse(storage?.getItem(PRESENTATION_STORAGE_KEY) ?? 'null')) } catch (_) { /* Blocked/invalid storage uses defaults for this page. */ }
  let snapshot = Object.freeze({ ...DEFAULTS, ...saved })
  const listeners = new Set()
  return Object.freeze({
    getSnapshot: () => snapshot,
    subscribe (listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    update (patch) {
      const fields = booleanFields(patch)
      if (!FIELDS.some(key => Object.hasOwn(fields, key) && fields[key] !== snapshot[key])) return snapshot
      snapshot = Object.freeze({ ...snapshot, ...fields })
      try { storage?.setItem(PRESENTATION_STORAGE_KEY, JSON.stringify(snapshot)) } catch (_) { /* Denied/quota-limited storage keeps the new page-local preference. */ }
      for (const listener of [...listeners]) listener()
      return snapshot
    }
  })
}

let singleton
/** Importing this module performs no storage access; the application opts in by requesting it. */
export function getPresentationPolicy () {
  singleton ??= createPresentationPolicy()
  return singleton
}
