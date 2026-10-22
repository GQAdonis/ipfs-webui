import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../../scripts/local-artifact.mjs'
const REVISION = 'ba1503c64472b82256d9de95e2e62c5901a38e8b'
const LICENSE = '1564074e13439397221ffd522e2e504d56561994a23d371aa5e3ad43e4f5423f'
const BLOBS = Object.freeze({ button: 'e3345d985d14c33e3cb9d8c45cf973807326c944', badge: '1a94cc539326e26227271a0b3599be99e0e55fb6', input: 'ddb9b315e34245addded54b1848bb32c80c418cc', textarea: 'bf23f6c255978311c3069f5da3fa10c1d896e8cf', label: '5aff7469c384001a3f1b49cc5cf8871b10f10386', tabs: '6e174747a509f8a906ce9cfb27bc2c7603f2b6b5', dialog: 'ccadf4a85bf6398d52314b112600f796fc97db97', sheet: '9f7ae5fed9763e9ddbe38692fbf5b3f67224b731', 'dropdown-menu': '1f9742d6783223126a3b91e91b7a230243ddf23d' })
const blob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
export async function sourceProvenance (ctx) {
  const root = join(ctx.kubo, 'mcp/ui'), directory = join(root, 'src/components/primitives/upstream')
  const bytes = await readFile(join(directory, 'provenance.json')), value = JSON.parse(bytes)
  ctx.assert(value.repository === 'https://github.com/shadcn-ui/ui' && value.revision === REVISION && value.registry === 'new-york-v4' && value.license.spdx === 'MIT', 'The exact source-owned shadcn revision/registry/license authority is preserved')
  ctx.assert(value.files.length === Object.keys(BLOBS).length && new Set(value.files.map(item => item.component)).size === value.files.length, 'Every copied source has one named immutable snapshot')
  const files = []
  for (const item of value.files) {
    ctx.assert(BLOBS[item.component] === item.blob && item.sourcePath === `apps/v4/registry/new-york-v4/ui/${item.component}.tsx` && item.snapshot === `${item.component}.tsx.txt`, 'Snapshot path and Git blob match the independently pinned revision table')
    const source = await readFile(join(directory, item.snapshot))
    ctx.assert(blob(source) === BLOBS[item.component] && sha256(source) === item.sha256, 'Actual original source bytes match both immutable Git blob and recorded SHA-256', { component: item.component, blob: item.blob, sha256: item.sha256 })
    ctx.assert(blob(Buffer.concat([source, Buffer.from('\nnegative-control')])) !== BLOBS[item.component], 'A changed source snapshot is detected by the same immutable-byte oracle')
    files.push({ component: item.component, blob: item.blob, sha256: item.sha256 })
  }
  ctx.assert(value.license.sha256 === LICENSE && sha256(await readFile(join(directory, 'LICENSE'))) === LICENSE, 'The actual distributed MIT license bytes match the pinned upstream license')
  const sources = await readFile(join(root, 'SOURCES.md'), 'utf8')
  ctx.assert(sources.includes(REVISION) && sources.includes('Material host adaptation') && sources.includes('native `<dialog>`') && sources.includes('Copyright (c) 2023 shadcn'), 'Distributed source notice explicitly documents the native host adaptation and license')
  await ctx.record('immutable-shadcn-provenance', { revision: REVISION, registry: value.registry, manifestSha256: sha256(bytes), licenseSha256: LICENSE, files, sourcesSha256: sha256(sources), fontsSourceSha256: sha256(await readFile(join(root, 'src/fonts/fonts-data.ts'))) })
}
