import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { join, relative } from 'node:path'
import { sha256, slash } from './local-artifact.mjs'

// Compiler provenance only. Final browser fixtures still establish which root
// is actually mounted; a successful dependency build does not supply that proof.
export function exportReactRuntime (root, receive) {
  return {
    name: 'webui-export-react-provenance',
    generateBundle (_options, bundle) {
      const packages = new Map()
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue
        for (const id of Object.keys(output.modules)) {
          if (id.startsWith('\0')) continue
          const path = id.split('?')[0]
          const match = /^(.*\/node_modules\/(react|react-dom))\//.exec(slash(path))
          if (!match || !existsSync(path)) continue
          const directory = realpathSync(match[1])
          if (!packages.has(directory)) {
            const packageJson = join(directory, 'package.json')
            const bytes = readFileSync(packageJson)
            const metadata = JSON.parse(bytes)
            packages.set(directory, { name: metadata.name, version: metadata.version, packageJson: slash(relative(root, packageJson)), packageJsonSha256: sha256(bytes), modules: new Map() })
          }
          packages.get(directory).modules.set(slash(relative(root, path)), sha256(readFileSync(path)))
        }
      }
      for (const name of ['react', 'react-dom']) {
        const matches = [...packages.values()].filter(pkg => pkg.name === name)
        if (matches.length !== 1 || matches[0].version !== '19.3.1') this.error(`Local WebUI export requires one resolved ${name}@19.3.1`)
      }
      const report = {
        schemaVersion: 1, delivery: 'webui-host',
        packages: [...packages.values()].map(pkg => ({ ...pkg, modules: [...pkg.modules].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, sha256]) => ({ path, sha256 })) })).sort((a, b) => a.name.localeCompare(b.name))
      }
      receive(report)
      this.emitFile({ type: 'asset', fileName: 'provenance/react-runtime.json', source: JSON.stringify(report, null, 2) + '\n' })
    }
  }
}
