import { createReadStream } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expect } from '@playwright/test'
import { assembleBaselineSources } from '../baseline-sources.mjs'
import { decodeScreenshot, rasterDifference } from '../baseline-pixels.mjs'
import { assertLocalFontRequests, fontSources, watchFontNetwork } from '../local-fonts.mjs'
import { roleFixtureHashes } from '../role-fixture-binding.mjs'
import { sha256, treeFiles } from '../../../scripts/local-artifact.mjs'

const FIXED_TIME = '2026-10-20T12:00:00.000Z'
const SCREENS = [
  { id: 'files', hash: '/files', ready: '[data-id="FilesPage"]' },
  { id: 'pins', hash: '/pins', ready: '[data-id="PinsPage"]' },
  { id: 'explore', hash: '/explore', ready: 'main h1' },
  { id: 'settings', hash: '/settings', ready: '[data-id="SettingsPage"]' }
]

async function bind (ctx, authority, details) {
  await ctx.record('role-source-and-runtime-binding', { authority: { ...authority, path: 'test/boundary/incumbent-source-authority.json' }, fixtureHashes: await roleFixtureHashes({ webuiRoot: ctx.root, kuboRoot: ctx.kubo }), ...details })
}
async function importFixture (ctx, directory, label) {
  const node = await ctx.getNode(); const inventory = await treeFiles(directory)
  ctx.assert(Boolean(inventory['index.html'] || inventory['register.js']), `${label}: real compiled fixture entry exists`)
  async function * source () { for (const file of Object.keys(inventory)) yield { path: `${label}/${file}`, content: createReadStream(join(directory, file)) } }
  const recipe = { cidVersion: 1, rawLeaves: true, hashAlg: 'sha2-256', wrapWithDirectory: true, pin: true }
  let cid
  for await (const result of node.api.addAll(source(), recipe)) if (result.path === '') cid = result.cid.toString()
  ctx.assert(Boolean(cid), `${label}: actual isolated make-built node imported the explicit fixture bytes`)
  await ctx.record(`import-${label}`, { cid, recipe, inventory, baseURL: `${node.gatewayUrl}/ipfs/${cid}/${label}/` })
  return { baseURL: `${node.gatewayUrl}/ipfs/${cid}/${label}/`, inventory }
}
async function compileHistorical (ctx, fixtures) {
  const userconfig = join(ctx.scratch, 'baseline-user.npmrc'); const globalconfig = join(ctx.scratch, 'baseline-global.npmrc')
  await writeFile(userconfig, ''); await writeFile(globalconfig, '')
  const npm = await ctx.processes.run('npm', ['--version'], { cwd: ctx.root, env: { ...ctx.env, NPM_CONFIG_USERCONFIG: userconfig, NPM_CONFIG_GLOBALCONFIG: globalconfig }, label: 'historical-npm-version' })
  for (const [kind, fixture] of Object.entries(fixtures)) {
    const npmrc = await readFile(join(fixture.directory, '.npmrc'), 'utf8')
    const nodeOptions = /^node-options="([^"]+)"$/m.exec(npmrc)?.[1]
    const env = { ...ctx.env, COREPACK_ENABLE_AUTO_PIN: '0', NPM_CONFIG_USERCONFIG: userconfig, NPM_CONFIG_GLOBALCONFIG: globalconfig, NPM_CONFIG_CACHE: join(ctx.scratch, `npm-cache-${kind}`), ...(nodeOptions ? { NODE_OPTIONS: nodeOptions } : {}), NODE_ENV: 'production', REACT_APP_ENV: 'production', REACT_APP_GIT_REV: fixture.ref.slice(0, 7), CI: 'true' }
    // Dependencies remain frozen to the immutable original graph. Do not repair
    // historical peer/engine/compiler failures or enable all install scripts.
    const installEnv = { ...env, NODE_ENV: 'development' }
    await ctx.processes.run('npm', ['ci', '--include=dev', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund'], { cwd: fixture.directory, env: installEnv, label: `historical-${kind}-frozen-install`, timeout: 10 * 60 * 1000 })
    await ctx.processes.run(process.execPath, [join(fixture.directory, 'node_modules/.bin/patch-package')], { cwd: fixture.directory, env: installEnv, label: `historical-${kind}-original-patches`, timeout: 120000 })
    await ctx.processes.run(process.execPath, [join(fixture.directory, 'node_modules/.bin/react-app-rewired-esm'), 'build'], { cwd: fixture.directory, env, label: `historical-${kind}-original-compiler`, timeout: 10 * 60 * 1000 })
    for (const [file, hash] of Object.entries(fixture.inputs)) ctx.assert(sha256(await readFile(join(fixture.directory, file))) === hash, `${kind}: original source/lock/config stayed unchanged during dependency derivation: ${file}`)
    fixture.output = await importFixture(ctx, join(fixture.directory, 'build'), `baseline-${kind}`)
    await ctx.record(`historical-${kind}-compiler`, { npm: npm.stdout.trim(), node: process.version, executable: process.execPath, originalNodeOptions: nodeOptions ?? null, ref: fixture.ref, archiveSha256: fixture.archiveSha256, source: fixture.inputs, output: fixture.output.inventory, historicalReactIsTestOnly: true })
  }
}
const viewportShot = (ctx, page, name) => ctx.screenshot({ screenshot: options => page.screenshot({ ...options, fullPage: false, scale: 'css', animations: 'disabled', caret: 'hide' }) }, name)
async function stableShot (ctx, page, name) {
  const first = await viewportShot(ctx, page, `${name}-settling`)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const second = await viewportShot(ctx, page, name)
  const raster = await decodeScreenshot(page, await readFile(second))
  const stability = rasterDifference(await decodeScreenshot(page, await readFile(first)), raster)
  ctx.assert(stability.equal, `${name}: real screen is stable without masks before comparing variants`, stability)
  return { path: second, raster, sha256: sha256(await readFile(second)) }
}
async function ready (ctx, page, screen, node) {
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator(screen.ready).first()).toBeVisible()
  if (screen.id === 'files') await expect(page.getByText('visual-baseline.txt', { exact: true })).toBeVisible()
  if (screen.id === 'settings') await expect(page.locator('.ace_editor')).toContainText(node.id.id)
  await page.evaluate(() => document.fonts.ready)
  ctx.assert(new URL(page.url()).hash === `#${screen.hash}`, `${screen.id}: correct immutable incumbent route is ready`)
}
async function fixtureTests (ctx) {
  const report = join(ctx.directory, 'baseline-font-fixtures-vitest.json')
  const result = await ctx.processes.run('pnpm', ['exec', 'vitest', 'run', 'test/boundary/baseline-pixels.test.js', 'test/boundary/local-fonts.test.js', '--reporter=json', `--outputFile=${report}`], { cwd: ctx.root, env: ctx.env, label: 'UI-102-baseline-font-negative-fixtures', timeout: 180000 })
  const bytes = await readFile(report); const data = JSON.parse(bytes)
  ctx.assert(result.exitCode === 0 && data.success && data.numPassedTests > 0 && data.numFailedTests === 0 && data.numPendingTests === 0 && data.numTodoTests === 0, 'Baseline/font guard positives and negative controls actually ran without skip/todo')
  await ctx.record('baseline-font-fixture-command', { argv: result.argv, cwd: result.cwd, exitCode: result.exitCode, reportSha256: sha256(bytes) })
}

export default [
  { scenario: 'UI-102', id: 'immutable-token-baseline', requires: ['browser', 'daemon'], async run (ctx) {
    const assembled = await assembleBaselineSources(ctx)
    await compileHistorical(ctx, assembled.fixtures)
    await fixtureTests(ctx)
    const node = await ctx.getNode()
    const seed = Buffer.from('Explicit immutable-screen comparison fixture\n')
    await node.api.files.write('/visual-baseline.txt', seed, { create: true, truncate: true, mtime: new Date('2020-01-01T00:00:00.000Z') })
    await ctx.record('baseline-screen-inputs', { path: '/visual-baseline.txt', sha256: sha256(seed), fixedTime: FIXED_TIME, locale: 'en-US', themes: ['dark', 'light'], widths: [375, 1440], screens: SCREENS, node: node.identity, policies: ['same node/data for both variants', 'real RPC; no response mocks', 'reduced motion; fixed Date with live timers', 'zero masks; zero differing pixels', 'redesigned shell excluded'] })
    await ctx.rpcSnapshot('before-immutable-screen-capture')
    for (const theme of ['dark', 'light']) for (const width of [375, 1440]) {
      const captures = {}
      for (const [kind, fixture] of Object.entries(assembled.fixtures)) {
        const session = await ctx.browserSession({ theme, width, height: 1000 })
        try {
          await session.context.addInitScript(() => {
            localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify({ enabled: false, endpoint: '' }))
            localStorage.setItem('ipfs-webui:webmcp', JSON.stringify({ enabled: false, dnslink: false }))
          })
          await session.page.clock.setFixedTime(new Date(FIXED_TIME))
          await session.page.emulateMedia({ reducedMotion: 'reduce' })
          captures[kind] = {}
          for (const screen of SCREENS) {
            const response = await session.page.goto(`${fixture.output.baseURL}#${screen.hash}`)
            ctx.assert(response?.ok(), `${kind}/${screen.id}: actual immutable fixture is served from the owned gateway CID path`)
            await ready(ctx, session.page, screen, node)
            captures[kind][screen.id] = await stableShot(ctx, session.page, `${kind}-${theme}-${width}-${screen.id}`)
            if (kind === 'token-only') {
              const original = captures.incumbent[screen.id]
              const compared = rasterDifference(original.raster, captures[kind][screen.id].raster)
              ctx.assert(compared.equal, `${screen.id}/${theme}/${width}: token-only aliases preserve the same incumbent shell pixels`, compared)
              await ctx.record(`baseline-comparison-${theme}-${width}-${screen.id}`, { ...compared, incumbentPNG: { path: original.path, sha256: original.sha256 }, tokenOnlyPNG: { path: captures[kind][screen.id].path, sha256: captures[kind][screen.id].sha256 } })
            }
          }
          if (kind === 'token-only') {
            const perturbation = ':root { --ground: #ff00ff !important; --surface: #ff00ff !important; }'
            await session.page.addStyleTag({ content: perturbation })
            const negative = await stableShot(ctx, session.page, `perturbed-${theme}-${width}`)
            const mismatch = rasterDifference(captures[kind].settings.raster, negative.raster)
            ctx.assert(!mismatch.equal && mismatch.changedPixels > 0, `${theme}/${width}: deliberately changed palette is detected by the actual screenshot comparator`, mismatch)
            await ctx.record(`palette-perturbation-${theme}-${width}`, { css: perturbation, sha256: sha256(perturbation), mismatch })
          }
        } finally { await session.close() }
      }
    }
    await ctx.rpcSnapshot('after-immutable-screen-capture')
    await bind(ctx, assembled.authority, { variants: Object.fromEntries(Object.entries(assembled.fixtures).map(([kind, fixture]) => [kind, { ref: fixture.ref, source: fixture.inputs, archiveSha256: fixture.archiveSha256, output: fixture.output.inventory }])), redesignedShellCompared: false })
  } },
  { scenario: 'UI-102', id: 'local-fonts', requires: ['browser', 'daemon'], async run (ctx) {
    const sources = await fontSources(ctx)
    const { manifest } = await ctx.getArtifact()
    for (const face of sources.webui) ctx.assert(manifest.inputs.webui.files[face.path] === face.sha256 && Object.values(manifest.artifacts).includes(face.sha256), `WebUI ${face.family}/${face.weight}/${face.style}: immutable font bytes are bundled in the actual production export`)
    for (const face of sources.shared) ctx.assert(manifest.inputs.ui.files[face.path.replace(/^mcp\/ui\//, '')] === face.sha256, `Shared ${face.family}/${face.weight}: immutable font source is bound to actual artifact inputs`)
    const output = join(ctx.scratch, 'compiled-shared-font-fixture'); await mkdir(output)
    await ctx.processes.run(process.execPath, [join(ctx.root, 'test/boundary/derive-font-fixture.mjs'), ctx.kubo, output], { cwd: ctx.root, env: ctx.env, label: 'derive-actual-shared-font-loader-fixture', timeout: 180000 })
    const derived = JSON.parse(await readFile(join(output, 'FONT_FIXTURE.json'), 'utf8'))
    for (const [file, hash] of Object.entries(derived.inputs.files)) ctx.assert(manifest.inputs.ui.files[file] === hash, `Compiled font fixture used the exact current shared input: ${file}`)
    const fixture = await importFixture(ctx, output, 'font-fixture')
    for (const [file, hash] of Object.entries(derived.files)) ctx.assert(fixture.inventory[file] === hash, `Imported compiled font fixture retains the producer's actual bytes: ${file}`)
    for (const theme of ['dark', 'light']) for (const width of [375, 1440]) {
      const session = await ctx.browserSession({ theme, width })
      const network = watchFontNetwork(session.page)
      try {
        await session.page.goto(`${session.baseURL}#/settings`)
        await expect(session.page.locator('main')).toBeVisible()
        const loaded = await session.page.evaluate(async ({ faces, moduleURL }) => {
          const proof = document.createElement('section'); proof.dataset.localFontProof = ''
          const webui = []
          for (const face of faces.webui) {
            const selected = await document.fonts.load(`${face.style} ${face.weight} 18px "${face.family}"`, 'Bundled font Aa 0123')
            webui.push({ ...face, actual: selected.map(font => ({ family: font.family.replace(/^['"]|['"]$/g, ''), weight: font.weight, style: font.style, status: font.status })) })
            const sample = document.createElement('p'); sample.style.fontFamily = `"${face.family}"`; sample.style.fontWeight = face.weight; sample.style.fontStyle = face.style; sample.textContent = `${face.family} ${face.weight} ${face.style}: Bundled font Aa 0123`; proof.append(sample)
          }
          const module = await import(moduleURL)
          const added = await module.registerBundledFonts(document)
          const shared = []
          for (const face of faces.shared) {
            const selected = await document.fonts.load(`${face.weight} 18px "${face.family}"`, 'Bundled font Aa 0123')
            shared.push({ ...face, actual: selected.map(font => ({ family: font.family.replace(/^['"]|['"]$/g, ''), weight: font.weight, style: font.style, status: font.status })) })
            const sample = document.createElement('p'); sample.style.fontFamily = `"${face.family}"`; sample.style.fontWeight = face.weight; sample.textContent = `${face.family} ${face.weight}: Bundled font Aa 0123`; proof.append(sample)
          }
          document.body.prepend(proof); await document.fonts.ready
          return { added, webui, shared }
        }, { faces: sources, moduleURL: `${fixture.baseURL}register.js` })
        ctx.assert(loaded.added === sources.shared.length, 'Actual compiled shared font registration loads every declared bundled face without fallback substitution')
        for (const [host, faces] of Object.entries({ webui: loaded.webui, shared: loaded.shared })) for (const face of faces) ctx.assert(face.actual.some(actual => actual.family === face.family && actual.weight === face.weight && actual.style === face.style && actual.status === 'loaded'), `${host}/${theme}: actual browser loaded ${face.family}/${face.weight}/${face.style}`, face)
        await network.settle()
        assertLocalFontRequests(network.requests, session.baseURL)
        for (const face of sources.webui) ctx.assert(network.responses.some(response => response.status === 200 && response.woff2 && response.sha256 === face.sha256), `${theme}: actual local font response bytes match immutable ${face.family}/${face.weight}/${face.style}`)
        await ctx.record(`local-font-network-${theme}-${width}`, { requests: network.requests.slice(), responses: network.responses.slice(), loaded, compiledFixture: derived })
        await viewportShot(ctx, session.page, `local-fonts-${theme}-${width}`)
        const before = network.requests.length
        await session.page.evaluate(async () => { try { await new FontFace('External negative fixture', 'url("https://font-negative.invalid/not-a-font.woff2")').load() } catch {} })
        await network.settle()
        const attempts = network.requests.slice(before)
        ctx.assert(attempts.length > 0, 'Browser actually attempted the deliberately external font negative control; harness blocked egress')
        let rejected = false
        try { assertLocalFontRequests(attempts, session.baseURL) } catch { rejected = true }
        ctx.assert(rejected, 'External font attempt is detected even though the existing egress guard aborted it')
        const noRemoteFontResponse = !network.responses.some(response => response.url.startsWith('https://font-negative.invalid/'))
        ctx.assert(noRemoteFontResponse, 'The deliberate external font probe received no remote response through the owned egress guard')
        await ctx.record(`external-font-negative-${theme}-${width}`, { attempts, rejected, noRemoteFontResponse })
      } finally { network.close(); await session.close() }
    }
    await fixtureTests(ctx)
    await bind(ctx, sources.authority, { fonts: sources, compiledFontFixture: derived, artifactSha256: manifest.artifactSha256, reactRuntime: manifest.reactRuntime })
  } }
]
