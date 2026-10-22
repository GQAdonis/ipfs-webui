// @vitest-environment node
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { sha256, snapshot } from '../../scripts/local-artifact.mjs'
import { kuboInputs } from './evidence-schema.mjs'
import { makeBinaryIdentity } from '../helpers/owned-kubo.mjs'

const scratch = []
afterEach(async () => { await Promise.all(scratch.splice(0).map(path => rm(path, { recursive: true, force: true }))) })

// Synthetic local files exercise validator failures; these do not represent
// actual Kubo build or node evidence. The separate opt-in regression uses both.
async function fixture ({ legacy = false, unboundEmbed = false, embedIndent = '' } = {}) {
  const kubo = await realpath(await mkdtemp(join(tmpdir(), 'make-build-receipt-test-'))); scratch.push(kubo)
  const directory = join(kubo, 'evidence/build')
  await mkdir(directory, { recursive: true })
  const sources = { Makefile: 'build:\n\tgo build\n', 'version.go': 'const CurrentVersionNumber = "0.44.0-dev"\n', 'go.mod': 'module github.com/ipfs/kubo\n', 'go.sum': '', 'cmd/ipfs/Rules.mk': 'canonical recipe fixture', 'mcp/app/dist/view.html': 'embedded view', 'mcp/ui/catalog/catalog.go': 'package catalog', 'assets/assets.go': '//go:embed init-doc\n', 'assets/init-doc/readme': 'initial documentation', 'mcp/contract/contract.go': '//go:embed catalog.json\n', 'mcp/contract/catalog.json': '{}', 'mcp/server/confirm/la_prompt.swift': 'native confirmation helper' }
  if (unboundEmbed) { sources['version.go'] += `${embedIndent}//go:embed extra-embed.txt\n`; sources['extra-embed.txt'] = 'uncaptured input' }
  for (const directory of ['core', 'config', 'plugin/loader', 'plugin/plugins', 'repo', 'client', 'test/cli', 'mcp/server', 'mk', 'bin']) await mkdir(join(kubo, directory), { recursive: true })
  for (const path of ['plugin/Rules.mk', 'plugin/loader/Rules.mk', 'plugin/plugins/Rules.mk', 'test/Rules.mk', 'bin/Rules.mk']) sources[path] = 'fixture rule'
  for (const [path, value] of Object.entries(sources)) { await mkdir(dirname(join(kubo, path)), { recursive: true }); await writeFile(join(kubo, path), value) }
  const binary = join(kubo, 'cmd/ipfs/ipfs'); await writeFile(binary, 'fixture binary bytes')
  const tools = join(kubo, 'tools'); await mkdir(tools)
  for (const name of ['go', 'make']) await writeFile(join(tools, name), `fixture ${name} tool`)
  const makeExecutable = join(tools, 'make')
  const head = 'a3bd2fbbe3114e217730b514ef82732a369510ea'
  const commit = `${head.slice(0, 9)}-dirty`
  const buildInfo = `${binary}: go1.27.1\n\tbuild\t-trimpath=true\n\tbuild\tvcs.revision=${head}\n\tbuild\tvcs.modified=true\n${legacy ? '\tbuild\t-ldflags=CurrentCommit= taggedRelease= buildOrigin=\n' : ''}`
  const version = `Kubo version: 0.44.0-dev-${commit}\nRepo version: 18\nSystem version: arm64/darwin\nGolang version: go1.27.1\n`
  const files = Object.keys(sources).filter(path => /\.(?:go|mod|sum|mk)$/.test(path) || path === 'Makefile').sort()
  const inventory = files.join('\0') + '\0'
  const capture = { kuboInputs: await kuboInputs(kubo), buildSource: await snapshot(kubo, files), embedsAndMake: await snapshot(kubo, ['assets', 'mcp/contract', 'mcp/server/confirm/la_prompt.swift', 'mk', 'mcp/app/dist', 'mcp/ui/catalog', 'cmd/ipfs/Rules.mk', 'plugin/Rules.mk', 'plugin/loader/Rules.mk', 'plugin/plugins/Rules.mk', 'test/Rules.mk', 'bin/Rules.mk'], { optional: ['.tarball'] }) }
  let counter = 0
  async function command (argv, stdout) {
    const id = ++counter
    const row = { argv, cwd: kubo, pid: 1200 + id, exitCode: 0, signal: null, startedAt: '2026-01-01T12:00:00.000Z', endedAt: '2026-01-01T12:00:01.000Z', stdoutFile: `${id}.stdout.txt`, stderrFile: `${id}.stderr.txt`, stdoutSha256: sha256(stdout), stderrSha256: sha256('') }
    await writeFile(join(directory, row.stdoutFile), stdout); await writeFile(join(directory, row.stderrFile), '')
    return row
  }
  const commands = [await command(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], inventory), await command(['git', 'rev-parse', 'HEAD'], head + '\n'), await command(['go', 'version'], 'go version go1.27.1 darwin/arm64\n'), await command(['make', 'build'], `go build -mod=readonly "-trimpath" -ldflags="-X "github.com/ipfs/kubo".CurrentCommit=${commit} -X "github.com/ipfs/kubo".taggedRelease= -X "github.com/ipfs/kubo".buildOrigin=github.com/GQAdonis/kubo" -o "cmd/ipfs/ipfs" "github.com/ipfs/kubo/cmd/ipfs"\n`), await command(['go', 'version', '-m', binary], buildInfo)]
  commands.push(await command(['make', '--version'], 'GNU Make 3.81\n'))
  const versionCommand = await command([binary, 'version', '--all'], version)
  const build = { schemaVersion: 1, kind: 'same-checkout-make-build-only', producer: { role: 'mcp_server_engineer', externalCollaboratorReceipt: false }, checkout: kubo, status: 'BLOCKED', error: 'historical metadata predicate', before: capture, after: capture, sourceUnchanged: true, commands, head, goVersion: 'go version go1.27.1 darwin/arm64', makeVersion: 'GNU Make 3.81', startedAt: '2026-01-01T11:59:59.000Z', endedAt: '2026-01-01T12:00:02.000Z' }
  const diagnostic = { schemaVersion: 1, sourceUnchanged: true, binary: { path: binary, bytes: Buffer.byteLength('fixture binary bytes'), sha256: sha256('fixture binary bytes'), buildInfoSha256: sha256(buildInfo), versionSha256: sha256(version), version }, command: versionCommand, kuboInputsSha256: capture.kuboInputs.sha256, buildSourceSha256: capture.buildSource.sha256, embedsAndMakeSha256: capture.embedsAndMake.sha256 }
  const binding = { schemaVersion: 1, kind: 'same-checkout-make-build-artifact-binding', checkout: kubo, current: { head, kuboInputsSha256: capture.kuboInputs.sha256, buildSourceSha256: capture.buildSource.sha256, embedsAndMakeSha256: capture.embedsAndMake.sha256, binarySha256: diagnostic.binary.sha256, buildInfoSha256: diagnostic.binary.buildInfoSha256, versionSha256: diagnostic.binary.versionSha256, toolchain: { goVersion: build.goVersion, makeVersion: build.makeVersion, go: { path: join(tools, 'go'), sha256: sha256('fixture go tool') }, make: { path: makeExecutable, sha256: sha256('fixture make tool') } } } }
  const path = join(directory, 'binding.json')
  async function save () {
    for (const [key, value, name] of [['originalReceipt', build, 'original.json'], ['identityDiagnostic', diagnostic, 'diagnostic.json']]) {
      const bytes = JSON.stringify(value); await writeFile(join(directory, name), bytes); binding[key] = { path: name, sha256: sha256(bytes) }
    }
    await writeFile(path, JSON.stringify(binding))
  }
  await save()
  const processes = {
    run: async (command, args) => {
      const argv = [command, ...args]
      const row = [...commands, versionCommand].find(row => JSON.stringify(row.argv) === JSON.stringify(argv))
      if (!row) throw new Error(`Unexpected command ${JSON.stringify(argv)}`)
      return { ...row, stdout: await readFile(join(directory, row.stdoutFile), 'utf8') }
    }
  }
  return { kubo, directory, binary, path, build, binding, diagnostic, save, run: overrides => makeBinaryIdentity({ kubo, processes, env: { PATH: tools }, makeBuildReceipt: path, ...overrides }) }
}

describe('strict explicit local make build receipt', () => {
  it('accepts complete bound source, embeds, command logs and binary identity while preserving historical BLOCKED', async () => {
    const f = await fixture()
    expect((await f.run()).provenance.method).toBe('same-checkout-make-build-receipt')
    expect(f.build.status).toBe('BLOCKED')
  })
  it('rejects a newly introduced embed target outside the complete captured inputs', async () => {
    const f = await fixture({ unboundEmbed: true })
    await expect(f.run()).rejects.toThrow('embedded input is not bound: extra-embed.txt')
  })
  it('rejects a valid indented Go embed whose input was not captured', async () => {
    const f = await fixture({ unboundEmbed: true, embedIndent: ' \t  ' })
    await expect(f.run()).rejects.toThrow('embedded input is not bound: extra-embed.txt')
  })
  it('keeps genuine Makefile metadata accepted without a receipt', async () => {
    const f = await fixture({ legacy: true })
    expect((await f.run({ makeBuildReceipt: undefined })).provenance.method).toBe('makefile-build-info')
  })
  it('keeps missing metadata blocked when the receipt opt-in is off', async () => {
    const f = await fixture()
    await expect(f.run({ makeBuildReceipt: undefined })).rejects.toThrow('CurrentCommit=')
  })
  for (const [label, mutate] of [
    ['missing receipt', async f => rm(f.path)],
    ['stale source', async f => writeFile(join(f.kubo, 'version.go'), 'changed source')],
    ['stale contract embed', async f => writeFile(join(f.kubo, 'mcp/contract/catalog.json'), '{"tampered":true}')],
    ['stale initial documentation embed', async f => writeFile(join(f.kubo, 'assets/init-doc/readme'), 'changed documentation')],
    ['stale native confirmation embed', async f => writeFile(join(f.kubo, 'mcp/server/confirm/la_prompt.swift'), 'changed native helper')],
    ['stale embed', async f => writeFile(join(f.kubo, 'mcp/app/dist/view.html'), 'changed embed')],
    ['changed binary', async f => writeFile(f.binary, 'changed binary bytes')],
    ['oversized receipt', async f => writeFile(f.path, Buffer.alloc(8 * 1024 * 1024 + 1))],
    ['tampered stdout', async f => writeFile(join(f.directory, f.build.commands[3].stdoutFile), 'tampered')],
    ['tampered stderr', async f => writeFile(join(f.directory, f.build.commands[3].stderrFile), 'tampered')],
    ['symlink receipt', async f => { await rm(f.path); await symlink('original.json', f.path) }],
    ['symlink binary', async f => { await rm(f.binary); await symlink(join(f.kubo, 'version.go'), f.binary) }],
    ['symlink log ancestor', async f => { await mkdir(join(f.kubo, 'logs')); await symlink(join(f.kubo, 'logs'), join(f.directory, 'linked')); f.build.commands[3].stdoutFile = 'linked/stdout'; await writeFile(join(f.kubo, 'logs/stdout'), 'fixture'); f.build.commands[3].stdoutSha256 = sha256('fixture'); await f.save() }],
    ['out-of-root log', async f => { f.build.commands[3].stdoutFile = '../outside.stdout'; await f.save() }],
    ['unsupported make arguments', async f => { f.build.commands[3].argv.push('GOTAGS=noagent'); await f.save() }],
    ['changed current Go tool', async f => writeFile(join(f.kubo, 'tools/go'), 'changed go')],
    ['changed current make tool', async f => writeFile(join(f.kubo, 'tools/make'), 'changed make')],
    ['failed make', async f => { f.build.commands[3].exitCode = 1; await f.save() }],
    ['missing PID', async f => { delete f.build.commands[3].pid; await f.save() }],
    ['missing time', async f => { delete f.build.commands[3].endedAt; await f.save() }],
    ['changed checkout', async f => { f.build.checkout += '-other'; await f.save() }],
    ['bare PASS without evidence', async f => { await writeFile(f.path, JSON.stringify({ status: 'PASS' })) }],
    ['mutated original document', async f => writeFile(join(f.directory, 'original.json'), '{}')],
    ['version hash mismatch', async f => { f.diagnostic.binary.versionSha256 = '0'.repeat(64); await f.save() }],
    ['build info hash mismatch', async f => { f.diagnostic.binary.buildInfoSha256 = '0'.repeat(64); await f.save() }],
    ['removed compile injection', async f => { const row = f.build.commands[3]; const output = (await readFile(join(f.directory, row.stdoutFile), 'utf8')).replace('CurrentCommit=', 'FakeCommit='); await writeFile(join(f.directory, row.stdoutFile), output); row.stdoutSha256 = sha256(output); await f.save() }]
  ]) {
    it(`rejects ${label}`, async () => {
      const f = await fixture(); await f.run(); await mutate(f)
      await expect(f.run()).rejects.toThrow()
    })
  }
})
