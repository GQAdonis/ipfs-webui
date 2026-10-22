import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { sha256 } from '../../../../scripts/local-artifact.mjs'
import { Blocked } from '../../processes.mjs'

export const DECISION_BROWSER_INPUTS = [
  'test/boundary/accessibility/decisions/fixture.tsx', 'test/boundary/accessibility/decisions/build.mjs',
  'test/boundary/accessibility/decisions/browser.mjs', 'scripts/export-react-runtime.mjs'
].map(path => ({ root: 'webui', path }))

/** Final packet only: compiler command, exact current production imports, explicit fixture CID. */
export async function decisionBrowser (ctx) {
  const { manifest } = await ctx.getArtifact()
  const directory = join(ctx.scratch, `decision-fixture-${ctx.scenario}-${ctx.slot}`)
  const command = await ctx.processes.run(process.execPath, [join(ctx.root, 'test/boundary/accessibility/decisions/build.mjs'), '--out', directory], {
    cwd: ctx.root, env: { ...ctx.env, COREPACK_ENABLE_AUTO_PIN: '0' }, label: `${ctx.scenario}-${ctx.slot}-decision-browser-producer`, timeout: 180000
  })
  const html = await readFile(join(directory, 'index.html'))
  const report = JSON.parse(await readFile(join(directory, 'fixture-provenance.json'), 'utf8'))
  ctx.assert(report.kind === 'decision-boundary-fixture' && report.htmlSha256 === sha256(html) && report.sources.length > 0, 'The isolated browser fixture has exact current compiler/module/HTML provenance')
  for (const name of ['react', 'react-dom']) {
    const packages = report.runtime.packages.filter(pkg => pkg.name === name)
    ctx.assert(packages.length === 1 && packages[0].version === '19.3.1' && packages[0].modules.length > 0, `The composed decision fixture imports exactly one ${name}@19.3.1`)
    const prod = manifest.reactRuntime.packages.find(pkg => pkg.name === name)
    ctx.assert(prod?.packageJsonSha256 === packages[0].packageJsonSha256, `The fixture's ${name} package bytes match the current production WebUI runtime`)
  }
  const ui = join(ctx.kubo, 'mcp/ui')
  for (const pkg of report.runtime.packages) {
    ctx.assert(sha256(await readFile(resolve(ui, pkg.packageJson))) === pkg.packageJsonSha256, `The actually compiled ${pkg.name} manifest is current`)
    for (const module of pkg.modules) ctx.assert(sha256(await readFile(resolve(ui, module.path))) === module.sha256, `The actually compiled ${pkg.name} module is current: ${module.path}`)
  }
  const node = await ctx.getNode()
  const recipe = { cidVersion: 1, rawLeaves: true, hashAlg: 'sha2-256', pin: true }
  const imported = await node.api.add(html, recipe)
  const session = await ctx.browserSession({ theme: 'dark', width: 1440, height: 1000 })
  const url = new URL(`/ipfs/${imported.cid}`, session.baseURL).href
  const origin = new URL(url).origin
  let remoteAssets = 0, blockedFontProbe = 0
  session.page.on('request', request => {
    const target = new URL(request.url())
    if (target.href === 'https://boundary.invalid/font.woff2') { blockedFontProbe++; return }
    if (['http:', 'https:'].includes(target.protocol) && target.origin !== origin) remoteAssets++
  })
  await session.page.goto(url)
  await session.page.waitForFunction(() => document.documentElement.dataset.fixtureReady === 'true' && Boolean(window.__decisionBoundary))
  const phases = await session.page.evaluate(() => window.__decisionBoundary.phases)
  const schema = JSON.parse(await readFile(join(ctx.kubo, 'mcp/contract/confirmation/confirmation.schema.json'), 'utf8'))
  ctx.assert(JSON.stringify(phases) === JSON.stringify(schema.$defs.DecisionPresentation.enum) && phases.length === 11, 'Browser presentations derive the exact eleven canonical contract states')
  const facts = await session.page.evaluate(() => window.__decisionBoundary.facts())
  ctx.assert(facts.loadedFonts > 0 && facts.fonts.length > 0 && facts.fonts.every(face => face.status === 'loaded'), 'The actual shared fixture decodes bundled local fonts without remote font loading')
  await ctx.record('decision-browser-production-binding', { fixture: report, command: { argv: command.argv, cwd: command.cwd, pid: command.pid, exitCode: command.exitCode },
    fixtureCid: imported.cid.toString(), recipe, artifactSha256: manifest.artifactSha256, sharedArtifacts: manifest.sharedArtifacts, facts, phases, remoteAssets })
  return { ...session, url, phases, surfaces: ['chat', 'dialog', 'app'], report,
    async close () {
      try {
        for (const source of report.sources) ctx.assert(sha256(await readFile(source.path)) === source.sha256, `Executed decision fixture input remains current: ${source.path}`)
        ctx.assert(remoteAssets === 0, 'Production decision components attempted no remote assets, fonts or network reads')
        await ctx.record('decision-browser-network-policy', { remoteAssets, intentionalRejectedFontProbes: blockedFontProbe, csp: report.csp })
      } finally { await session.close() }
    }
  }
}

export async function selectDecision (page, phase, surface, theme) {
  const ticket = await page.evaluate(({ phase, surface, theme }) => window.__decisionBoundary.select(phase, surface, theme), { phase, surface, theme })
  await page.waitForFunction(ticket => document.documentElement.dataset.fixtureTicket === String(ticket), ticket)
  await page.locator('[data-phase]').waitFor()
  return page.locator('[data-phase]')
}

export async function injectAxe (ctx, page) {
  const require = createRequire(join(ctx.kubo, 'mcp/ui/package.json'))
  const file = require.resolve('axe-core/axe.min.js')
  const metadata = JSON.parse(await readFile(require.resolve('axe-core/package.json'), 'utf8'))
  const expected = JSON.parse(await readFile(join(ctx.kubo, 'mcp/ui/package.json'), 'utf8')).devDependencies['axe-core']
  if (metadata.version !== expected) throw new Blocked('Use the existing exact pinned axe runtime; no download or substitute')
  await page.addScriptTag({ path: file })
  await ctx.record('axe-runtime-binding', { path: file, sha256: sha256(await readFile(file)), version: metadata.version })
}
