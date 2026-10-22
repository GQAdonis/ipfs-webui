// Final-boundary-only dependency fixture. Compiles the actual shared font loader
// without changing shared source, its production build or its generator outputs.
import assert from 'node:assert/strict'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { snapshot, treeFiles, assertSame, sha256 } from '../../scripts/local-artifact.mjs'

const [kuboArgument, outputArgument] = process.argv.slice(2)
assert.ok(kuboArgument && outputArgument && process.argv.length === 4, 'Explicit Kubo source and exclusive empty output directory required')
const root = join(resolve(kuboArgument), 'mcp/ui'); const output = resolve(outputArgument)
assert.equal((await readdir(output)).length, 0, 'Font fixture output must already be an exclusive empty owned directory')
const require = createRequire(join(root, 'package.json'))
const { build } = await import(pathToFileURL(require.resolve('vite')).href)
const before = await snapshot(root, ['src/fonts', 'fonts', 'package.json', 'pnpm-lock.yaml'])
await build({ root, configFile: false, envDir: false, publicDir: false, base: './', build: { outDir: output, emptyOutDir: false, target: 'es2023', minify: false, lib: { entry: join(root, 'src/fonts/register.ts'), formats: ['es'], fileName: () => 'register.js' } } })
assertSame(await snapshot(root, ['src/fonts', 'fonts', 'package.json', 'pnpm-lock.yaml']), before, 'Shared font fixture authoritative inputs')
const files = await treeFiles(output)
assert.ok(files['register.js'], 'Actual shared font registration entry emitted')
const manifest = { kind: 'test-only-shared-font-loader', inputs: before, files, node: { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) }, vite: require('vite/package.json').version }
await writeFile(join(output, 'FONT_FIXTURE.json'), JSON.stringify(manifest, null, 2) + '\n')
