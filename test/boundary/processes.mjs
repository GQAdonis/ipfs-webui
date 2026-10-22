import { spawn, execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'

const exec = promisify(execFile)
export const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
export class Blocked extends Error { constructor (message) { super(message); this.name = 'Blocked' } }

function protectedFrame (stream, limit, label, child) {
  return new Promise((resolve, reject) => {
    let bytes = Buffer.alloc(0)
    const timer = setTimeout(() => finish(new Blocked(`${label} did not produce a bounded readiness frame`)), 45000)
    function finish (error, frame) {
      clearTimeout(timer); stream.removeListener('data', onData); stream.removeListener('end', onEnd)
      if (error) { child.stdin?.end(); reject(error) } else resolve(frame)
    }
    function onData (chunk) {
      bytes = Buffer.concat([bytes, chunk])
      if (bytes.length > limit) { bytes.fill(0); finish(new Blocked(`${label} exceeds its bounded frame limit`)); return }
      const newline = bytes.indexOf(10)
      if (newline !== -1) finish(null, bytes.subarray(0, newline).toString('utf8'))
    }
    function onEnd () { if (bytes.length) finish(null, bytes.toString('utf8')); else finish(new Blocked(`${label} closed without a frame`)) }
    stream.on('data', onData); stream.on('end', onEnd); stream.once('error', error => finish(error))
  })
}

function publicStatusChannel (stream, child) {
  const statuses = []
  let buffer = ''; let readyResolve; let readyReject; let closedResolve; let closedReject
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject })
  const closed = new Promise((resolve, reject) => { closedResolve = resolve; closedReject = reject })
  const fail = reason => { const error = new Blocked(reason); readyReject(error); closedReject(error); child.stdin?.end() }
  const timer = setTimeout(() => fail('Public lease FD4 readiness timed out'), 45000)
  stream.on('data', chunk => {
    buffer += chunk.toString('utf8')
    if (Buffer.byteLength(buffer) > 65536) { buffer = ''; fail('Public lease FD4 exceeds bounded status size'); return }
    while (buffer.includes('\n')) {
      const newline = buffer.indexOf('\n'); const frame = buffer.slice(0, newline); buffer = buffer.slice(newline + 1)
      if (!frame) continue
      if (statuses.length >= 3 || /"[^"]*(?:authorization|bearer|token|password|secret|credential|api[_-]?key)[^"]*"\s*:/i.test(frame)) { fail('Public lease FD4 contains an unexpected or secret-shaped frame'); return }
      let descriptor
      try { descriptor = JSON.parse(frame) } catch { fail('Public lease FD4 is invalid JSON'); return }
      if (!['READY', 'BLOCKED', 'CLOSED'].includes(descriptor.status)) { fail('Public lease FD4 status is unsupported'); return }
      if ((!statuses.length && descriptor.status === 'CLOSED') || (statuses.length && descriptor.status !== 'CLOSED') || statuses.length >= 2) { fail('Public lease FD4 status ordering is invalid'); return }
      statuses.push(descriptor)
      if (descriptor.status === 'READY' || descriptor.status === 'BLOCKED') { clearTimeout(timer); readyResolve(descriptor) }
      if (descriptor.status === 'CLOSED') closedResolve(descriptor)
    }
  })
  stream.on('end', () => {
    clearTimeout(timer)
    if (buffer.trim()) fail('Public lease FD4 ended with an incomplete NDJSON frame')
    else if (!statuses.length) fail('Public lease FD4 closed before readiness')
    else if (statuses[0].status === 'BLOCKED') closedResolve(statuses[0])
    else if (statuses.at(-1).status !== 'CLOSED') closedReject(new Blocked('Public lease FD4 omitted the owned-child CLOSED receipt'))
  })
  stream.once('error', () => fail('Public lease FD4 stream failed'))
  ready.catch(() => {}); closed.catch(() => {})
  return { ready, closed, statuses }
}

class EphemeralCredential {
  #value
  constructor (value, leaseId) { this.#value = value; this.leaseId = leaseId }
  use (callback) { return callback(this.#value) }
  clear () { this.#value = undefined }
  toJSON () { return '[ephemeral credential omitted]' }
  toString () { return '[ephemeral credential omitted]' }
}

export function isolatedEnvironment (ipfsPath, kubo) {
  const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'LANG', 'LC_ALL', 'SDKROOT', 'GOPATH', 'GOCACHE', 'GOMODCACHE', 'CC', 'CXX', 'CGO_ENABLED', 'SystemRoot'].filter(key => process.env[key]).map(key => [key, process.env[key]]))
  return { ...env, PATH: `${join(kubo, 'cmd/ipfs')}:${env.PATH || ''}`, IPFS_PATH: ipfsPath, IPFS_TELEMETRY: 'off', DO_NOT_TRACK: '1', COREPACK_ENABLE_AUTO_PIN: '0' }
}

// Record exact PID/start identities of our descendants. Never signal a process
// group, an unowned PID, or a PID whose start identity no longer matches.
export class Processes {
  constructor (directory) {
    this.directory = directory; this.commands = []; this.owned = new Map(); this.children = new Set(); this.pending = new Set(); this.closed = false
    this.monitor = setInterval(async () => {
      if (this.scanning) return
      this.scanning = true
      try { await this.captureDescendants() } catch (error) { this.monitorError = error } finally { this.scanning = false }
    }, 500)
    this.monitor.unref()
  }
  async captureDescendants () {
    if (process.platform === 'win32') throw new Blocked('Exact descendant PID collection is authored for the adopted macOS/POSIX environment only')
    const { stdout } = await exec('ps', ['-axo', 'pid=,ppid=,lstart='])
    const rows = stdout.trim().split('\n').map(line => {
      const [, pid, ppid, start] = line.match(/^\s*(\d+)\s+(\d+)\s+(.+)$/) || []
      return { pid: Number(pid), ppid: Number(ppid), start }
    }).filter(row => row.pid)
    const descendants = new Set([process.pid])
    let changed = true
    while (changed) {
      changed = false
      for (const row of rows) if (descendants.has(row.ppid) && !descendants.has(row.pid)) { descendants.add(row.pid); changed = true }
    }
    for (const row of rows) if (row.pid !== process.pid && descendants.has(row.pid)) this.owned.set(row.pid, row)
    return new Map(rows.map(row => [row.pid, row]))
  }
  async signalOwned (signal) {
    const live = await this.captureDescendants()
    for (const [pid, identity] of [...this.owned].reverse()) {
      if (live.get(pid)?.start !== identity.start) continue
      try { process.kill(pid, signal) } catch (error) { if (error.code !== 'ESRCH') throw error }
    }
  }
  async start (command, args, { cwd, env, label = 'command', timeout = 120000, protectedSetup } = {}) {
    await mkdir(this.directory, { recursive: true })
    const index = String(this.commands.length + 1).padStart(3, '0')
    const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, '_')
    const prefix = join(this.directory, `${index}-${safeLabel}`)
    const record = { command, argv: [command, ...args], cwd, environment: { IPFS_PATH: env?.IPFS_PATH, PATH: env?.PATH, IPFS_TELEMETRY: env?.IPFS_TELEMETRY, DO_NOT_TRACK: env?.DO_NOT_TRACK, COREPACK_ENABLE_AUTO_PIN: env?.COREPACK_ENABLE_AUTO_PIN, IPFS_MCP_BOUNDARY_LEASE: env?.IPFS_MCP_BOUNDARY_LEASE }, startedAt: new Date().toISOString(), stdoutFile: `${prefix}.stdout.txt`, stderrFile: `${prefix}.stderr.txt`, exitCode: null, signal: null }
    this.commands.push(record)
    let stdout = ''; let stderr = ''; let spawnError
    const secrets = new Set()
    function secretInputs (value) {
      if (!value || typeof value !== 'object') return
      for (const [key, child] of Object.entries(value)) {
        if (/(?:authorization|bearer|token|password|secret|credential|api[_-]?key)/i.test(key) && typeof child === 'string' && child) secrets.add(child)
        else secretInputs(child)
      }
    }
    if (protectedSetup) secretInputs(protectedSetup)
    const scrub = value => [...secrets].reduce((text, secret) => text.replaceAll(secret, '[ephemeral credential omitted]'), value).replace(/\bBearer\s+[^\s"']+/gi, 'Bearer [omitted]')
    if (protectedSetup && protectedSetup.test_only !== true) throw new Blocked('Protected lease setup must explicitly be test_only')
    const child = spawn(command, args, { cwd, env, stdio: protectedSetup ? ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'], shell: false })
    this.children.add(child)
    record.pid = child.pid
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', error => { spawnError = error; stderr += error.message })
    let expired = false
    const timer = setTimeout(async () => { expired = true; await this.captureDescendants().catch(error => { this.monitorError = error }); child.kill('SIGTERM') }, timeout)
    const forceTimer = setTimeout(() => { if (expired) child.kill('SIGKILL') }, timeout + 5000)
    const done = new Promise((resolve, reject) => child.on('close', async (code, signal) => {
      clearTimeout(timer); clearTimeout(forceTimer)
      if (protectedSetup) { stdout = scrub(stdout); stderr = scrub(stderr) }
      Object.assign(record, { exitCode: code, signal, timedOut: expired, endedAt: new Date().toISOString(), spawnError: spawnError?.code || null })
      record.stdoutSha256 = createHash('sha256').update(stdout).digest('hex')
      record.stderrSha256 = createHash('sha256').update(stderr).digest('hex')
      try {
        await Promise.all([writeFile(record.stdoutFile, stdout), writeFile(record.stderrFile, stderr)])
        resolve({ ...record, stdout, stderr })
      } catch (error) { reject(error) }
    }))
    this.pending.add(done)
    done.catch(error => { this.monitorError = error })
    let publicDescriptor; let publicClosed; let publicStatuses; let credential
    if (protectedSetup) {
      // FD3 setup is never logged. FD4 is public readiness; FD5 carries only an
      // ephemeral credential, never stdout/stderr/argv/files/traces.
      const setup = JSON.stringify(protectedSetup) + '\n'
      if (Buffer.byteLength(setup) > 65536) { child.stdin.end(); child.kill('SIGTERM'); throw new Blocked('Protected lease FD3 setup exceeds 64KiB') }
      child.stdio[3].end(setup)
      const status = publicStatusChannel(child.stdio[4], child)
      publicDescriptor = status.ready; publicClosed = status.closed; publicStatuses = status.statuses
      credential = protectedFrame(child.stdio[5], 32768, 'Credential FD5', child).then(frame => {
        let value
        try { value = JSON.parse(frame) } catch { throw new Blocked('Private lease FD5 is invalid JSON') }
        if (typeof value.lease_id !== 'string' || typeof value.ui_bearer !== 'string' || !value.ui_bearer || Object.keys(value).some(key => !['lease_id', 'ui_bearer'].includes(key))) throw new Blocked('Private lease FD5 credential envelope is invalid')
        secrets.add(value.ui_bearer)
        return new EphemeralCredential(value.ui_bearer, value.lease_id)
      })
      // Attach rejection handlers immediately; callers await both protected
      // channels explicitly, and a public BLOCKED descriptor can omit FD5.
      publicDescriptor.catch(() => {}); credential.catch(() => {})
    }
    return { child, done, record, publicDescriptor, publicClosed, publicStatuses, credential, closeLease: () => child.stdin?.end(), output: () => ({ stdout: protectedSetup ? scrub(stdout) : stdout, stderr: protectedSetup ? scrub(stderr) : stderr }) }
  }
  async run (command, args, options) {
    const { done } = await this.start(command, args, options)
    const result = await done
    if (result.spawnError) throw new Blocked(`Required executable unavailable: ${command} (${result.spawnError})`)
    if (result.exitCode !== 0) throw Object.assign(new Error(`${command} exited ${result.exitCode}${result.timedOut ? ' (timeout)' : ''}; see ${result.stderrFile}`), { receipt: result })
    return result
  }
  async stop () {
    if (this.closed) return
    this.closed = true
    clearInterval(this.monitor)
    for (const child of this.children) child.stdin?.end()
    await delay(1000)
    await this.signalOwned('SIGTERM')
    await delay(1000)
    await this.signalOwned('SIGKILL')
    const complete = await Promise.race([Promise.allSettled(this.pending).then(() => true), delay(5000).then(() => false)])
    if (!complete) throw new Blocked('Owned child exit receipts did not complete during bounded cleanup')
    const live = await this.captureDescendants()
    for (const [pid, identity] of this.owned) {
      if (live.get(pid)?.start !== identity.start) continue
      try { process.kill(pid, 0) } catch (error) { if (error.code === 'ESRCH') continue; throw error }
      throw new Blocked(`Owned child PID ${pid} is still alive after bounded cleanup`)
    }
    await writeFile(join(this.directory, 'processes.json'), JSON.stringify({ commands: this.commands, ownedPids: [...this.owned.values()] }, null, 2) + '\n')
  }
}
