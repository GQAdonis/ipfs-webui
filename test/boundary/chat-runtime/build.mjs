// Executed only by the final packet. Never compiles a backend or substitutes a dev server.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { exportReactRuntime } from '../../../scripts/export-react-runtime.mjs'
import { sha256 } from '../../../scripts/local-artifact.mjs'

export async function buildChatFixture ({ root, kubo, output }) {
  const chat = join(kubo, 'mcp/chat'), require = createRequire(join(chat, 'package.json'))
  const entry = join(chat, 'dist/react/agent-chat-react.js'), uiEntry = join(kubo, 'mcp/ui/dist/index.js')
  const inputs = await Promise.all([entry, uiEntry].map(async path => ({ path, sha256: sha256(await readFile(path)) })))
  const vite = require.resolve('vite'), reactPlugin = require.resolve('@vitejs/plugin-react')
  const { build } = await import(pathToFileURL(vite).href), { default: react } = await import(pathToFileURL(reactPlugin).href)
  let runtime
  const result = await build({ configFile: false, root: chat, plugins: [react(), exportReactRuntime(chat, value => { runtime = value })],
    resolve: { dedupe: ['react', 'react-dom', 'radix-ui'], alias: [{ find: /^@gqadonis\/ipfs-agent-chat\/react$/, replacement: entry }, { find: /^@gqadonis\/ipfs-mcp-ui$/, replacement: uiEntry }] },
    define: { 'process.env.NODE_ENV': '"production"' },
    build: { write: false, target: 'es2023', minify: false, sourcemap: false, lib: { entry: join(root, 'test/boundary/chat-runtime/fixture.tsx'), name: 'ChatRuntimeBoundary', formats: ['iife'] }, rolldownOptions: { output: { codeSplitting: false } } } })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output), chunks = outputs.filter(item => item.type === 'chunk')
  if (chunks.length !== 1 || !runtime || outputs.some(item => item.type === 'asset' && item.fileName !== 'provenance/react-runtime.json')) throw new Error('Chat fixture needs one self-contained produced-entry script and runtime provenance')
  const csp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; font-src 'none'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><title>Produced chat runtime boundary</title><style>body{margin:0}*{box-sizing:border-box}</style></head><body><main aria-label="Supplemental chat runtime"><h1>Produced chat runtime</h1><div id="chat-host"></div></main><script>${chunks[0].code.replace(/<\/script/gi, '<\\/script')}</script></body></html>`
  const sources = []
  for (const id of Object.keys(chunks[0].modules).filter(id => !id.startsWith('\0'))) {
    const path = id.split('?')[0]
    try { sources.push({ path, sha256: sha256(await readFile(path)) }) } catch { if (!id.includes('?')) throw new Error('Compiled chat fixture source disappeared') }
  }
  const report = { schemaVersion: 1, kind: 'supplemental-produced-chat-fixture', htmlSha256: sha256(html), inputs, sources, runtime, csp, compiler: await Promise.all([vite, reactPlugin].map(async path => ({ path, sha256: sha256(await readFile(path)) }))), node: { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) } }
  await mkdir(output, { recursive: false }); await writeFile(join(output, 'index.html'), html, { flag: 'wx' }); await writeFile(join(output, 'fixture-provenance.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  return report
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [flag, output] = process.argv.slice(2)
  if (flag !== '--out' || !output || process.argv.length !== 4) throw new Error('Use build.mjs --out <new-owned-scratch-directory>')
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
  await buildChatFixture({ root, kubo: resolve(root, '../kubo'), output: resolve(output) })
}
