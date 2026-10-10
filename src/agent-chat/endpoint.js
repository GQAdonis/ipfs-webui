const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * The same rules the island applies to its `endpoint` attribute, so Settings can
 * refuse a bad value without loading the island: https, or http on a loopback host;
 * the path ends in /agui; no credentials, query or fragment. There is no default.
 *
 * @param {string} input
 * @returns {{ ok: true, value: string } | { ok: false, reason: 'empty' | 'invalid' | 'scheme' | 'path' | 'extras' }}
 */
export function validateEndpoint (input) {
  const text = typeof input === 'string' ? input.trim() : ''
  if (text === '') return { ok: false, reason: 'empty' }
  let url
  try {
    url = new URL(text)
  } catch (_) {
    return { ok: false, reason: 'invalid' }
  }
  const isLoopback = url.protocol === 'http:' && (LOOPBACK_HOSTS.has(url.hostname) || /^127\.\d+\.\d+\.\d+$/.test(url.hostname))
  if (url.protocol !== 'https:' && !isLoopback) return { ok: false, reason: 'scheme' }
  if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') return { ok: false, reason: 'extras' }
  if (!url.pathname.endsWith('/agui')) return { ok: false, reason: 'path' }
  return { ok: true, value: url.href }
}
