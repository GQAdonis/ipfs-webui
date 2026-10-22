import { createRequire } from 'node:module'
import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { artifactConfig } from './artifact-config.mjs'
import { explorerSourceManifest, artifactFiles } from './freshness.mjs'
import { copyDependencyNotices } from './licenses.mjs'

const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const host = resolve(directory, '../..')
const hostRequire = createRequire(resolve(host, 'package.json'))
const toolchain = { vite: '8.3.4', '@vitejs/plugin-react': '6.1.2' }
for (const [name, version] of Object.entries(toolchain)) {
  const installed = JSON.parse(await readFile(resolve(host, 'node_modules', name, 'package.json'), 'utf8'))
  if (installed.version !== version) throw new Error(`Explorer artifact requires host ${name}@${version}`)
}
const { build } = await import(pathToFileURL(hostRequire.resolve('vite')).href)
const { default: react } = await import(pathToFileURL(hostRequire.resolve('@vitejs/plugin-react')).href)
const before = await explorerSourceManifest(directory)
// This supplies the file dependency, not a verification build of the Web UI.
await build(artifactConfig(directory, react))
await copyDependencyNotices(directory)
await copyFile(resolve(directory, 'package-lock.json'), resolve(directory, 'dist/build-inputs.lock.json'))
await copyFile(resolve(directory, 'upstream/package-lock.json'), resolve(directory, 'dist/upstream-original.lock.json'))
const after = await explorerSourceManifest(directory)
if (before.sha256 !== after.sha256) throw new Error('Explorer source changed while generating its dependency artifact')
const artifacts = await artifactFiles(directory)
await writeFile(resolve(directory, 'dist/artifact-manifest.json'), JSON.stringify({
  schemaVersion: 1,
  version: JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8')).version,
  sourceSha256: after.sha256,
  sourceFiles: after.files,
  toolchain,
  artifacts
}, null, 2) + '\n')
