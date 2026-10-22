import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

// Preserve explicit .js imports of migrated .ts/.tsx modules without rewriting
// unrelated source. Never redirect package imports or existing JavaScript files.
export function extensionAlias () {
  return {
    name: 'webui-extension-alias',
    enforce: 'pre',
    resolveId (source, importer) {
      if (!importer || !source.startsWith('.') || !/\.jsx?$/.test(source)) return null
      const target = resolve(dirname(importer.split('?')[0]), source)
      if (existsSync(target)) return null
      const extensions = source.endsWith('.jsx') ? ['.tsx'] : ['.ts', '.tsx', '.jsx']
      return extensions.map(ext => target.replace(/\.jsx?$/, ext)).find(existsSync) || null
    }
  }
}
