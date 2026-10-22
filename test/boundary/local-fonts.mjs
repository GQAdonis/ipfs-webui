import { baselineAuthorityPath, loadBaselineAuthority } from './baseline-authority.mjs'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { sha256 } from '../../scripts/local-artifact.mjs'

const require = createRequire(import.meta.url)
const postcss = createRequire(require.resolve('vite/package.json'))('postcss')
const unquote = value => value.replace(/^['"]|['"]$/g, '')
export function declaredWebuiFaces (css) {
  const faces = []
  postcss.parse(css).walkAtRules('font-face', rule => {
    const declarations = Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]))
    const path = /^url\(['"]?(\.\/fonts\/[^'"()]+\.woff2)['"]?\)/.exec(declarations.src ?? '')?.[1]
    assert.ok(path, 'Every WebUI face must reference a bundled relative WOFF2')
    assert.ok(declarations['unicode-range'], 'Existing per-script fallback range must remain')
    faces.push({ family: unquote(declarations['font-family']), weight: declarations['font-weight'], style: declarations['font-style'], path: `src/promethity/${path.slice(2)}` })
  })
  assert.ok(faces.length > 0, 'No font declarations cannot pass local-font coverage')
  return faces
}
export function declaredSharedFaces (source) {
  const imports = Object.fromEntries([...source.matchAll(/import (\w+) from '\.\.\/\.\.\/fonts\/([^']+)\?inline'/g)].map(([, name, file]) => [name, file]))
  const faces = [...source.matchAll(/\{ family: '([^']+)', weight: '(\d+)', dataUri: (\w+) \}/g)].map(([, family, weight, name]) => {
    assert.ok(imports[name], 'Shared face must resolve to its actual bundled source import')
    return { family, weight, style: 'normal', path: `mcp/ui/fonts/${imports[name]}` }
  })
  assert.ok(faces.length > 0 && faces.length === Object.keys(imports).length, 'Every shared font import must have an explicit face descriptor')
  return faces
}
export function assertLocalFontRequests (requests, baseURL) {
  assert.ok(requests.length > 0, 'No actual font network observations cannot prove WebUI font loading')
  const base = new URL(baseURL)
  for (const request of requests) {
    const url = new URL(request.url)
    assert.ok(url.origin === base.origin && url.pathname.startsWith(base.pathname) && !url.username && !url.password && !url.search, 'External or unexpected font request detected')
  }
}
export async function fontSources (ctx) {
  const { bytes: authorityBytes } = await loadBaselineAuthority(ctx)
  const authority = JSON.parse(authorityBytes).repositories.find(repo => repo.root.endsWith('/ipfs-webui'))
  assert.ok(authority, 'Immutable WebUI font authority required')
  const webuiCSS = await readFile(join(ctx.root, 'src/promethity/fonts.css'), 'utf8')
  assert.equal(sha256(webuiCSS), authority.sourceHashes['src/promethity/fonts.css'], 'WebUI font declarations retain immutable incumbent bytes')
  const webui = declaredWebuiFaces(webuiCSS)
  const shared = declaredSharedFaces(await readFile(join(ctx.kubo, 'mcp/ui/src/fonts/fonts-data.ts'), 'utf8'))
  for (const [host, faces] of [['webui', webui], ['shared', shared]]) for (const face of faces) {
    const bytes = await readFile(join(host === 'webui' ? ctx.root : ctx.kubo, face.path))
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2', 'Actual WOFF2 font bytes required')
    face.sha256 = sha256(bytes)
    const incumbentPath = host === 'webui' ? face.path : `src/promethity/fonts/${face.path.split('/').at(-1)}`
    assert.equal(face.sha256, authority.sourceHashes[incumbentPath], `${host}: font bytes retain immutable bundled identity`)
  }
  return { webui, shared, authority: { path: baselineAuthorityPath, sha256: sha256(authorityBytes) } }
}

export function watchFontNetwork (page) {
  const requests = []; const responses = []; const pending = []
  const publicURL = input => { const url = new URL(input); return url.origin + url.pathname + (url.search ? '?[omitted]' : '') }
  const request = event => { if (event.resourceType() === 'font') requests.push({ url: publicURL(event.url()), resourceType: 'font' }) }
  const response = event => {
    if (event.request().resourceType() !== 'font') return
    const job = (async () => {
      try { const body = await event.body(); responses.push({ url: publicURL(event.url()), status: event.status(), sha256: sha256(body), woff2: body.subarray(0, 4).toString() === 'wOF2' }) } catch { responses.push({ url: publicURL(event.url()), status: event.status(), unreadable: true }) }
    })()
    pending.push(job)
  }
  page.on('request', request); page.on('response', response)
  return { requests, responses, async settle () { await Promise.all(pending) }, close () { page.off('request', request); page.off('response', response) } }
}
