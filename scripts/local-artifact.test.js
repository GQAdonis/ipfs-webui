// @vitest-environment node
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { assertExportArtifacts, digest, EXPORT_MANIFEST, packageExportArtifacts, safeRelativePath, sha256, sharedArtifacts, snapshot, treeFiles } from './local-artifact.mjs'

const temporary = []
async function directory () {
  const root = await mkdtemp(join(tmpdir(), 'webui-local-artifact-'))
  temporary.push(root)
  return root
}
afterEach(async () => { for (const root of temporary.splice(0)) await rm(root, { recursive: true, force: true }) })
async function put (root, path, contents) {
  const parts = path.split('/'); parts.pop()
  await mkdir(join(root, ...parts), { recursive: true })
  await writeFile(join(root, path), contents)
}
async function artifact () {
  const root = await directory()
  for (const [path, text] of Object.entries({
    'index.html': '<script type="module" src="./static/app.js"></script>',
    'static/app.js': 'export default 1',
    'licenses/ipld-explorer-components/dependencies.json': '{}',
    'licenses/ipld-explorer-components/LICENSE-MIT': 'MIT notice',
    'licenses/ipld-explorer-components/LICENSE-APACHE': 'Apache notice',
    'provenance/explorer/artifact-manifest.json': '{}',
    'provenance/shared-artifacts.json': '{}',
    'provenance/react-runtime.json': '{}'
  })) await put(root, path, text)
  const files = await treeFiles(root)
  const manifest = { schemaVersion: 1, kind: 'ipfs-webui-local', entry: 'index.html', base: './', routing: 'hash', artifactSha256: digest(files), artifacts: files }
  await put(root, EXPORT_MANIFEST, JSON.stringify(manifest))
  return root
}

describe('local artifact packaging preconditions', () => {
  it('requires every typed public entry, including the host React and catalog exports', async () => {
    const root = await directory()
    const files = ['dist/index.js', 'dist/types/index.d.ts', 'dist/react/agent-chat-react.js', 'dist/types/react.d.ts', 'catalog/catalog.json']
    await put(root, 'package.json', JSON.stringify({
      exports: {
        '.': { types: './dist/types/index.d.ts', default: './dist/index.js' },
        './react': { types: './dist/types/react.d.ts', default: './dist/react/agent-chat-react.js' },
        './catalog.json': './catalog/catalog.json'
      }
    }))
    for (const file of files) await put(root, file, file)
    expect(Object.keys(await packageExportArtifacts(root))).toEqual([...files].sort())
    await rm(join(root, 'dist/types/react.d.ts'))
    await expect(packageExportArtifacts(root)).rejects.toThrow()
  })
  it('refuses exported paths outside the package and symlinked export ancestors', async () => {
    const root = await directory()
    await put(root, 'package.json', JSON.stringify({ exports: './dist/../outside.js' }))
    await expect(packageExportArtifacts(root)).rejects.toThrow('Unsafe')
    await put(root, 'package.json', JSON.stringify({ exports: './dist/index.js' }))
    await put(root, 'actual/index.js', 'export default 1')
    await symlink('actual', join(root, 'dist'))
    await expect(packageExportArtifacts(root)).rejects.toThrow('symlink')
  })
  it('rejects stale MCP App view hashes and sizes before copying shared artifacts', async () => {
    const root = await directory()
    const required = {
      ui: ['index.js', 'host.js', 'a2ui.js', 'ipfs-ui.css', 'react-runtime.json', 'types/index.d.ts'],
      chat: ['ipfs-agent-chat.js', 'react-runtime.json', 'react/agent-chat-react.js', 'react/react-runtime.json', 'types/index.d.ts', 'types/react.d.ts'],
      app: ['view.html'],
      webmcp: ['index.js', 'index.d.ts', 'generated/tools.js']
    }
    for (const [name, files] of Object.entries(required)) {
      await put(root, `mcp/${name}/package.json`, '{"exports":{}}')
      for (const file of files) await put(root, `mcp/${name}/dist/${file}`, file)
    }
    await put(root, 'mcp/ui/tests/fixtures/converter-schemas.generated.ts', '// fixture')
    await put(root, 'mcp/chat/src/generated/island.css', '/* fixture */')
    const view = { file: 'view.html', bytes: Buffer.byteLength('view.html'), sha256: sha256('view.html') }
    const manifest = async views => put(root, 'mcp/app/dist/manifest.json', JSON.stringify({ views }))
    await manifest([view])
    await expect(sharedArtifacts(root)).resolves.toHaveProperty('app')
    await manifest([{ ...view, bytes: view.bytes + 1 }])
    await expect(sharedArtifacts(root)).rejects.toThrow('bytes differ')
    await manifest([{ ...view, sha256: '0'.repeat(64) }])
    await expect(sharedArtifacts(root)).rejects.toThrow('bytes differ')
    await manifest([view, view])
    await expect(sharedArtifacts(root)).rejects.toThrow('Duplicate')
  })
  it('accepts a complete portable file inventory independently of checkout location', async () => {
    const root = await artifact()
    const manifest = await assertExportArtifacts(root)
    expect(manifest.base).toBe('./')
    expect(manifest.routing).toBe('hash')
  })
  it('rejects tampered files, added files and absent required inputs', async () => {
    const root = await artifact()
    await put(root, 'static/app.js', 'changed')
    await expect(assertExportArtifacts(root)).rejects.toThrow('stale')
    const extra = await artifact(); await put(extra, 'unexpected.js', 'extra')
    await expect(assertExportArtifacts(extra)).rejects.toThrow('stale')
    const missing = await artifact(); await rm(join(missing, 'licenses/ipld-explorer-components/LICENSE-MIT'))
    await expect(assertExportArtifacts(missing)).rejects.toThrow('stale')
  })
  it('rejects path traversal and symlinks instead of reading outside the supplied tree', async () => {
    for (const path of ['../outside', '/absolute', 'a/../b', 'a\\b', 'C:/host', 'a//b']) expect(() => safeRelativePath(path)).toThrow('Unsafe')
    const root = await artifact()
    await symlink('index.html', join(root, 'linked-entry'))
    await expect(assertExportArtifacts(root)).rejects.toThrow('symlink')
    await rm(join(root, 'linked-entry'))
    const manifest = JSON.parse(await readFile(join(root, EXPORT_MANIFEST), 'utf8'))
    manifest.artifacts['../outside'] = '0'.repeat(64)
    await put(root, EXPORT_MANIFEST, JSON.stringify(manifest))
    await expect(assertExportArtifacts(root)).rejects.toThrow('Unsafe')
  })
  it('binds source, lock, catalog and contract bytes without timestamps or absolute paths', async () => {
    const root = await directory()
    for (const file of ['src/component.tsx', 'pnpm-lock.yaml', 'catalog/catalog.json', 'contract/tool.json']) await put(root, file, file)
    const first = await snapshot(root, ['src', 'pnpm-lock.yaml', 'catalog', 'contract'])
    const reordered = await snapshot(root, ['contract', 'catalog', 'pnpm-lock.yaml', 'src'])
    expect(reordered).toEqual(first)
    expect(JSON.stringify(first)).not.toContain(root)
    for (const file of ['src/component.tsx', 'pnpm-lock.yaml', 'catalog/catalog.json', 'contract/tool.json']) {
      const original = await readFile(join(root, file))
      await put(root, file, 'changed')
      expect((await snapshot(root, ['src', 'pnpm-lock.yaml', 'catalog', 'contract'])).sha256).not.toBe(first.sha256)
      await put(root, file, original)
    }
  })
})
