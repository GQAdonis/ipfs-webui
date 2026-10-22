// Authored producer for an isolated final-boundary browser fixture. Never invoked during production authoring.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { exportReactRuntime } from '../../../../scripts/export-react-runtime.mjs'
import { sha256 } from '../../../../scripts/local-artifact.mjs'

export async function buildDecisionFixture ({ root, kubo, output }) {
  const ui = join(kubo, 'mcp/ui'), require = createRequire(join(ui, 'package.json'))
  const toolchain = []
  for (const name of ['vite', '@vitejs/plugin-react']) {
    const entry = require.resolve(name)
    let packageFile, metadata, directory = dirname(entry)
    for (let depth = 0; depth < 8; depth++) {
      const candidate = join(directory, 'package.json')
      try {
        const value = JSON.parse(await readFile(candidate, 'utf8'))
        if (value.name === name) { packageFile = candidate; metadata = value; break }
      } catch (error) { if (error.code !== 'ENOENT') throw error }
      directory = dirname(directory)
    }
    if (!packageFile) throw new Error(`Missing compiler package provenance: ${name}`)
    toolchain.push({ name, version: metadata.version, entry, entrySha256: sha256(await readFile(entry)), packageFile, packageSha256: sha256(await readFile(packageFile)) })
  }
  const { build } = await import(pathToFileURL(toolchain[0].entry).href)
  const { default: react } = await import(pathToFileURL(toolchain[1].entry).href)
  let runtime
  const result = await build({ configFile: false, root: ui, plugins: [react(), exportReactRuntime(ui, value => { runtime = value })],
    resolve: { dedupe: ['react', 'react-dom', 'zod', 'lucide-react'], alias: [{ find: /^@gqadonis\/ipfs-mcp-ui$/, replacement: join(ui, 'dist/index.js') }] },
    define: { 'process.env.NODE_ENV': '"production"' },
    build: { write: false, target: 'es2023', minify: false, sourcemap: false,
      lib: { entry: join(root, 'test/boundary/accessibility/decisions/fixture.tsx'), name: 'DecisionBoundary', formats: ['iife'] },
      rolldownOptions: { output: { codeSplitting: false } } } })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output)
  const chunks = outputs.filter(item => item.type === 'chunk')
  if (chunks.length !== 1 || !runtime || outputs.some(item => item.type === 'asset' && item.fileName !== 'provenance/react-runtime.json')) throw new Error('Decision fixture must compile to one self-contained script and runtime provenance')
  const csp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><title>Local decision boundary</title><style>body{margin:0}*,*::before,*::after{box-sizing:border-box}</style></head><body><main aria-label="Decision fixture"><div id="fixture-root"></div><div id="shadow-host"></div></main><script>${chunks[0].code.replace(/<\/script/gi, '<\\/script')}</script></body></html>`
  await mkdir(output, { recursive: false })
  const sources = []
  for (const file of Object.keys(chunks[0].modules).filter(file => !file.startsWith('\0'))) {
    const path = file.split('?')[0]
    try { sources.push({ path, sha256: sha256(await readFile(path)) }) } catch { if (!file.includes('?')) throw new Error(`Fixture compiler source disappeared: ${path}`) }
  }
  const report = { schemaVersion: 1, kind: 'decision-boundary-fixture', htmlSha256: sha256(html), runtime, toolchain,
    sources: sources.sort((a, b) => a.path.localeCompare(b.path)), node: { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) }, csp }
  await writeFile(join(output, 'index.html'), html, { flag: 'wx' })
  await writeFile(join(output, 'fixture-provenance.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  return report
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [flag, output] = process.argv.slice(2)
  if (flag !== '--out' || !output || process.argv.length !== 4) throw new Error('Use build.mjs --out <new-owned-scratch-directory>')
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
  await buildDecisionFixture({ root, kubo: resolve(root, '../kubo'), output: resolve(output) })
}
