// URL rules shared by the form, the clients and the tests. They mirror the
// contract: a backend candidate is https, or http on a loopback host
// (test-connection.schema.json), with no credentials, query or fragment.

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * @param {string} input
 * @returns {{ ok: true, value: string } | { ok: false, reason: 'empty' | 'invalid' | 'scheme' | 'extras' }}
 */
export function validateBackendUrl (input) {
  const text = typeof input === 'string' ? input.trim() : ''
  if (text === '') return { ok: false, reason: 'empty' }
  if (/\s/.test(text) || text.length > 2048) return { ok: false, reason: 'invalid' }
  let url
  try {
    url = new URL(text)
  } catch (_) {
    return { ok: false, reason: 'invalid' }
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { ok: false, reason: 'scheme' }
  if (url.protocol === 'http:' && !LOOPBACK_HOSTS.has(url.hostname)) return { ok: false, reason: 'scheme' }
  if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') return { ok: false, reason: 'extras' }
  return { ok: true, value: text }
}

/**
 * The host (with a non-default port) the way the server compares egress hosts.
 * Empty when the input is not a URL.
 *
 * @param {string} input
 */
export function hostOf (input) {
  try {
    return new URL(input).host.toLowerCase()
  } catch (_) {
    return ''
  }
}

/**
 * The settings API root for a chat endpoint: the same listener, so the `/agui`
 * suffix is dropped and the route paths are added by the client. No default:
 * an endpoint that is not an https or loopback `/agui` URL gives nothing.
 *
 * @param {string} endpoint
 * @returns {string | undefined}
 */
export function settingsRootFromEndpoint (endpoint) {
  let url
  try {
    url = new URL(endpoint)
  } catch (_) {
    return undefined
  }
  const loopback = url.protocol === 'http:' && (LOOPBACK_HOSTS.has(url.hostname) || /^127\.\d+\.\d+\.\d+$/.test(url.hostname))
  if (url.protocol !== 'https:' && !loopback) return undefined
  if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') return undefined
  if (!url.pathname.endsWith('/agui')) return undefined
  return `${url.origin}${url.pathname.slice(0, -'/agui'.length)}`
}
