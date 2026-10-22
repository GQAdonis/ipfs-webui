// @vitest-environment node
import { mkdtemp, mkdir, readFile, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { assertSharedAliases, isolateA2uiStyles, sharedEntrypoints, sharedEntrypointGuard } from './shared-entrypoints.js'
import { createWebuiConfig } from '../vite.config.js'

const temporary = []
const webui = resolve(dirname(fileURLToPath(import.meta.url)), '..')
afterEach(async () => { for (const root of temporary.splice(0)) await rm(root, { recursive: true, force: true }) })
async function put (root, file, text) {
  await mkdir(dirname(join(root, file)), { recursive: true })
  await writeFile(join(root, file), text)
}
async function checkout () {
  const root = await mkdtemp(join(tmpdir(), 'webui-shared-entry-fixture-'))
  temporary.push(root)
  await mkdir(join(root, 'ipfs-webui'))
  const kubo = join(root, 'kubo')
  const packages = {
    ui: {
      name: '@gqadonis/ipfs-mcp-ui',
      exports: {
        '.': { types: './dist/types/index.d.ts', default: './dist/index.js' },
        './host': { types: './dist/types/host/index.d.ts', default: './dist/host.js' },
        './a2ui': { types: './dist/types/a2ui/index.d.ts', default: './dist/a2ui.js' },
        './styles.css': './dist/ipfs-ui.css'
      }
    },
    chat: { name: '@gqadonis/ipfs-agent-chat', exports: { './react': { types: './dist/types/react.d.ts', default: './dist/react/agent-chat-react.js' } } }
  }
  for (const [name, metadata] of Object.entries(packages)) {
    await put(kubo, `mcp/${name}/package.json`, JSON.stringify(metadata))
    for (const entry of Object.values(metadata.exports)) {
      for (const file of typeof entry === 'string' ? [entry] : Object.values(entry)) await put(kubo, `mcp/${name}/${file.slice(2)}`, '// Explicit test fixture; not a production dependency artifact.\n')
    }
  }
  return { root, webui: join(root, 'ipfs-webui'), kubo, packages }
}

describe('trusted built shared package entrypoints', () => {
  it('resolves the exact public package/subpaths and their matching declarations from the default sibling', async () => {
    const fixture = await checkout(); const entries = sharedEntrypoints(fixture.webui)
    expect(entries.kuboRoot).toBe(await realpath(fixture.kubo))
    expect(entries.imports.map(item => item.specifier)).toEqual([
      '@gqadonis/ipfs-mcp-ui', '@gqadonis/ipfs-mcp-ui/styles.css', '@gqadonis/ipfs-mcp-ui/host', '@gqadonis/ipfs-mcp-ui/a2ui', '@gqadonis/ipfs-agent-chat/react'
    ])
    for (const item of entries.imports) {
      expect(item.runtime).toContain('/dist/')
      expect(item.runtime).not.toMatch(/\/src\/|\/public\//)
      if (!item.specifier.endsWith('.css')) expect(item.types).toMatch(/\/dist\/types\/.+\.d\.ts$/)
    }
    expect(() => assertSharedAliases(entries, entries.aliases)).not.toThrow()
    expect(entries.aliases.some(alias => alias.find.test('@gqadonis/ipfs-mcp-ui/untrusted'))).toBe(false)
  })

  it('the export config consumes the explicit alternate producer root instead of silently using the default sibling', async () => {
    const alternate = await checkout()
    const expected = sharedEntrypoints(webui, alternate.kubo)
    const config = createWebuiConfig({ mode: 'production', kubo: alternate.kubo })
    expect(() => assertSharedAliases(expected, config.resolve.alias)).not.toThrow()
    expect(config.resolve.dedupe).toEqual(expect.arrayContaining(['react', 'react-dom', 'radix-ui']))
    expect(config.optimizeDeps.exclude).toEqual(expect.arrayContaining(['@a2ui/react', '@a2ui/react/v0_9']))
    expect(config.plugins.map(plugin => plugin.name)).toEqual(expect.arrayContaining(['webui-trusted-shared-entrypoints', 'webui-isolate-a2ui-global-style']))
  })

  it('rejects a later alias override that consumes another checkout or a source file', async () => {
    const selected = await checkout(); const other = await checkout()
    const entries = sharedEntrypoints(selected.webui)
    const alternate = sharedEntrypoints(other.webui)
    expect(() => assertSharedAliases(entries, [...alternate.aliases, ...entries.aliases])).toThrow('root mismatch')
    expect(() => sharedEntrypointGuard(entries).configResolved({ resolve: { alias: [{ find: '@gqadonis/ipfs-mcp-ui', replacement: join(entries.kuboRoot, 'mcp/ui/src/index.ts') }, ...entries.aliases] } })).toThrow('root mismatch')
    expect(() => assertSharedAliases(entries, entries.aliases.map(alias => ({ ...alias, customResolver () {} })))).toThrow('custom resolver')
  })

  it('keeps default sibling TypeScript paths aligned with the same package export declarations', async () => {
    const fixture = await checkout(); const entries = sharedEntrypoints(fixture.webui)
    const tsconfig = JSON.parse(await readFile(join(webui, 'tsconfig.json'), 'utf8'))
    for (const item of entries.imports) {
      const file = item.types || item.runtime
      expect(tsconfig.compilerOptions.paths[item.specifier]).toEqual([relative(await realpath(fixture.webui), file).replaceAll('\\', '/')])
    }
  })

  it.each(['./src/index.ts', './dist/../outside.js', './dist/nested//index.js', 'https://example.test/index.js', './dist/evil\\index.js'])('rejects unsafe or unbuilt manifest target %s', async target => {
    const fixture = await checkout()
    fixture.packages.ui.exports['.'].default = target
    await put(fixture.kubo, 'mcp/ui/package.json', JSON.stringify(fixture.packages.ui))
    expect(() => sharedEntrypoints(fixture.webui)).toThrow()
  })

  it('refuses a package-name substitution and missing typed entry', async () => {
    const fixture = await checkout()
    await put(fixture.kubo, 'mcp/ui/package.json', JSON.stringify({ ...fixture.packages.ui, name: 'unrelated-package' }))
    expect(() => sharedEntrypoints(fixture.webui)).toThrow('identity')
    await put(fixture.kubo, 'mcp/ui/package.json', JSON.stringify(fixture.packages.ui))
    await rm(join(fixture.kubo, 'mcp/ui/dist/types/host/index.d.ts'))
    expect(() => sharedEntrypoints(fixture.webui)).toThrow()
  })

  it.each(['root', 'package', 'dist', 'file'])('refuses a symlinked %s instead of following a different artifact location', async kind => {
    const fixture = await checkout()
    if (kind === 'root') {
      await symlink('kubo', join(fixture.root, 'linked-kubo'))
      expect(() => sharedEntrypoints(fixture.webui, join(fixture.root, 'linked-kubo'))).toThrow('symlink')
      return
    }
    const path = kind === 'package' ? 'mcp/ui' : kind === 'dist' ? 'mcp/ui/dist' : 'mcp/ui/dist/index.js'
    const moved = `${path}-retained`
    // Copy-free fixture relocation through rename leaves one real target, with no loop.
    await rename(join(fixture.kubo, path), join(fixture.kubo, moved))
    await symlink(kind === 'file' ? 'index.js-retained' : kind === 'dist' ? 'dist-retained' : 'ui-retained', join(fixture.kubo, path))
    expect(() => sharedEntrypoints(fixture.webui)).toThrow('symlink')
  })
})

describe('pinned A2UI stylesheet isolation', () => {
  const upstream = '/trusted/node_modules/@a2ui/react/v0_9/index.js'
  const context = { error (message) { throw new Error(message) } }
  it('removes the actual installed pinned package head-injection block while retaining its module exports', async () => {
    const source = await readFile(join(webui, '../kubo/mcp/ui/node_modules/@a2ui/react/v0_9/index.js'), 'utf8')
    const result = isolateA2uiStyles().transform.call(context, source, upstream)
    expect(result.code).not.toContain('a2ui-date-time-input-webkit-styles')
    expect(result.code).toContain('export {')
    expect(result.code).toContain('DateTimeInput')
  })
  it('fails closed when the known injection identifier has a changed implementation', () => {
    const changed = 'if (typeof document !== "undefined") { const styleId = "a2ui-date-time-input-webkit-styles"; document.head.append(style); }'
    expect(() => isolateA2uiStyles().transform.call(context, changed, upstream)).toThrow('changed')
  })
  it('does not rewrite application strings or unrelated package modules', () => {
    const code = 'const fixture = "a2ui-date-time-input-webkit-styles"'
    expect(isolateA2uiStyles().transform.call(context, code, '/trusted/src/user-content.js')).toBeNull()
  })
})
