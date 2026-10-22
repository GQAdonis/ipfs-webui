import { constants } from 'node:fs'
import { lstat, open, readFile, realpath } from 'node:fs/promises'
import { delimiter, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { digest, safeRelativePath, sha256, snapshot } from '../../scripts/local-artifact.mjs'
import { kuboInputs } from './evidence-schema.mjs'
import { Blocked } from './processes.mjs'

const inventoryArgs = ['ls-files', '--cached', '--others', '--exclude-standard', '-z']
const embedPaths = ['assets', 'mcp/contract', 'mcp/server/confirm/la_prompt.swift', 'mk', 'mcp/app/dist', 'mcp/ui/catalog', 'cmd/ipfs/Rules.mk', 'plugin/Rules.mk', 'plugin/loader/Rules.mk', 'plugin/plugins/Rules.mk', 'test/Rules.mk', 'bin/Rules.mk']
const same = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Blocked(`Make build receipt ${label} differs or is stale`)
}
const requireValue = (condition, label) => { if (!condition) throw new Blocked(`Make build receipt ${label}`) }

async function executableIdentity (command, env) {
  const candidates = isAbsolute(command) ? [command] : (env?.PATH || process.env.PATH || '').split(delimiter).filter(Boolean).map(directory => join(directory, command))
  for (const candidate of candidates) {
    try {
      const path = await realpath(candidate)
      if (!(await lstat(path)).isFile()) continue
      return { path, sha256: sha256(await readFile(path)) }
    } catch (error) { if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error }
  }
  throw new Blocked(`Make build receipt current tool is unavailable: ${command}`)
}

// A receipt is an explicitly selected local evidence file, never an environment
// fallback or a bare PASS. Reject symlinks in every component, including parents.
async function ownedFile (base, name, expected) {
  requireValue(typeof name === 'string' && name.length > 0, 'file path is absent')
  const path = resolve(base, name)
  const rel = relative(base, path)
  requireValue(rel && !rel.startsWith('..') && !isAbsolute(rel), 'file escapes its evidence directory')
  requireValue(await realpath(path) === path && (await lstat(path)).isFile(), 'file must be a regular non-symlink file')
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  let bytes
  try {
    const metadata = await handle.stat()
    requireValue(metadata.isFile() && metadata.size <= 8 * 1024 * 1024, 'file exceeds the bounded regular evidence limit')
    const buffer = Buffer.alloc(metadata.size + 1)
    let offset = 0
    while (offset < buffer.length) {
      const { bytesRead } = await handle.read(buffer, offset, buffer.length - offset, offset)
      if (!bytesRead) break
      offset += bytesRead
    }
    requireValue(offset === metadata.size, 'file changed during bounded read')
    bytes = buffer.subarray(0, offset)
  } finally { await handle.close() }
  if (expected !== undefined) requireValue(/^[a-f0-9]{64}$/.test(expected) && sha256(bytes) === expected, 'file hash differs')
  return bytes
}

function sourceFiles (output) {
  return output.split('\0').filter(path => path && !/(?:^|\/)evidence(?:\/|$)/.test(path) && (/\.(?:go|mod|sum|mk)$/.test(path) || path === 'Makefile')).sort()
}

// Guard against a future Go embed outside the maintained capture roots. Parse
// only the simple in-repository directive form supported by this build proof;
// unsupported syntax blocks rather than silently narrowing the input set.
async function assertEmbedCoverage (kubo, files, capture) {
  const captured = Object.assign({}, ...Object.values(capture).map(item => item.files))
  for (const source of files.filter(path => path.endsWith('.go') && !path.endsWith('_test.go'))) {
    const text = await readFile(join(kubo, source), 'utf8')
    for (const [, patterns] of text.matchAll(/^[ \t]*\/\/go:embed[ \t]+(.+)$/gm)) {
      for (const raw of patterns.trim().split(/\s+/)) {
        const pattern = raw.replace(/^all:/, '')
        requireValue(!/["'`]/.test(pattern), 'embed directive syntax is unsupported')
        safeRelativePath(pattern)
        const wildcard = pattern.search(/[?*[]/)
        const prefix = wildcard < 0 ? pattern : pattern.slice(0, wildcard)
        const input = wildcard < 0 ? prefix : prefix.includes('/') ? prefix.slice(0, prefix.lastIndexOf('/')) : ''
        const path = input ? join(dirname(source), input) : dirname(source)
        safeRelativePath(path)
        const embedded = await snapshot(kubo, [path])
        for (const [file, hash] of Object.entries(embedded.files)) requireValue(captured[file] === hash, `embedded input is not bound: ${file}`)
      }
    }
  }
}

async function currentInputs (kubo, files) {
  for (const path of files) safeRelativePath(path)
  const capture = {
    kuboInputs: await kuboInputs(kubo),
    buildSource: await snapshot(kubo, files),
    embedsAndMake: await snapshot(kubo, embedPaths, { optional: ['.tarball'] })
  }
  for (const path of new Set(Object.values(capture).flatMap(item => Object.keys(item.files)))) {
    const file = join(kubo, path)
    requireValue(await realpath(file) === file && (await lstat(file)).isFile(), 'source or embed is a symlink or irregular file')
  }
  await assertEmbedCoverage(kubo, files, capture)
  return capture
}

function completeSnapshot (capture) {
  requireValue(capture && Object.keys(capture).sort().join(',') === 'buildSource,embedsAndMake,kuboInputs', 'source captures are incomplete')
  for (const item of Object.values(capture)) {
    requireValue(item.files && Object.keys(item.files).length > 0 && item.sha256 === digest(item.files), 'source capture digest is invalid')
    for (const [path, hash] of Object.entries(item.files)) { safeRelativePath(path); requireValue(/^[a-f0-9]{64}$/.test(hash), 'source file hash is invalid') }
  }
}

async function commandOutput (directory, command, kubo, argv) {
  requireValue(command && command.cwd === kubo && command.pid > 0 && Number.isInteger(command.pid) && command.exitCode === 0 && command.signal === null && !command.timedOut, 'command identity or successful exit is absent')
  same(command.argv, argv, 'command argv')
  const start = Date.parse(command.startedAt); const end = Date.parse(command.endedAt)
  requireValue(Number.isFinite(start) && Number.isFinite(end) && end >= start && end <= Date.now(), 'command time bounds are invalid')
  const stdout = await ownedFile(directory, command.stdoutFile, command.stdoutSha256)
  await ownedFile(directory, command.stderrFile, command.stderrSha256)
  return stdout.toString('utf8')
}

/** Verify local make build provenance when Go trimpath omits ldflags metadata. */
export async function assertMakeBuildReceipt ({ path, kubo, binary, buildInfo, version, processes, env }) {
  try {
    requireValue(await realpath(kubo) === kubo, 'checkout root is a symlink')
    const receiptPath = resolve(path)
    const bytes = await ownedFile(join(kubo, 'evidence'), relative(join(kubo, 'evidence'), receiptPath))
    const binding = JSON.parse(bytes)
    requireValue(binding.schemaVersion === 1 && binding.kind === 'same-checkout-make-build-artifact-binding' && binding.checkout === kubo, 'binding schema or checkout is unsupported')
    const directory = dirname(receiptPath)
    const build = JSON.parse(await ownedFile(directory, binding.originalReceipt?.path, binding.originalReceipt?.sha256))
    const diagnostic = JSON.parse(await ownedFile(directory, binding.identityDiagnostic?.path, binding.identityDiagnostic?.sha256))
    requireValue(diagnostic.schemaVersion === 1, 'diagnostic schema is unsupported')
    requireValue(build.schemaVersion === 1 && build.kind === 'same-checkout-make-build-only' && build.checkout === kubo && build.producer?.role === 'mcp_server_engineer' && build.producer?.externalCollaboratorReceipt === false, 'original build identity is unsupported')
    // The historical overall BLOCKED result is retained. Every successful-build
    // predicate below is checked directly; neither document's verdict is trusted.
    completeSnapshot(build.before); completeSnapshot(build.after)
    same(build.before, build.after, 'source before/after')
    requireValue(build.sourceUnchanged === true && diagnostic.sourceUnchanged === true, 'source changed during build')
    requireValue(Array.isArray(build.commands), 'command inventory is absent')
    const command = argv => {
      const matches = build.commands.filter(row => JSON.stringify(row.argv) === JSON.stringify(argv))
      requireValue(matches.length === 1, 'command inventory is missing or ambiguous')
      return matches[0]
    }
    const inventory = await commandOutput(directory, command(['git', ...inventoryArgs]), kubo, ['git', ...inventoryArgs])
    const files = sourceFiles(inventory)
    same(files, Object.keys(build.before.buildSource.files).sort(), 'complete source inventory')
    const liveInventory = await processes.run('git', inventoryArgs, { cwd: kubo, env, label: 'make-receipt-source-inventory' })
    same(sourceFiles(liveInventory.stdout), files, 'current complete source inventory')
    same(await currentInputs(kubo, files), build.before, 'current source and embeds')
    const head = (await commandOutput(directory, command(['git', 'rev-parse', 'HEAD']), kubo, ['git', 'rev-parse', 'HEAD'])).trim()
    requireValue(/^[a-f0-9]{40}$/.test(head) && head === build.head, 'source HEAD is invalid')
    same((await processes.run('git', ['rev-parse', 'HEAD'], { cwd: kubo, env, label: 'make-receipt-head' })).stdout.trim(), head, 'current source HEAD')
    const goVersion = (await commandOutput(directory, command(['go', 'version']), kubo, ['go', 'version'])).trim()
    same(goVersion, build.goVersion, 'recorded Go version')
    same((await processes.run('go', ['version'], { cwd: kubo, env, label: 'make-receipt-go-version' })).stdout.trim(), goVersion, 'current Go version')
    const makeCandidates = build.commands.filter(row => ['make', '/usr/bin/make'].includes(row.argv?.[0]) && row.argv?.[1] === 'build')
    requireValue(makeCandidates.length === 1, 'canonical make build command is absent or ambiguous')
    const make = makeCandidates[0]
    const makeVersion = (await commandOutput(directory, command([make.argv[0], '--version']), kubo, [make.argv[0], '--version'])).split('\n')[0]
    same(makeVersion, build.makeVersion, 'recorded make version')
    same((await processes.run(make.argv[0], ['--version'], { cwd: kubo, env, label: 'make-receipt-make-version' })).stdout.split('\n')[0], makeVersion, 'current make version')
    requireValue(binding.current?.toolchain, 'current tool observations are absent')
    same(binding.current.toolchain.goVersion, goVersion, 'binding current Go version')
    same(binding.current.toolchain.makeVersion, makeVersion, 'binding current make version')
    same(await executableIdentity('go', env), binding.current.toolchain.go, 'current Go executable')
    same(await executableIdentity(make.argv[0], env), binding.current.toolchain.make, 'current make executable')
    const output = await commandOutput(directory, make, kubo, [make.argv[0], 'build'])
    requireValue(Date.parse(make.startedAt) >= Date.parse(build.startedAt) && Date.parse(make.endedAt) <= Date.parse(build.endedAt), 'build time lies outside source captures')
    const compileLines = output.split('\n').filter(line => line.startsWith('go build '))
    requireValue(compileLines.length === 1, 'canonical Go invocation is absent or ambiguous')
    const injection = compileLines[0].match(/^go build -mod=readonly "-trimpath" -ldflags="-X "github\.com\/ipfs\/kubo"\.CurrentCommit=([a-f0-9]{9}(?:-dirty)?) -X "github\.com\/ipfs\/kubo"\.taggedRelease=([^\s"]*) -X "github\.com\/ipfs\/kubo"\.buildOrigin=([A-Za-z0-9._/-]+)" -o "cmd\/ipfs\/ipfs" "github\.com\/ipfs\/kubo\/cmd\/ipfs"$/)
    requireValue(injection && injection[1].startsWith(head.slice(0, 9)), 'canonical Makefile injections or output target differ')
    const retainedInfo = await commandOutput(directory, command(['go', 'version', '-m', binary]), kubo, ['go', 'version', '-m', binary])
    same(buildInfo, retainedInfo, 'current binary build info')
    same(version, await commandOutput(directory, diagnostic.command, kubo, [binary, 'version', '--all']), 'current binary version')
    const toolchain = goVersion.match(/^go version (go\S+) (\S+)$/)
    requireValue(toolchain && buildInfo.startsWith(`${binary}: ${toolchain[1]}\n`) && buildInfo.includes('\tbuild\t-trimpath=true\n') && buildInfo.includes(`\tbuild\tvcs.revision=${head}\n`) && buildInfo.includes(`\tbuild\tvcs.modified=${injection[1].endsWith('-dirty')}\n`), 'trimpath toolchain or VCS identity differs')
    const versionSource = await readFile(join(kubo, 'version.go'), 'utf8')
    const currentVersion = versionSource.match(/const CurrentVersionNumber = "([^"]+)"/)?.[1]
    requireValue(currentVersion && version.startsWith(`Kubo version: ${currentVersion}-${injection[1]}\n`) && version.includes(`Golang version: ${toolchain[1]}\n`), 'Makefile commit or current version differs')
    const binaryBytes = await readFile(binary)
    const identity = diagnostic.binary
    requireValue(identity?.path === binary && identity.sha256 === sha256(binaryBytes) && identity.bytes === binaryBytes.length && identity.buildInfoSha256 === sha256(buildInfo) && identity.versionSha256 === sha256(version) && identity.version === version, 'binary bytes or identity hashes differ')
    for (const [key, value] of Object.entries({ head, kuboInputsSha256: build.before.kuboInputs.sha256, buildSourceSha256: build.before.buildSource.sha256, embedsAndMakeSha256: build.before.embedsAndMake.sha256, binarySha256: identity.sha256, buildInfoSha256: identity.buildInfoSha256, versionSha256: identity.versionSha256 })) same(binding.current[key], value, `binding current ${key}`)
    same(diagnostic.kuboInputsSha256, build.before.kuboInputs.sha256, 'diagnostic Kubo inputs')
    same(diagnostic.buildSourceSha256, build.before.buildSource.sha256, 'diagnostic build source')
    same(diagnostic.embedsAndMakeSha256, build.before.embedsAndMake.sha256, 'diagnostic embed source')
    return { method: 'same-checkout-make-build-receipt', path: receiptPath, sha256: sha256(bytes), buildCommand: { argv: make.argv, cwd: make.cwd, pid: make.pid, startedAt: make.startedAt, endedAt: make.endedAt, stdoutSha256: make.stdoutSha256, stderrSha256: make.stderrSha256 }, inputs: Object.fromEntries(Object.entries(build.before).map(([key, value]) => [key, value.sha256])), scope: 'local-build-identity-only' }
  } catch (error) {
    if (error instanceof Blocked) throw error
    throw new Blocked(`Make build receipt invalid or unavailable: ${error.message}`)
  }
}
