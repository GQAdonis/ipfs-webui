import { createServer } from 'node:http'
import { lstat, readFile, realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve } from 'node:path'
import { Blocked } from './processes.mjs'

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon' }
/** Exact static bytes only, no proxy/auth response/transform or development runtime. */
export async function serveStatic ({ directory, port = 0 }) {
  const root = await realpath(directory)
  if (!Number.isInteger(port) || port < 0 || port > 65535 || (port && (port < 1024 || [3000, 3001, 4001, 5001, 8080].includes(port)))) throw new Blocked('Dedicated production hosting needs an explicit non-default loopback port')
  const server = createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return }
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
      if (pathname.includes('\\') || pathname.includes('\0')) throw new Error('invalid path')
      const path = resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname))
      const rel = relative(root, path)
      if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('outside static root')
      const physical = relative(root, await realpath(path)), stat = await lstat(path)
      if (physical.startsWith('..') || isAbsolute(physical) || stat.isSymbolicLink() || !stat.isFile()) throw new Error('invalid static input')
      const body = await readFile(path), suffix = path.slice(path.lastIndexOf('.'))
      response.writeHead(200, { 'Content-Type': types[suffix] || 'application/octet-stream', 'Content-Length': body.length, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' })
      response.end(request.method === 'HEAD' ? undefined : body)
    } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found') }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  const baseURL = `http://127.0.0.1:${server.address().port}/`
  return { directory: root, baseURL, close: () => new Promise((resolve, reject) => { server.closeAllConnections(); server.close(error => error ? reject(error) : resolve()) }) }
}
