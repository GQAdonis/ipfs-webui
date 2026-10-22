// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { assertRoleFixtureBinding, assertRoleSlotFixtureBinding, roleFixtureHashes, roleFixturePaths } from './role-fixture-binding.mjs'
import { sha256 } from '../../scripts/local-artifact.mjs'

const owned = []
afterEach(async () => { for (const directory of owned.splice(0)) await rm(directory, { recursive: true, force: true }) })
async function fixture () {
  const directory = await mkdtemp(join(tmpdir(), 'role-fixture-binding-'))
  owned.push(directory)
  const roots = { webuiRoot: join(directory, 'webui'), kuboRoot: join(directory, 'kubo') }
  for (const [host, paths] of Object.entries(roleFixturePaths)) {
    for (const file of paths) {
      const path = join(host === 'webui' ? roots.webuiRoot : roots.kuboRoot, file)
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, `current fixture ${host}:${file}\n`)
    }
  }
  const authorityPath = 'test/boundary/incumbent-source-authority.json'
  await mkdir(dirname(join(roots.webuiRoot, authorityPath)), { recursive: true })
  await writeFile(join(roots.webuiRoot, authorityPath), '{"fixture":"immutable source identity"}\n')
  const imported = 'docs/design/baselines/react19-foundation-inputs/manifest.json'
  await mkdir(dirname(join(roots.webuiRoot, imported)), { recursive: true })
  await writeFile(join(roots.webuiRoot, imported), '{}')
  await writeFile(join(roots.webuiRoot, 'test/boundary/baseline-authority.json'), JSON.stringify({ incumbent: { root: 'webui', path: authorityPath, sha256: sha256('{"fixture":"immutable source identity"}\n') }, importedPreF2: { root: 'webui', path: imported, sha256: sha256('{}') } }))
  return { roots, binding: { fixtureHashes: await roleFixtureHashes(roots), authority: { path: authorityPath, sha256: sha256('{"fixture":"immutable source identity"}\n') } } }
}
const bytes = record => Buffer.from(JSON.stringify(record))

describe('final aggregation revalidates V1.4 assertion sources', () => {
  it('accepts only the exact current closed set of actual fixture bytes', async () => {
    const { roots, binding } = await fixture()
    await expect(assertRoleFixtureBinding(bytes(binding), roots)).resolves.toBeUndefined()
  })
  it('rejects a shared helper edit after the browser slot even if its old evidence hash is intact', async () => {
    const { roots, binding } = await fixture()
    await writeFile(join(roots.kuboRoot, 'mcp/ui/tests/helpers/role-contrast.mjs'), 'changed after the slot\n')
    await expect(assertRoleFixtureBinding(bytes(binding), roots)).rejects.toThrow('stale current fixture bytes')
  })
  it('rejects missing current source, omitted hashes and generic source-free evidence', async () => {
    const { roots, binding } = await fixture()
    const missingHash = structuredClone(binding)
    delete missingHash.fixtureHashes['shared:mcp/ui/tests/role-contrast.test.ts']
    await expect(assertRoleFixtureBinding(bytes(missingHash), roots)).rejects.toThrow('stale current fixture bytes')
    await expect(assertRoleFixtureBinding(bytes({ status: 'PASS' }), roots)).rejects.toThrow('Missing V1.4')
    await unlink(join(roots.kuboRoot, 'mcp/ui/tests/role-contrast.test.ts'))
    await expect(assertRoleFixtureBinding(bytes(binding), roots)).rejects.toThrow()
  })
  it('rejects extra/redirected fixture identities and a mismatched recorded hash', async () => {
    const { roots, binding } = await fixture()
    await expect(assertRoleFixtureBinding(bytes({ fixtureHashes: { ...binding.fixtureHashes, 'shared:other-helper.mjs': '0'.repeat(64) } }), roots)).rejects.toThrow('stale current fixture bytes')
    const stale = structuredClone(binding)
    stale.fixtureHashes['shared:mcp/ui/tests/helpers/role-contrast.mjs'] = '0'.repeat(64)
    await expect(assertRoleFixtureBinding(bytes(stale), roots)).rejects.toThrow('stale current fixture bytes')
  })
  it('requires exactly one source-binding artifact before reading it through the evidence verifier', async () => {
    const { roots, binding } = await fixture()
    const artifact = { path: '/owned/run/role-source-and-runtime-binding.json', sha256: 'recorded-by-lane' }
    const observed = []
    const readEvidence = async file => { observed.push(file); return bytes(binding) }
    await expect(assertRoleSlotFixtureBinding([], readEvidence, roots)).rejects.toThrow('Missing/duplicate')
    await expect(assertRoleSlotFixtureBinding([artifact, artifact], readEvidence, roots)).rejects.toThrow('Missing/duplicate')
    expect(observed).toHaveLength(0)
    await expect(assertRoleSlotFixtureBinding([artifact], readEvidence, roots)).resolves.toBeUndefined()
    expect(observed).toEqual([artifact])
  })
  it('rejects missing or changed immutable source authority after a capture', async () => {
    const { roots, binding } = await fixture()
    await expect(assertRoleFixtureBinding(bytes({ fixtureHashes: binding.fixtureHashes }), roots)).rejects.toThrow('baseline authority')
    await writeFile(join(roots.webuiRoot, binding.authority.path), 'different baseline authority\n')
    binding.fixtureHashes = await roleFixtureHashes(roots)
    await expect(assertRoleFixtureBinding(bytes(binding), roots)).rejects.toThrow('baseline authority')
  })
})
