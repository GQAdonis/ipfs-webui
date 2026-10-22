import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { createWebuiConfig } from '../../../vite.config.js'
import { exportReactRuntime } from '../../../scripts/export-react-runtime.mjs'
import { sha256, treeFiles } from '../../../scripts/local-artifact.mjs'
const root = resolve(fileURLToPath(new URL('../../..', import.meta.url))), kubo = resolve(root, '../kubo')
const [flag, output] = process.argv.slice(2)
if (flag !== '--out' || !output || process.argv.length !== 4) throw new Error('Use build.mjs --out <new owned scratch directory>')
await mkdir(output, { recursive: false })
let runtime
const config = createWebuiConfig({ mode: 'production', kubo })
const sources = new Map()
await build({ ...config, configFile: false, publicDir: false, plugins: [...config.plugins, exportReactRuntime(root, value => { runtime = value }), {
  name: 'host-fixture-source-provenance', async generateBundle () {
    for (const id of this.getModuleIds()) {
      const path = id.split('?')[0]
      if (path.startsWith('/') && !path.includes('\0')) try { sources.set(path, sha256(await readFile(path))) } catch { /* Virtual/style query IDs have no independent source bytes. */ }
    }
  }
}], build: { ...config.build, outDir: output, emptyOutDir: false, manifest: false, sourcemap: false,
  lib: { entry: join(root, 'test/boundary/host-fixtures/entry.jsx'), formats: ['es'], fileName: () => 'fixture.mjs' },
  rolldownOptions: { output: { codeSplitting: false } } } })
if (!runtime || !sources.size) throw new Error('Fixture requires compiler-observed React and source provenance')
const emitted = await treeFiles(output), css = Object.keys(emitted).filter(path => path.endsWith('.css'))
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Source-owned frontend host fixture</title>${css.map(path => `<link rel="stylesheet" href="./${path}">`).join('')}</head><body><main id="root"></main><script type="module" src="./fixture.mjs"></script></body></html>`
await writeFile(join(output, 'index.html'), html, { flag: 'wx' })
await writeFile(join(output, 'fixture-provenance.json'), JSON.stringify({ schemaVersion: 1, kind: 'current-production-host-fixture', supplemental: true, runtime, sources: Object.fromEntries([...sources].sort()), emitted: await treeFiles(output), htmlSha256: sha256(html) }, null, 2) + '\n', { flag: 'wx' })
