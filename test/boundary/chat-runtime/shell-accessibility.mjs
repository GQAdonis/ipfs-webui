import { expectFor } from './browser.mjs'
import { injectAxe } from '../accessibility/decisions/browser.mjs'
import { inspectFocus, inspectLayout, inspectMotion } from '../accessibility/decisions/inspect.mjs'

/** Actual shipped shell on the original shared-path host: no synthetic trust/configured agent. */
export async function shellAccessibility (ctx, slot) {
  const results = []; const expect = expectFor(ctx)
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 375, 539, 540, 768, 1024, 1440, 1920]) {
      const session = await ctx.browserSession({ theme, width, height: 1000, credentialBearing: false })
      const { page } = session
      try {
        if (slot === 'reduced-motion') await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme })
        await page.goto(`${session.baseURL}#/`)
        await expect(page.locator('main').first()).toBeVisible()
        if (width < 540) {
          const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
          await expect(nav).toBeVisible()
          const labels = await nav.locator('a,button').allTextContents()
          ctx.assert(JSON.stringify(labels.map(value => value.trim())) === JSON.stringify(['Home', 'Files', 'Pins', 'Activity', 'More']), 'Actual phone shell has the four real destinations and More in adopted order', { theme, width, labels })
          const more = nav.getByRole('button', { name: 'More', exact: true })
          await more.click()
          const dialog = page.getByRole('dialog', { name: 'More destinations' }); await expect(dialog).toBeVisible()
          for (const name of ['Explore', 'Peers', 'Status', 'Diagnostics', 'Settings']) await expect(dialog.getByRole('link', { name, exact: true })).toBeVisible()
          if (slot === 'keyboard-and-focus') { await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(more).toBeFocused(); const focus = await page.evaluate(inspectFocus); ctx.assert(focus.visible, 'Native More sheet restores visible focus after Escape', focus) }
        }
        if (slot === 'viewport-theme-matrix') { const layout = await page.evaluate(inspectLayout); ctx.assert(layout.documentWidth <= layout.width + 1 && layout.overflow.length === 0, 'Actual production shell has no horizontal overflow', { theme, width, layout }); results.push({ theme, width, layout }) } else if (slot === 'keyboard-and-focus') {
          if (width >= 540) { const target = page.getByRole('link', { name: 'Files', exact: true }).first(); await target.focus(); await page.keyboard.press('Tab'); const focus = await page.evaluate(inspectFocus); ctx.assert(focus.visible, 'Actual desktop shell navigation exposes visible keyboard focus', focus) }
          results.push({ theme, width, keyboard: 'actual-page' })
        } else if (slot === 'axe') {
          await injectAxe(ctx, page)
          const fullReport = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
          await ctx.record(`actual-shell-axe-${theme}-${width}`, fullReport)
          await ctx.screenshot(page, `actual-shell-${slot}-${theme}-${width}`)
          const report = { passes: fullReport.passes.map(value => value.id), violations: fullReport.violations.map(value => ({ id: value.id, nodes: value.nodes.map(node => node.target) })) }
          ctx.assert(report.passes.length > 0 && report.violations.length === 0, 'Actual production shell and open phone More sheet pass the applicable axe rules', { theme, width, report }); results.push({ theme, width, report })
        } else if (slot === 'reduced-motion') { const motion = await page.evaluate(inspectMotion); ctx.assert(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches) && motion.length === 0, 'Actual shell/More honors active reduced motion', { theme, width, motion }); results.push({ theme, width, motion }) } else throw new Error('Unknown shell accessibility slot')
        if (slot !== 'axe') await ctx.screenshot(page, `actual-shell-${slot}-${theme}-${width}`)
      } finally { await session.close() }
    }
  }
  await ctx.record(`actual-shell-${slot}`, { kind: 'actual-production-shared-path-shell', agentPolicy: 'shared-path-disabled', results })
}
