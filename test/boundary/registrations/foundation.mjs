import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { assertExportArtifacts, sha256 } from '../../../scripts/local-artifact.mjs'
import { consumeCompatibilityReceipt } from '../collaborator-inputs.mjs'
import { reactConsumerInventory } from '../react-inventory.mjs'

async function vitestReceipt (ctx, files) {
  const path = join(ctx.directory, 'vitest.json')
  const result = await ctx.processes.run('pnpm', ['exec', 'vitest', 'run', ...files, '--reporter=json', `--outputFile=${path}`], { cwd: ctx.root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}`, timeout: 180000 })
  const report = JSON.parse(await readFile(path, 'utf8'))
  ctx.assert(report.success === true && report.numPassedTests > 0 && report.numFailedTests === 0 && report.numPendingTests === 0 && report.numTodoTests === 0, 'All named foundation assertions executed without skipped/todo tests', { passed: report.numPassedTests })
  await ctx.record('fixture-command', { argv: result.argv, cwd: result.cwd, exitCode: result.exitCode, reportSha256: sha256(await readFile(path)) })
}

export default [
  {
    scenario: 'UI-101',
    id: 'artifact-freshness',
    requires: [],
    async run (ctx) {
      const artifact = await ctx.getMetadata()
      ctx.assert(artifact.manifest.base === './' && artifact.manifest.routing === 'hash', 'Actual current export preserves relative static base and hash routing')
      await ctx.record('current-artifact', { sha256: artifact.manifest.artifactSha256, toolchain: artifact.manifest.toolchain, inputs: artifact.manifest.inputs })
    }
  },
  {
    scenario: 'UI-101',
    id: 'artifact-negative-controls',
    requires: [],
    async run (ctx) {
      await ctx.getMetadata()
      const directory = join(ctx.scratch, 'tampered-artifact')
      await cp(join(ctx.root, 'build'), directory, { recursive: true })
      const index = await readFile(join(directory, 'index.html'))
      await writeFile(join(directory, 'index.html'), Buffer.concat([index, Buffer.from('\n<!-- negative control -->')]))
      let rejected = false
      try { await assertExportArtifacts(directory) } catch { rejected = true }
      ctx.assert(rejected, 'Changed production asset is rejected by actual portable artifact guard')
      await rm(directory, { recursive: true, force: true })
      await vitestReceipt(ctx, ['scripts/local-artifact.test.js', 'src/explore/explorer-freshness.test.js'])
    }
  },
  {
    scenario: 'UI-101',
    id: 'react-runtime',
    requires: [],
    async run (ctx) {
      const { manifest } = await ctx.getMetadata()
      const packages = manifest.reactRuntime.packages
      for (const name of ['react', 'react-dom']) ctx.assert(packages.filter(pkg => pkg.name === name && pkg.version === '19.3.1').length === 1, `Compiler resolves one adopted ${name} runtime`)
      for (const pkg of packages) ctx.assert(pkg.modules.length > 0, `${pkg.name} report records actual compiled modules`)
      const consumers = await reactConsumerInventory({ root: ctx.root, kubo: ctx.kubo, desktop: join(ctx.root, '../ipfs-desktop') })
      ctx.assert(consumers.length > 0 && consumers.every(consumer => consumer.legacy.length === 0), 'Current live React consumer inventory has no removed DOM roots/lookups or legacy context adapter', consumers.filter(consumer => consumer.legacy.length))
      await ctx.record('live-react-consumers', consumers)
      await vitestReceipt(ctx, ['src/explore/explorer-react19.test.jsx', 'src/explore/explorer-upstream.test.ts', 'scripts/toolchain.test.js', 'test/boundary/react-inventory.test.js'])
      await ctx.record('resolved-runtime', manifest.reactRuntime)
    }
  },
  {
    scenario: 'UI-101',
    id: 'store-disposal',
    requires: [],
    async run (ctx) {
      await vitestReceipt(ctx, ['src/lib/react-store.test.jsx', 'src/lib/react-store-root.test.jsx', 'src/lib/react-store-tooltip.test.jsx', 'src/bundles/root-cleanup.test.js'])
    }
  },
  {
    scenario: 'UI-113',
    id: 'kubo-cli-families',
    requires: ['daemon'],
    async run (ctx) {
      await consumeCompatibilityReceipt(ctx)
    }
  }
]
