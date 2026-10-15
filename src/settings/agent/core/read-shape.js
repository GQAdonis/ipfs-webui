// Reads the server's read shape (settings-read.schema.json) defensively. Only
// known fields are copied, so an unexpected field can never reach the UI state,
// and a malformed answer is a protocol error instead of a half-rendered page.

import { SettingsError } from './errors.js'

/** @param {unknown} v */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * @param {unknown} json
 * @param {string} [etag] the ETag response header, used when the body has no revision
 * @returns {import('./types.js').GetResponse}
 */
export function readShape (json, etag) {
  if (!isObject(json)) throw new SettingsError('protocol', 'The node answered with something that is not settings.')
  const o = /** @type {Record<string, any>} */ (json)
  const revision = typeof o.revision === 'string' && o.revision !== '' ? o.revision : unquote(etag)
  if (!revision || revision.length > 256) throw new SettingsError('protocol', 'The settings carry no revision.')
  const sp = isObject(o.system_prompt) ? o.system_prompt : {}
  const knc = o.key_not_carried
  return {
    revision,
    backend: readBackend(o.backend),
    system_prompt: {
      safety_prefix: typeof sp.safety_prefix === 'string' ? sp.safety_prefix : '',
      custom: typeof sp.custom === 'string' ? sp.custom : ''
    },
    // ADR-0012: a write that moved the backend host without a new key says so, once.
    ...(isObject(knc) && knc.reason === 'host_changed' ? { key_not_carried: { reason: /** @type {const} */ ('host_changed'), cleared: knc.cleared === true } } : {})
  }
}

/** @param {unknown} b @returns {import('./types.js').BackendRead | null} */
function readBackend (b) {
  if (!isObject(b)) return null
  const o = /** @type {Record<string, any>} */ (b)
  if (o.kind !== 'openai' && o.kind !== 'uar') return null
  /** @type {import('./types.js').BackendRead} */
  const out = { kind: o.kind }
  if (typeof o.base_url === 'string') out.base_url = o.base_url
  if (typeof o.model === 'string') out.model = o.model
  if (isObject(o.api_key) && typeof o.api_key.set === 'boolean') {
    const src = o.api_key.source
    out.api_key = o.api_key.set
      ? { set: true, source: src === 'settings_api' || src === 'environment' || src === 'file' ? src : 'settings_api' }
      : { set: false }
  }
  return out
}

/** @param {string | null | undefined} etag */
function unquote (etag) {
  return typeof etag === 'string' ? etag.replace(/^W\//, '').replace(/^"|"$/g, '') : undefined
}
