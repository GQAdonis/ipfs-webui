// @vitest-environment node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// This is the UI-01 alias contract, not a new palette. V/1.4 owns role contrast;
// V/1.6 owns the incumbent-screen comparison at the final verification boundary.
const roleMap = {
  '--role-canvas': '--ground',
  '--role-chrome': '--surface',
  '--role-surface': '--surface',
  '--role-raised': '--raised',
  '--role-hover': '--control',
  '--role-muted': '--control',
  '--role-text': '--text',
  '--role-text-muted': '--text-muted',
  '--role-text-subtle': '--text-muted',
  '--role-action': '--accent',
  '--role-ai': '--info',
  '--role-ok': '--ok',
  '--role-warn': '--warn',
  '--role-err': '--err'
}
const css = readFileSync(new URL('./roles.css', import.meta.url), 'utf8')
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
const expectedSelectors = [":root,:root[data-theme='dark']", ":root[data-theme='light']"]
const withoutComments = source => source.replace(/\/\*[\s\S]*?\*\//g, '')

// roles.css deliberately has only two unconditional declaration blocks. Reject
// extra selectors/at-rules as well as literal values, so an overriding theme or
// media rule cannot silently defeat the alias contract.
function assertRoleAliases (source) {
  const text = withoutComments(source)
  const blocks = [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  assert.equal(text.replace(/([^{}]+)\{([^{}]*)\}/g, '').trim(), '', 'alias-only stylesheet')
  assert.deepEqual(blocks.map(([, selector]) => selector.replace(/\s+/g, '')), expectedSelectors, 'theme selectors')
  for (const [, selector, body] of blocks) {
    const declarations = body.split(';').map(item => item.trim()).filter(Boolean)
    const actual = {}
    for (const declaration of declarations) {
      const match = /^(--role-[a-z-]+)\s*:\s*var\((--[a-z-]+)\)$/.exec(declaration)
      assert.ok(match, `${selector}: only var(existingToken) aliases`)
      const [, role, token] = match
      assert.ok(!Object.hasOwn(actual, role), `${selector}: duplicate ${role}`)
      actual[role] = token
    }
    assert.deepEqual(actual, roleMap, `${selector}: exact fourteen role mappings`)
  }
}

describe('Praxis role aliases', () => {
  test('defines the same fourteen aliases in root/dark and light', () => {
    assertRoleAliases(css)
  })

  test('targets tokens already present in each existing theme', () => {
    const source = withoutComments(tokens)
    for (const selector of [":root[data-theme='dark']", ":root[data-theme='light']", ":root[data-theme='system']"]) {
      const start = source.indexOf(selector)
      assert.ok(start >= 0, `${selector}: existing theme`)
      const body = source.slice(source.indexOf('{', start) + 1, source.indexOf('}', start))
      for (const token of new Set(Object.values(roleMap))) {
        assert.ok(body.includes(`${token}:`), `${selector}: existing ${token}`)
      }
    }
  })

  test('loads aliases after brand tokens in the existing CSS entry sequence', () => {
    const entry = readFileSync(new URL('../index.js', import.meta.url), 'utf8')
    const tokenImport = entry.indexOf("import './promethity/tokens.css'")
    const roleImport = entry.indexOf("import './promethity/roles.css'")
    assert.ok(tokenImport >= 0 && roleImport > tokenImport)
    assert.equal(entry.match(/import '\.\/promethity\/roles\.css'/g)?.length, 1)
  })

  test.each([
    ['missing role', source => source.replace('  --role-canvas: var(--ground);', '')],
    ['hex literal', source => source.replace('var(--info)', '#7fb2d9')],
    ['raw token without var()', source => source.replace('var(--ground)', '--ground')],
    ['wrong light alias', source => source.replace(/(:root\[data-theme='light'\][\s\S]*?--role-ai:) var\(--info\)/, '$1 var(--accent)')],
    ['missing explicit light theme', source => source.slice(0, source.indexOf(":root[data-theme='light']"))],
    ['wrong theme selector', source => source.replace("[data-theme='light']", "[data-theme='system']")],
    ['unknown role', source => source.replace('--role-err:', '--role-error:')],
    ['duplicate role', source => source.replace('--role-ai: var(--info);', '--role-ai: var(--info); --role-ai: var(--accent);')],
    ['conditional override', source => `${source}\n@media (prefers-color-scheme: light) { :root { --role-ai: var(--accent); } }`]
  ])('rejects %s', (_, mutate) => {
    assert.throws(() => assertRoleAliases(mutate(css)))
  })
})
