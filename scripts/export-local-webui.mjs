import { spawnSync } from 'node:child_process'
import { cp, copyFile, lstat, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { assertExplorerFreshness } from '../vendor/ipld-explorer-components/scripts/freshness.mjs'
import { authoritativeInputs, assertSame, digest, EXPORT_MANIFEST, locations, sha256, slash, SHARED_PACKAGES, sharedArtifacts, sourceInputs, treeFiles } from './local-artifact.mjs'
import { exportReactRuntime } from './export-react-runtime.mjs'
import { copyExportNotices } from './export-notices.mjs'
import { buildEnvironment } from './build-environment.js'
import { createWebuiConfig } from '../vite.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(root, 'package.json'))
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
function run (command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, COREPACK_ENABLE_AUTO_PIN: '0' }, shell: process.platform === 'win32' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Local dependency generation stopped: ${command} exited ${result.status}`)
}

async function promote (stage, output) {
  const backup = join(dirname(stage), 'previous-build')
  let hadPrevious = false
  try { await lstat(output); hadPrevious = true } catch (error) { if (error.code !== 'ENOENT') throw error }
  if (hadPrevious) await rename(output, backup)
  try { await rename(stage, output) } catch (error) { if (hadPrevious) await rename(backup, output); throw error }
  if (hadPrevious) await rm(backup, { recursive: true, force: true })
}

export async function exportLocalWebui ({ kubo = resolve(root, '../kubo') } = {}) {
  kubo = resolve(kubo)
  const output = join(root, 'build')
  // Fail before producing anything when the maintained source or installed
  // packed copy is stale. The explicit prepare command regenerates both.
  const explorer = await assertExplorerFreshness(root)
  const expected = { vite: '8.3.4', '@vitejs/plugin-react': '6.1.2', react: '19.3.1', 'react-dom': '19.3.1' }
  const manager = spawnSync(pnpm, ['--version'], { cwd: root, encoding: 'utf8', env: { ...process.env, COREPACK_ENABLE_AUTO_PIN: '0' }, shell: process.platform === 'win32' })
  if (manager.error || manager.status !== 0) throw new Error('The local pnpm dependency artifact builder is unavailable')
  const toolchain = { node: process.version, packageManager: { name: 'pnpm', version: manager.stdout.trim() }, packages: {} }
  for (const [name, version] of Object.entries(expected)) {
    const bytes = await readFile(join(root, 'node_modules', name, 'package.json'))
    const metadata = JSON.parse(bytes)
    if (metadata.version !== version) throw new Error(`Local export requires installed ${name}@${version}`)
    const entry = require.resolve(name)
    toolchain.packages[name] = { version: metadata.version, packageJson: `node_modules/${name}/package.json`, packageJsonSha256: sha256(bytes), entry: { path: slash(relative(root, entry)), sha256: sha256(await readFile(entry)) } }
  }
  const before = authoritativeInputs(await sourceInputs(root, kubo))
  for (const name of SHARED_PACKAGES) run(pnpm, ['install', '--frozen-lockfile', '--strict-peer-dependencies', '--ignore-scripts'], join(kubo, 'mcp', name))
  run(pnpm, ['run', 'gen'], join(kubo, 'mcp/ui'))
  run(process.execPath, ['scripts/gen-constraint-fixtures.mjs'], join(kubo, 'mcp/ui'))
  run(pnpm, ['run', 'gen'], join(kubo, 'mcp/webmcp'))
  // Dependency artifacts supply this consumer. No test/check/lint scripts run.
  for (const name of SHARED_PACKAGES) run(pnpm, ['run', 'build'], join(kubo, 'mcp', name))
  const built = authoritativeInputs(await sourceInputs(root, kubo))
  for (const name of [...SHARED_PACKAGES, 'contract']) assertSame(built[name], before[name], `${name} source/lock/config inputs`)
  const shared = await sharedArtifacts(kubo)
  run(process.execPath, ['src/agent-chat/vendor-island.mjs', join(kubo, 'mcp/chat/dist')])
  run(process.execPath, ['src/webmcp/vendor-webmcp.mjs', join(kubo, 'mcp/webmcp/dist')])
  run(process.execPath, ['scripts/generate-locales.js'])
  const inputs = await sourceInputs(root, kubo)
  const { build, loadEnv } = await import(pathToFileURL(require.resolve('vite')).href)
  const environment = buildEnvironment({ ...loadEnv('production', root, ['REACT_APP_', 'DEBUG']), ...process.env }, 'production')
  if (environment.REACT_APP_ENV !== 'production' || process.env.WEBUI_ANALYZE === 'true') throw new Error('The local Desktop export requires production mode without test instrumentation or bundle analysis')
  const cache = join(root, '.cache')
  await mkdir(cache, { recursive: true })
  const scratch = await mkdtemp(join(cache, 'local-export-'))
  const stage = join(scratch, 'build')
  let reactRuntime
  const previousCwd = process.cwd()
  try {
    process.chdir(root)
    // The explicit --kubo source must be the same root whose built exports Vite consumes.
    // Avoid loading a second default config that would silently select the sibling instead.
    const config = createWebuiConfig({ mode: 'production', kubo })
    await build({ ...config, configFile: false, mode: 'production',
      plugins: [...config.plugins, exportReactRuntime(root, report => { reactRuntime = report })],
      build: { ...config.build, outDir: stage, emptyOutDir: true, sourcemap: false } })
    if (!reactRuntime) throw new Error('Local export has no resolved React runtime provenance')
    await mkdir(join(stage, 'provenance/explorer'), { recursive: true })
    await cp(join(root, 'vendor/ipld-explorer-components/dist/licenses'), join(stage, 'licenses/ipld-explorer-components'), { recursive: true })
    for (const [input, output] of [
      ['dist/artifact-manifest.json', 'artifact-manifest.json'], ['provenance.json', 'provenance.json'], ['package-lock.json', 'derived-package-lock.json'],
      ['upstream/package-lock.json', 'original-package-lock.json'], ['upstream/source-sha256.json', 'upstream-source-sha256.json'], ['upstream/runtime-closure.json', 'original-runtime-closure.json']
    ]) await copyFile(join(root, 'vendor/ipld-explorer-components', input), join(stage, 'provenance/explorer', output))
    await cp(join(root, 'vendor/ipld-explorer-components/patches'), join(stage, 'provenance/explorer/patches'), { recursive: true })
    await copyExportNotices(root, kubo, stage)
    await writeFile(join(stage, 'provenance/shared-artifacts.json'), JSON.stringify(shared, null, 2) + '\n')
    assertSame(await sourceInputs(root, kubo), inputs, 'WebUI/shared/contract source and lock inputs')
    assertSame(await sharedArtifacts(kubo), shared, 'Shared dependency artifacts')
    assertSame(await assertExplorerFreshness(root), explorer, 'Maintained Explorer dependency')
    const artifacts = await treeFiles(stage)
    const manifest = {
      schemaVersion: 1, kind: 'ipfs-webui-local', entry: 'index.html', base: './', routing: 'hash',
      locations: locations(root, kubo, output), environment, toolchain,
      inputs, sharedArtifacts: shared, explorer, reactRuntime,
      artifactSha256: digest(artifacts), artifacts
    }
    await writeFile(join(stage, EXPORT_MANIFEST), JSON.stringify(manifest, null, 2) + '\n')
    await promote(stage, output)
    console.log(`Local WebUI export: ${output}\nManifest: ${EXPORT_MANIFEST}\nArtifact SHA-256: ${manifest.artifactSha256}`)
    return manifest
  } finally {
    process.chdir(previousCwd)
    await rm(scratch, { recursive: true, force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.length && (args.length !== 2 || args[0] !== '--kubo' || !args[1])) throw new Error('Usage: npm run export:local -- [--kubo <local-kubo-checkout>]')
  await exportLocalWebui({ kubo: args[1] })
}
