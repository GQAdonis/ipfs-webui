import { randomBytes, randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { sha256 } from '../../../../scripts/local-artifact.mjs'
import { Blocked, delay } from '../../processes.mjs'

export const DECISION_MODES = Object.freeze(['success', 'pause_after_claim', 'fail_after_approval', 'unknown', 'expired', 'native_required'])
export const NEGATIVE_KINDS = Object.freeze(['changed_arguments', 'changed_digest', 'malformed_digest', 'duplicate_answer', 'duplicate_dispatch', 'wrong_session', 'different_subject', 'a2a', 'uar', 'list_only'])
export function loopbackEndpoint (value) {
  const url = new URL(value)
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || !url.port || ['4001', '5001', '8080', '3001'].includes(url.port) || url.username || url.password || url.search || url.hash) throw new Blocked('Decision fixture exposed an invalid owned loopback endpoint')
  return url
}
export function assertNegativeObservation (ctx, value, kind) {
  const duplicate = kind === 'duplicate_answer' || kind === 'duplicate_dispatch'
  ctx.assert(value.kind === kind && Number.isInteger(value.http_status) && value.http_status >= 200 && value.http_status < 600 && (duplicate || value.http_status >= 400 || typeof value.error_code === 'string' && value.error_code.length > 0), `Actual protected ${kind} attempt was rejected or an idempotent duplicate`)
  ctx.assert(value.invocations_before === value.invocations_after && value.rpc_mutations_before === value.rpc_mutations_after && value.pinned_before === value.pinned_after, `${kind} cannot invoke a handler, mutate RPC or change the pin set`, value)
}
async function boundedJSON (response) {
  const reader = response.body?.getReader()
  if (!reader) throw new Blocked('Decision fixture returned no response body')
  let size = 0; const chunks = []
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 1048576) throw new Blocked('Decision fixture JSON response exceeded 1MiB'); chunks.push(value) }
  } finally { await reader.cancel().catch(() => {}) }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new Blocked('Decision fixture returned invalid bounded JSON') }
}
async function consumeEvents (response) {
  const reader = response.body?.getReader()
  if (!reader) throw new Blocked('AG-UI answer returned no response stream')
  const decoder = new TextDecoder(), types = []
  let bytes = 0, pending = ''
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      bytes += value.byteLength; if (bytes > 2097152) throw new Blocked('AG-UI answer exceeded its bounded event stream')
      pending += decoder.decode(value, { stream: true })
      while (pending.includes('\n')) {
        const index = pending.indexOf('\n'), line = pending.slice(0, index).trim(); pending = pending.slice(index + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim(); if (!data || data === '[DONE]') continue
        let event; try { event = JSON.parse(data) } catch { throw new Blocked('AG-UI emitted invalid event JSON') }
        // Keep only public event names. Never persist arbitrary model content, resume handles or credentials.
        if (typeof event.type === 'string') types.push(event.type.slice(0, 128))
      }
    }
    if (pending.trim()) throw new Blocked('AG-UI answer ended with an incomplete event frame')
    return { httpStatus: response.status, eventTypes: types, bytes }
  } finally { await reader.cancel().catch(() => {}) }
}

/** Final packet only. Control credentials cannot be sent to production observer/resolver routes. */
export async function startDecisionLease (ctx, origin) {
  const node = await ctx.getNode(), approved = await ctx.getLeaseExecutable('decisions'), binary = approved.executable
  let controlSecret = randomBytes(48).toString('base64url'), credential, closed = false
  const process = await ctx.processes.start(binary, ['-test.run=^TestDecisionBoundaryLease$', '-test.timeout=20m'], {
    cwd: ctx.kubo, env: { ...ctx.env, IPFS_MCP_DECISION_BOUNDARY_LEASE: '1' }, label: `${ctx.scenario}-${ctx.slot}-real-decision-lease`, timeout: 21 * 60000,
    protectedSetup: { version: 1, test_only: true, make_build_sha256: node.identity.sha256, allowed_origins: [origin], control_secret: controlSecret }
  })
  async function close () {
    if (closed) return; closed = true; process.closeLease()
    try {
      const [status, exit] = await Promise.all([process.publicClosed, process.done])
      ctx.assert(status.status === 'CLOSED' && status.owned_children_joined === true && status.lease_id === descriptor.lease_id && exit.exitCode === 0, 'The real decision lease joined exactly its owned children before returning')
      await ctx.record('decision-lease-closed', { statuses: process.publicStatuses, command: process.record, executableSha256: sha256(await readFile(binary)), environment: { IPFS_MCP_DECISION_BOUNDARY_LEASE: '1' } })
    } finally { credential?.clear(); controlSecret = undefined }
  }
  let descriptor
  try {
    descriptor = await process.publicDescriptor
    await ctx.record('decision-lease-readiness', descriptor)
    if (descriptor.status !== 'READY') throw new Blocked(`Real decision fixture unavailable: ${descriptor.reason || descriptor.status}`)
    ctx.assert(descriptor.test_only === true && descriptor.version === 1 && descriptor.make_build_sha256 === node.identity.sha256, 'The server fixture uses the actual make-built disposable daemon')
    ctx.assert(descriptor.capabilities?.model_invocations === 0 && descriptor.capabilities.authentication === 'real_jwt_and_static_verifiers' && descriptor.capabilities.native_presence === false, 'The fixture uses real authentication and reports its genuine native-factor limitation')
    // Authenticated canonical actions/private fresh detail decide the existing continuation lane.
    // A historical owner_channel display/fixture field is not an additional server grant.
    ctx.assert(DECISION_MODES.every(mode => descriptor.capabilities.modes.includes(mode)), 'The live fixture explicitly supports every required handler mode')
    for (const key of ['control_url', 'agui_url', 'decisions_url', 'rpc_url']) loopbackEndpoint(descriptor[key])
    ctx.assert(new URL(descriptor.control_url).origin !== new URL(descriptor.agui_url).origin, 'Fixture control and production resolver are separate listeners')
    await ctx.processes.captureDescendants()
    ctx.assert(descriptor.fixture_pid === process.child.pid && descriptor.owned_pids?.length > 0 && descriptor.owned_pids.every(pid => ctx.processes.owned.has(pid)), 'Lease helper and daemon PIDs belong to this exact runner')
    credential = await process.credential
    ctx.assert(credential.leaseId === descriptor.lease_id, 'Private owner credential and public lease identity match')
  } catch (error) {
    process.closeLease(); await process.done; credential?.clear(); controlSecret = undefined; throw error
  }
  const control = async (action, body) => {
    if (closed || !['prepare', 'release', 'snapshot', 'negative'].includes(action)) throw new Blocked('Closed or unsupported decision control action')
    const response = await fetch(new URL(`/${action}`, descriptor.control_url), { method: 'POST', headers: { Authorization: `Bearer ${controlSecret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ version: 1, ...body }), signal: AbortSignal.timeout(45000) })
    if (!response.ok) { await response.body?.cancel(); throw new Blocked(`Decision fixture control ${action} failed with HTTP ${response.status}`) }
    return boundedJSON(response)
  }
  return { descriptor, close, credential, allowedOrigins: [origin],
    async prepare (mode) {
      if (!DECISION_MODES.includes(mode)) throw new Blocked('Unknown decision fixture mode')
      return control('prepare', { mode })
    },
    release: caseId => control('release', { case_id: caseId }),
    snapshot: caseId => control('snapshot', { case_id: caseId }),
    negative: (caseId, kind) => { if (!NEGATIVE_KINDS.includes(kind)) throw new Blocked('Unknown protected negative attempt'); return control('negative', { case_id: caseId, kind }) },
    async observe (prepared) {
      if (!prepared.decision_id) throw new Blocked('The actual gate produced no decision to observe')
      const url = new URL(`${descriptor.decisions_url.replace(/\/$/, '')}/${encodeURIComponent(prepared.decision_id)}`)
      const response = await credential.use(bearer => fetch(url, { headers: { Authorization: `Bearer ${bearer}`, Origin: origin }, signal: AbortSignal.timeout(15000) }))
      if (!response.ok) { await response.body?.cancel(); throw new Blocked(`Authenticated decision read failed with HTTP ${response.status}`) }
      const value = await boundedJSON(response)
      ctx.assert(value.item?.id === prepared.decision_id && value.item?.effect_digest === prepared.effect_digest && value.item?.summary?.tool === prepared.tool, 'Authenticated observation agrees with the actual interrupted operation binding')
      return value.item
    },
    async answer (prepared, approved, surface = 'chat') {
      if (closed || !prepared.decision_id || !prepared.interrupt_id || !prepared.effect_digest) throw new Blocked('No live interrupted operation is available to answer')
      const response = await credential.use(bearer => fetch(descriptor.agui_url, { method: 'POST', headers: { Authorization: `Bearer ${bearer}`, Origin: origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: prepared.thread_id, runId: randomUUID(), messages: [], resume: [{ interruptId: prepared.interrupt_id, status: 'resolved', payload: { approved }, reviewed_effect: { effect_digest: prepared.effect_digest } }], forwardedProps: { ipfs: { surface: { kind: surface, instance: `decision-boundary-${descriptor.lease_id}` } } } }), signal: AbortSignal.timeout(90000) }))
      return consumeEvents(response)
    },
    async wait (prepared, predicate, description) {
      const deadline = Date.now() + 45000
      let value
      do { value = await control('snapshot', { case_id: prepared.case_id }); if (predicate(value)) return value; await delay(50) } while (Date.now() < deadline)
      throw new Blocked(`Actual decision handler did not reach ${description}`)
    }
  }
}
