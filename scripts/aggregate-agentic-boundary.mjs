import { linkFrontendPacket } from '../test/boundary/packet-link.mjs'
import { adoptedContractSha256, adoptedIdentity, contractRelativePath } from '../test/boundary/requirements.mjs'
import { isDeepStrictEqual } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertLocalWebuiExport, sha256, snapshot } from './local-artifact.mjs'
import { assertLaneReceipt, desktopInputs, kuboInputs, laneSlots, slotKey } from '../test/boundary/evidence-schema.mjs'

export async function aggregateBoundary ({ webuiReceipt, desktopReceipt, packetReceipt, output, root = resolve(dirname(fileURLToPath(import.meta.url)), '..'), kubo = resolve(root, '../kubo'), desktop = resolve(root, '../ipfs-desktop') }) {
  const result = { schemaVersion: 1, kind: 'agentic-ui-final-lanes', status: 'BLOCKED', phaseStatus: 'BLOCKED', phaseAcceptance: false, lanes: [], receiptInputs: [], missing: [], limitations: ['Lane evidence is not independent security/UI review or native hardware proof. The lead must include shared-package packet receipts and separate reviewer findings.'] }
  if (packetReceipt) try { result.frontendPacket = await linkFrontendPacket(resolve(packetReceipt), { webui: root, kubo, desktop }) } catch (error) { result.packetReason = error.message }
  for (const [lane, path] of [['WU', webuiReceipt], ['SU', desktopReceipt]]) {
    if (!path) continue
    try { const bytes = await readFile(resolve(path)), value = JSON.parse(bytes); result.receiptInputs.push({ lane, path: resolve(path), sha256: sha256(bytes), status: value.status, validated: false, scenarios: value.scenarios?.map(({ id, status, checks = [] }) => ({ id, status, checks: checks.map(({ id, status, reason, attempted }) => ({ id, status, reason, attempted })) })) }) } catch (error) { result.receiptInputs.push({ lane, path, unavailable: error.message }) }
  }
  try {
    if (!webuiReceipt || !desktopReceipt) throw new Error('Both explicit current WU and SU lane receipt paths are required')
    const contractPath = join(kubo, contractRelativePath)
    const contract = JSON.parse(await readFile(contractPath, 'utf8'))
    contract.fileSha256 = sha256(await readFile(contractPath))
    if (contract.fileSha256 !== adoptedContractSha256 || !isDeepStrictEqual(contract.identity, adoptedIdentity) || contract.scenarioMatrix.length !== 18) throw new Error('Aggregate adopted identity/oracle bytes are stale')
    const artifact = await assertLocalWebuiExport({ root, kubo })
    const { chromium } = await import('@playwright/test')
    const nodeRuntime = { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) }
    const browserRuntime = { executable: chromium.executablePath(), sha256: sha256(await readFile(chromium.executablePath())) }
    const harness = await snapshot(root, ['test', 'scripts', 'package.json', 'package-lock.json', 'vite.config.js', 'vitest.config.js'])
    const kuboSource = await kuboInputs(kubo)
    const common = { contract, artifact, kuboSource, harness, kuboRoot: kubo, webuiRoot: root, desktopRoot: desktop, nodeRuntime, browserRuntime }
    try { result.lanes.push(await assertLaneReceipt(resolve(webuiReceipt), { ...common, lane: 'WU' })) } catch (error) { result.lanes.push({ lane: 'WU', status: 'BLOCKED', reason: error.message, contributions: [] }) }
    try {
      const { assertLocalAssembly } = await import(pathToFileURL(join(desktop, 'scripts/local-assembly.mjs')).href)
      const { localElectron } = await import(pathToFileURL(join(desktop, 'scripts/run-local-desktop.mjs')).href)
      const paths = { source: join(root, 'build'), webuiRoot: root, kuboRoot: kubo, destination: join(desktop, 'assets/webui'), expectedArtifactSha256: artifact.artifactSha256 }
      const runtime = localElectron(desktop, process.env.IPFS_ELECTRON_DIST)
      const desktopCurrent = {
        inputs: await desktopInputs(desktop),
        assembly: await assertLocalAssembly({ root: desktop, shared: join(kubo, 'mcp/ui'), paths }),
        electron: { version: '44.3.0', executable: runtime.executable, sha256: sha256(await readFile(runtime.executable)) }
      }
      result.lanes.push(await assertLaneReceipt(resolve(desktopReceipt), { ...common, lane: 'SU', desktop: desktopCurrent }))
    } catch (error) { result.lanes.push({ lane: 'SU', status: 'BLOCKED', reason: error.message, contributions: [] }) }
    const expected = [...laneSlots('WU'), ...laneSlots('SU')].map(slotKey)
    const actual = result.lanes.flatMap(lane => lane.contributions.map(slotKey))
    for (const key of expected) if (actual.filter(value => value === key).length !== 1) result.missing.push(key)
    if (actual.some(key => !expected.includes(key)) || result.missing.length) throw new Error('Missing, unexpected or duplicate required per-host contribution')
    result.contract = contract.identity
    result.artifactSha256 = artifact.artifactSha256
    result.status = 'PASS'
  } catch (error) { result.reason = error.message }
  const expectedSlots = [...laneSlots('WU'), ...laneSlots('SU')].map(slotKey)
  const observedSlots = result.lanes.flatMap(lane => (lane.contributions || []).map(slotKey))
  result.missing = expectedSlots.filter(key => !observedSlots.includes(key))
  if (result.packetReason) result.status = 'BLOCKED'
  if (output) await writeFile(resolve(output), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  return result
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const options = {}
  while (args.length) {
    const key = args.shift(); const value = args.shift()
    if (!value || !['--webui-receipt', '--desktop-receipt', '--packet-receipt', '--output'].includes(key)) throw new Error('Use --webui-receipt <manifest> --desktop-receipt <manifest> [--packet-receipt <outer-manifest>] --output <new-file>')
    options[{ '--webui-receipt': 'webuiReceipt', '--desktop-receipt': 'desktopReceipt', '--packet-receipt': 'packetReceipt', '--output': 'output' }[key]] = value
  }
  const result = await aggregateBoundary(options)
  console.log(JSON.stringify(result, null, 2))
  process.exitCode = result.status === 'PASS' ? 0 : 2
}
