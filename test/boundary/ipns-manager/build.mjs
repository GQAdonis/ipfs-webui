import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'vite'
import { createWebuiConfig } from '../../../vite.config.js'
import { exportReactRuntime } from '../../../scripts/export-react-runtime.mjs'
import { safeRelativePath, sha256 } from '../../../scripts/local-artifact.mjs'

export async function buildIpnsFixture ({ root, kubo, output }) {
  const config = await createWebuiConfig({ mode: 'production', kubo })
  let runtime
  const result = await build({
    ...config,
    configFile: false,
    root,
    publicDir: false,
    plugins: [...config.plugins, exportReactRuntime(root, value => { runtime = value })],
    build: {
      write: false,
      target: 'es2023',
      minify: false,
      sourcemap: false,
      cssCodeSplit: false,
      lib: { entry: join(root, 'test/boundary/ipns-manager/fixture.jsx'), formats: ['es'], fileName: 'fixture' },
      rolldownOptions: { output: { codeSplitting: false } }
    }
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(item => item.output)
  const chunks = outputs.filter(item => item.type === 'chunk')
  if (chunks.length !== 1 || !runtime) throw new Error('Expected one actual fixture module and React provenance')
  const css = outputs.filter(item => item.fileName.endsWith('.css'))
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IPNS production component fixture</title>${css.map(item => `<link rel="stylesheet" href="./${item.fileName}">`).join('')}</head><body><div id="root"></div><script type="module" src="./${chunks[0].fileName}"></script></body></html>`
  await mkdir(output, { recursive: false })
  const files = []
  for (const item of [...outputs, { type: 'asset', fileName: 'index.html', source: html }]) {
    const path = join(output, safeRelativePath(item.fileName)); const bytes = item.type === 'chunk' ? item.code : item.source
    await mkdir(join(path, '..'), { recursive: true }); await writeFile(path, bytes, { flag: 'wx' })
    files.push({ path: item.fileName, sha256: sha256(bytes) })
  }
  const sources = []
  for (const id of Object.keys(chunks[0].modules).filter(id => !id.startsWith('\0'))) {
    const path = id.split('?')[0]
    try { sources.push({ path, sha256: sha256(await readFile(path)) }) } catch { if (!id.includes('?')) throw new Error(`Missing compiled input: ${id}`) }
  }
  const report = { kind: 'production-ipns-component-mocked-transport', runtime, sources, files, node: { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) } }
  await writeFile(join(output, 'fixture-provenance.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  return report
}
