// @vitest-environment node
import { mkdtemp, mkdir, writeFile, cp, rm, copyFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { assertExplorerFreshness, explorerSourceManifest, artifactFiles } from '../../vendor/ipld-explorer-components/scripts/freshness.mjs'

it('rejects a stale packed copy even when its local package version matches', async () => {
  const root = await mkdtemp(join(tmpdir(), 'explorer-freshness-'))
  try {
    const source = join(root, 'vendor/ipld-explorer-components')
    for (const directory of ['src', 'public', 'scripts', 'test', 'upstream', 'patches']) await mkdir(join(source, directory), { recursive: true })
    for (const file of ['LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE', 'FORK.md', 'provenance.json']) await writeFile(join(source, file), 'fixture notice')
    await writeFile(join(source, 'package.json'), JSON.stringify({ version: '8.1.3-react19.1' }))
    await writeFile(join(source, 'package-lock.json'), '{}')
    await writeFile(join(source, 'upstream/package-lock.json'), 'original immutable lock')
    await writeFile(join(source, 'patches/0001.patch'), 'compatibility patch')
    await writeFile(join(source, 'src/index.ts'), 'export const revision = 1')
    await mkdir(join(source, 'dist'))
    await copyFile(join(source, 'package-lock.json'), join(source, 'dist/build-inputs.lock.json'))
    await copyFile(join(source, 'upstream/package-lock.json'), join(source, 'dist/upstream-original.lock.json'))
    for (const file of ['index.js', 'providers.js', 'pages.js', 'forms.js', 'start-exploring.js', 'style.css']) await writeFile(join(source, 'dist', file), 'fixture artifact')
    await writeFile(join(source, 'dist/artifact-manifest.json'), JSON.stringify({ sourceSha256: (await explorerSourceManifest(source)).sha256, artifacts: await artifactFiles(source) }))
    await cp(source, join(root, 'node_modules/ipld-explorer-components'), { recursive: true })
    expect(await assertExplorerFreshness(root)).toEqual(expect.objectContaining({ version: '8.1.3-react19.1' }))
    await writeFile(join(root, 'node_modules/ipld-explorer-components/src/index.ts'), 'export const revision = 2')
    await expect(assertExplorerFreshness(root)).rejects.toThrow('Explorer dependency artifact is stale')
    await cp(source, join(root, 'node_modules/ipld-explorer-components'), { recursive: true })
    await writeFile(join(source, 'upstream/package-lock.json'), 'changed immutable lock')
    await expect(assertExplorerFreshness(root)).rejects.toThrow('artifact is stale')
    await writeFile(join(source, 'upstream/package-lock.json'), 'original immutable lock')
    await writeFile(join(source, 'dist/index.js'), 'tampered artifact')
    await expect(assertExplorerFreshness(root)).rejects.toThrow('artifact files differ')
    await writeFile(join(source, 'dist/index.js'), 'fixture artifact')
    await writeFile(join(source, 'src/index.ts'), 'export const revision = 2')
    await writeFile(join(source, 'dist/artifact-manifest.json'), JSON.stringify({ sourceSha256: (await explorerSourceManifest(source)).sha256, artifacts: await artifactFiles(source) }))
    await expect(assertExplorerFreshness(root)).rejects.toThrow('Installed Explorer source is stale')
  } finally {
    await rm(root, { recursive: true })
  }
})
