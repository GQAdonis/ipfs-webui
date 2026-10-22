import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, extname, join, normalize } from 'node:path'
import { parseSync, traverse } from '@babel/core'

// Reuse the adopted Vite compiler's locked PostCSS dependency. Do not depend on
// a separately installed parser or on an incidental top-level hoist.
const require = createRequire(import.meta.url)
const viteRequire = createRequire(require.resolve('vite/package.json'))
const postcss = viteRequire('postcss')
export const surfaceDirectories = ['src/shell', 'src/activity']
const codeExtensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx', '.svg'])
const unsupportedStyles = new Set(['.scss', '.sass', '.less', '.styl', '.html'])
const colorProperty = /^(?:color|background(?:Color|-color)?|border(?:Top|Right|Bottom|Left|Block|Inline)?(?:Color)?|border(?:-(?:top|right|bottom|left|block|inline))?(?:-color)?|outline(?:Color|-color)?|(?:box|text)(?:Shadow|-shadow)|fill|stroke|(?:caret|accent|stop|flood|lighting)(?:Color|-color)|textDecorationColor|text-decoration-color)$/i
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const excluded = path => /(?:^|\/)(?:__tests__|__fixtures__|fixtures)(?:\/|$)|\.(?:test|spec|stories)\.[^.]+$|\.d\.ts$/.test(path)
const decodeCSS = value => value.replace(/\\([a-f\d]{1,6})(?:\r\n|[\t\n\r\f ])?|\\([^\r\n])/gi, (_match, hex, character) => hex ? String.fromCodePoint(Math.min(parseInt(hex, 16) || 0xfffd, 0x10ffff)) : character)
const keyName = node => node?.name ?? node?.value

export function inspectSurfaceSource ({ path, source, rawTokens, roles }) {
  const diagnostics = []; const references = new Set(); const imports = new Set()
  const knownRoles = new Set(roles); const forbidden = new Set(rawTokens)
  let renderer = false; let meaningful = false
  const issue = (code, message, location) => diagnostics.push({ path, code, message, line: location?.line ?? 1, column: location?.column ?? 1 })
  function value (input, colors, location, trackReferences = true) {
    // URL fragments/CIDs and comments are data, not CSS color literals. CSS
    // identifier escapes are decoded before matching custom-property names.
    const text = decodeCSS(input.replace(/\/\*[\s\S]*?\*\//g, '')).replace(/url\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)/gi, '')
    if (colors) for (const match of text.matchAll(/(^|[^\w-])#([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})(?![\w-])/gi)) issue('hex-color', `Color literal #${match[2]} must use a role alias`, location)
    for (const match of text.matchAll(/--[a-zA-Z_][\w-]*/g)) {
      const token = match[0]
      if (forbidden.has(token)) issue('raw-token', `Raw Promethity token ${token} must use an existing role or inherited primitive`, location)
      else if (token.startsWith('--role')) {
        if (!knownRoles.has(token)) issue('unknown-role', `Unknown Praxis role ${token}`, location)
        else if (trackReferences) references.add(token)
      }
    }
    for (const match of text.matchAll(/var\(\s*([^,)]*)/g)) {
      if (!/^--[\w-]+\s*$/.test(match[1])) issue('dynamic-token', 'Unresolved CSS var() name cannot bypass the token rule', location)
    }
  }
  function stylesheet (text, inline = false, location, trackReferences = true) {
    const ast = postcss.parse(inline ? `fixture { ${text} }` : text, { from: path })
    ast.walkDecls(declaration => {
      meaningful = true
      const property = decodeCSS(declaration.prop)
      const position = location ?? declaration.source?.start
      if (property.startsWith('--')) value(property, false, position, false)
      value(declaration.value, colorProperty.test(property) || property.startsWith('--'), position, trackReferences)
    })
    ast.walkAtRules(rule => {
      if (rule.name === 'import') {
        const target = /^(?:url\(\s*)?["']([^"']+)["']/.exec(rule.params)?.[1]
        if (target?.startsWith('.')) imports.add(target)
      } else if (rule.params.includes('var(') || /(?:color|background)\s*:/i.test(rule.params)) value(rule.params, true, rule.source?.start, trackReferences)
    })
  }
  try {
    if (extname(path) === '.css') stylesheet(source)
    else {
      const ast = parseSync(source, { filename: path, babelrc: false, configFile: false, sourceType: 'unambiguous', parserOpts: { plugins: ['jsx', ...(extname(path).startsWith('.ts') ? ['typescript'] : [])] } })
      if (!ast) throw new Error('Source parser produced no AST')
      function constant (nodePath, seen = new Set()) {
        if (!nodePath?.node || seen.has(nodePath.node)) return undefined
        const visited = new Set(seen).add(nodePath.node)
        if (nodePath.isStringLiteral()) return nodePath.node.value
        if (nodePath.isNumericLiteral()) return String(nodePath.node.value)
        if (nodePath.isIdentifier()) {
          const binding = nodePath.scope.getBinding(nodePath.node.name)
          if (binding?.constant && binding.path.isVariableDeclarator()) return constant(binding.path.get('init'), visited)
        }
        if (nodePath.isBinaryExpression({ operator: '+' })) {
          const left = constant(nodePath.get('left'), visited); const right = constant(nodePath.get('right'), visited)
          if (left !== undefined && right !== undefined) return left + right
        }
        if (nodePath.isTemplateLiteral()) {
          const expressions = nodePath.get('expressions').map(item => constant(item, visited))
          if (expressions.every(item => item !== undefined)) return nodePath.node.quasis.map((quasi, index) => (quasi.value.cooked ?? quasi.value.raw) + (expressions[index] ?? '')).join('')
        }
        if (nodePath.isTSAsExpression() || nodePath.isTSNonNullExpression()) return constant(nodePath.get('expression'), visited)
        return undefined
      }
      function styleUse (nodePath, seen = new Set()) {
        for (let current = nodePath; current; current = current.parentPath) {
          if (seen.has(current.node)) return false
          seen.add(current.node)
          if (current.isJSXAttribute() && ['style', 'className', 'fill', 'stroke', 'color'].includes(keyName(current.node.name))) return true
          if (current.isJSXSpreadAttribute()) return true
          if (current.isAssignmentExpression()) {
            const left = current.node.left
            if (left.type === 'MemberExpression' && (keyName(left.property) === 'cssText' || left.object?.type === 'MemberExpression' && keyName(left.object.property) === 'style')) return true
          }
          if (current.isVariableDeclarator() && current.node.id.type === 'Identifier') {
            const binding = current.scope.getBinding(current.node.id.name)
            return binding?.referencePaths.some(reference => styleUse(reference, new Set(seen))) ?? false
          }
        }
        return false
      }
      function inspect (nodePath, colors = false, tokenName = false, trackReferences = true, seen = new Set()) {
        if (!nodePath?.node || seen.has(nodePath.node)) return
        const visited = new Set(seen).add(nodePath.node)
        const text = constant(nodePath)
        const position = nodePath.node?.loc?.start
        if (text !== undefined) value(text, colors, position, trackReferences)
        else if (nodePath.isConditionalExpression()) { inspect(nodePath.get('consequent'), colors, tokenName, trackReferences, visited); inspect(nodePath.get('alternate'), colors, tokenName, trackReferences, visited) }
        else if (nodePath.isIdentifier()) {
          const binding = nodePath.scope.getBinding(nodePath.node.name)
          if (binding?.path.isVariableDeclarator()) {
            inspect(binding.path.get('init'), colors, tokenName, trackReferences, visited)
            for (const assignment of binding.constantViolations) if (assignment.isAssignmentExpression()) inspect(assignment.get('right'), colors, tokenName, trackReferences, visited)
          } else if (tokenName) issue('dynamic-token', 'CSS custom-property names must resolve statically for coverage', position)
        }
        else if (nodePath.isTemplateLiteral()) {
          const fragments = nodePath.node.quasis.map(quasi => quasi.value.cooked ?? quasi.value.raw).join('${dynamic}')
          value(fragments, colors, position, trackReferences)
          if (tokenName || /var\(/.test(fragments)) issue('dynamic-token', 'Constructed CSS token name must resolve statically to an allowed alias', position)
        } else if (tokenName) issue('dynamic-token', 'CSS custom-property names must resolve statically for coverage', position)
      }
      traverse(ast, {
        ImportDeclaration (nodePath) { imports.add(nodePath.node.source.value) },
        JSXElement () { renderer = true; meaningful = true },
        CallExpression (nodePath) {
          const callee = nodePath.node.callee
          if (callee.type === 'MemberExpression' && keyName(callee.property) === 'createElement') { renderer = true; meaningful = true }
          if (callee.type === 'MemberExpression' && ['getPropertyValue', 'setProperty', 'removeProperty'].includes(keyName(callee.property))) {
            const args = nodePath.get('arguments')
            if (args[0]) inspect(args[0], false, true, false)
            if (args[1]) inspect(args[1], true)
          }
        },
        ObjectProperty (nodePath) {
          const property = nodePath.node.computed ? constant(nodePath.get('key')) : keyName(nodePath.node.key)
          if (typeof property !== 'string') return
          if (property.startsWith('--')) value(property, false, nodePath.node.loc?.start, false)
          if (colorProperty.test(property) || property.startsWith('--')) inspect(nodePath.get('value'), true, false, styleUse(nodePath))
        },
        AssignmentExpression (nodePath) {
          const left = nodePath.node.left
          if (left.type === 'MemberExpression' && colorProperty.test(String(keyName(left.property)))) inspect(nodePath.get('right'), true)
          if (left.type === 'MemberExpression' && keyName(left.property) === 'cssText') {
            const text = constant(nodePath.get('right'))
            if (text !== undefined) stylesheet(text, true, nodePath.node.loc?.start)
          }
        },
        JSXAttribute (nodePath) {
          const property = keyName(nodePath.node.name)
          const child = nodePath.get('value')
          if (!child.node) return
          const expression = child.isJSXExpressionContainer() ? child.get('expression') : child
          if (colorProperty.test(String(property)) || property === 'className') inspect(expression, true)
          if (property === 'style' && child.isStringLiteral()) stylesheet(child.node.value, true, child.node.loc?.start)
        },
        StringLiteral (nodePath) {
          // A stored CSS var() reference is still a token reference when passed
          // through a local constant before a style consumer.
          if (/var\(\s*--/.test(nodePath.node.value)) value(nodePath.node.value, false, nodePath.node.loc?.start, false)
          if (/(?:^|[;{])\s*(?:color|background|fill|stroke|outline|border)[\w-]*\s*:/.test(nodePath.node.value)) stylesheet(nodePath.node.value, !nodePath.node.value.includes('{'), nodePath.node.loc?.start, false)
        },
        TaggedTemplateExpression (nodePath) {
          const text = constant(nodePath.get('quasi'))
          if (text !== undefined && /[{};]|(?:color|background)\s*:/.test(text)) stylesheet(text, !text.includes('{'), nodePath.node.loc?.start, styleUse(nodePath))
          else inspect(nodePath.get('quasi'), true, false, styleUse(nodePath))
        }
      })
    }
  } catch (error) { issue('unparsed-source', error.message, error.loc ?? { line: error.line, column: error.column }) }
  const unique = [...new Map(diagnostics.map(item => [`${item.code}:${item.line}:${item.column}:${item.message}`, item])).values()]
  return { path, sha256: hash(source), renderer, meaningful, references: [...references].sort(), imports: [...imports].sort(), diagnostics: unique }
}

export async function checkRoleCoverage (root) {
  const tokensPath = 'src/promethity/tokens.css'; const rolesPath = 'src/promethity/roles.css'
  const tokens = await readFile(join(root, tokensPath), 'utf8'); const rolesCSS = await readFile(join(root, rolesPath), 'utf8')
  const rawTokens = [...new Set([...tokens.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]))]
  const roles = [...new Set([...rolesCSS.matchAll(/(--role-[\w-]+)\s*:/g)].map(match => match[1]))]
  if (roles.length !== 14 || !rawTokens.length) throw new Error('Current canonical token/role source is missing or incomplete')
  const files = []; const diagnostics = []; const directories = []
  async function visit (path) {
    if (excluded(path)) return
    const metadata = await lstat(join(root, path))
    if (metadata.isSymbolicLink()) { diagnostics.push({ path, code: 'source-symlink', message: 'Surface coverage cannot follow a source symlink' }); return }
    if (metadata.isDirectory()) { for (const name of (await readdir(join(root, path))).sort()) await visit(`${path}/${name}`); return }
    const extension = extname(path)
    if (unsupportedStyles.has(extension)) { diagnostics.push({ path, code: 'unsupported-source', message: 'Unsupported surface styling syntax needs an explicit parser; it cannot silently escape coverage' }); return }
    if (extension !== '.css' && !codeExtensions.has(extension)) return
    const file = inspectSurfaceSource({ path, source: await readFile(join(root, path), 'utf8'), rawTokens, roles })
    files.push(file); diagnostics.push(...file.diagnostics)
  }
  for (const path of surfaceDirectories) {
    try { await visit(path) } catch (error) { if (error.code !== 'ENOENT') throw error; diagnostics.push({ path, code: 'missing-surface', message: 'Required production surface directory is absent' }) }
  }
  const byPath = new Map(files.map(file => [file.path, file]))
  const connected = (file, seen = new Set()) => {
    if (seen.has(file.path)) return new Set()
    seen.add(file.path)
    const references = new Set(file.references)
    for (const target of file.imports.filter(target => target.startsWith('.'))) {
      const base = normalize(join(dirname(file.path), target)).replaceAll('\\', '/')
      const dependency = [base, ...[...codeExtensions, '.css'].map(extension => base + extension), ...[...codeExtensions].map(extension => `${base}/index${extension}`)].map(path => byPath.get(path)).find(Boolean)
      if (dependency) for (const role of connected(dependency, seen)) references.add(role)
    }
    return references
  }
  for (const path of surfaceDirectories) {
    const production = files.filter(file => file.path.startsWith(`${path}/`) && file.meaningful)
    const renderers = production.filter(file => file.renderer)
    const used = new Set(renderers.flatMap(file => [...connected(file)]))
    directories.push({ path, productionFiles: production.length, renderers: renderers.map(file => file.path), roles: [...used].sort() })
    if (!production.length || !renderers.length || !used.size) diagnostics.push({ path, code: 'empty-surface', message: 'Required surface needs a production renderer connected to actual role-bearing styling; tests, comments and unimported styles do not count' })
  }
  return { schemaVersion: 1, ok: diagnostics.length === 0, toolchain: { node: process.version, executable: process.execPath, babel: require('@babel/core/package.json').version, vite: require('vite/package.json').version, postcss: viteRequire('postcss/package.json').version }, inputs: { [tokensPath]: hash(tokens), [rolesPath]: hash(rolesCSS) }, directories, files, diagnostics }
}
