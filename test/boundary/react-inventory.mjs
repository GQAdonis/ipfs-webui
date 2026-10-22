import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { treeFiles } from '../../scripts/local-artifact.mjs'

export function inspectReactSource (source) {
  const code = source.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '')
  const imports = [...code.matchAll(/(?:from\s*|import\s*\(|require\s*\(|import\s*)['"]((?:react(?:-dom|-ace|-chartjs-2|-hook-form|-joyride|-dnd|-virtualized)?|redux-bundler-react)(?:\/[^'"]*)?)['"]/g)].map(match => match[1])
  const legacy = [
    ['legacy DOM root', /\b(?:ReactDOM|ReactDom)\.(?:render|hydrate|unmountComponentAtNode)\s*\(/],
    ['removed DOM lookup', /\bfindDOMNode\s*\(/],
    ['legacy context binding', /\b(?:childContextTypes|contextTypes|getChildContext)\b/],
    ['removed root named import', /import\s*\{[^}]*\b(?:render|hydrate|findDOMNode|unmountComponentAtNode)\b[^}]*\}\s*from\s*['"]react-dom['"]/],
    ['legacy Redux adapter', /from\s*['"]redux-bundler-react['"]/]
  ].filter(([, pattern]) => pattern.test(code)).map(([name]) => name)
  return { imports: [...new Set(imports)].sort(), legacy }
}

export async function reactConsumerInventory ({ root, kubo, desktop }) {
  const scopes = [
    ['webui', root, 'src'], ['explorer', root, 'vendor/ipld-explorer-components/src'],
    ...['ui', 'app', 'chat', 'webmcp'].map(name => [`shared-${name}`, kubo, `mcp/${name}/src`]),
    ['desktop-confirm', desktop, 'src/agent/confirm/ui/src'], ['desktop-search', desktop, 'src/agent/search/ui/src']
  ]
  const consumers = []
  for (const [scope, checkout, directory] of scopes) {
    const files = await treeFiles(join(checkout, directory))
    for (const [file, sha256] of Object.entries(files)) {
      if (!/\.[jt]sx?$/.test(file) || /(?:^|\/)(?:__tests__|fixtures|generated|vendor)(?:\/|$)|\.(?:test|spec|stories)\./.test(file)) continue
      const inspected = inspectReactSource(await readFile(join(checkout, directory, file), 'utf8'))
      if (inspected.imports.length || inspected.legacy.length) consumers.push({ scope, path: `${directory}/${file}`, sha256, ...inspected })
    }
  }
  return consumers
}
