import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'

const IMPORTS = [
  ['@gqadonis/ipfs-mcp-ui', 'ui', '.'],
  ['@gqadonis/ipfs-mcp-ui/styles.css', 'ui', './styles.css'],
  ['@gqadonis/ipfs-mcp-ui/host', 'ui', './host'],
  ['@gqadonis/ipfs-mcp-ui/a2ui', 'ui', './a2ui'],
  ['@gqadonis/ipfs-agent-chat/react', 'chat', './react']
]
const NAMES = { ui: '@gqadonis/ipfs-mcp-ui', chat: '@gqadonis/ipfs-agent-chat' }

function localFile (root, relative) {
  if (!relative || !/^[A-Za-z0-9_./-]+$/.test(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error(`Unsafe shared entry target: ${relative}`)
  let physical = root
  for (const part of relative.split('/')) {
    physical = join(physical, part)
    if (lstatSync(physical).isSymbolicLink()) throw new Error(`Shared entry symlink is unsupported: ${relative}`)
  }
  if (!lstatSync(physical).isFile()) throw new Error(`Shared entry must be a built file: ${relative}`)
  return physical
}

function builtFile (root, target, extension) {
  if (typeof target !== 'string' || !target.startsWith('./dist/') || !target.endsWith(extension)) throw new Error(`Shared package must export a built ${extension} entry: ${target}`)
  return localFile(root, target.slice(2))
}

/** Build-command configuration only. Never read a route, payload, URL or public asset path.
 * Default uses the isolated sibling; export:local supplies its explicit --kubo root here. */
export function sharedEntrypoints (webuiRoot, kuboRoot = resolve(webuiRoot, '../kubo')) {
  const root = resolve(kuboRoot)
  if (lstatSync(root).isSymbolicLink()) throw new Error('Shared Kubo root must not be a symlink')
  const kubo = realpathSync(root)
  const packages = {}
  for (const name of Object.keys(NAMES)) {
    const metadata = localFile(kubo, `mcp/${name}/package.json`)
    const value = JSON.parse(readFileSync(metadata, 'utf8'))
    if (value.name !== NAMES[name]) throw new Error(`Unexpected shared package identity at ${metadata}`)
    packages[name] = { root: join(kubo, 'mcp', name), metadata: value }
  }
  const imports = IMPORTS.map(([specifier, name, subpath]) => {
    const { root, metadata } = packages[name]
    const entry = metadata.exports?.[subpath]
    if (subpath === './styles.css') return { specifier, runtime: builtFile(root, entry, '.css') }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error(`Missing typed shared export: ${specifier}`)
    return { specifier, runtime: builtFile(root, entry.default, '.js'), types: builtFile(root, entry.types, '.d.ts') }
  })
  return {
    kuboRoot: kubo,
    imports,
    aliases: imports.map(({ specifier, runtime }) => ({
      find: new RegExp(`^${specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), replacement: runtime
    }))
  }
}

/** A later alias must not silently consume another checkout than the producer stamped. */
export function assertSharedAliases (entries, aliases) {
  for (const entry of entries.imports) {
    let consumed
    for (const alias of aliases) {
      let matches
      if (typeof alias.find === 'string') matches = entry.specifier === alias.find || entry.specifier.startsWith(`${alias.find}/`)
      else { alias.find.lastIndex = 0; matches = alias.find.test(entry.specifier) }
      if (!matches) continue
      if (alias.customResolver) throw new Error(`Shared entry custom resolver is unsupported: ${entry.specifier}`)
      consumed = typeof alias.find === 'string' ? `${alias.replacement}${entry.specifier.slice(alias.find.length)}` : entry.specifier.replace(alias.find, alias.replacement)
      break
    }
    if (consumed !== entry.runtime) throw new Error(`Shared entry root mismatch for ${entry.specifier}; consume the same built artifacts as ${entries.kuboRoot}`)
  }
}

export function sharedEntrypointGuard (entries) {
  return { name: 'webui-trusted-shared-entrypoints', configResolved: config => assertSharedAliases(entries, config.resolve.alias) }
}

// The same pinned @a2ui/react@0.12.0 adaptation as mcp/chat/vite.config.ts. The shared
// UI library externalizes this dependency; this consumer must also remove its document.head
// DateTimeInput stylesheet. Never alias shared source to bypass its package's build transforms.
export function isolateA2uiStyles () {
  const block = /if \(typeof document !== "undefined"\) \{\s*const styleId = "a2ui-date-time-input-webkit-styles";[\s\S]*?document\.head\.appendChild\(style\);\s*\}\s*\}/
  return {
    name: 'webui-isolate-a2ui-global-style',
    enforce: 'pre',
    transform (code, id) {
      if (!id.replaceAll('\\', '/').includes('/@a2ui/react/') || !code.includes('a2ui-date-time-input-webkit-styles')) return null
      if (!block.test(code)) this.error('Pinned @a2ui/react global stylesheet changed; update its explicit consumer adaptation before building.')
      return { code: code.replace(block, '/* removed by webui-isolate-a2ui-global-style: scoped IPFS catalog only */'), map: null }
    }
  }
}
