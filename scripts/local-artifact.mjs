import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { assertExplorerFreshness } from '../vendor/ipld-explorer-components/scripts/freshness.mjs'

export const EXPORT_MANIFEST = 'WEBUI_ARTIFACT.json'
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
export const slash = path => path.replaceAll('\\', '/')
export const sorted = object => Object.fromEntries(Object.entries(object).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0))
export const digest = object => sha256(JSON.stringify(sorted(object)))

export function safeRelativePath (path) {
  if (typeof path !== 'string' || !path || path.includes('\\') || path.includes('\0') || path.split('/').some(part => !part || part === '.' || part === '..') || path.includes(':')) throw new Error(`Unsafe artifact path: ${path}`)
  return path
}

async function exists (path) {
  try { await lstat(path); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error }
}

export async function treeFiles (root, { exclude = () => false } = {}) {
  const files = {}
  async function visit (path) {
    if (exclude(path) || path.split('/').at(-1) === '.DS_Store') return
    const physical = resolve(root, path)
    const entry = await lstat(physical)
    if (entry.isSymbolicLink()) throw new Error(`Artifact/source symlink is unsupported: ${path}`)
    if (entry.isDirectory()) {
      for (const name of (await readdir(physical)).sort()) await visit(path ? `${path}/${name}` : name)
    } else if (entry.isFile()) files[path] = sha256(await readFile(physical))
    else throw new Error(`Unsupported artifact/source entry: ${path}`)
  }
  await visit('')
  return sorted(files)
}

export async function snapshot (root, paths, { optional = [], exclude = () => false } = {}) {
  const files = {}
  for (const path of [...paths, ...optional].sort()) {
    if (optional.includes(path) && !await exists(join(root, path))) continue
    const metadata = await lstat(join(root, path))
    if (metadata.isSymbolicLink()) throw new Error(`Source symlink is unsupported: ${path}`)
    if (metadata.isDirectory()) {
      for (const [name, hash] of Object.entries(await treeFiles(join(root, path), { exclude: child => exclude(`${path}/${child}`) }))) files[`${path}/${name}`] = hash
    } else if (metadata.isFile()) files[path] = sha256(await readFile(join(root, path)))
    else throw new Error(`Unsupported source entry: ${path}`)
  }
  const ordered = sorted(files)
  return { sha256: digest(ordered), files: ordered }
}

const WEBUI_INPUTS = ['src', 'public', '@types', 'scripts', 'patches', 'package.json', 'package-lock.json', '.npmrc', '.tool-versions', 'index.html', 'vite.config.js', 'tsconfig.json', 'postcss.config.js', 'LICENSE']
const PACKAGE_INPUTS = ['src', 'scripts', 'package.json', 'pnpm-lock.yaml']
const PACKAGE_OPTIONAL = ['.npmrc', 'fonts', 'catalog', 'tools', 'vite.config.ts', 'postcss.config.mjs', 'postcss.config.js', 'tsconfig.json', 'tsconfig.build.json', 'SOURCES.md', 'LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE', 'NOTICE', 'tests/fixtures/converter-schemas.json']
export const SHARED_PACKAGES = ['ui', 'chat', 'app', 'webmcp']

/** Validate every public entry, including types/subpaths; a barrel alone is not a usable package. */
export async function packageExportArtifacts (root) {
  const metadata = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const targets = new Set()
  function collect (value) {
    if (value === null) return
    if (typeof value === 'string') {
      if (!value.startsWith('./')) throw new Error(`Local package export must be relative: ${value}`)
      targets.add(safeRelativePath(value.slice(2)))
    } else if (Array.isArray(value)) value.forEach(collect)
    else if (value && typeof value === 'object') Object.values(value).forEach(collect)
    else throw new Error('Unsupported local package export target')
  }
  collect(metadata.exports ?? {})
  const files = {}
  for (const target of [...targets].sort()) {
    // Walk each ancestor too: lstat on the final file alone would follow an ancestor symlink.
    let parent = root
    for (const part of target.split('/')) {
      parent = join(parent, part)
      const entry = await lstat(parent)
      if (entry.isSymbolicLink()) throw new Error(`Package export symlink is unsupported: ${target}`)
    }
    if (!(await lstat(parent)).isFile()) throw new Error(`Package export must be a file: ${target}`)
    files[target] = sha256(await readFile(parent))
  }
  return files
}

export async function sourceInputs (root, kubo) {
  const inputs = { webui: await snapshot(root, WEBUI_INPUTS) }
  for (const name of SHARED_PACKAGES) {
    inputs[name] = await snapshot(join(kubo, 'mcp', name), PACKAGE_INPUTS, {
      optional: PACKAGE_OPTIONAL,
      exclude: path => name === 'chat' && path.startsWith('src/generated/')
    })
  }
  // Includes catalog/schema/derivation inputs, even when a particular current
  // bundle does not import them. A later contract edit invalidates the receipt.
  inputs.contract = await snapshot(kubo, ['mcp/contract', 'LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE'])
  return inputs
}

// These outputs are deliberately regenerated before compilation. Compare the
// remaining authoritative inputs across generation, then stamp all derived bytes.
export function authoritativeInputs (inputs) {
  const derived = { ui: path => path.startsWith('src/contract/generated/') || path === 'catalog/ipfs-mcp.catalog.json', webmcp: path => path === 'src/generated/tools.ts' }
  return Object.fromEntries(Object.entries(inputs).map(([name, input]) => {
    const files = sorted(Object.fromEntries(Object.entries(input.files).filter(([path]) => !derived[name]?.(path))))
    return [name, { sha256: digest(files), files }]
  }))
}

export async function sharedArtifacts (kubo) {
  const artifacts = {}
  const required = {
    ui: ['index.js', 'host.js', 'a2ui.js', 'ipfs-ui.css', 'react-runtime.json', 'types/index.d.ts'],
    chat: ['ipfs-agent-chat.js', 'react-runtime.json', 'react/agent-chat-react.js', 'react/react-runtime.json', 'types/index.d.ts', 'types/react.d.ts'],
    app: ['manifest.json'],
    webmcp: ['index.js', 'index.d.ts', 'generated/tools.js']
  }
  for (const name of SHARED_PACKAGES) {
    const files = await treeFiles(join(kubo, 'mcp', name, 'dist'))
    for (const path of required[name]) if (!files[path]) throw new Error(`Missing local ${name} artifact: dist/${path}`)
    const generatedPaths = { ui: ['tests/fixtures/converter-schemas.generated.ts'], chat: ['src/generated/island.css'] }[name]
    const generatedInputs = generatedPaths ? (await snapshot(join(kubo, 'mcp', name), generatedPaths)).files : {}
    const exports = await packageExportArtifacts(join(kubo, 'mcp', name))
    artifacts[name] = { sha256: digest(files), files, generatedInputs, exports }
  }
  const app = JSON.parse(await readFile(join(kubo, 'mcp/app/dist/manifest.json'), 'utf8'))
  if (!app.views?.length) throw new Error('The local MCP App has no emitted views')
  const emittedViews = new Set()
  for (const view of app.views) {
    const file = safeRelativePath(view.file)
    if (emittedViews.has(file)) throw new Error(`Duplicate local MCP App view: ${file}`)
    emittedViews.add(file)
    if (!artifacts.app.files[file]) throw new Error(`Missing local MCP App view: ${file}`)
    const bytes = await readFile(join(kubo, 'mcp/app/dist', file))
    if (view.sha256 !== artifacts.app.files[file] || view.bytes !== bytes.length) throw new Error(`MCP App view bytes differ from manifest: ${file}`)
  }
  return artifacts
}

export function assertSame (actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label} is stale or changed during assembly; regenerate the local export`)
}

export async function assertExportArtifacts (directory) {
  const manifest = JSON.parse(await readFile(join(directory, EXPORT_MANIFEST), 'utf8'))
  if (manifest.schemaVersion !== 1 || manifest.kind !== 'ipfs-webui-local' || manifest.entry !== 'index.html' || manifest.base !== './' || manifest.routing !== 'hash') throw new Error('Unsupported local WebUI artifact manifest')
  if (!manifest.artifacts || !Object.keys(manifest.artifacts).length) throw new Error('The local WebUI artifact has no file inventory')
  for (const [path, hash] of Object.entries(manifest.artifacts)) {
    safeRelativePath(path)
    if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error(`Invalid artifact SHA-256: ${path}`)
  }
  const files = await treeFiles(directory, { exclude: path => path === EXPORT_MANIFEST })
  assertSame(files, manifest.artifacts, 'Local WebUI artifact files')
  if (digest(files) !== manifest.artifactSha256 || !files['index.html']) throw new Error('Local WebUI artifact digest or entry differs')
  for (const path of ['licenses/ipld-explorer-components/dependencies.json', 'licenses/ipld-explorer-components/LICENSE-MIT', 'licenses/ipld-explorer-components/LICENSE-APACHE', 'provenance/explorer/artifact-manifest.json', 'provenance/shared-artifacts.json', 'provenance/react-runtime.json']) {
    if (!files[path]) throw new Error(`Local WebUI provenance/license artifact is missing ${path}`)
  }
  return manifest
}

export async function assertLocalWebuiExport ({ root, kubo, directory = join(root, 'build') }) {
  const manifest = await assertExportArtifacts(directory)
  assertSame(await sourceInputs(root, kubo), manifest.inputs, 'WebUI/shared/contract source and lock inputs')
  assertSame(await sharedArtifacts(kubo), manifest.sharedArtifacts, 'Local shared dependency artifacts')
  assertSame(await assertExplorerFreshness(root), manifest.explorer, 'Maintained Explorer dependency')
  for (const [name, pkg] of Object.entries(manifest.toolchain.packages)) {
    if (sha256(await readFile(resolve(root, pkg.packageJson))) !== pkg.packageJsonSha256 || sha256(await readFile(resolve(root, pkg.entry.path))) !== pkg.entry.sha256) throw new Error(`Installed build/runtime input changed: ${name}`)
  }
  for (const pkg of manifest.reactRuntime.packages) {
    if (sha256(await readFile(resolve(root, pkg.packageJson))) !== pkg.packageJsonSha256) throw new Error(`React runtime package changed: ${pkg.name}`)
    for (const module of pkg.modules) if (sha256(await readFile(resolve(root, module.path))) !== module.sha256) throw new Error(`React runtime source changed: ${module.path}`)
  }
  return manifest
}

export function locations (root, kubo, directory) {
  return { webui: slash(relative(directory, root)), kubo: slash(relative(directory, kubo)) }
}
