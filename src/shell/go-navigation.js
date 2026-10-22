import { isValidIpfsPath, normalizeToPath } from '../lib/ipfs-path.js'

const ROUTES = Object.freeze({ '/': '/', '/home': '/', '/files': '/files', '/pins': '/pins', '/explore': '/explore', '/peers': '/peers', '/activity': '/activity', '/status': '/status', '/settings': '/settings', '/diagnostics': '/diagnostics' })
export function submitGo (text, { ipfsReady, navigate, browse }, lifetime) {
  if (!lifetime.isCurrent()) return { accepted: false }
  const route = ROUTES[text.trim().toLowerCase()]
  if (route) { navigate(route); return { accepted: true } }
  if (!ipfsReady || !isValidIpfsPath(text) || !lifetime.isCurrent()) return { accepted: false }
  browse({ path: normalizeToPath(text) })
  return { accepted: true }
}
