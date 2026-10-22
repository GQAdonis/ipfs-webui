import { CID } from 'multiformats/basics'

/** @param {string} reason */
const blocked = reason => Object.freeze({ allowed: false, kind: reason })
/** @param {string} kind */
const permitted = kind => Object.freeze({ allowed: true, kind })

/** Decode only for classification; never rewrite a gateway/content/navigation URL. */
/** @param {string | undefined} pathname */
function pathSegments (pathname) {
  if (typeof pathname !== 'string') return undefined
  let path = pathname
  for (let pass = 0; pass < 4; pass++) {
    let decoded
    try { decoded = decodeURIComponent(path) } catch { return undefined }
    if (decoded === path) return path.replaceAll('\\', '/').split('/')
    path = decoded
  }
  return undefined // Ambiguous deeper escaping cannot establish an isolated agent page.
}
/** @param {string} pathname */
export function hasContentPath (pathname) {
  const segments = pathSegments(pathname)
  return !segments || segments.some(part => /^(ipfs|ipns)$/i.test(part))
}
/** @param {string} hostname */
function isolatedSubdomain (hostname) {
  const labels = hostname.toLowerCase().split('.')
  if (labels.length < 3 || !['ipfs', 'ipns'].includes(labels[1]) || !labels.slice(2).every(label => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return false
  try {
    const cid = CID.parse(labels[0])
    return labels[1] === 'ipfs' ? cid.version === 1 : cid.code === 0x72
  } catch { return false }
}
/** @param {string} hostname */
function loopback (hostname) {
  return ['localhost', '[::1]'].includes(hostname) || /^127(?:\.\d{1,3}){3}$/.test(hostname)
}

/** Structural origin isolation is a necessary frontend guard, never authentication or permission.
 * consoleConfigured/desktopHosted come only from existing host/session ingress in origin-policy,
 * never a saved endpoint/gateway, DOM attribute, URL parameter or caller-supplied page flag. */
/** @param {{href?: string, consoleConfigured?: boolean, desktopHosted?: boolean}} [options] */
export function classifyAgentOrigin ({ href, consoleConfigured = false, desktopHosted = false } = {}) {
  let url
  try { url = new URL(href ?? '') } catch { return blocked('unavailable') }
  if (url.username || url.password) return blocked('unavailable')
  if (url.protocol === 'file:') return desktopHosted ? permitted('desktop') : blocked('unavailable')
  if (!['http:', 'https:'].includes(url.protocol)) return blocked('unavailable')
  // Per-content CID/PeerID origins isolate even a content directory named ipfs or ipns.
  if (isolatedSubdomain(url.hostname) && (url.protocol === 'https:' || url.hostname.endsWith('.localhost'))) return permitted('isolated-subdomain')
  // A local address or successful session cannot make a shared content origin isolated.
  if (hasContentPath(url.pathname)) return blocked('shared-gateway')
  if (loopback(url.hostname)) return permitted('local')
  if (url.protocol === 'https:' && consoleConfigured) return permitted('configured-console')
  return blocked('unconfigured-origin')
}

/** An unknown dedicated HTTPS page may discover its existing same-origin console session.
 * Shared gateway paths cannot bootstrap trust by asking that origin for a report. */
/** @param {string} href */
export function mayProbeConsole (href) {
  let url
  try { url = new URL(href ?? '') } catch { return false }
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password &&
    (!hasContentPath(url.pathname) || isolatedSubdomain(url.hostname))
}
