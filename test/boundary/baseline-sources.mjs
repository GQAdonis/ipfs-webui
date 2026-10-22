import { loadBaselineAuthority } from './baseline-authority.mjs'
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256, treeFiles } from '../../scripts/local-artifact.mjs'
import { Blocked } from './processes.mjs'

export function assertTokenOnlyDelta (ctx, incumbent, tokenOnly, roleHash, originalCSS, derivedCSS) {
  const expected = ['src/index.css', 'src/promethity/roles.css']
  const changed = [...new Set([...Object.keys(incumbent), ...Object.keys(tokenOnly)])].filter(path => incumbent[path] !== tokenOnly[path]).sort()
  ctx.assert(JSON.stringify(changed) === JSON.stringify(expected), 'Token-only baseline changes exactly the alias stylesheet and its CSS import', changed)
  ctx.assert(!incumbent['src/promethity/roles.css'] && tokenOnly['src/promethity/roles.css'] === roleHash, 'Token-only baseline adds the actual current role alias bytes')
  ctx.assert(derivedCSS === '@import "./promethity/roles.css";\n' + originalCSS, 'Token-only baseline preserves every incumbent CSS declaration verbatim')
}

// Called by the later UI-102 immutable-token-baseline registration only at the
// final boundary. Does not install historical dependencies, build or render.
export async function assembleBaselineSources (ctx) {
  const { path, baseline } = await loadBaselineAuthority(ctx)
  const webui = baseline.repositories.find(repo => repo.root.endsWith('/ipfs-webui'))
  const kubo = baseline.repositories.find(repo => repo.root.endsWith('/kubo'))
  if (!webui || !kubo || webui.workingTreeStatus.trim()) throw new Blocked('Baseline authority is missing or needs its task-owned uncommitted source snapshot; never substitute current source')
  const fixtures = {}
  for (const kind of ['incumbent', 'token-only']) {
    const directory = join(ctx.scratch, `baseline-${kind}`)
    await mkdir(directory, { recursive: false })
    const archive = join(ctx.scratch, `${kind}-source.tar`)
    await ctx.processes.run('git', ['archive', '--format=tar', `--output=${archive}`, webui.head], { cwd: ctx.root, env: ctx.env, label: `${kind}-immutable-source` })
    await ctx.processes.run('tar', ['-xf', archive, '-C', directory], { cwd: ctx.root, env: ctx.env, label: `${kind}-extract-owned-source` })
    const files = await treeFiles(directory)
    for (const [file, hash] of Object.entries(webui.sourceHashes)) ctx.assert(files[file] === hash, `Immutable ${kind} WebUI source matches pre-production ${file}`)
    if (kind === 'token-only') {
      await copyFile(join(ctx.root, 'src/promethity/roles.css'), join(directory, 'src/promethity/roles.css'))
      const css = join(directory, 'src/index.css')
      await writeFile(css, '@import "./promethity/roles.css";\n' + await readFile(css, 'utf8'))
    }
    fixtures[kind] = { directory, ref: webui.head, archiveSha256: sha256(await readFile(archive)), inputs: await treeFiles(directory), dependencyPolicy: 'historical React is test-only; isolated install only; never ship or change current manifests' }
  }
  assertTokenOnlyDelta(ctx, fixtures.incumbent.inputs, fixtures['token-only'].inputs, sha256(await readFile(join(ctx.root, 'src/promethity/roles.css'))), await readFile(join(fixtures.incumbent.directory, 'src/index.css'), 'utf8'), await readFile(join(fixtures['token-only'].directory, 'src/index.css'), 'utf8'))
  const sharedStyles = join(ctx.scratch, 'baseline-shared-styles')
  await mkdir(sharedStyles)
  for (const [file, hash] of Object.entries(kubo.sourceHashes).filter(([file]) => file.startsWith('mcp/ui/src/styles/'))) {
    const result = await ctx.processes.run('git', ['show', `${kubo.head}:${file}`], { cwd: ctx.kubo, env: ctx.env, label: 'immutable-shared-style' })
    ctx.assert(sha256(result.stdout) === hash, `Immutable shared style matches pre-production ${file}`)
    await writeFile(join(sharedStyles, file.split('/').at(-1)), result.stdout)
  }
  await ctx.record('baseline-source-authority', { capturedAt: baseline.capturedAt, authoritySha256: sha256(await readFile(path)), webuiRef: webui.head, sharedRef: kubo.head, fixtures, sharedStyles })
  return { fixtures, sharedStyles, authority: { path, sha256: sha256(await readFile(path)), capturedAt: baseline.capturedAt } }
}
