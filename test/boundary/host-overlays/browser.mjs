import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { assertLocalWebuiExport, sha256 } from '../../../scripts/local-artifact.mjs'

const expectFor = ctx => createRequire(join(ctx.root, 'package.json'))('@playwright/test').expect
const snapshot = page => page.evaluate(() => window.__hostPrimitives.snapshot())
let sequence = 0
async function fixture (ctx) {
  const manifest = await assertLocalWebuiExport({ root: ctx.root, kubo: ctx.kubo })
  const directory = join(ctx.scratch, `host-overlays-${ctx.scenario}-${ctx.slot}-${++sequence}`)
  const command = await ctx.processes.run(process.execPath, [join(ctx.root, 'test/boundary/host-overlays/build.mjs'), '--out', directory], { cwd: ctx.root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}-produced-host-fixture`, timeout: 180000 })
  const report = JSON.parse(await readFile(join(directory, 'fixture-provenance.json'), 'utf8'))
  ctx.assert(report.kind === 'produced-ui-v2-host-fixture' && report.htmlSha256 === sha256(await readFile(join(directory, 'host-primitives.html'))), 'Actual V2 host scenario adapter consumes the current produced UI with exact HTML provenance')
  for (const name of ['react', 'react-dom']) {
    const packages = report.runtime.packages.filter(value => value.name === name)
    ctx.assert(packages.length === 1 && packages[0].version === '19.3.1' && packages[0].modules.length > 0 && packages[0].packageJsonSha256 === manifest.reactRuntime.packages.find(value => value.name === name)?.packageJsonSha256, `Host fixture resolves the actual single production ${name} runtime`)
  }
  for (const value of report.runtime.packages) {
    ctx.assert(sha256(await readFile(resolve(ctx.kubo, 'mcp/ui', value.packageJson))) === value.packageJsonSha256, 'Compiled host runtime package bytes remain current')
    for (const module of value.modules) ctx.assert(sha256(await readFile(resolve(ctx.kubo, 'mcp/ui', module.path))) === module.sha256, 'Compiled host runtime module bytes remain current')
  }
  const session = await ctx.serveFixture({ directory, width: 1280, height: 1000 })
  let foreignRequests = 0
  const errors = []
  let rejectInitialization
  const initializationFailure = new Promise((resolve, reject) => { rejectInitialization = reject })
  // Attach immediately: an early page parse error must not become an unhandled rejection.
  initializationFailure.catch(() => {})
  session.page.on('pageerror', error => {
    const message = String(error.message).slice(0, 1024)
    if (errors.length < 16) errors.push({ kind: 'pageerror', message })
    rejectInitialization(new Error(`Produced host fixture page error: ${message}`))
  })
  session.context.on('request', request => { const url = new URL(request.url()); if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(session.baseURL).origin) foreignRequests++ })
  await ctx.record('host-fixture-producer', { kind: 'actual-produced-ui-host-fixture', report, command: { argv: command.argv, cwd: command.cwd, exitCode: command.exitCode }, currentWebuiArtifact: manifest.artifactSha256 })
  return { ...session, initializationFailure, async close () {
    try {
      for (const value of [report.gallery, report.adapted, report.input, ...report.sources]) ctx.assert(sha256(await readFile(value.path)) === value.sha256, 'Executed gallery/adapter/produced dependency source remains unchanged')
      ctx.assert(foreignRequests === 0, 'Actual overlay hosts attempted no remote assets, fonts or services')
      await ctx.record('host-fixture-initialization', { errors, state: await session.page.evaluate(() => ({ ready: document.documentElement.dataset.ready ?? null, error: document.documentElement.dataset.fixtureError ?? null, name: document.documentElement.dataset.fixtureErrorName ?? null, message: document.documentElement.dataset.fixtureErrorMessage ?? null, hostApi: Boolean(window.__hostPrimitives) })).catch(() => null) })
      await ctx.record('host-fixture-network', { foreignRequests, csp: report.csp, framePolicy: 'self-only fixture document', productionMcpAppCsp: 'unchanged' })
    } finally { await session.close() }
  } }
}
async function open (session, expect, host, theme, disabled = false) {
  await session.page.goto(`${session.baseURL}host-primitives.html?host=${host}&theme=${theme}&disabled=${disabled ? '1' : '0'}`)
  await Promise.race([session.initializationFailure, session.page.waitForFunction(() => (document.documentElement.dataset.ready === 'true' && Boolean(window.__hostPrimitives)) || Boolean(document.documentElement.dataset.fixtureError))])
  const failure = await session.page.evaluate(() => ({ error: document.documentElement.dataset.fixtureError, name: document.documentElement.dataset.fixtureErrorName, message: document.documentElement.dataset.fixtureErrorMessage }))
  if (failure.error) throw new Error(`Produced host fixture initialization failed: ${failure.name}: ${failure.message}`)
  await expect.poll(async () => (await snapshot(session.page)).host).toBe(host)
  const state = await snapshot(session.page)
  expect(state.ownerDocument).toBe(host === 'iframe' ? 'iframe' : 'top')
  if (host === 'shadow') expect(state.shadowIsClosed).toBe(true)
}
async function click (page, expect, key) {
  await expect.poll(() => page.evaluate(key => window.__hostPrimitives.rect(key), key)).not.toBeNull()
  const rect = await page.evaluate(key => window.__hostPrimitives.rect(key), key)
  await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2)
}
const focused = (page, expect, key) => expect.poll(async () => (await snapshot(page)).focus).toBe(key)
async function boundary (ctx, value, label) {
  await ctx.record(`host-boundary-${label}`, value)
  ctx.assert(value.portalsStayInHost && value.outerDocumentPortals === 0 && value.unownedPortals === 0, `Trusted ownerDocument/HTMLElement portal containment: ${label}`, { host: value.host, ownerDocument: value.ownerDocument, portalsStayInHost: value.portalsStayInHost, outerDocumentPortals: value.outerDocumentPortals, unownedPortals: value.unownedPortals })
  ctx.assert(value.brand.surface && value.brand.portalSurfaces.every(surface => surface === value.brand.surface), `Every portal retains its actual themed surface role: ${label}`, value.brand)
  ctx.assert(value.brand.fonts.length > 0 && value.brand.fonts.every(face => face.status === 'loaded'), 'Local bundled faces decode in the actual owner document')
}

/** Real native modality in ordinary, CLOSED shadow and iframe documents. No mocked focus APIs. */
export async function runHost (ctx, host, smokeOnly = false) {
  const session = await fixture(ctx), { page } = session, expect = expectFor(ctx), results = []
  try {
    for (const theme of ['light', 'dark']) {
      await open(session, expect, host, theme)
      await click(page, expect, 'dialog-trigger'); await focused(page, expect, 'dialog-safe')
      const opened = await snapshot(page)
      ctx.assert(opened.modals.length === 1 && opened.modals[0].nativeModal === true && opened.modals[0].ariaModal === 'true' && opened.modals[0].title === 'Review local action' && opened.modals[0].description === 'Fixture only. No operation reaches a node.', 'The actual native modal has its required accessible name/description and initial safe focus')
      await boundary(ctx, opened, `${host}/${theme}/dialog`)
      for (const key of [...Array(12).fill('Tab'), ...Array(12).fill('Shift+Tab')]) { await page.keyboard.press(key); ctx.assert((await snapshot(page)).focusInModal, 'Real keyboard focus cannot escape the native modal') }
      await page.keyboard.press('Escape'); await focused(page, expect, 'dialog-trigger')
      ctx.assert((await snapshot(page)).modals.length === 0, 'Escape unmounts closed dialog content and restores the actual descendant trigger')
      if (smokeOnly) { await ctx.screenshot(page, `${host}-${theme}-produced-source-smoke`); results.push({ theme, host, opened }); continue }

      // Native inertness/outside dismissal: the first click cannot activate the obscured background.
      await click(page, expect, 'dialog-trigger'); await focused(page, expect, 'dialog-safe'); await click(page, expect, 'before')
      await expect.poll(async () => (await snapshot(page)).modals.length).toBe(0)
      ctx.assert((await snapshot(page)).outsideActivations === 0, 'Modal outside dismissal does not activate the inert background')
      await click(page, expect, 'before'); ctx.assert((await snapshot(page)).outsideActivations === 1, 'Background action becomes usable only after the modal has closed')

      await click(page, expect, 'dialog-trigger'); await click(page, expect, 'nested-menu-trigger'); await focused(page, expect, 'nested-menu-keep')
      await boundary(ctx, await snapshot(page), `${host}/${theme}/nested-menu`)
      ctx.assert((await snapshot(page)).menuInsideModal, 'A modal-local menu stays within the native top layer')
      await page.keyboard.press('ArrowDown'); await focused(page, expect, 'nested-menu-finish')
      await page.keyboard.press('Home'); await focused(page, expect, 'nested-menu-keep'); await page.keyboard.press('Enter')
      ctx.assert((await snapshot(page)).menuCount === 1, 'Cancelable menu selection stays open and disabled item is skipped')
      await page.keyboard.press('Escape'); await focused(page, expect, 'nested-menu-trigger')
      ctx.assert((await snapshot(page)).modals.length === 1 && (await snapshot(page)).menuCount === 0, 'Escape closes only the nested menu')
      await click(page, expect, 'nested-dialog-trigger'); await focused(page, expect, 'nested-dialog-safe')
      ctx.assert((await snapshot(page)).modals.length === 2 && (await snapshot(page)).modals.every(value => value.nativeModal), 'Nested dialogs are both native modals in correct top-layer order')
      for (let index = 0; index < 8; index++) { await page.keyboard.press('Tab'); ctx.assert(['nested-dialog-safe', 'nested-dialog-close', 'Close nested review'].includes((await snapshot(page)).focus), 'Nested modal contains its own actual Tab focus') }
      await page.keyboard.press('Escape'); await focused(page, expect, 'nested-dialog-trigger'); await page.keyboard.press('Escape'); await focused(page, expect, 'dialog-trigger')

      await click(page, expect, 'sheet-trigger'); await focused(page, expect, 'sheet-safe')
      const sheet = await snapshot(page); await boundary(ctx, sheet, `${host}/${theme}/sheet`)
      ctx.assert(sheet.modals[0]?.slot === 'sheet-content' && sheet.modals[0]?.title === 'Context inspector' && sheet.modals[0]?.nativeModal, 'Sheet uses the named native modal lifecycle')
      await click(page, expect, 'sheet-close'); await focused(page, expect, 'sheet-trigger')
      await click(page, expect, 'menu-trigger'); await page.keyboard.press('End'); await focused(page, expect, 'menu-finish'); await page.keyboard.press('Enter'); await focused(page, expect, 'menu-trigger')
      await page.keyboard.press('ArrowUp'); await focused(page, expect, 'menu-finish'); await page.keyboard.press('Tab'); await expect.poll(async () => (await snapshot(page)).menuCount).toBe(0)
      for (let index = 0; index < 14; index++) { await page.keyboard.press('Tab'); const value = await snapshot(page); ctx.assert(!value.focusInModal && !value.focusInMenu, 'Closed popup descendants are not in the actual Tab sequence') }

      const dock = (await snapshot(page)).dock
      ctx.assert(dock.tag === 'ASIDE' && dock.role === null && dock.ariaModal === null && !dock.dialogAncestor, 'Docked conversation remains a nonmodal landmark')
      await click(page, expect, 'dock-draft'); await page.keyboard.press('Tab'); await focused(page, expect, 'dock-action'); await page.keyboard.press('Tab'); await focused(page, expect, 'after')
      await click(page, expect, 'tabs-entry'); await page.keyboard.press('Tab'); await focused(page, expect, 'tab-references'); await page.keyboard.press('ArrowRight'); await focused(page, expect, 'tab-tools')
      ctx.assert((await snapshot(page)).tabs.selected.join(',') === 'tab-references', 'Arrow navigation skips the disabled tab and preserves manual selection')
      await page.keyboard.press('End'); await focused(page, expect, 'tab-events'); await page.keyboard.press('Enter')
      ctx.assert((await snapshot(page)).tabs.mountedPanels.join(',') === 'events', 'Only the keyboard-activated tab panel is mounted')

      // A deliberately foreign portal is detected by the same containment observation, then removed.
      await page.evaluate(() => { const probe = document.createElement('div'); probe.id = 'foreign-portal-negative'; probe.dataset.slot = 'dialog-content'; document.body.append(probe) })
      const negative = await snapshot(page)
      ctx.assert(negative.outerDocumentPortals + negative.unownedPortals > 0, 'The containment oracle detects an intentionally escaped test portal')
      await page.evaluate(() => document.getElementById('foreign-portal-negative').remove())
      await boundary(ctx, await snapshot(page), `${host}/${theme}/negative-removed`)

      await page.emulateMedia({ reducedMotion: 'reduce' }); await click(page, expect, 'dialog-trigger'); await focused(page, expect, 'dialog-safe'); await page.keyboard.press('Tab')
      ctx.assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'The real browser reduced-motion preference is active')
      const motion = await snapshot(page)
      ctx.assert(motion.motion.length === 0 && motion.focusOutline?.visible && motion.focusOutline.style === 'solid' && motion.focusOutline.width === '2px', 'Actual reduced motion preserves visible keyboard focus without popup animation')
      await ctx.screenshot(page, `${host}-${theme}-native-modal-focus`)
      await click(page, expect, 'disable-inside'); await expect.poll(async () => (await snapshot(page)).modals.length).toBe(0)
      ctx.assert((await snapshot(page)).disabled['dialog-trigger'] && (await snapshot(page)).modalActivations === 0, 'Feature off synchronously tears down an open modal without dispatching an action')
      await click(page, expect, 'overlays-toggle'); await click(page, expect, 'dialog-trigger'); await focused(page, expect, 'dialog-safe'); await click(page, expect, 'unmount-inside')
      await expect.poll(async () => (await snapshot(page)).modals.length).toBe(0)
      ctx.assert((await snapshot(page)).menuCount === 0 && (await snapshot(page)).unownedPortals === 0, 'Unmounting the actual host closes/cleans native overlays and portal descendants')

      await open(session, expect, host, theme, true)
      const off = await snapshot(page)
      ctx.assert(Object.values(off.disabled).every(Boolean) && off.modals.length === 0 && off.menuCount === 0, 'Stored-off/disabled controls expose no modal or menu content')
      for (let index = 0; index < 10; index++) { await page.keyboard.press('Tab'); ctx.assert(!/^(dialog|sheet|menu|disabled)-/.test((await snapshot(page)).focus ?? ''), 'Off popup controls cannot enter the actual focus order') }
      await ctx.screenshot(page, `${host}-${theme}-off`)
      results.push({ host, theme, opened, sheet, motion, negativeDetected: true, off })
    }
    ctx.assert(results.length === 2 && results[0].opened.brand.surface !== results[1].opened.brand.surface, 'Both real themes resolve distinct surface roles while each portal matches its host')
    await ctx.record(`${host}-actual-overlay-hosts`, { kind: 'actual-native-owner-document-and-shadow-host', smokeOnly, results })
  } finally { await session.close() }
}
