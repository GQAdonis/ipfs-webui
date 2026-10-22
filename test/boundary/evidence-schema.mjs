import { assertCompatibilityPayload } from './collaborator-inputs.mjs'
import { lstat, readFile, realpath } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { assertSame, digest, sha256, snapshot } from '../../scripts/local-artifact.mjs'
import { adoptedContractSha256, adoptedDigest, requirements } from './requirements.mjs'
import { assertRoleSlotFixtureBinding } from './role-fixture-binding.mjs'

export function laneSlots (lane) {
  const owned = []
  for (const [scenario, slots] of Object.entries(requirements)) {
    if (lane === 'WU' && scenario !== 'UI-110') for (const id of slots) if (id !== 'desktop-shell-overlays') owned.push({ scenario, id, host: 'webui' })
    if (lane === 'SU' && (scenario === 'UI-110' || scenario === 'UI-112')) for (const id of slots) owned.push({ scenario, id, host: 'desktop' })
  }
  if (lane === 'SU') {
    owned.push({ scenario: 'UI-101', id: 'react-runtime', host: 'desktop' })
    owned.push({ scenario: 'UI-118', id: 'desktop-shell-overlays', host: 'desktop' })
  }
  return owned
}
export const slotKey = slot => `${slot.scenario}/${slot.id}/${slot.host}`
export const desktopInputs = root => snapshot(root, ['src', 'scripts', 'test', 'assets/build', 'assets/icons', 'package.json', 'package-lock.json'], { optional: ['.npmrc', '.tool-versions'] })
export const kuboInputs = root => snapshot(root, ['cmd', 'core', 'config', 'plugin', 'repo', 'client', 'test/cli', 'mcp/server', 'go.mod', 'go.sum', 'Makefile', 'version.go'], {
  optional: ['Rules.mk', 'test/dependencies/go.mod', 'test/dependencies/go.sum', 'docs/examples/kubo-as-a-library/go.mod', 'docs/examples/kubo-as-a-library/go.sum'],
  exclude: path => path === 'cmd/ipfs/ipfs' || /(?:^|\/)evidence(?:\/|$)/.test(path)
})

async function evidenceFile (receiptPath, file, expected) {
  const base = dirname(receiptPath)
  const path = isAbsolute(file) ? file : resolve(base, file)
  const rel = relative(base, path)
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Evidence file is outside its lane run: ${file}`)
  const physical = relative(await realpath(base), await realpath(path))
  if (physical.startsWith('..') || isAbsolute(physical) || (await lstat(path)).isSymbolicLink()) throw new Error(`Evidence symlink escapes or replaces an owned file: ${file}`)
  const bytes = await readFile(path)
  if (!/^[a-f0-9]{64}$/.test(expected) || sha256(bytes) !== expected) throw new Error(`Evidence bytes are absent or stale: ${file}`)
  return bytes
}

// Validates concrete evidence structure and freshness, never trusts a bare PASS.
// Independent final reviewers still evaluate whether assertions meet the oracle.
export async function assertLaneReceipt (path, { lane, contract, artifact, kuboSource, harness, desktop, kuboRoot, webuiRoot, desktopRoot, nodeRuntime, browserRuntime }) {
  const receipt = JSON.parse(await readFile(path, 'utf8'))
  if (receipt.schemaVersion !== 1 || receipt.lane !== lane || receipt.execution !== 'real-local-boundary' || !receipt.runId || receipt.status !== 'PASS' || receipt.interrupted || receipt.cleanup?.length) throw new Error(`Missing or unsuccessful ${lane} boundary execution receipt`)
  if (receipt.contract?.identity?.contractDigest !== adoptedDigest || JSON.stringify(receipt.contract.identity) !== JSON.stringify(contract.identity) || receipt.contract.fileSha256 !== contract.fileSha256 || receipt.contract.fileSha256 !== adoptedContractSha256) throw new Error(`${lane} adopted contract identity differs`)
  assertSame(receipt.ownedSlots, laneSlots(lane), `${lane} declared assertion ownership`)
  assertSame(receipt.adoptedOracles, contract.scenarioMatrix.map(({ id, name, oracle, negativeControl }) => ({ id, name, oracle, negativeControl })), `${lane} complete adopted oracle inventory`)
  assertSame(receipt.artifact?.inputs, artifact.inputs, `${lane} current WebUI/shared/contract inputs`)
  if (receipt.artifact?.sha256 !== artifact.artifactSha256) throw new Error(`${lane} current WebUI artifact differs`)
  assertSame(receipt.artifact?.reactRuntime, artifact.reactRuntime, `${lane} actual WebUI runtime inputs`)
  assertSame(receipt.artifact?.sharedArtifacts, artifact.sharedArtifacts, `${lane} shared dependency outputs`)
  assertSame(receipt.kuboInputs, kuboSource, `${lane} current Kubo source/lock/CLI fixtures`)
  assertSame(receipt.node, nodeRuntime, `${lane} actual boundary Node executable/version`)
  if (lane === 'WU') {
    assertSame(receipt.harness, harness, 'WU current harness/fixture source')
    if (!receipt.browser || receipt.browser.executable !== browserRuntime.executable || receipt.browser.executableSha256 !== browserRuntime.sha256) throw new Error('WU actual pinned browser executable changed or is not recorded')
  }
  else {
    assertSame(receipt.desktop?.inputs, desktop.inputs, 'SU current Desktop source/lock/fixtures')
    assertSame(receipt.desktop?.assembly, desktop.assembly, 'SU current local Desktop assembly/runtime artifacts')
    assertSame(receipt.desktop?.electron, desktop.electron, 'SU current actual Electron executable')
  }
  if (!Array.isArray(receipt.commands) || !receipt.commands.length) throw new Error(`${lane} has no actual command receipts`)
  for (const command of receipt.commands) {
    if (!Array.isArray(command.argv) || !command.argv.length || !command.cwd || !command.pid || !command.endedAt || (command.exitCode === null && !command.signal)) throw new Error(`${lane} has an incomplete command receipt`)
    await evidenceFile(path, command.stdoutFile, command.stdoutSha256)
    await evidenceFile(path, command.stderrFile, command.stderrSha256)
    if (command.spawnError || command.timedOut || (command.exitCode !== 0 && !['SIGTERM', 'SIGKILL'].includes(command.signal))) throw new Error(`${lane} command failed or never exercised its required process`)
  }
  const contributions = []
  const expectedKeys = new Set(laneSlots(lane).map(slotKey))
  for (const scenario of receipt.scenarios || []) for (const check of scenario.checks || []) {
    if ((check.attempted || check.status === 'PASS') && !expectedKeys.has(slotKey({ scenario: scenario.id, id: check.id, host: check.host }))) throw new Error(`Unexpected or duplicate-lane execution ${scenario.id}/${check.id}/${check.host}`)
  }
  for (const expected of laneSlots(lane)) {
    const scenario = receipt.scenarios.filter(item => item.id === expected.scenario)
    if (scenario.length !== 1) throw new Error(`Missing/duplicate ${lane} scenario ${expected.scenario}`)
    const matches = scenario[0].checks.filter(check => check.id === expected.id && check.host === expected.host)
    if (matches.length !== 1) throw new Error(`Missing/duplicate contribution ${slotKey(expected)}`)
    const check = matches[0]
    if (check.status !== 'PASS' || !check.attempted || !check.observations?.length || !check.artifacts?.length || !check.implementation?.sha256) throw new Error(`Unexercised contribution ${slotKey(expected)}`)
    for (const observation of check.observations) if (!observation.description) throw new Error(`Empty observation ${slotKey(expected)}`)
    const implementationRoot = lane === 'WU' ? webuiRoot : desktopRoot
    const implementationFile = relative(implementationRoot, resolve(implementationRoot, check.implementation.path)).replaceAll('\\', '/')
    const source = lane === 'WU' ? harness.files : desktop.inputs.files
    if (implementationFile.startsWith('../') || !/^(?:test|scripts)\//.test(implementationFile) || source[implementationFile] !== check.implementation.sha256) throw new Error(`Current assertion implementation is absent/stale ${slotKey(expected)}`)
    const screenshots = []
    for (const file of check.artifacts) {
      const bytes = await evidenceFile(path, file.path, file.sha256)
      if (file.path.endsWith('.png')) {
        if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Screenshot is not actual PNG bytes')
        screenshots.push(file)
      }
    }
    if (lane === 'WU' && expected.scenario === 'UI-102' && ['role-parity', 'role-contrast', 'local-fonts', 'immutable-token-baseline'].includes(expected.id)) {
      await assertRoleSlotFixtureBinding(check.artifacts, file => evidenceFile(path, file.path, file.sha256), { webuiRoot, kuboRoot })
    }
    if (check.requires?.includes('browser') && !screenshots.length) throw new Error(`Browser contribution has no actual screenshot ${slotKey(expected)}`)
    contributions.push({ ...expected, observations: check.observations.length, screenshots: screenshots.length, receipt: path, implementation: check.implementation })
  }
  if (lane === 'WU') {
    const scenario = receipt.scenarios.find(item => item.id === 'UI-113'), check = scenario?.checks.find(item => item.id === 'kubo-cli-families')
    const publicReceipt = check?.artifacts.filter(file => file.path.endsWith('claude-kubo-compatibility-compatibility.json')) || []
    if (publicReceipt.length !== 1) throw new Error('Exact retained source-bound Claude compatibility receipt is missing/duplicated')
    const external = JSON.parse((await evidenceFile(path, publicReceipt[0].path, publicReceipt[0].sha256)).toString('utf8'))
    const stdout = check.artifacts.find(file => file.path.endsWith('claude-kubo-compatibility-compatibility.json.stdout.txt'))
    const stderr = check.artifacts.find(file => file.path.endsWith('claude-kubo-compatibility-compatibility.json.stderr.txt'))
    if (!stdout || !stderr || stdout.sha256 !== external.command?.stdout?.sha256 || stderr.sha256 !== external.command?.stderr?.sha256) throw new Error('Claude actual compatibility log bytes are missing/stale')
    const output = (await evidenceFile(path, stdout.path, stdout.sha256)).toString('utf8')
    await evidenceFile(path, stderr.path, stderr.sha256)
    assertCompatibilityPayload(external, output, { contract, sourceSha256: kuboSource.sha256, binarySha256: sha256(await readFile(join(kuboRoot, 'cmd/ipfs/ipfs'))), kuboRoot })
  }
  return { lane, path, sha256: sha256(await readFile(path)), runId: receipt.runId, contributions, contributionSha256: digest(Object.fromEntries(contributions.map(item => [slotKey(item), item.implementation.sha256]))) }
}
