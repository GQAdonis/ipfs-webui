import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertExportArtifacts, assertLocalWebuiExport } from './local-artifact.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const options = { root, kubo: resolve(root, '../kubo'), directory: resolve(root, 'build') }
let artifactOnly = false
for (let index = 0; index < args.length; index++) {
  if (args[index] === '--artifact-only') { artifactOnly = true; continue }
  const name = { '--kubo': 'kubo', '--directory': 'directory', '--webui': 'root' }[args[index]]
  if (!name || !args[index + 1]) throw new Error('Usage: check-local-export.mjs [--directory <artifact>] [--webui <source>] [--kubo <source>] [--artifact-only]')
  options[name] = resolve(args[++index])
}
const manifest = artifactOnly ? await assertExportArtifacts(options.directory) : await assertLocalWebuiExport(options)
console.log(`${artifactOnly ? 'Artifact inventory' : 'Source-aware local export'} matches ${manifest.artifactSha256}`)
