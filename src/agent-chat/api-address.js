// Whether a saved Web UI API address carries a credential. Pure, so the API-address bundle and the
// session boot can share it (console-session-auth 3.2).

/** @param {unknown} value */
function stringHasUserinfo (value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.username !== '' || url.password !== ''
  } catch (_) {
    return false
  }
}

/**
 * Whether a saved API address carries a credential: userinfo in a URL string, or in the `url` of a
 * client options object, or any Authorization header in its `headers` (what the Web UI stores when
 * the person typed `https://user:pass@host`).
 *
 * @param {string} raw the stored text
 */
export function apiAddressHasCredential (raw) {
  /** @type {unknown} */
  let value = raw
  try {
    value = JSON.parse(raw)
  } catch (_) {
    // A bare string such as a multiaddr or a URL.
  }
  if (typeof value === 'string') return stringHasUserinfo(value)
  if (value === null || typeof value !== 'object') return false
  const options = /** @type {Record<string, any>} */ (value)
  if (stringHasUserinfo(options.url)) return true
  const headers = options.headers
  return headers !== null && typeof headers === 'object' && Object.keys(headers).some((name) => name.toLowerCase() === 'authorization')
}
