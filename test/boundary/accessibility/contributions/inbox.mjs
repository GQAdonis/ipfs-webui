import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expect } from '@playwright/test'
import { hostFixture, HOST_FIXTURE_INPUTS } from '../../host-fixtures/browser.mjs'
import { injectAxe } from '../decisions/browser.mjs'
import { inspectMotion } from '../decisions/inspect.mjs'
import { sha256 } from '../../../../scripts/local-artifact.mjs'
const themes = ['light', 'dark']; const widths = [375, 1440]
const fixtureNames = ['activity-pending.json', 'node-success.json', 'native-deny-only.json']
const fixtures = [...HOST_FIXTURE_INPUTS, ...fixtureNames.map(name => ({ root: 'kubo', path: `mcp/contract/confirmation/examples/DecisionObservation/${name}` }))]
async function rows (ctx) {
  const input = []
  for (const name of fixtureNames) {
    const path = join(ctx.kubo, 'mcp/contract/confirmation/examples/DecisionObservation', name); const bytes = await readFile(path)
    const record = JSON.parse(bytes)
    // Display-only synthetic current time keeps pending/native typography exercised; no authority.
    if (record.approval_state === 'pending') record.expires_at = new Date(Date.now() + 3600000).toISOString()
    input.push(record)
    await ctx.record(`canonical-inbox-input-${name}`, { path, sha256: sha256(bytes), presentationOnly: true, currentTimeExpiry: record.approval_state === 'pending' })
  }
  return input
}
async function forViews (ctx, run) {
  const session = await hostFixture(ctx); const observations = await rows(ctx)
  try {
    await session.page.evaluate(input => window.__frontendHost.presentRows(input), observations)
    for (const theme of themes) {
      for (const width of widths) {
        await session.page.setViewportSize({ width, height: 1000 })
        await session.page.emulateMedia({ colorScheme: theme })
        await session.page.evaluate(theme => window.__frontendHost.theme(theme), theme)
        for (const view of ['inbox', 'activity']) {
          await session.page.evaluate(view => window.__frontendHost.mode(view), view)
          await expect(session.page.getByRole('heading', { name: view === 'inbox' ? 'Decisions' : 'Activity', exact: true })).toBeVisible()
          await run(session.page, { theme, width, view })
          await ctx.screenshot(session.page, `inbox-${view}-${theme}-${width}`)
        }
      }
    }
    await ctx.record('inbox-accessibility-boundary', { presentationOnly: true, authenticating: false, privateIngressGranted: false, themes, widths, views: ['HomeInbox', 'ActivityView'], actualStatus: 'no-endpoint', note: 'Read-only graph fixtures are not authenticated observations or live receipt acceptance. Eleven-state authority/receipt semantics remain the decision family and real-collaborator slots.' })
  } finally { await session.close() }
}
async function matrix (ctx) {
  await forViews(ctx, async (page, label) => {
    const bounds = await page.evaluate(() => ({ width: innerWidth, actual: document.documentElement.scrollWidth, text: document.body.innerText }))
    ctx.assert(bounds.actual <= bounds.width + 1, `Inbox/Activity does not overflow ${JSON.stringify(label)}`, { width: bounds.width, actual: bounds.actual })
    ctx.assert(/not durable chat history|bounded|retained|history/i.test(bounds.text), 'Actual inbox/Activity presents bounded/unavailable history without inventing durable chat history')
    ctx.assert(await page.getByRole('button', { name: 'Approve', exact: true }).count() === 0, 'Read-only presentation fixture never acquires approve authority')
  })
}
async function keyboard (ctx) {
  await forViews(ctx, async (page, label) => {
    const controls = page.locator('a[href]:visible, button:enabled:visible')
    await controls.first().focus()
    const active = await page.evaluate(() => { const node = document.activeElement; return { tag: node?.tagName, name: node?.textContent?.trim(), disabled: node?.disabled === true, outline: node ? getComputedStyle(node).outlineStyle : 'none' } })
    ctx.assert(active.tag !== 'BODY' && !active.disabled, `Keyboard reaches an enabled named destination ${JSON.stringify(label)}`, active)
    await page.keyboard.press('Tab')
    ctx.assert(await page.evaluate(() => document.activeElement?.disabled !== true), 'Tab does not focus a disabled review/approval control')
    await controls.first().focus()
    ctx.assert(await controls.first().evaluate(element => element.ownerDocument.activeElement === element), 'A visible named control can regain keyboard focus')
    await expect(page.getByRole('button', { name: /Review decision|Read current detail/ }).first()).toBeDisabled()
  })
}
async function axe (ctx) {
  await forViews(ctx, async (page, label) => {
    if (!(await page.evaluate(() => typeof window.axe === 'object'))) await injectAxe(ctx, page)
    const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }))
    await ctx.record(`inbox-axe-${label.view}-${label.theme}-${label.width}`, result)
    await ctx.screenshot(page, `inbox-axe-${label.view}-${label.theme}-${label.width}`)
    ctx.assert(result.passes.length > 0 && result.violations.length === 0, `Pinned axe exercises actual inbox/Activity ${JSON.stringify(label)}`, result)
  })
}
async function reducedMotion (ctx) {
  await forViews(ctx, async (page, label) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const actual = await page.evaluate(inspectMotion)
    ctx.assert(actual.length === 0, `Inbox/Activity respects actual reduced motion ${JSON.stringify(label)}`, actual)
    ctx.assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'Actual browser preference is active')
  })
}
export default { schemaVersion: 1, family: 'inbox', fixtures, slots: { 'viewport-theme-matrix': matrix, 'keyboard-and-focus': keyboard, axe, 'reduced-motion': reducedMotion } }
