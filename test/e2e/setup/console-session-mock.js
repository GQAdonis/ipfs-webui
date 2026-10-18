// A stand-in for the console's `ipfs mcp` (kubo ADR-0013), for the Web UI end-to-end tests and for the
// session-mode screenshots: Playwright route handlers answer `/auth/session`, `/agui`, `/agent/settings`
// and `/index/*` on the page's own origin, and pass `/api/v0` through to a real Kubo node. It implements
// none of the server's authorization and is not part of the product.

export const CHAT_KEY = 'ipfs-webui:agent-chat'
export const CHAT_TOKEN_KEY = 'ipfs-webui:agent-chat:token'
export const SEEDED_TOKEN = 'seeded-chat-token-0123456789abcdef'
export const SEEDED_PASSWORD = 'seeded-password-xyz789'
export const ORIGIN = 'http://127.0.0.1:3001'
export const REPORT = {
  principals: [{ name: 'console-ui', kind: 'ui' }, { name: 'operator', kind: 'admin' }],
  email: 'ada@know-me.tools',
  exp: Math.floor(Date.now() / 1000) + 900,
  admin: 'ok'
}
const SETTINGS = { revision: 'rev-1', backend: { kind: 'openai', base_url: 'http://127.0.0.1:4000/v1', model: 'qwen3:8b', api_key: { set: false } }, system_prompt: { safety_prefix: 'Safety text.', custom: '' } }
const RUN_EVENTS = [
  { type: 'RUN_STARTED', threadId: 't-1', runId: 'r-1' },
  { type: 'TEXT_MESSAGE_START', messageId: 'm-1', role: 'assistant' },
  { type: 'TEXT_MESSAGE_CONTENT', messageId: 'm-1', delta: 'You have one recursive pin, named wiki.' },
  { type: 'TEXT_MESSAGE_END', messageId: 'm-1' },
  { type: 'RUN_FINISHED', threadId: 't-1', runId: 'r-1', outcome: { type: 'success' } }
]
const STEP_UP = { error: { code: 'step_up_required', message: 'verify again' } }

const json = (route, status, body, headers = {}) => route.fulfill({ status, contentType: 'application/json', headers: { 'cache-control': 'no-store', ...headers }, body: body === undefined ? '' : JSON.stringify(body) })

/** The Kubo RPC origin the suite started, from its multiaddr. */
const rpcOrigin = () => {
  const m = /\/ip4\/([^/]+)\/tcp\/(\d+)/.exec(process.env.IPFS_RPC_ADDR ?? '')
  return m ? `http://${m[1]}:${m[2]}` : process.env.IPFS_RPC_ADDR
}

/**
 * Play the console. `session` is what `/auth/session` answers; `settings` and `agui` pick the answers of
 * those routes. Returns the list of requests the page made to the five route families, with the headers
 * the browser actually sent (cookies included).
 */
export async function installConsole (page, { session = 200, report = REPORT, settings = 'ok', agui = 'ok', index = 'ok', api = 'ok' } = {}) {
  const calls = []
  const family = (p) => (p === '/auth/session' ? 'session' : p === '/agui' ? 'agui' : p === '/agent/settings' || p.startsWith('/agent/settings/') ? 'settings' : p.startsWith('/index/') ? 'index' : p.startsWith('/api/v0/') ? 'api' : undefined)
  page.on('request', async (request) => {
    const url = new URL(request.url())
    if (url.origin !== ORIGIN) return
    const f = family(url.pathname)
    if (f) calls.push({ family: f, path: url.pathname, method: request.method(), headers: await request.allHeaders() })
  })
  await page.route((url) => url.origin === ORIGIN && family(url.pathname) !== undefined, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const f = family(url.pathname)
    if (f === 'session') return session === 200 ? json(route, 200, report) : route.fulfill({ status: session, body: '' })
    if (f === 'api') {
      if (api === '401') return route.fulfill({ status: 401, body: '' })
      // A plain Node request: the page's Origin and Referer must not reach Kubo, which would apply its CORS check to them.
      const upstream = await fetch(`${rpcOrigin()}${url.pathname}${url.search}`, { method: request.method(), headers: { 'content-type': request.headers()['content-type'] ?? 'application/octet-stream' }, body: request.method() === 'GET' ? undefined : request.postDataBuffer() ?? undefined })
      const type = upstream.headers.get('content-type')
      return route.fulfill({ status: upstream.status, body: Buffer.from(await upstream.arrayBuffer()), ...(type ? { contentType: type } : {}) })
    }
    if (f === 'agui') {
      if (agui === '401') return route.fulfill({ status: 401, body: '' })
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body: RUN_EVENTS.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('') })
    }
    if (f === 'index') return index === 'ok' ? json(route, 200, { enabled: true, mode: 'embedded', store_reachable: true, model: 'bge-m3', dimensions: 1024, indexed_cids: 12, chunk_count: 80 }) : route.fulfill({ status: 404, body: '' })
    if (settings === '401') return route.fulfill({ status: 401, body: '' })
    if (settings === 'stepup') return json(route, 403, STEP_UP)
    if (settings === 'forbidden') return route.fulfill({ status: 403, contentType: 'text/plain', body: 'forbidden' })
    if (url.pathname === '/agent/settings/events') return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': keepalive\n\n' })
    return json(route, 200, SETTINGS, { etag: '"rev-1"' })
  })
  await page.route('**/oauth2/logout', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>signed out</title><p>signed out</p>' }))
  return calls
}
