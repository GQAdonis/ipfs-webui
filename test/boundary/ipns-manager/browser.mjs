/* global window, document, localStorage */
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'
import { buildIpnsFixture } from './build.mjs'
import { assertLocalWebuiExport, sha256 } from '../../../scripts/local-artifact.mjs'
import { createImmutableArtifactWriter } from '../immutable-artifacts.mjs'
import { serveStatic } from '../static-host.mjs'
import { injectAxe } from '../accessibility/decisions/browser.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..'); const kubo = resolve(root, '../kubo')
const sourcePaths = ['fixture.jsx', 'build.mjs', 'browser.mjs'].map(name => join(root, 'test/boundary/ipns-manager', name))
const artifact = await assertLocalWebuiExport({ root, kubo })
const sources = await Promise.all(sourcePaths.map(async path => ({ path, sha256: sha256(await readFile(path)) })))
const runId = `ipns-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
const directory = join(kubo, 'evidence/agentic-ui-frontend/correction-batch/frontend-ipns-table-accessibility/task2', runId)
await mkdir(directory, { recursive: true })
const artifacts = []; const retain = createImmutableArtifactWriter({ directory, artifacts })
const report = {
  kind: 'supplemental-ipns-accessibility',
  runId,
  startedAt: new Date().toISOString(),
  status: 'FAIL',
  phaseAcceptance: false,
  backendExercised: false,
  artifactSha256: artifact.artifactSha256,
  sources,
  argv: process.argv,
  cases: [],
  artifacts,
  cleanup: [],
  limits: ['Mocked transport/provider states are supplemental production-component evidence, not backend acceptance.', 'Automated browser semantics, keyboard and axe are not a screen-reader or full manual WCAG conformance test. Full incomplete results require human review.']
}
let browser, fixtureHost, exportHost
const record = (name, value) => retain(name, 'json', JSON.stringify(value, null, 2) + '\n')
try {
  report.fixture = await buildIpnsFixture({ root, kubo, output: join(directory, 'fixture') })
  fixtureHost = await serveStatic({ directory: join(directory, 'fixture') })
  exportHost = await serveStatic({ directory: join(root, 'build') })
  browser = await chromium.launch({ headless: true })
  report.browser = { version: browser.version(), executable: chromium.executablePath(), sha256: sha256(await readFile(chromium.executablePath())) }
  for (const width of [375, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const kind of ['component', 'offline-export']) {
        const label = `${kind}-${width}-${theme}`; const entry = { label, status: 'FAIL', pageErrors: [], blockedEgress: [], states: [] }
        report.cases.push(entry)
        const host = kind === 'component' ? fixtureHost : exportHost
        const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, locale: 'en-US', reducedMotion: 'reduce' })
        const page = await context.newPage()
        page.setDefaultTimeout(10000)
        page.on('pageerror', error => entry.pageErrors.push(error.message))
        try {
          await context.route('**/*', route => {
            if (new URL(route.request().url()).origin === new URL(host.baseURL).origin) return route.continue()
            entry.blockedEgress.push({ url: new URL(route.request().url()).origin, method: route.request().method() })
            return route.abort('blockedbyclient')
          })
          await context.addInitScript(({ theme, kind }) => {
            localStorage.setItem('ipfs-webui:theme:v1', theme)
            if (kind === 'offline-export') {
              localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify({ enabled: false, endpoint: '' }))
              localStorage.setItem('ipfs-webui:webmcp', JSON.stringify({ enabled: false, dnslink: false }))
              // Tour behavior has separate retained production proof. This probe
              // audits the requested Settings controls without a competing hint.
              localStorage.setItem('tourTooltip', 'false')
            }
          }, { theme, kind })
          await page.goto(host.baseURL + (kind === 'offline-export' ? '#/settings' : ''))
          if (kind === 'component') await page.evaluate(theme => document.documentElement.setAttribute('data-theme', theme), theme)
          await page.evaluate(() => document.fonts.ready)
          await injectAxe({ kubo, record }, page)
          const audit = async state => {
            const result = await page.evaluate(async () => {
              const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })
              return { url: window.location.href, theme: document.documentElement.dataset.theme, violations: result.violations, incomplete: result.incomplete, passes: result.passes.map(rule => rule.id), width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }
            })
            entry.states.push({ state, axe: await record(`${label}-${state}-axe`, result), screenshot: await retain(`${label}-${state}`, 'png', await page.screenshot({ fullPage: true })) })
            assert.deepEqual(result.violations, [], `${label}/${state}: real axe violations (full details retained)`)
            assert(result.scrollWidth <= width, `${label}/${state}: horizontal overflow`)
          }
          const status = page.getByRole('status', { name: 'IPNS publishing keys', exact: true })
          const noGrid = async text => {
            await expect(status).toContainText(text)
            await expect(page.getByRole('grid', { name: 'IPNS publishing keys', exact: true })).toHaveCount(0)
            await expect(page.getByRole('rowgroup', { name: 'IPNS publishing keys', exact: true })).toHaveCount(0)
          }
          if (kind === 'offline-export') {
            await expect(page.locator('main[data-route=settings]')).toBeVisible()
            await noGrid('Disconnected')
            await audit('unavailable')
          } else {
            await page.waitForFunction(() => Boolean(window.__ipnsFixture))
            const facts = () => page.evaluate(() => window.__ipnsFixture.facts())
            const act = (operation, args = []) => page.evaluate(({ operation, args }) => window.__ipnsFixture[operation](...args), { operation, args })
            const statusKeyboard = async () => {
              await page.locator('#before').focus(); await page.keyboard.press('Tab')
              await expect(page.getByRole('button', { name: '+ Generate key', exact: true })).toBeFocused()
              await page.keyboard.press('Tab'); await expect(page.locator('#after')).toBeFocused()
            }
            await noGrid('Disconnected'); assert.equal((await facts()).calls.length, 0)
            await statusKeyboard(); await audit('unavailable')
            await act('connect'); await noGrid('Loading')
            assert((await facts()).preEffects.some(value => value.ready && value.text?.includes('Unknown')), 'Actual pre-passive-effect idle DOM is observed, not seeded')
            await statusKeyboard(); await audit('loading')
            await act('complete', [0, 'empty']); await noGrid(': 0')
            await statusKeyboard(); await audit('verified-empty')
            await act('refresh'); await noGrid('Loading'); await act('complete', [1, 'error'])
            await noGrid('Failed to fetch'); await statusKeyboard(); await audit('failed')
            await act('refresh'); await act('complete', [2, 'populated'])
            const grid = page.getByRole('grid', { name: 'IPNS publishing keys' })
            await expect(grid).toBeVisible()
            const names = () => grid.getByRole('row').filter({ has: page.getByRole('gridcell') }).evaluateAll(rows => rows.map(row => row.querySelector('[role=gridcell]').textContent))
            assert.deepEqual(await names(), ['alpha', 'self', 'zeta'])
            const nameHeader = grid.getByRole('columnheader', { name: 'Name', exact: true })
            await nameHeader.focus(); await page.keyboard.press('Enter')
            await expect(nameHeader).toHaveAttribute('aria-sort', 'descending'); assert.deepEqual(await names(), ['zeta', 'self', 'alpha'])
            await page.keyboard.press('Space'); await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
            await expect(page.getByRole('button', { name: 'Show options: self' })).toHaveCount(0)
            const options = page.getByRole('button', { name: 'Show options: zeta', exact: true })
            const link = grid.getByRole('link')
            await expect(link).toHaveAttribute('href', `http://127.0.0.1:18080/ipns/${(await facts()).publishedId}`)
            await page.locator('#before').focus()
            for (let step = 0; step < 14 && !await options.evaluate(node => node === document.activeElement); step++) await page.keyboard.press('Tab')
            await expect(options).toBeFocused(); await page.keyboard.press('Enter')
            await expect(page.getByRole('menuitem', { name: 'Rename', exact: true })).toBeFocused()
            await page.keyboard.press('ArrowDown'); await expect(page.getByRole('menuitem', { name: 'Remove', exact: true })).toBeFocused()
            await page.keyboard.press('Escape'); await expect(options).toBeFocused()
            await audit('populated')
            await act('refresh'); await noGrid('Loading'); await act('replace'); await noGrid('Disconnected')
            await act('connect'); await noGrid('Loading'); await act('complete', [4, 'empty']); await noGrid(': 0')
            await act('complete', [3, 'populated']); await noGrid(': 0')
            assert.deepEqual((await facts()).keys, [], 'Late old client response cannot resurrect rows')
            await act('retire'); await noGrid('Disconnected'); await statusKeyboard(); await audit('retired')
            entry.facts = await facts(); await act('dispose')
          }
          assert.deepEqual(entry.pageErrors, [], 'No uncaught component/runtime errors')
          entry.status = 'PASS'
        } catch (error) {
          entry.error = error.stack
          entry.failureCapture = await retain(`${label}-failure`, 'png', await page.screenshot({ fullPage: true }))
          entry.failureDom = await record(`${label}-failure-dom`, { url: page.url(), html: await page.locator('body').innerHTML() })
        } finally { await context.close() }
      }
    }
  }
  for (const source of [...sources, ...report.fixture.sources]) assert.equal(sha256(await readFile(source.path)), source.sha256, `Frozen executed input: ${source.path}`)
  assert.equal((await assertLocalWebuiExport({ root, kubo })).artifactSha256, artifact.artifactSha256)
  report.status = report.cases.every(entry => entry.status === 'PASS') ? 'PASS' : 'FAIL'
} catch (error) { report.error = error.stack } finally {
  if (browser) { await browser.close(); report.cleanup.push('owned Chromium closed') }
  for (const host of [fixtureHost, exportHost]) if (host) { await host.close(); report.cleanup.push('owned static host closed') }
  report.finishedAt = new Date().toISOString()
  console.log(JSON.stringify({ report: await record('report', report), status: report.status, cases: report.cases.map(({ label, status, error }) => ({ label, status, error })) }, null, 2))
}
if (report.status !== 'PASS') process.exitCode = 1
