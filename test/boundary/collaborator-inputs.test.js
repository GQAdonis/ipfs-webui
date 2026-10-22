// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { adoptedIdentity } from './requirements.mjs'
import { assertCompatibilityPayload, assertPublicBytes, CLI_PATTERN, validateClaudeExecutable } from './collaborator-inputs.mjs'
import { kuboInputs } from './evidence-schema.mjs'
import { sha256 } from '../../scripts/local-artifact.mjs'
const owned = []
afterEach(async () => { for (const root of owned.splice(0)) await rm(root, { recursive: true, force: true }) })
const sourceSha256 = '1'.repeat(64); const binarySha256 = '2'.repeat(64); const kuboRoot = '/owned/kubo'
const compatibility = () => ({
  schemaVersion: 1,
  owner: 'claude',
  kind: 'kubo-compatibility',
  execution: 'actual-command',
  status: 'PASS',
  contract: { ...adoptedIdentity },
  kuboSourceSha256: sourceSha256,
  makeBuildSha256: binarySha256,
  command: { argv: ['go', 'test', './test/cli/...', '-run', CLI_PATTERN, '-count=1', '-timeout=30m', '-v'], cwd: kuboRoot, pid: 12001, startedAt: '2026-10-20T12:00:00Z', endedAt: '2026-10-20T12:01:00Z', exitCode: 0, environment: { PATH: `${kuboRoot}/cmd/ipfs:/toolchain`, IPFS_PATH: '/owned/disposable-repo' } }
})
const output = () => CLI_PATTERN.split('|').map(name => `=== RUN   ${name}Fixture\n--- PASS: ${name}Fixture (0.01s)`).join('\n')
const validate = (receipt = compatibility(), text = output()) => assertCompatibilityPayload(receipt, text, { contract: { identity: adoptedIdentity }, sourceSha256, binarySha256, kuboRoot })
describe('source-bound backend evidence intake', () => {
  it('requires actual output for every adopted compatibility family, with optional standalone lease skip only', () => {
    expect(Object.keys(validate())).toEqual(CLI_PATTERN.split('|'))
    expect(() => validate(compatibility(), `${output()}\n--- SKIP: TestMCPBoundaryLease (0.00s)`)).not.toThrow()
    for (const family of CLI_PATTERN.split('|')) expect(() => validate(compatibility(), output().split('\n').filter(line => !line.includes(family)).join('\n'))).toThrow()
    expect(() => validate(compatibility(), '? module [no test files]')).toThrow()
    expect(() => validate(compatibility(), `${output()}\n--- SKIP: TestProviderDisabled (0.00s)`)).toThrow()
  })
  it.each(['contract', 'source', 'binary', 'argv', 'cwd', 'exit', 'pid', 'timeout', 'repo', 'path'])('refuses stale/incomplete %s evidence instead of accepting a generic PASS', field => {
    const receipt = compatibility()
    if (field === 'contract') receipt.contract.phaseId = 'agentic-ui-implementation'
    if (field === 'source') receipt.kuboSourceSha256 = '3'.repeat(64)
    if (field === 'binary') receipt.makeBuildSha256 = '3'.repeat(64)
    if (field === 'argv') receipt.command.argv[4] = 'TestMCP'
    if (field === 'cwd') receipt.command.cwd = '/operator/repo'
    if (field === 'exit') receipt.command.exitCode = 1
    if (field === 'pid') delete receipt.command.pid
    if (field === 'timeout') receipt.command.timedOut = true
    if (field === 'repo') delete receipt.command.environment.IPFS_PATH
    if (field === 'path') receipt.command.environment.PATH = '/unrelated/toolchain'
    expect(() => validate(receipt)).toThrow()
  })
  it('never retains credential-shaped command output or accepts ownerless status', () => {
    expect(() => assertPublicBytes(Buffer.from('Authorization: Bearer fixture-private'), 'log')).toThrow('secret-shaped')
    expect(() => assertPublicBytes(Buffer.from('{"ui_bearer":"fixture-private"}'), 'log')).toThrow('secret-shaped')
    expect(() => validate({ status: 'PASS' })).toThrow('generic external PASS')
    expect(assertPublicBytes(Buffer.from('=== RUN TestProviderFixture'), 'log')).toContain('TestProvider')
  })
})
async function executableFixture () {
  const root = await mkdtemp(join(tmpdir(), 'claude-input-fixture-')); owned.push(root)
  const kubo = join(root, 'kubo'); const receipts = join(root, 'receipts')
  await mkdir(receipts)
  for (const name of ['cmd', 'core', 'config', 'plugin', 'repo', 'client', 'test/cli', 'mcp/server']) { await mkdir(join(kubo, name), { recursive: true }); await writeFile(join(kubo, name, 'fixture.txt'), `Explicit source fixture ${name}`) }
  for (const name of ['go.mod', 'go.sum', 'Makefile', 'version.go']) await writeFile(join(kubo, name), `Explicit source fixture ${name}`)
  const executable = join(root, 'leased-fixture.test'); await writeFile(executable, 'Source-bound executable byte fixture; never executed'); await chmod(executable, 0o700)
  const stdout = Buffer.from('compiled fixture'); const stderr = Buffer.from('')
  await writeFile(join(receipts, 'stdout.txt'), stdout); await writeFile(join(receipts, 'stderr.txt'), stderr)
  const receipt = {
    schemaVersion: 1,
    owner: 'claude',
    kind: 'backend-lease-executable',
    leaseKind: 'decisions',
    execution: 'actual-command',
    status: 'PASS',
    contract: { ...adoptedIdentity },
    kuboSourceSha256: (await kuboInputs(kubo)).sha256,
    makeBuildSha256: binarySha256,
    executable: { path: executable, sha256: sha256(await readFile(executable)) },
    command: { argv: ['go', 'test', '-c', '-o', executable, './mcp/server'], cwd: kubo, pid: 1234, startedAt: '2026-10-20T12:00:00Z', endedAt: '2026-10-20T12:01:00Z', exitCode: 0, stdout: { path: 'stdout.txt', sha256: sha256(stdout) }, stderr: { path: 'stderr.txt', sha256: sha256(stderr) } }
  }
  const receiptPath = join(receipts, 'lease.json')
  const save = () => writeFile(receiptPath, JSON.stringify(receipt))
  await save()
  const config = { leases: { decisions: { executable, receipt: receiptPath } } }
  const check = () => validateClaudeExecutable({ config, kind: 'decisions', kubo, contract: { identity: adoptedIdentity }, binaryIdentity: { sha256: binarySha256 } })
  return { root, kubo, receipts, executable, receipt, save, check }
}
describe('approved executable intake never compiles a backend', () => {
  it('binds source, compile command, exact log and executable bytes without invoking them', async () => {
    const fixture = await executableFixture()
    await expect(fixture.check()).resolves.toMatchObject({ executable: fixture.executable, executableSha256: fixture.receipt.executable.sha256 })
    await writeFile(join(fixture.kubo, 'core/fixture.txt'), 'Later source mutation')
    await expect(fixture.check()).rejects.toThrow('current Kubo source')
  })
  it('refuses changed logs, executable bytes and source-free compile receipts', async () => {
    const fixture = await executableFixture()
    await writeFile(join(fixture.receipts, 'stdout.txt'), 'changed log')
    await expect(fixture.check()).rejects.toThrow('digest')
    await writeFile(join(fixture.receipts, 'stdout.txt'), 'compiled fixture')
    await writeFile(fixture.executable, 'changed binary')
    await expect(fixture.check()).rejects.toThrow('digest')
  })
  it('rejects symlinked external logs and unsupported native protocol instead of following arbitrary input', async () => {
    const fixture = await executableFixture(); const outside = join(fixture.root, 'outside.txt')
    await writeFile(outside, 'compiled fixture')
    await rm(join(fixture.receipts, 'stdout.txt')); await symlink(outside, join(fixture.receipts, 'stdout.txt'))
    await expect(fixture.check()).rejects.toThrow('escapes')
    await expect(validateClaudeExecutable({ kind: 'native', config: {} })).rejects.toThrow('No published native-host')
  })
})
