import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../../scripts/local-artifact.mjs'
export const HOST_FIXTURE_INPUTS = ['test/boundary/host-fixtures/entry.jsx', 'test/boundary/host-fixtures/build.mjs', 'test/boundary/host-fixtures/browser.mjs', 'test/boundary/host-fixtures/live.mjs'].map(path => ({ root: 'webui', path }))
export async function hostFixture (ctx, { allowedOrigins = [], theme = 'dark', width = 1440 } = {}) {
  const directory = join(ctx.scratch, `host-fixture-${ctx.scenario}-${ctx.slot}-${Date.now()}`)
  const command = await ctx.processes.run(process.execPath, [join(ctx.root, 'test/boundary/host-fixtures/build.mjs'), '--out', directory], { cwd: ctx.root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}-current-host-producer`, timeout: 180000 })
  const report = JSON.parse(await readFile(join(directory, 'fixture-provenance.json'), 'utf8'))
  ctx.assert(report.kind === 'current-production-host-fixture' && report.htmlSha256 === sha256(await readFile(join(directory, 'index.html'))) && Object.keys(report.sources).length > 0, 'Visible host fixture binds actual produced HTML and compiler-observed current production sources')
  for (const name of ['react', 'react-dom']) ctx.assert(report.runtime.packages.filter(pkg => pkg.name === name && pkg.version === '19.3.1').length === 1, `Visible current host has one ${name}@19.3.1`)
  const session = await ctx.serveFixture({ directory, allowedOrigins, theme, width })
  let remoteAssets = 0
  session.page.on('request', request => { const url = new URL(request.url()); if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(session.baseURL).origin && !allowedOrigins.includes(url.origin)) remoteAssets++ })
  await session.page.goto(session.baseURL)
  await session.page.waitForFunction(() => document.documentElement.dataset.fixtureReady === 'true')
  await session.page.evaluate(value => window.__frontendHost.theme(value), theme)
  await ctx.record('current-host-producer-binding', { report, command: { argv: command.argv, cwd: command.cwd, pid: command.pid, exitCode: command.exitCode }, supplemental: true })
  return { ...session, report, allowOrigin (value) { session.allowOrigin(value); allowedOrigins.push(new URL(value).origin) }, async close () {
    try {
      for (const [path, expected] of Object.entries(report.sources)) ctx.assert(sha256(await readFile(path)) === expected, `Current executed host source remains unchanged: ${path}`)
      ctx.assert(remoteAssets === 0, 'Host uses only local assets and explicitly leased loopback origins')
    } finally { await session.close() }
  } }
}
