import { baselineAuthorityPath, loadBaselineAuthority } from './baseline-authority.mjs'
import assert from 'node:assert/strict'
import { lstat, readFile, realpath } from 'node:fs/promises'
import { basename, isAbsolute, join, relative } from 'node:path'
import { sha256 } from '../../scripts/local-artifact.mjs'

// Closed set of actual V1.4 assertion sources. Evidence cannot choose a different
// helper or omit a shared test merely because its production bundle is current.
export const roleFixturePaths = {
  webui: ['test/boundary/baseline-authority.mjs', 'test/boundary/baseline-authority.json', 'test/boundary/incumbent-source-authority.json', 'src/promethity/roles.test.js', 'src/promethity/role-contrast.test.js', 'test/boundary/role-fixture-binding.test.js', 'scripts/role-coverage.mjs', 'scripts/check-role-coverage.mjs', 'scripts/role-coverage.test.js', 'test/boundary/baseline-sources.mjs', 'test/boundary/baseline-pixels.mjs', 'test/boundary/baseline-pixels.test.js', 'test/boundary/local-fonts.mjs', 'test/boundary/local-fonts.test.js', 'test/boundary/derive-font-fixture.mjs', 'test/boundary/registrations/baseline-fonts.mjs'],
  shared: ['mcp/ui/tests/roles.test.ts', 'mcp/ui/tests/role-contrast.test.ts', 'mcp/ui/tests/helpers/role-contrast.mjs', 'mcp/ui/tests/helpers/role-contrast.d.mts']
}

export async function roleFixtureHashes ({ webuiRoot, kuboRoot }) {
  const hashes = {}
  for (const [host, paths] of Object.entries(roleFixturePaths)) {
    const root = host === 'webui' ? webuiRoot : kuboRoot
    const physicalRoot = await realpath(root)
    for (const file of paths) {
      const path = join(root, file)
      const metadata = await lstat(path)
      const physical = relative(physicalRoot, await realpath(path))
      assert.ok(metadata.isFile() && !metadata.isSymbolicLink() && physical && !physical.startsWith('..') && !isAbsolute(physical), `Role fixture is not a current regular source file: ${host}:${file}`)
      hashes[`${host}:${file}`] = sha256(await readFile(path))
    }
  }
  return hashes
}

export async function assertRoleFixtureBinding (bytes, roots) {
  const record = JSON.parse(bytes.toString('utf8'))
  assert.ok(record && typeof record.fixtureHashes === 'object' && record.fixtureHashes !== null && !Array.isArray(record.fixtureHashes), 'Missing V1.4 role fixture hash binding')
  assert.deepEqual(record.fixtureHashes, await roleFixtureHashes(roots), 'V1.4 role evidence references missing, extra or stale current fixture bytes')
  const authorityPath = baselineAuthorityPath
  await loadBaselineAuthority({ root: roots.webuiRoot })
  assert.ok(record.authority?.path === authorityPath && record.authority.sha256 === sha256(await readFile(join(roots.webuiRoot, authorityPath))), 'Role evidence immutable baseline authority is missing or stale')
}

export async function assertRoleSlotFixtureBinding (artifacts, readEvidence, roots) {
  const bindings = artifacts.filter(file => basename(file.path) === 'role-source-and-runtime-binding.json')
  assert.equal(bindings.length, 1, 'Missing/duplicate V1.4 role fixture binding artifact')
  // The lane's existing reader validates owned evidence paths and actual bytes
  // against their receipt hash before interpreting this source binding.
  await assertRoleFixtureBinding(await readEvidence(bindings[0]), roots)
}
