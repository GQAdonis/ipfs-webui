// A stub of the `ipfs mcp` search routes for the Web UI end-to-end tests and for screenshots:
// GET /index/status and POST /index/search answer fixed responses in the shape of
// kubo mcp/contract/routes/index.json. No Kubo node, no embedder, no store and no network
// beyond this one loopback listener. It is not part of the product and implements none of
// the server's authorization beyond "a bearer equal to STUB_TOKEN".
//
// Usage from a test:   const stub = await startStub()  ...  await stub.close()
// Usage from a shell:  node test/e2e/stub-ipfs-mcp.js --port 3199 [--rpc-shim]
//
// The scenario (what the stub answers) is switched at run time with
//   POST /__stub/scenario   {"status": "...", "search": "..."}
// and the requests it saw are listed by GET /__stub/requests. Those two paths exist only here.

import http from 'node:http'
import { pathToFileURL } from 'node:url'

export const STUB_TOKEN = 'stub-token-0000'
export const CID_INVOICE = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
export const CID_PHOTO = 'bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy'
export const CID_NOTES = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
export const CID_TALK = 'bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm'
export const XSS_SNIPPET = '<img src=x onerror=alert(1)> and **not bold**'

const CONFIGURED = Object.freeze({
  enabled: true,
  mode: 'embedded',
  auto: true,
  store_reachable: true,
  model: 'bge-m3',
  dimensions: 1024,
  indexed_cids: 1284,
  chunk_count: 9120
})

const RUN = Object.freeze({
  run_id: 'run-1',
  state: 'running',
  started_by: 'ui',
  sources: ['pins'],
  caps: { max_files: 2000, max_bytes: 2000000000, files_per_minute: 60 },
  files_seen: 412,
  files_indexed: 331,
  files_skipped: 81,
  chunks_indexed: 2212,
  bytes_read: 482000000,
  skipped_by_reason: { mime_not_allowed: 52, too_large: 11, already_indexed: 18 }
})

/** @type {Record<string, () => { status: number, body?: unknown, headers?: Record<string, string> }>} */
const STATUS = {
  idle: () => ({ status: 200, body: CONFIGURED }),
  running: () => ({ status: 200, body: { ...CONFIGURED, bulk_run: RUN } }),
  paused: () => ({ status: 200, body: { ...CONFIGURED, bulk_run: { ...RUN, state: 'paused' } } }),
  failed: () => ({ status: 200, body: { ...CONFIGURED, bulk_run: { ...RUN, state: 'failed', last_error: 'the embedder at 127.0.0.1:11434 stopped answering' } } }),
  completed: () => ({ status: 200, body: { ...CONFIGURED, bulk_run: { ...RUN, state: 'completed', files_seen: 412, files_indexed: 340, files_skipped: 72 } } }),
  storedown: () => ({ status: 200, body: { ...CONFIGURED, store_reachable: false } }),
  notconfigured: () => ({ status: 404 }),
  disabled: () => ({ status: 200, body: { enabled: false, mode: 'disabled', auto: false } }),
  unauthorized: () => ({ status: 401 }),
  forbidden: () => ({ status: 403 })
}

const toolError = (code, message, retryable = false, details) => ({ error: { code, message, retryable, ...(details ? { details } : {}) } })

/** All hits the stub knows; the request's kinds and sources filter them. */
const HITS = [
  {
    cid: CID_INVOICE,
    path: '/documents/roofer-invoice-4411.pdf',
    mime_type: 'application/pdf',
    chunk_index: 0,
    score: 0.8214,
    text: 'Invoice 4411 from Kestrel Roofing. Replacement of the north slope, due in 30 days. Total 4,180.00.',
    kind: 'document',
    source: 'extracted'
  },
  {
    cid: CID_NOTES,
    path: '/notes/2026-roof-quotes.md',
    mime_type: 'text/markdown',
    chunk_index: 3,
    score: 0.7611,
    text: XSS_SNIPPET,
    kind: 'text',
    source: 'text'
  },
  {
    cid: CID_PHOTO,
    path: '/photos/IMG_2041.jpg',
    mime_type: 'image/jpeg',
    chunk_index: 0,
    score: 0.7022,
    text: 'Scaffolding on a house with half the slate roof removed; a blue tarp covers the open section.',
    kind: 'image',
    source: 'description',
    described_by: 'llava-7b'
  },
  {
    cid: CID_PHOTO,
    path: '/photos/IMG_2041.jpg',
    mime_type: 'image/jpeg',
    chunk_index: 1,
    score: 0.6418,
    text: 'KESTREL ROOFING  Licence 88-4410  Call 555 0142',
    kind: 'image',
    source: 'ocr'
  },
  {
    cid: CID_TALK,
    path: '/recordings/neighbourhood-meeting.mp4',
    mime_type: 'video/mp4',
    chunk_index: 7,
    score: 0.5530,
    text: 'and the roofer said the slate would arrive on Thursday, which is why the scaffold stays up.',
    kind: 'video',
    source: 'transcript'
  }
]

/** @type {Record<string, (body: any) => { status: number, body?: unknown, headers?: Record<string, string> }>} */
const SEARCH = {
  ok: (body) => {
    const kinds = Array.isArray(body.kinds) ? body.kinds : undefined
    const sources = Array.isArray(body.sources) ? body.sources : undefined
    const results = HITS.filter((h) => (!kinds || kinds.includes(h.kind)) && (!sources || sources.includes(h.source)))
    return { status: 200, body: { model: 'bge-m3', results } }
  },
  empty: () => ({ status: 200, body: { model: 'bge-m3', results: [] } }),
  egress: () => ({ status: 403, body: toolError('egress_not_acknowledged', 'not acknowledged', false, { reason: 'backend_host_not_acknowledged', principal: 'ui', missing_hosts: ['embed.internal.example', '10.0.0.5:8000'] }) }),
  unavailable: () => ({ status: 503, headers: { 'Retry-After': '5' }, body: toolError('index_unavailable', 'the embedder did not answer', true) }),
  unauthorized: () => ({ status: 401 }),
  forbidden: () => ({ status: 403 }),
  ratelimited: () => ({ status: 429, headers: { 'Retry-After': '3' }, body: toolError('resource_exhausted', 'too many searches', true) }),
  internal: () => ({ status: 500, body: toolError('internal', 'boom') })
}

/**
 * @param {{ port?: number, host?: string, rpcShim?: boolean }} [options] port 0 (default) picks a free port; rpcShim answers
 *   the two Kubo RPC calls the Web UI shell makes to decide it is connected (screenshot runs only; never in the e2e suite)
 * @returns {Promise<{ url: string, port: number, endpoint: string, token: string, setScenario: (s: { status?: string, search?: string }) => void, requests: () => Array<{ method: string, path: string, authorized: boolean, body: unknown }>, close: () => Promise<void> }>}
 */
export async function startStub ({ port = 0, host = '127.0.0.1', rpcShim = false } = {}) {
  const scenario = { status: 'idle', search: 'ok' }
  /** @type {Array<{ method: string, path: string, authorized: boolean, body: unknown }>} */
  const seen = []

  const server = http.createServer((req, res) => {
    const origin = req.headers.origin
    const cors = {
      'access-control-allow-origin': typeof origin === 'string' ? origin : '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': req.headers['access-control-request-headers'] ?? 'authorization, content-type',
      'access-control-expose-headers': 'Retry-After',
      vary: 'Origin'
    }
    const send = (status, body, extra = {}) => {
      res.writeHead(status, { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store', ...extra })
      res.end(body === undefined ? '' : JSON.stringify(body))
    }
    const path = (req.url ?? '/').split('?')[0]
    if (req.method === 'OPTIONS') return send(204)
    if (path === '/__stub/requests') return send(200, seen)

    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      let body
      try { body = raw ? JSON.parse(raw) : undefined } catch (_) { body = undefined }
      if (path === '/__stub/scenario' && req.method === 'POST') {
        Object.assign(scenario, body)
        return send(200, scenario)
      }
      const authorized = req.headers.authorization === `Bearer ${STUB_TOKEN}`
      seen.push({ method: req.method ?? '', path, authorized, body })
      if (rpcShim && path.startsWith('/api/v0/')) {
        const command = path.slice('/api/v0/'.length)
        if (command === 'id') return send(200, { ID: '12D3KooWStubStubStubStubStubStubStubStubStubStubStub', PublicKey: '', Addresses: [], AgentVersion: 'kubo/stub', ProtocolVersion: 'ipfs/0.1.0', Protocols: [] })
        if (command === 'version') return send(200, { Version: '0.39.0', Commit: 'stub', Repo: '18', System: 'stub', Golang: 'stub' })
        if (command === 'stats/bw') return send(200, { TotalIn: 0, TotalOut: 0, RateIn: 0, RateOut: 0 })
        if (command === 'swarm/peers') return send(200, { Peers: [] })
        return send(200, {})
      }
      if (path !== '/index/status' && path !== '/index/search') return send(404)
      if (!authorized) return send(401)
      const answer = path === '/index/status' ? STATUS[scenario.status]?.() : SEARCH[scenario.search]?.(body ?? {})
      if (!answer) return send(500)
      return send(answer.status, answer.body, answer.headers)
    })
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => resolve(undefined))
  })
  const address = /** @type {import('node:net').AddressInfo} */ (server.address())
  const url = `http://${host}:${address.port}`
  return {
    url,
    port: address.port,
    endpoint: `${url}/agui`,
    token: STUB_TOKEN,
    setScenario: (next) => { Object.assign(scenario, next) },
    requests: () => seen.slice(),
    close: () => new Promise((resolve) => { server.close(() => resolve(undefined)); server.closeAllConnections?.() })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = process.argv.indexOf('--port')
  const port = flag === -1 ? 0 : Number(process.argv[flag + 1])
  const stub = await startStub({ port, rpcShim: process.argv.includes('--rpc-shim') })
  console.log(`stub ipfs mcp on ${stub.url} (endpoint ${stub.endpoint}, token ${stub.token})`)
}
