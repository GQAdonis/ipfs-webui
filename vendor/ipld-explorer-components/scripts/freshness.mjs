import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const directories = ['src', 'public', 'test', 'scripts', 'upstream', 'patches']
const documents = ['package.json', 'package-lock.json', 'LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE', 'FORK.md', 'provenance.json', 'upstream/package-lock.json']

export async function explorerSourceManifest (directory, { packed = false } = {}) {
  const files = [...documents]
  async function visit (relative) {
    const entries = await readdir(join(directory, relative), { withFileTypes: true })
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const path = `${relative}/${entry.name}`
      if (entry.isDirectory()) await visit(path)
      else if (entry.isFile()) files.push(path)
      else throw new Error(`Unsupported Explorer source entry: ${path}`)
    }
  }
  for (const name of directories) await visit(name)
  const manifest = {}
  for (const path of files.sort()) {
    // npm omits package-lock.json from a packed dependency. The generator
    // includes its exact bytes under dist so installed-copy checks retain it.
    const physical = packed && path === 'package-lock.json'
      ? 'dist/build-inputs.lock.json'
      : packed && path === 'upstream/package-lock.json' ? 'dist/upstream-original.lock.json' : path
    manifest[path] = createHash('sha256').update(await readFile(join(directory, physical))).digest('hex')
  }
  return { files: manifest, sha256: createHash('sha256').update(JSON.stringify(manifest)).digest('hex') }
}

// F1.9 assembly consumes this precondition before building the Web UI. A local
// file dependency is packed, so matching versions alone do not establish that
// the installed copy contains the current source-controlled compatibility work.
export async function artifactFiles (directory) {
  const files = {}
  async function visit (relative) {
    const entries = await readdir(join(directory, relative), { withFileTypes: true })
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const path = `${relative}/${entry.name}`
      if (path === 'dist/artifact-manifest.json') continue
      if (entry.isDirectory()) await visit(path)
      else if (entry.isFile()) files[path] = createHash('sha256').update(await readFile(join(directory, path))).digest('hex')
      else throw new Error(`Unsupported Explorer artifact entry: ${path}`)
    }
  }
  await visit('dist')
  return files
}

export async function assertArtifactFreshness (directory, options) {
  const stamp = JSON.parse(await readFile(join(directory, 'dist/artifact-manifest.json'), 'utf8'))
  const source = await explorerSourceManifest(directory, options)
  if (source.sha256 !== stamp.sourceSha256) throw new Error('Explorer dependency artifact is stale. Install its own locked build inputs and regenerate the artifact before assembly.')
  const actual = await artifactFiles(directory)
  if (JSON.stringify(actual) !== JSON.stringify(stamp.artifacts)) throw new Error('Explorer dependency artifact files differ from their source/lock build manifest')
  for (const file of ['index.js', 'providers.js', 'pages.js', 'forms.js', 'start-exploring.js', 'style.css']) {
    if (!actual[`dist/${file}`]) throw new Error(`Explorer dependency artifact is missing ${file}`)
  }
  return { source, artifacts: actual }
}

export async function assertExplorerFreshness (root = process.cwd()) {
  const source = resolve(root, 'vendor/ipld-explorer-components')
  const installed = resolve(root, 'node_modules/ipld-explorer-components')
  if ((await lstat(installed)).isSymbolicLink()) throw new Error('Explorer must be installed with the project install-links=true configuration')
  const [expected, actual] = await Promise.all([assertArtifactFreshness(source), assertArtifactFreshness(installed, { packed: true })])
  if (expected.source.sha256 !== actual.source.sha256 || JSON.stringify(expected.artifacts) !== JSON.stringify(actual.artifacts)) {
    throw new Error('Installed Explorer source is stale. Regenerate the local dependency lock after source changes, then run npm ci with the project .npmrc before assembly.')
  }
  return { version: JSON.parse(await readFile(join(source, 'package.json'), 'utf8')).version, sourceSha256: expected.source.sha256, installedSha256: actual.source.sha256, artifacts: expected.artifacts }
}
