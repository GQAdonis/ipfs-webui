import { createRequire } from 'node:module'
import { join } from 'node:path'
import { decisionBrowser, DECISION_BROWSER_INPUTS, injectAxe, selectDecision } from '../decisions/browser.mjs'
import { inspectFocus, inspectLayout, inspectMotion } from '../decisions/inspect.mjs'

const themes = ['light', 'dark'], widths = [375, 1440]
const fixtures = [...DECISION_BROWSER_INPUTS,
  { root: 'webui', path: 'test/boundary/accessibility/decisions/inspect.mjs' },
  { root: 'webui', path: 'test/boundary/accessibility/contributions.mjs' },
  { root: 'kubo', path: 'mcp/contract/confirmation/confirmation.schema.json' },
  { root: 'kubo', path: 'mcp/contract/confirmation/examples/DecisionObservation/node-success.json' }]
const expectFor = ctx => createRequire(join(ctx.root, 'package.json'))('@playwright/test').expect
async function layout (ctx, page, label) {
  const value = await page.evaluate(inspectLayout)
  ctx.assert(value.documentWidth <= value.width + 1 && !value.overflow.length, `No page or decision pane overflow: ${label}`, value)
  return value
}
async function matrix (ctx) {
  const session = await decisionBrowser(ctx), results = []
  const expect = expectFor(ctx)
  try {
    for (const theme of themes) for (const width of widths) {
      await session.page.setViewportSize({ width, height: 1000 }); await session.page.emulateMedia({ colorScheme: theme })
      for (const surface of session.surfaces) for (const phase of session.phases) {
        const panel = await selectDecision(session.page, phase, surface, theme)
        await expect(panel).toHaveAttribute('data-phase', phase)
        const status = panel.getByRole('status').first()
        await expect(status).toBeVisible()
        ctx.assert((await status.innerText()).trim().length > 0, `${surface}/${phase}/${theme}/${width} communicates its state in text, not color alone`)
        const viewport = await layout(ctx, session.page, `${surface}/${phase}/${theme}/${width}`)
        await ctx.screenshot(session.page, `${surface}-${phase}-${theme}-${width}`)
        results.push({ surface, phase, theme, width, viewport })
      }
    }
    // A wide probe must fail the exact same layout oracle; remove before final state capture.
    await session.page.evaluate(() => { const probe = document.createElement('div'); probe.id = 'boundary-overflow-negative'; probe.style.cssText = 'width:5000px;height:40px'; document.body.append(probe) })
    const negative = await session.page.evaluate(inspectLayout)
    ctx.assert(negative.documentWidth > negative.width + 1 && negative.overflow.some(item => item.id === 'boundary-overflow-negative'), 'The overflow negative control is actually detected')
    await session.page.locator('#boundary-overflow-negative').evaluate(element => element.remove())
    await layout(ctx, session.page, 'negative probe removed')
    await ctx.record('all-eleven-matrix', { presentationOnly: true, results, negative })
  } finally { await session.close() }
}
async function keyboard (ctx) {
  const session = await decisionBrowser(ctx), expect = expectFor(ctx), observed = []
  try {
    await session.page.bringToFront()
    for (const surface of ['chat', 'dialog']) {
      await selectDecision(session.page, 'pending', surface, 'dark')
      const deny = session.page.getByRole('button', { name: 'Deny', exact: true })
      await expect(deny).toBeFocused()
      await session.page.keyboard.press('Tab'); await deny.focus()
      const focus = await session.page.evaluate(inspectFocus)
      ctx.assert(focus.visible && focus.text === 'Deny', `${surface}: Deny receives initial focus and has a visible keyboard focus ring`, focus)
      await session.page.evaluate(() => window.__decisionBoundary.clearIntents())
      await session.page.keyboard.press('Enter')
      const denied = await session.page.evaluate(() => window.__decisionBoundary.intents())
      ctx.assert(denied.length === 1 && denied[0].kind === 'deny' && denied[0].trusted === true, `${surface}: Enter delivers one actual trusted Deny intent`)
      await expect(session.page.locator('[data-phase]')).toHaveAttribute('data-phase', 'uncertain')

      await selectDecision(session.page, 'pending', surface, 'dark')
      await session.page.evaluate(() => window.__decisionBoundary.clearIntents())
      const approve = session.page.getByRole('button', { name: /^Approve/ })
      await expect(approve).toBeDisabled()
      await approve.evaluate(element => element.click())
      ctx.assert((await session.page.evaluate(() => window.__decisionBoundary.intents())).length === 0, `${surface}: a pre-arm synthetic click dispatches no answer`)
      const started = await session.page.evaluate(() => performance.now())
      await expect(approve).toBeEnabled({ timeout: 5000 })
      await approve.focus(); await session.page.keyboard.press('Enter'); await session.page.keyboard.press('Enter')
      const approved = await session.page.evaluate(() => window.__decisionBoundary.intents())
      ctx.assert(approved.length === 1 && approved[0].kind === 'approve' && approved[0].trusted === true && approved[0].elapsedReviewMs >= 1000, `${surface}: real keyboard activation submits once after a full second without a repeated Enter answer`)
      observed.push({ surface, focus, denied, approved, observedArmWaitMs: await session.page.evaluate(() => performance.now()) - started })

      // Same mounted ID: a new digest must synchronously disarm, not inherit the earlier arm.
      const first = await session.page.evaluate(({ surface }) => window.__decisionBoundary.present(window.__decisionBoundary.model('pending'), surface, 'dark'), { surface })
      await session.page.waitForFunction(ticket => document.documentElement.dataset.fixtureTicket === String(ticket), first)
      await expect(approve).toBeEnabled({ timeout: 5000 })
      const changed = await session.page.evaluate(({ surface }) => {
        const model = window.__decisionBoundary.model('pending'); model.effectDigest = `sha256:${'a'.repeat(64)}`
        return window.__decisionBoundary.present(model, surface, 'dark')
      }, { surface })
      await session.page.waitForFunction(ticket => document.documentElement.dataset.fixtureTicket === String(ticket), changed)
      await expect(approve).toBeDisabled(); await expect(deny).toBeFocused()
      const other = await session.context.newPage()
      try {
        await other.bringToFront(); await expect(approve).toBeDisabled()
        await session.page.bringToFront(); await expect(approve).toBeDisabled(); await expect(approve).toBeEnabled({ timeout: 5000 })
      } finally { await other.close() }
      await ctx.screenshot(session.page, `${surface}-keyboard-rearm`)
    }
    for (const theme of themes) for (const width of widths) {
      await session.page.setViewportSize({ width, height: 1000 }); await session.page.emulateMedia({ colorScheme: theme })
      for (const surface of session.surfaces) for (const phase of session.phases) {
        const panel = await selectDecision(session.page, phase, surface, theme)
        const expected = await panel.locator('button:not([disabled]), summary, a[href], input:not([disabled]), select:not([disabled])').evaluateAll(elements => elements.flatMap((element, index) => {
          const box = element.getBoundingClientRect()
          if (!box.width || !box.height) return []
          const id = `control-${index}`; element.setAttribute('data-boundary-focus-id', id); return [id]
        }))
        const seen = new Set(), focus = []
        for (let index = 0; index < expected.length + 3; index++) {
          await session.page.keyboard.press('Tab')
          const item = await session.page.evaluate(inspectFocus)
          if (item.focusId) { seen.add(item.focusId); focus.push(item); ctx.assert(item.visible, `Visible actual keyboard focus: ${surface}/${phase}/${theme}/${width}`, item) }
        }
        ctx.assert(expected.length > 0 && expected.every(id => seen.has(id)), `Every enabled decision control is reachable by Tab: ${surface}/${phase}/${theme}/${width}`, { expected, seen: [...seen] })
        observed.push({ surface, phase, theme, width, expected, focus })
      }
      await ctx.screenshot(session.page, `keyboard-${theme}-${width}`)
    }
    await session.page.evaluate(() => { const probe = document.createElement('button'); probe.id = 'boundary-focus-negative'; probe.textContent = 'Invisible focus probe'; probe.style.cssText = 'outline:none;box-shadow:none;border:0;width:100px;height:40px'; document.body.append(probe); probe.focus() })
    ctx.assert(!(await session.page.evaluate(inspectFocus)).visible, 'The invisible-focus negative control is refused by the same focus oracle')
    await session.page.locator('#boundary-focus-negative').evaluate(element => element.remove())
    await selectDecision(session.page, 'committed', 'app', 'light')
    const receipt = session.page.locator('summary', { hasText: 'View receipt' })
    await receipt.focus(); await session.page.keyboard.press('Enter')
    ctx.assert(await receipt.locator('..').getAttribute('open') !== null, 'MCP App receipt is reachable and expands by real keyboard input')
    await ctx.screenshot(session.page, 'app-keyboard-receipt')
    await ctx.record('keyboard-focus-and-one-answer', { presentationOnly: true, observed })
  } finally { await session.close() }
}
async function axe (ctx) {
  const session = await decisionBrowser(ctx), results = []
  try {
    await injectAxe(ctx, session.page)
    for (const theme of themes) for (const width of widths) {
      await session.page.setViewportSize({ width, height: 1000 }); await session.page.emulateMedia({ colorScheme: theme })
      for (const surface of session.surfaces) for (const phase of session.phases) {
        await selectDecision(session.page, phase, surface, theme)
        const report = await session.page.evaluate(async () => {
          const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })
          return { passes: result.passes.map(item => item.id), violations: result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target) })) }
        })
        ctx.assert(report.passes.length > 0 && report.violations.length === 0, `Real-browser axe: ${surface}/${phase}/${theme}/${width}`, report)
        results.push({ surface, phase, theme, width, ...report })
      }
      await ctx.screenshot(session.page, `axe-${theme}-${width}`)
    }
    await session.page.evaluate(() => { const probe = document.createElement('button'); probe.id = 'boundary-label-negative'; probe.style.cssText = 'width:44px;height:44px'; document.body.append(probe) })
    const detected = await session.page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'rule', values: ['button-name'] } })).violations.map(item => item.id))
    ctx.assert(detected.includes('button-name'), 'The missing-label negative control is detected by actual axe')
    await session.page.locator('#boundary-label-negative').evaluate(element => element.remove())
    await ctx.record('axe-eleven-presentations', { presentationOnly: true, results, negative: detected })
  } finally { await session.close() }
}
async function reducedMotion (ctx) {
  const session = await decisionBrowser(ctx), results = []
  try {
    await session.page.emulateMedia({ reducedMotion: 'reduce' })
    ctx.assert(await session.page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'Actual browser reduced-motion preference is active')
    for (const theme of themes) for (const width of widths) {
      await session.page.setViewportSize({ width, height: 1000 }); await session.page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      for (const surface of session.surfaces) for (const phase of session.phases) {
        await selectDecision(session.page, phase, surface, theme)
        const motion = await session.page.evaluate(inspectMotion)
        ctx.assert(motion.length === 0, `No inappropriate reduced-motion animation: ${surface}/${phase}/${theme}/${width}`, motion)
        results.push({ surface, phase, theme, width, motion })
      }
      await ctx.screenshot(session.page, `reduced-motion-${theme}-${width}`)
    }
    await session.page.evaluate(() => {
      const style = document.createElement('style'); style.id = 'boundary-motion-style'; style.textContent = '@keyframes boundary-motion{from{transform:translateX(0)}to{transform:translateX(20px)}}'
      const probe = document.createElement('div'); probe.id = 'boundary-motion-negative'; probe.textContent = 'Motion negative probe'; probe.style.cssText = 'animation:boundary-motion 5s infinite;width:100px;height:40px'
      document.head.append(style); document.body.append(probe)
    })
    const negative = await session.page.evaluate(inspectMotion)
    ctx.assert(negative.some(item => item.id === 'boundary-motion-negative'), 'The inappropriate-animation negative control is detected')
    await session.page.evaluate(() => { document.getElementById('boundary-motion-negative').remove(); document.getElementById('boundary-motion-style').remove() })
    const font = await session.page.evaluate(async () => {
      const violated = []; const listener = event => violated.push(event.violatedDirective)
      document.addEventListener('securitypolicyviolation', listener)
      let rejected = false
      try { await new FontFace('BoundaryForbiddenRemote', 'url(https://boundary.invalid/font.woff2)').load() } catch { rejected = true }
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      document.removeEventListener('securitypolicyviolation', listener)
      return { rejected, violated }
    })
    ctx.assert(font.rejected && font.violated.some(value => value.startsWith('font-src')), 'A deliberately requested remote font is refused by the fixture CSP; bundled faces require no network')
    await ctx.record('reduced-motion-and-local-assets', { presentationOnly: true, results, negative, remoteFontNegative: font })
  } finally { await session.close() }
}

export default { schemaVersion: 1, family: 'decisions', fixtures, slots: {
  'viewport-theme-matrix': matrix, 'keyboard-and-focus': keyboard, axe, 'reduced-motion': reducedMotion
} }
