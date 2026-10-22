// Final-packet producer only. Reuses the authored V/2 fixture with PRODUCED UI imports.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { exportReactRuntime } from '../../../scripts/export-react-runtime.mjs'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { inlineClassicScript } from './inline-script.mjs'

export async function buildHostFixture ({ root, kubo, output }) {
  const ui = join(kubo, 'mcp/ui'), require = createRequire(join(ui, 'package.json'))
  const gallery = join(ui, 'gallery/host-primitives.html'), original = await readFile(gallery, 'utf8')
  const script = /<script type="module">([\s\S]*?)<\/script>/.exec(original)
  if (!script || original.match(/<script type="module">/g)?.length !== 1) throw new Error('V2 host fixture script shape changed; update the explicit adapter')
  const entry = join(ui, 'dist/index.js'), input = { path: entry, sha256: sha256(await readFile(entry)) }
  let module = script[1].replace("'../src/index.ts'", JSON.stringify(entry))
  if (module === script[1]) throw new Error('V2 fixture must bind the actual produced UI entry')
  const imports = [...module.matchAll(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g)].map(value => value[0])
  if (imports.length !== 3) throw new Error('Expected the V2 fixture’s three explicit runtime imports')
  for (const value of imports) module = module.replace(value, '')
  module = module.replace('host: host ===', `brand: {
              surface: mount.querySelector('[data-ipfs-ui]') ? getComputedStyle(mount.querySelector('[data-ipfs-ui]')).getPropertyValue('--role-surface').trim() : null,
              fonts: [...document.fonts].map(face => ({ family: face.family, status: face.status })),
              portalSurfaces: nodes.map(node => getComputedStyle(node).getPropertyValue('--role-surface').trim()),
            },
            unownedPortals: [...document.querySelectorAll('[data-slot="dialog-content"],[data-slot="sheet-content"],[data-slot="dropdown-menu-content"]')].filter(node => !mount.contains(node)).length,
            host: host ===`)
  const before = 'createRoot(mount).render(h(Fixture));'
  if (!module.includes(before)) throw new Error('V2 fixture root lifecycle changed')
  module = module.replace('function Fixture() {', 'let disposeRoot = () => {};\nfunction Fixture() {')
  const disabledControl = "h('button', { 'data-fixture': 'disable-inside'"
  if (!module.includes(disabledControl)) throw new Error('V2 modal cleanup control insertion changed')
  module = module.replace(disabledControl, `h('button', { 'data-fixture': 'unmount-inside', onClick: () => disposeRoot() }, 'Unmount fixture'),\n${disabledControl}`)
  module = module.replace(before, `const reactRoot = createRoot(mount); reactRoot.render(h(Fixture));
        const cleanup = document.createElement('button'); cleanup.id = 'unmount-host-fixture'; cleanup.textContent = 'Unmount fixture'; cleanup.style.cssText = 'margin:24px;padding:12px';
        let disposed = false;
        const dispose = () => { if (!disposed) { disposed = true; reactRoot.unmount(); } }; disposeRoot = dispose;
        cleanup.addEventListener('click', dispose); document.body.append(cleanup);
        window.addEventListener('pagehide', dispose, { once: true });`)
  await mkdir(output, { recursive: false })
  const adapted = join(output, 'adapted-v2.mjs')
  await writeFile(adapted, `${imports.join('\n')}\n(async () => {${module}\n})().catch(error => { document.documentElement.dataset.fixtureError = 'initialization_failed'; document.documentElement.dataset.fixtureErrorName = typeof error?.name === 'string' ? error.name.slice(0, 80) : 'Error'; document.documentElement.dataset.fixtureErrorMessage = typeof error?.message === 'string' ? error.message.slice(0, 1024) : 'Fixture initialization failed'; });\n`, { flag: 'wx' })
  const vite = require.resolve('vite'), reactPlugin = require.resolve('@vitejs/plugin-react')
  const { build } = await import(pathToFileURL(vite).href), { default: react } = await import(pathToFileURL(reactPlugin).href)
  let runtime
  const result = await build({ configFile: false, root: ui, plugins: [react(), exportReactRuntime(ui, value => { runtime = value })],
    resolve: { dedupe: ['react', 'react-dom', 'radix-ui'], alias: [{ find: /^react$/, replacement: require.resolve('react') }, { find: /^react-dom\/client$/, replacement: require.resolve('react-dom/client') }] },
    define: { 'process.env.NODE_ENV': '"production"' }, build: { write: false, minify: false, sourcemap: false, target: 'es2023', lib: { entry: adapted, name: 'HostOverlayBoundary', formats: ['iife'] }, rolldownOptions: { output: { codeSplitting: false } } } })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output), chunks = outputs.filter(item => item.type === 'chunk')
  if (chunks.length !== 1 || !runtime || outputs.some(item => item.type === 'asset' && item.fileName !== 'provenance/react-runtime.json')) throw new Error('Host fixture must have one inline script and runtime provenance')
  const csp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; font-src 'none'; frame-src 'self'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
  const html = inlineClassicScript(original.replace('<title>', `<meta http-equiv="Content-Security-Policy" content="${csp}"><title>`), script[0], chunks[0].code)
  const sources = []
  for (const id of Object.keys(chunks[0].modules).filter(id => !id.startsWith('\0'))) {
    const path = id.split('?')[0]
    try { sources.push({ path, sha256: sha256(await readFile(path)) }) } catch { if (!id.includes('?')) throw new Error('Compiled overlay source disappeared') }
  }
  const report = { schemaVersion: 1, kind: 'produced-ui-v2-host-fixture', gallery: { path: gallery, sha256: sha256(original) }, adapted: { path: adapted, sha256: sha256(await readFile(adapted)) }, input, sources, runtime, csp, htmlSha256: sha256(html), compiler: await Promise.all([vite, reactPlugin].map(async path => ({ path, sha256: sha256(await readFile(path)) }))), adaptations: ['produced UI import', 'async IIFE', 'read-only brand/foreign-portal observations', 'visible root-unmount control and pagehide cleanup', 'same-origin iframe-only CSP'] }
  await writeFile(join(output, 'index.html'), html, { flag: 'wx' }); await writeFile(join(output, 'host-primitives.html'), html, { flag: 'wx' }); await writeFile(join(output, 'fixture-provenance.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [flag, output] = process.argv.slice(2)
  if (flag !== '--out' || !output || process.argv.length !== 4) throw new Error('Use build.mjs --out <new-owned-scratch-directory>')
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
  await buildHostFixture({ root, kubo: resolve(root, '../kubo'), output: resolve(output) })
}
