// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { adoptedContractSha256, adoptedIdentity } from './requirements.mjs'
import { linkFrontendPacket } from './packet-link.mjs'
import { sha256 } from '../../scripts/local-artifact.mjs'
const owned = []
afterEach(async () => { for (const root of owned.splice(0)) await rm(root, { recursive: true, force: true }) })
async function fixture () {
  const root = await mkdtemp(join(tmpdir(), 'packet-link-')); owned.push(root)
  const webui = join(root, 'webui'); const packet = join(root, 'packet')
  await mkdir(join(webui, 'src'), { recursive: true }); await mkdir(packet)
  await writeFile(join(webui, 'src/fixture.js'), 'Exact source fixture')
  await writeFile(join(packet, 'stdout.txt'), 'Explicit command fixture output'); await writeFile(join(packet, 'stderr.txt'), '')
  const value = { kind: 'frontend-final-packet', phaseAcceptance: false, status: 'FAIL', contract: { identity: { ...adoptedIdentity }, fileSha256: adoptedContractSha256 }, sourceAfter: { sha256: 'fixture-only-source-digest', files: { 'webui/src/fixture.js': sha256('Exact source fixture') } }, commands: [{ id: 'webui-eslint', attempted: true, status: 'FAIL', receipt: { pid: 1234, argv: ['pnpm', 'run', 'eslint'], cwd: webui, endedAt: '2026-10-20T12:00:00Z', exitCode: 1, stdoutFile: 'stdout.txt', stdoutSha256: sha256('Explicit command fixture output'), stderrFile: 'stderr.txt', stderrSha256: sha256('') } }] }
  const path = join(packet, 'manifest.json'); const save = () => writeFile(path, JSON.stringify(value))
  await save()
  const check = () => linkFrontendPacket(path, { webui, kubo: join(root, 'kubo'), desktop: join(root, 'desktop') })
  return { root, webui, packet, path, value, save, check }
}
it('preserves actual failed command facts without importing a phase PASS', async () => {
  const f = await fixture()
  await expect(f.check()).resolves.toMatchObject({ status: 'FAIL', phaseAcceptance: false, commands: [{ id: 'webui-eslint', attempted: true, status: 'FAIL' }] })
})
it('rejects stale current source and independently altered retained command logs', async () => {
  const f = await fixture()
  await writeFile(join(f.webui, 'src/fixture.js'), 'Changed later')
  await expect(f.check()).rejects.toThrow('source is stale')
  await writeFile(join(f.webui, 'src/fixture.js'), 'Exact source fixture')
  await writeFile(join(f.packet, 'stdout.txt'), 'Changed evidence')
  await expect(f.check()).rejects.toThrow('log bytes')
})
it('rejects a different adoption, generic PASS and escaping source map', async () => {
  const f = await fixture()
  f.value.contract.identity.phaseId = 'agentic-ui-implementation'; await f.save()
  await expect(f.check()).rejects.toThrow('different-identity')
  f.value.contract.identity = { ...adoptedIdentity }; f.value.phaseAcceptance = true; await f.save()
  await expect(f.check()).rejects.toThrow('generic')
  f.value.phaseAcceptance = false; f.value.sourceAfter.files = { 'webui/../private.txt': '0'.repeat(64) }; await f.save()
  await expect(f.check()).rejects.toThrow('escapes')
})
