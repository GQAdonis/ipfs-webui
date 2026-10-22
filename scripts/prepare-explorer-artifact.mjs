import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertExplorerFreshness } from '../vendor/ipld-explorer-components/scripts/freshness.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
function run (command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, COREPACK_ENABLE_AUTO_PIN: '0' }, shell: process.platform === 'win32' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Explorer preparation stopped (${command} exited ${result.status}); no stale-artifact fallback`)
}
// The fork has an isolated original-protocol lock. Never install it against the
// host's dependency graph, and never patch the installed packed copy.
run(npm, ['ci', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund'], resolve(root, 'vendor/ipld-explorer-components'))
run(process.execPath, ['vendor/ipld-explorer-components/scripts/build-artifact.mjs'])
// npm may reuse a same-version file dependency. Removing this exact dependency
// before reinstalling records the new tar integrity and copies current source.
run(npm, ['uninstall', 'ipld-explorer-components', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund'])
run(npm, ['install', '--save-exact', 'file:vendor/ipld-explorer-components', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund'])
const receipt = await assertExplorerFreshness(root)
console.log(`Prepared local Explorer ${receipt.version}; source ${receipt.sourceSha256}`)
