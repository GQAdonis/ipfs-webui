// Frontend evidence intake only. Never compiles, repairs or maintains a backend.
import { lstat, readFile, realpath, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { kuboInputs } from './evidence-schema.mjs'
import { adoptedIdentity } from './requirements.mjs'
import { Blocked } from './processes.mjs'

export const CLI_PATTERN = 'TestMCP|TestDefaultMatchesExpectedProfile|TestCommandDocsWidth|TestGateway|TestTelemetry|TestProvider'
export function assertPublicBytes (bytes, label) {
  const text = bytes.toString('utf8')
  if (/(?:Bearer\s+[^\s"']+|"(?:authorization|ui_bearer|control_secret|password|api_key|credential)"\s*:)/i.test(text)) throw new Blocked(`${label} contains secret-shaped content; never retain it`)
  return text
}
async function file (path, hash, limit = 16 * 1024 * 1024) {
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > limit) throw new Blocked('Claude receipt input is not a bounded regular file')
  const bytes = await readFile(path)
  if (!/^[a-f0-9]{64}$/.test(hash || '') || sha256(bytes) !== hash) throw new Blocked('Claude receipt input bytes differ from their claimed digest')
  return bytes
}
function currentContract (receipt, contract) {
  if (!isDeepStrictEqual(receipt.contract, adoptedIdentity) || !isDeepStrictEqual(receipt.contract, contract.identity)) throw new Blocked('Claude receipt belongs to a different adopted frontend identity')
}
async function sourceBinding (receipt, kubo) {
  const source = await kuboInputs(kubo)
  if (receipt.kuboSourceSha256 !== source.sha256) throw new Blocked('Claude receipt does not bind the exact current Kubo source/lock/fixture snapshot')
  return source.sha256
}
async function readReceipt (path) {
  if (!path || !isAbsolute(path)) throw new Blocked('Supply an explicit absolute Claude receipt path')
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1024 * 1024) throw new Blocked('Claude receipt is missing or exceeds 1MiB')
  const bytes = await readFile(path)
  let receipt
  try { receipt = JSON.parse(assertPublicBytes(bytes, 'Claude public receipt')) } catch (error) { if (error instanceof Blocked) throw error; throw new Blocked('Claude receipt is invalid JSON') }
  if (receipt.schemaVersion !== 1 || receipt.owner !== 'claude' || receipt.status !== 'PASS' || receipt.execution !== 'actual-command') throw new Blocked('A generic external PASS is not a Claude actual-command receipt')
  return { receipt, bytes, path }
}
async function commandEvidence (input, expectedArgv, cwd) {
  const command = input.receipt.command
  if (!command || !isDeepStrictEqual(command.argv, expectedArgv) || await realpath(command.cwd) !== await realpath(cwd) || command.exitCode !== 0 || !Number.isInteger(command.pid) || command.pid <= 0 || !command.startedAt || !command.endedAt || command.timedOut || command.spawnError || command.signal) throw new Blocked('Claude exact command/PID/cwd/exit receipt is incomplete or mismatched')
  const evidence = []
  for (const name of ['stdout', 'stderr']) {
    const field = command[name]
    if (!field?.path) throw new Blocked(`Claude ${name} bytes are missing`)
    const path = resolve(dirname(input.path), field.path)
    const rel = relative(await realpath(dirname(input.path)), await realpath(path))
    if (rel.startsWith('..') || isAbsolute(rel)) throw new Blocked('Claude command evidence escapes its receipt directory')
    const bytes = await file(path, field.sha256)
    assertPublicBytes(bytes, `Claude ${name}`)
    evidence.push({ name, bytes, sha256: field.sha256 })
  }
  return { command, evidence }
}
async function retain (ctx, input, evidence) {
  const path = join(ctx.directory, `claude-${input.receipt.kind}-${input.receipt.leaseKind || 'compatibility'}.json`)
  await writeFile(path, input.bytes, { flag: 'wx' })
  const files = [{ path, sha256: sha256(input.bytes) }]
  for (const entry of evidence) {
    const output = `${path}.${entry.name}.txt`
    await writeFile(output, entry.bytes, { flag: 'wx' })
    files.push({ path: output, sha256: entry.sha256 })
  }
  if (ctx.attach) for (const item of files) await ctx.attach(item.path)
  await ctx.record('claude-source-bound-input', { kind: input.receipt.kind, leaseKind: input.receipt.leaseKind, receiptSha256: sha256(input.bytes), files })
  return files
}
export async function validateClaudeExecutable ({ config, kind, kubo, contract, binaryIdentity, ctx }) {
  if (!['builtin', 'uar', 'decisions'].includes(kind)) throw new Blocked('No published native-host lease/control protocol is available in this frontend intake')
  const selected = config.leases?.[kind]
  if (!selected?.executable || !selected.receipt || !isAbsolute(selected.executable)) throw new Blocked(`Claude ${kind} source-bound executable/receipt is not supplied`)
  const input = await readReceipt(selected.receipt), receipt = input.receipt
  if (receipt.kind !== 'backend-lease-executable' || receipt.leaseKind !== kind) throw new Blocked('Claude lease receipt kind differs from the requested collaborator')
  currentContract(receipt, contract)
  await sourceBinding(receipt, kubo)
  if (receipt.makeBuildSha256 !== binaryIdentity.sha256 || receipt.executable?.path !== selected.executable) throw new Blocked('Claude lease make-built daemon/executable identity differs')
  const executable = await file(selected.executable, receipt.executable.sha256, 512 * 1024 * 1024)
  if (!((await lstat(selected.executable)).mode & 0o111)) throw new Blocked('Claude fixture executable has no execute permission')
  const target = kind === 'decisions' ? './mcp/server' : './test/cli'
  const command = await commandEvidence(input, ['go', 'test', '-c', '-o', selected.executable, target], kubo)
  if (ctx) await retain(ctx, input, command.evidence)
  return { executable: selected.executable, executableSha256: sha256(executable), setup: selected.setup, releaseReceiptPath: selected.releaseReceiptPath, receiptSha256: sha256(input.bytes) }
}
export function assertCompatibilityPayload (receipt, stdout, { contract, sourceSha256, binarySha256, kuboRoot }) {
  if (receipt.schemaVersion !== 1 || receipt.owner !== 'claude' || receipt.kind !== 'kubo-compatibility' || receipt.execution !== 'actual-command' || receipt.status !== 'PASS') throw new Blocked('A generic external PASS cannot establish Kubo compatibility')
  currentContract(receipt, contract)
  if (receipt.kuboSourceSha256 !== sourceSha256 || receipt.makeBuildSha256 !== binarySha256) throw new Blocked('Compatibility source or make-built binary changed')
  const command = receipt.command
  if (!isDeepStrictEqual(command?.argv, ['go', 'test', './test/cli/...', '-run', CLI_PATTERN, '-count=1', '-timeout=30m', '-v']) || command.cwd !== kuboRoot || command.exitCode !== 0 || !command.pid || !command.startedAt || !command.endedAt || command.timedOut || command.spawnError || command.signal || !command.environment?.PATH?.startsWith(join(kuboRoot, 'cmd/ipfs') + ':') || !command.environment.IPFS_PATH) throw new Blocked('Exact isolated compatibility command receipt is missing')
  const families = {}
  for (const family of CLI_PATTERN.split('|')) {
    const runs = [...stdout.matchAll(new RegExp(`^=== RUN\\s+${family}\\S*`, 'gm'))].length
    const passed = [...stdout.matchAll(new RegExp(`^--- PASS: ${family}\\S*`, 'gm'))].length
    const skipped = [...stdout.matchAll(new RegExp(`^\\s*--- SKIP: ${family}\\S*`, 'gm'))].map(match => match[0].trim())
    if (!runs || !passed || skipped.some(line => line !== '--- SKIP: TestMCPBoundaryLease')) throw new Blocked(`Required compatibility family is omitted, unsuccessful or skipped: ${family}`)
    families[family] = { runs, passed, skipped }
  }
  return families
}
export async function consumeCompatibilityReceipt (ctx, path = ctx.config.compatibilityReceipt) {
  const input = await readReceipt(path), receipt = input.receipt
  if (receipt.kind !== 'kubo-compatibility') throw new Blocked('Claude compatibility receipt kind is required')
  currentContract(receipt, ctx.contract)
  await sourceBinding(receipt, ctx.kubo)
  const node = await ctx.getNode()
  if (receipt.makeBuildSha256 !== node.identity.sha256) throw new Blocked('Claude compatibility result used another make-built daemon')
  const command = await commandEvidence(input, ['go', 'test', './test/cli/...', '-run', CLI_PATTERN, '-count=1', '-timeout=30m', '-v'], ctx.kubo)
  if (!command.command.environment?.PATH?.startsWith(join(ctx.kubo, 'cmd/ipfs') + ':') || !command.command.environment.IPFS_PATH || command.command.environment.IPFS_PATH === process.env.IPFS_PATH) throw new Blocked('Claude compatibility command lacks its isolated repo/binary precedence')
  const stdout = command.evidence.find(item => item.name === 'stdout').bytes.toString('utf8')
  const families = assertCompatibilityPayload(receipt, stdout, { contract: ctx.contract, sourceSha256: receipt.kuboSourceSha256, binarySha256: node.identity.sha256, kuboRoot: ctx.kubo })
  const files = await retain(ctx, input, command.evidence)
  ctx.assert(true, 'Claude exact isolated compatibility families executed with current source and make-built binary', families)
  await ctx.record('cli-compatibility', { receiptSha256: sha256(input.bytes), makeBuildSha256: node.identity.sha256, kuboSourceSha256: receipt.kuboSourceSha256, families, files })
  return { receipt, files, families }
}
