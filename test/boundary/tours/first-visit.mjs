/* global document, window, MutationObserver, performance, getComputedStyle, localStorage */
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium, expect } from '@playwright/test'
import { assertLocalWebuiExport, sha256 } from '../../../scripts/local-artifact.mjs'
import { createImmutableArtifactWriter } from '../immutable-artifacts.mjs'
import { serveStatic } from '../static-host.mjs'
import { injectAxe } from '../accessibility/decisions/browser.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const kubo = resolve(root, '../kubo')
const hintText = 'Click this button any time for a guided tour on the current page.'

/** Supplemental production-only probe, not a new phase oracle or backend lease. */
export async function runTourRecovery ({ evidenceBase = join(kubo, 'evidence/agentic-ui-frontend/correction-batch/frontend-tour-target-recovery/task2'), diagnosticCase } = {}) {
  const artifact = await assertLocalWebuiExport({ root, kubo })
  const require = createRequire(join(root, 'package.json'))
  const packagePath = resolve(dirname(require.resolve('react-joyride')), '../package.json')
  const packageBytes = await readFile(packagePath)
  const version = JSON.parse(packageBytes).version
  assert.equal(version, '3.2.0', 'Probe observes the installed migration pin, not an alternate Joyride runtime')
  const sourcePath = fileURLToPath(import.meta.url)
  const sourceHash = sha256(await readFile(sourcePath))
  const runId = `tour-recovery-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
  await mkdir(evidenceBase, { recursive: true })
  const directory = join(evidenceBase, runId)
  await mkdir(directory)
  const artifacts = []
  const retain = createImmutableArtifactWriter({ directory, artifacts })
  const report = { kind: 'supplemental-production-tour-recovery', phaseAcceptance: false, backendExercised: false, runId, startedAt: new Date().toISOString(), argv: process.argv, artifactSha256: artifact.artifactSha256, joyride: { version, packagePath, sha256: sha256(packageBytes) }, source: { path: sourcePath, sha256: sourceHash }, cases: [], cleanup: [], artifacts }
  const host = await serveStatic({ directory: join(root, 'build') })
  let browser
  const capture = async (page, label) => retain(label, 'png', await page.screenshot())
  try {
    browser = await chromium.launch({ headless: true })
    report.browser = { version: browser.version(), executable: chromium.executablePath(), sha256: sha256(await readFile(chromium.executablePath())) }
    for (const width of [320, 375, 1440]) {
      for (const theme of ['light', 'dark']) {
        for (const kind of ['close', 'escape', 'hint-handoff', 'diagnostics-deferral']) {
          const label = `${width}-${theme}-${kind}`
          if (diagnosticCase && label !== diagnosticCase) continue
          const reduced = kind === 'hint-handoff'
          const entry = { label, width, theme, reduced, status: 'FAIL', pageErrors: [], blockedEgress: 0 }
          report.cases.push(entry)
          const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: reduced ? 'reduce' : 'no-preference', locale: 'en-US' })
          let page
          const state = () => page.evaluate(() => ({ url: window.location.href, route: document.querySelector('main[data-route]')?.getAttribute('data-route'), active: document.activeElement?.outerHTML.slice(0, 1000), dialogs: [...document.querySelectorAll('[role=alertdialog], [role=dialog]')].map(node => ({ text: node.textContent, html: node.outerHTML.slice(0, 5000) })), beacons: [...document.querySelectorAll('.react-joyride__beacon')].map(node => node.outerHTML), hintDismissed: localStorage.getItem('tourTooltip') }))
          try {
            await context.route('**/*', route => {
              if (new URL(route.request().url()).origin === new URL(host.baseURL).origin) return route.continue()
              entry.blockedEgress++
              return route.abort('blockedbyclient')
            })
            await context.addInitScript(theme => {
              localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify({ enabled: false, endpoint: '' }))
              localStorage.setItem('ipfs-webui:webmcp', JSON.stringify({ enabled: false, dnslink: false }))
              localStorage.setItem('ipfs-webui:theme:v1', theme)
              // Never pre-seed tourTooltip: first visits must exercise the real hint.
              const facts = { samples: [], maxDialogs: 0, loadersSeen: false }
              window.__tourRecovery = facts
              const observe = () => {
                const dialogs = [...document.querySelectorAll('[role=alertdialog], [role=dialog]')].filter(node => node.getClientRects().length)
                const loaders = [...document.querySelectorAll('.react-joyride__loader')].filter(node => node.getClientRects().length)
                facts.maxDialogs = Math.max(facts.maxDialogs, dialogs.length)
                facts.loadersSeen ||= loaders.length > 0
                if (facts.samples.length < 256) facts.samples.push({ time: performance.now(), dialogs: dialogs.length, loaders: loaders.length })
              }
              new MutationObserver(observe).observe(document, { childList: true, subtree: true, attributes: true })
            }, theme)
            page = await context.newPage()
            page.setDefaultTimeout(10000)
            page.on('pageerror', error => entry.pageErrors.push(error.message))
            const helper = page.getByRole('button', { name: 'Start tour', exact: true })
            const hint = page.locator('[role=alertdialog], [role=dialog]').filter({ hasText: hintText })
            const guide = page.getByRole('alertdialog').filter({ hasText: 'Settings page' })
            await page.goto(`${host.baseURL}#/${kind === 'diagnostics-deferral' ? 'diagnostics' : 'settings'}`)
            if (kind === 'diagnostics-deferral') {
              entry.requestedRoute = 'diagnostics'
              // The pinned library waits 1000ms for a target and shows its loader
              // after 300ms. Observe that whole window; do not mask it by opting out.
              await page.waitForTimeout(1300)
              entry.diagnosticsObservation = await state()
              if (entry.diagnosticsObservation.route === 'diagnostics') {
                await expect(helper).toHaveCount(0)
                await expect(page.getByRole('alertdialog')).toHaveCount(0)
                entry.stableDiagnostics = 'OBSERVED'
              } else {
                assert.equal(entry.diagnosticsObservation.route, 'welcome', 'Offline initialization follows the actual supported-route redirect')
                entry.stableDiagnostics = 'UNAVAILABLE: offline RPC failure redirected the requested diagnostics route to welcome; stable diagnostics guard is covered by App unit regression'
                await expect(helper).toBeVisible()
              }
              assert.equal(await page.evaluate(() => localStorage.getItem('tourTooltip')), null)
              assert.equal((await page.evaluate(() => window.__tourRecovery)).loadersSeen, false)
              await capture(page, `${label}-deferred`)
              await page.evaluate(() => { window.location.hash = '#/settings' })
            }
            await expect(helper).toBeVisible()
            await expect(helper).toHaveClass(/joyride-app-tour/)
            await expect(hint).toBeVisible()
            // Joyride's initial focus timer is 100ms; observe after it has settled,
            // then use native keys rather than assigning focus from the probe.
            await page.waitForTimeout(250)
            entry.settledHint = await hint.evaluate(node => ({ role: node.getAttribute('role'), modal: node.getAttribute('aria-modal'), name: node.getAttribute('aria-label'), labelledBy: node.getAttribute('aria-labelledby'), text: node.textContent }))
            entry.settledFocusBeforeTab = await state()
            await page.keyboard.press('Tab')
            entry.settledFocusAfterTab = await state()
            await capture(page, `${label}-settled-semantics`)
            assert.equal(entry.settledHint.role, 'dialog', 'Nonblocking hint exposes dialog semantics')
            assert.equal(entry.settledHint.modal, 'false', 'Ordinary keyboard access agrees with nonmodal semantics')
            await expect(page.getByRole('dialog', { name: hintText, exact: true })).toBeVisible()
            await expect(page.locator('[role=alertdialog], [role=dialog]')).toHaveCount(1)
            await expect(page.locator('.react-joyride__loader')).toHaveCount(0)
            await page.evaluate(() => document.fonts.ready)
            const close = hint.getByRole('button', { name: 'Close', exact: true })
            entry.overflow = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, outside: [...document.querySelectorAll('body *')].filter(node => node.getClientRects().length).flatMap(node => { const rect = node.getBoundingClientRect(); if (rect.right <= window.innerWidth + 1 && rect.left >= -1) return []; const style = getComputedStyle(node); return [{ tag: node.tagName, className: String(node.className), id: node.id, left: rect.left, right: rect.right, width: rect.width, position: style.position, transform: style.transform, html: node.outerHTML.slice(0, 500) }] }).slice(0, 30) }))
            const bounds = await close.evaluate(node => {
              const rect = node.getBoundingClientRect()
              return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, scrollWidth: document.documentElement.scrollWidth }
            })
            assert(bounds.left >= 0 && bounds.top >= 0 && bounds.right <= bounds.viewportWidth && bounds.bottom <= bounds.viewportHeight, 'Real hint close control is reachable inside the viewport')
            assert(bounds.scrollWidth <= bounds.viewportWidth + 1, 'Hint introduces no horizontal document overflow')
            entry.closeBounds = bounds
            if (reduced) {
              entry.motion = await page.evaluate(() => {
                const activeDuration = value => value.split(',').some(part => parseFloat(part) * (part.trim().endsWith('ms') ? 0.001 : 1) > 0.01)
                return [...document.querySelectorAll('#react-joyride-portal *')].filter(node => node.getClientRects().length).flatMap(node => {
                  const style = getComputedStyle(node)
                  return (style.animationName !== 'none' && activeDuration(style.animationDuration)) || activeDuration(style.transitionDuration)
                    ? [{ className: String(node.className), animationName: style.animationName, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration }]
                    : []
                })
              })
              assert.deepEqual(entry.motion, [], 'Reduced preference suppresses actual hint/portal motion')
            }
            await capture(page, `${label}-first-hint`)
            if (kind === 'hint-handoff') {
              await helper.click()
              entry.afterActivation = await state()
            } else {
              entry.focusSequence = [await state()]
              for (let attempt = 0; attempt < 40 && !(await close.evaluate(node => node === document.activeElement)); attempt++) {
                await page.keyboard.press(attempt === 0 ? 'Tab' : 'Shift+Tab')
                entry.focusSequence.push(await state())
              }
              await expect(close).toBeFocused()
              entry.keyboardFocus = await close.evaluate(node => {
                const style = getComputedStyle(node)
                return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor }
              })
              assert(entry.keyboardFocus.outlineStyle !== 'none' && parseFloat(entry.keyboardFocus.outlineWidth) > 0, 'Keyboard dismissal has a visible focus indicator')
              await capture(page, `${label}-keyboard-focus`)
              if (kind === 'escape') await page.keyboard.press('Escape')
              else await close.click()
              await expect(hint).toHaveCount(0)
              assert.equal(await page.evaluate(() => localStorage.getItem('tourTooltip')), 'false')
              await page.reload()
              await expect(helper).toBeVisible()
              await expect(hint).toHaveCount(0)
              await helper.click()
            }
            await expect(hint).toHaveCount(0)
            await expect(guide).toBeVisible()
            await expect(guide).toHaveAttribute('aria-modal', 'true')
            await page.waitForTimeout(250)
            entry.routeModalFocus = []
            for (let attempt = 0; attempt < 4; attempt++) {
              await page.keyboard.press('Tab')
              assert(await guide.evaluate(node => node.contains(document.activeElement)), 'Existing route-tour native Tab remains inside its modal')
              entry.routeModalFocus.push(await state())
            }
            await expect(page.getByRole('alertdialog')).toHaveCount(1)
            assert.equal(await page.evaluate(() => localStorage.getItem('tourTooltip')), 'false')
            await capture(page, `${label}-manual-guide`)
            await page.keyboard.press('Escape')
            await expect(page.getByRole('alertdialog')).toHaveCount(0)
            // A second explicit activation proves stopped tours remain replayable.
            await expect(helper).toBeFocused()
            await page.keyboard.press('Enter')
            const replayBeacon = page.getByRole('button', { name: 'Open the dialog', exact: true })
            await expect(replayBeacon).toBeVisible()
            entry.replayBeforeOpen = await state()
            await replayBeacon.click()
            const replayGuide = page.getByRole('alertdialog')
            await expect(replayGuide).toBeVisible()
            await expect(replayGuide).toHaveAttribute('aria-modal', 'true')
            await expect(replayGuide.getByRole('heading', { name: 'Custom Kubo RPC API address', exact: true })).toBeVisible()
            await expect(replayGuide).not.toContainText('tour.step2.paragraph2')
            entry.replayAfterOpen = await state()
            assert.equal(entry.replayAfterOpen.route, 'settings')
            assert(entry.replayAfterOpen.dialogs[0].text.length > 0, 'Explicit replay opens actual translated route-guide content')
            await expect(page.getByRole('alertdialog')).toHaveCount(1)
            await replayGuide.getByRole('button', { name: 'Close', exact: true }).click()
            await expect(page.getByRole('alertdialog')).toHaveCount(0)
            if (theme === 'dark' && width === 375 && kind === 'close') {
              await page.getByRole('radio', { name: 'System', exact: true }).check()
              await page.emulateMedia({ colorScheme: 'light' })
              await expect.poll(() => page.evaluate(() => window.matchMedia('(prefers-color-scheme: light)').matches)).toBe(true)
              await page.getByRole('button', { name: 'More', exact: true }).click()
              await expect(page.getByRole('dialog', { name: 'More destinations' })).toBeVisible()
              await page.keyboard.press('Escape')
              await page.evaluate(() => {
                window.__moreContrast = new Promise(resolve => {
                  const dark = window.matchMedia('(prefers-color-scheme: dark)')
                  dark.addEventListener('change', () => {
                    const until = performance.now() + 220
                    const samples = []
                    const rgb = value => value.match(/[\d.]+/g).map(Number)
                    const blend = (front, back) => front.slice(0, 3).map((value, index) => value * (front[3] ?? 1) + back[index] * (1 - (front[3] ?? 1)))
                    const luminance = values => values.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0)
                    const sample = () => {
                      const button = document.querySelector('.praxis-phone-more-trigger')
                      const style = getComputedStyle(button)
                      const nav = getComputedStyle(button.closest('nav'))
                      const background = blend(rgb(style.backgroundColor), rgb(nav.backgroundColor))
                      const foreground = blend(rgb(getComputedStyle(button.querySelector('span')).color), background)
                      const values = [luminance(background), luminance(foreground)].sort((left, right) => right - left)
                      samples.push({ time: performance.now(), color: style.color, backgroundColor: style.backgroundColor, navColor: nav.backgroundColor, ratio: (values[0] + 0.05) / (values[1] + 0.05) })
                      if (performance.now() < until) window.requestAnimationFrame(sample)
                      else resolve(samples)
                    }
                    sample()
                  }, { once: true })
                })
              })
              await page.emulateMedia({ colorScheme: 'dark' })
              await expect.poll(() => page.evaluate(() => window.matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true)
              entry.darkContrastFrames = await page.evaluate(() => window.__moreContrast)
              assert(entry.darkContrastFrames.length > 1 && entry.darkContrastFrames.every(sample => sample.ratio >= 4.5), 'More text preserves AA contrast through actual theme-switch frames, not only after a delay')
              entry.darkSwitchControls = await page.locator('.iu-control-button').evaluateAll(nodes => nodes.map(node => { const style = getComputedStyle(node); const child = node.querySelector('span'); return { html: node.outerHTML, color: style.color, backgroundColor: style.backgroundColor, transition: style.transition, spanColor: child && getComputedStyle(child).color } }))
              await injectAxe({ kubo, record: (name, data) => retain(`${label}-${name}`, 'json', JSON.stringify(data, null, 2) + '\n') }, page)
              entry.darkAxe = await page.evaluate(async () => { const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return { violations: result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })) })), incomplete: result.incomplete.map(item => item.id) } })
              await capture(page, `${label}-actual-dark-axe`)
              assert.deepEqual(entry.darkAxe.violations, [], 'Actual dark shell after More and live theme switch has no axe violations')
            }
            entry.lifecycle = await page.evaluate(() => window.__tourRecovery)
            assert.equal(entry.lifecycle.maxDialogs, 1, 'Hint and page tour never coexist visibly')
            assert.equal(entry.lifecycle.loadersSeen, false, 'A present helper never enters target-wait loading')
            assert.deepEqual(entry.pageErrors, [])
            entry.status = 'PASS'
          } catch (error) {
            entry.reason = error.message
            if (page) {
              entry.failureState = await state().catch(failure => ({ error: failure.message }))
              await capture(page, `${label}-failure`).catch(failure => report.cleanup.push(failure.message))
            }
          } finally { await context.close() }
          await retain(`${label}-observations`, 'json', JSON.stringify(entry, null, 2) + '\n')
        }
      }
    }
    assert.equal((await assertLocalWebuiExport({ root, kubo })).artifactSha256, artifact.artifactSha256)
    assert.equal(sha256(await readFile(sourcePath)), sourceHash)
  } catch (error) { report.error = error.message } finally {
    if (browser) try { await browser.close() } catch (error) { report.cleanup.push(error.message) }
    try { await host.close() } catch (error) { report.cleanup.push(error.message) }
  }
  report.endedAt = new Date().toISOString()
  report.completeMatrix = !diagnosticCase && report.cases.length === 24
  report.diagnosticCase = diagnosticCase
  report.status = !report.error && report.cleanup.length === 0 && report.cases.length === (diagnosticCase ? 1 : 24) && report.cases.every(entry => entry.status === 'PASS') ? 'PASS' : 'FAIL'
  // Record the final manifest once; exclude its own artifact entry to avoid a
  // circular hash claim. Every observation/capture above has a unique path.
  const manifest = await retain('tour-recovery-manifest', 'json', JSON.stringify(report, null, 2) + '\n')
  console.log(`Tour recovery ${report.status}: ${manifest}`)
  return { report, manifest }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [flag, value, ...extra] = process.argv.slice(2)
  if (flag && (flag !== '--evidence' || !value || extra.length)) throw new Error('Usage: node test/boundary/tours/first-visit.mjs [--evidence <new evidence base>]')
  const { report } = await runTourRecovery(flag ? { evidenceBase: resolve(value) } : {})
  process.exitCode = report.status === 'PASS' ? 0 : 1
}
