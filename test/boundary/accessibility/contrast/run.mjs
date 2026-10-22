import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, realpath } from 'node:fs/promises'
import { dirname, join, relative, resolve, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'
import { chatBrowser, configure, send, runtimeState } from '../../chat-runtime/browser.mjs'
import { hostFixture } from '../../host-fixtures/browser.mjs'
import { Processes, isolatedEnvironment } from '../../processes.mjs'
import { serveStatic } from '../../static-host.mjs'
import { assertLocalWebuiExport, sha256 } from '../../../../scripts/local-artifact.mjs'
import { inspectElement, assessMeasurement } from './inspect.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const options = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, values) => i % 2 ? pairs : [...pairs, [value, values[i + 1]]], []))
assert.deepEqual(Object.keys(options).sort(), ['--out', '--summary'])
assert(options['--out'] && options['--summary'], 'Use run.mjs --summary <retained confirmation-summary.json> --out <new issue11 contrast evidence directory>')
const kubo = resolve(root, '../kubo'), out = resolve(options['--out'])
const evidenceRoot = join(kubo, 'evidence/agentic-ui-frontend/issue11-clearance/contrast')
await mkdir(evidenceRoot, { recursive: true })
const within = relative(await realpath(evidenceRoot), out)
assert(within && !within.startsWith('..') && !isAbsolute(within), 'Output must be a new child of issue11-clearance/contrast')
await mkdir(out, { recursive: false })
const scratch = join(out, 'scratch'); await mkdir(scratch)
const screenshots = join(out, 'screenshots'); await mkdir(screenshots)
const records = join(out, 'records'); await mkdir(records)
const bind = async path => ({ path, sha256: sha256(await readFile(path)) })
const summaryPath = resolve(options['--summary']), summaryBinding = await bind(summaryPath)
const summary = JSON.parse(await readFile(summaryPath, 'utf8'))
assert.equal(summary.axe.length, 16, 'Expected the retained sixteen reports, not a substituted audit')
const inputs = await Promise.all(summary.axe.map(async entry => {
  const bytes = await readFile(entry.path); assert.equal(sha256(bytes), entry.sha256)
  const report = JSON.parse(bytes.toString('utf8'))
  assert.equal(report.violations.length, 0)
  const rules = report.incomplete.filter(rule => rule.id === 'color-contrast')
  assert.equal(rules.length, 1)
  return { ...entry, nodes: rules[0].nodes, family: entry.name.split('-')[0], theme: entry.name.includes('-light-') ? 'light' : 'dark', width: Number(entry.name.split('-').at(-1)), view: entry.name.includes('-activity-') ? 'activity' : 'inbox' }
}))
assert.equal(inputs.reduce((total, input) => total + input.nodes.length, 0), 384)
const processes = new Processes(join(out, 'commands'))
const env = isolatedEnvironment(join(scratch, 'unused-ipfs-path'), kubo)
const result = { schemaVersion: 1, kind: 'issue11-computed-contrast-follow-up', acceptanceAuthority: false, originalIncompleteRecordsModified: false, newAxeInvocations: 0, root, kubo, summaryBinding, startedAt: new Date().toISOString(), bindings: [], assertions: [], reports: [], cleanup: [], limitations: ['Supplemental production-component fixtures, not node-backed application acceptance or physical assistive technology.', 'Only the 384 retained incomplete occurrences and their reproduced states are assessed.', 'Unsupported compositor effects remain UNKNOWN; recorded screenshots require independent review.'] }
let serial = 0, shotSerial = 0, browser
const live = new Set()
const record = async (label, value) => {
  const path = join(records, `${String(++serial).padStart(4, '0')}-${label.replace(/[^a-zA-Z0-9_.-]/g, '_')}.json`)
  await writeFile(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  const binding = await bind(path); result.bindings.push(binding); return binding
}
const ctx = {
  root, kubo, scratch, env, processes, scenario: 'issue11-contrast', slot: 'computed-runtime', record,
  assert (condition, message, detail) { result.assertions.push({ message, passed: Boolean(condition), detail }); assert(condition, message) },
  async serveFixture ({ directory, theme = 'dark', width = 1440, height = 1000, allowedOrigins = [] }) {
    assert.equal(allowedOrigins.length, 0, 'This contrast run grants no network collaborator origin')
    const physical = await realpath(directory), rel = relative(await realpath(scratch), physical)
    assert(rel && !rel.startsWith('..') && !isAbsolute(rel))
    const host = await serveStatic({ directory: physical })
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, locale: 'en-US' })
    const origin = new URL(host.baseURL).origin
    const blockedRequests = []
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (['http:', 'https:'].includes(url.protocol) && url.origin !== origin) { blockedRequests.push({ origin: url.origin }); return route.abort('blockedbyclient') }
      return route.continue()
    })
    const page = await context.newPage(); page.setDefaultTimeout(15000)
    const session = { page, context, baseURL: host.baseURL, async close () {
      if (!live.has(session)) return
      live.delete(session)
      try { await record('fixture-host', { directory: physical, baseURL: host.baseURL, blockedRequests }); assert.equal(blockedRequests.length, 0) } finally { await context.close(); await host.close() }
    } }
    live.add(session); return session
  }
}

// Exact semantic identity is checked after any ephemeral-id rebinding. No nearest-match fallback.
async function resolveTarget (page, original, family) {
  const chain = original.target[0]
  const shadow = Array.isArray(chain)
  let selector = shadow ? chain.at(-1) : original.target[0]
  let scope = shadow ? page.locator(chain[0]) : page
  let mode = 'retained-selector'
  if (selector.includes('#radix-')) {
    scope = scope.locator('section[aria-label="Current run inspector"]')
    selector = selector.replace(/#radix-[^ ]+-(trigger|content)-(overview|context|prompt|events)/g, (_, kind, name) => `[id$="-${kind}-${name}"]`)
    mode = 'stable-radix-suffix-in-exact-current-run-region'
  } else if (/^#_r_/.test(selector)) {
    if (original.html.startsWith('<textarea')) selector = 'textarea[name="message"]'
    else if (original.html.startsWith('<h3')) selector = 'h3.iu-title'
    else if (original.html.startsWith('<p')) {
      const id = await scope.locator('textarea[name="message"]').getAttribute('aria-describedby')
      assert(id && !id.includes(' ')); selector = `[id="${id}"]`
    } else throw new Error(`Unsupported ephemeral target ${selector}`)
    mode = 'semantic-control-title-or-described-hint'
  }
  const candidates = scope.locator(selector), count = await candidates.count(), matches = []
  for (let index = 0; index < count; index++) {
    const match = await candidates.nth(index).evaluate((element, html) => {
      const template = document.createElement('template'); template.innerHTML = html
      const expected = template.content.firstElementChild
      if (!expected || expected.tagName !== element.tagName) return false
      for (const attribute of ['class', 'role', 'aria-selected', 'aria-pressed', 'placeholder', 'name']) {
        if (!expected.hasAttribute(attribute)) continue
        if (attribute === 'class') {
          if ([...expected.classList].sort().join(' ') !== [...element.classList].sort().join(' ')) return false
        } else if (expected.getAttribute(attribute) !== element.getAttribute(attribute)) return false
      }
      if (html.includes('</') && expected.textContent.trim().replace(/\s+/g, ' ') !== element.textContent.trim().replace(/\s+/g, ' ')) return false
      return true
    }, original.html)
    if (match) matches.push(index)
  }
  if (matches.length !== 1) return { binding: { mode, selector, candidateCount: count, matchingIndexes: matches, family }, error: 'target-not-uniquely-bound' }
  return { locator: candidates.nth(matches[0]), binding: { mode, selector, candidateCount: count, matchingIndexes: matches, family } }
}

const paintKey = snapshot => JSON.stringify({ text: snapshot.text, foreground: snapshot.foregroundStyle, ancestry: snapshot.ancestors.map(({ rect, style, scrollTop, scrollLeft, pseudos }) => ({ rect, style, scrollTop, scrollLeft, pseudos })), samples: snapshot.textSamples, scroll: snapshot.windowScroll })
async function settle (page) {
  await page.mouse.move(0, 0)
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) })
}
async function measureReport (session, input) {
  const { page } = session
  await settle(page)
  const report = { name: input.name, original: { path: input.path, sha256: input.sha256 }, family: input.family, theme: input.theme, width: input.width, nodes: [] }
  for (let index = 0; index < input.nodes.length; index++) {
    const original = input.nodes[index]
    const row = { originalNodeIndex: index, originalTarget: original.target, originalHtml: original.html, originalChecks: [...original.any, ...original.all, ...original.none], status: 'UNKNOWN' }
    report.nodes.push(row)
    try {
      let target = await resolveTarget(page, original, input.family)
      row.targetBinding = target.binding
      if (target.error) { row.reasons = [target.error]; continue }
      row.beforeScroll = await target.locator.evaluate(inspectElement)
      // A locator's native scroll operation exposes both ancestor scrollports and
      // the document. Virtual rows retain aria-posinset identity across rerender.
      await target.locator.scrollIntoViewIfNeeded()
      await settle(page)
      target = await resolveTarget(page, original, input.family)
      if (target.error) { row.reasons = ['target-lost-after-scroll']; continue }
      row.afterScrollBinding = target.binding
      const observed = await target.locator.evaluate(inspectElement)
      row.measurement = observed
      row.assessment = assessMeasurement(observed)
      const screenshotPath = join(screenshots, `${String(++shotSerial).padStart(4, '0')}-${input.name}-node-${index}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: false })
      row.screenshot = await bind(screenshotPath)
      const afterScreenshot = await target.locator.evaluate(inspectElement)
      row.paintStableDuringCapture = paintKey(observed) === paintKey(afterScreenshot)
      row.postCapturePaintSha256 = sha256(paintKey(afterScreenshot))
      row.status = row.paintStableDuringCapture ? row.assessment.status : 'UNKNOWN'
      row.reasons = row.paintStableDuringCapture ? row.assessment.reasons : ['paint-changed-during-capture']
    } catch (error) { row.reasons = ['measurement-error']; row.error = error.message }
  }
  report.counts = Object.fromEntries(['PASS', 'FAIL', 'UNKNOWN'].map(status => [status, report.nodes.filter(node => node.status === status).length]))
  result.reports.push({ name: input.name, counts: report.counts, binding: await record(input.name, report) })
}

try {
  // Existing provenance guard remains authoritative. No rebuild or stale fallback.
  const exported = await assertLocalWebuiExport({ root, kubo })
  result.export = { artifactSha256: exported.artifactSha256, manifest: await bind(join(root, 'build/WEBUI_ARTIFACT.json')) }
  result.helperBindings = await Promise.all(['inspect.mjs', 'run.mjs', 'README.md'].map(name => bind(join(dirname(fileURLToPath(import.meta.url)), name))))
  result.browser = { executable: chromium.executablePath(), executableSha256: sha256(await readFile(chromium.executablePath())), package: await bind(join(root, 'node_modules/@playwright/test/package.json')) }
  browser = await chromium.launch({ headless: true })
  result.browser.version = browser.version()
  for (const family of ['a2ui', 'context']) {
    const session = await chatBrowser(ctx)
    try {
      for (const input of inputs.filter(input => input.family === family)) {
        await session.page.setViewportSize({ width: input.width, height: 1000 })
        await session.page.emulateMedia({ colorScheme: input.theme, reducedMotion: 'no-preference' })
        await configure(session, family === 'a2ui' ? 'a2ui' : 'inspector', input.theme)
        if (family === 'context') await session.page.evaluate(() => window.__chatRuntime.select())
        await send(session.page, 'Local accessibility fixture')
        await expect.poll(async () => (await runtimeState(session.page)).running).toBe(false)
        if (family === 'context') {
          const toggle = session.page.getByRole('button', { name: /^(Inspect run|Show conversation)$/ })
          if (await toggle.getAttribute('aria-pressed') === 'false') await toggle.click()
          const supplemental = session.page.getByRole('region', { name: 'Supplemental bounded event inspector', exact: true })
          await supplemental.getByRole('tab', { name: 'Events', exact: true }).click()
          await supplemental.getByRole('region', { name: 'Current run events', exact: true }).evaluate(element => element.scrollTo(0, 0))
          await settle(session.page)
        }
        await measureReport(session, input)
      }
    } finally { await session.close() }
  }
  const session = await hostFixture(ctx)
  try {
    const rows = []
    for (const name of ['activity-pending.json', 'node-success.json', 'native-deny-only.json']) {
      const path = join(kubo, 'mcp/contract/confirmation/examples/DecisionObservation', name)
      const bytes = await readFile(path), value = JSON.parse(bytes.toString('utf8'))
      if (value.approval_state === 'pending') value.expires_at = new Date(Date.now() + 3600000).toISOString()
      rows.push(value); await record(`canonical-inbox-input-${name}`, { path, sha256: sha256(bytes), presentationOnly: true, currentTimeExpiry: value.approval_state === 'pending' })
    }
    await session.page.evaluate(rows => window.__frontendHost.presentRows(rows), rows)
    for (const input of inputs.filter(input => input.family === 'inbox')) {
      await session.page.setViewportSize({ width: input.width, height: 1000 })
      await session.page.emulateMedia({ colorScheme: input.theme })
      await session.page.evaluate(({ theme, view }) => { window.__frontendHost.theme(theme); window.__frontendHost.mode(view) }, input)
      await expect(session.page.getByRole('heading', { name: input.view === 'inbox' ? 'Decisions' : 'Activity', exact: true })).toBeVisible()
      await measureReport(session, input)
    }
  } finally { await session.close() }
  const after = await assertLocalWebuiExport({ root, kubo })
  assert.equal(after.artifactSha256, result.export.artifactSha256)
  for (const entry of result.helperBindings) assert.equal((await bind(entry.path)).sha256, entry.sha256)
} catch (error) { result.error = { name: error.name, message: error.message, stack: error.stack }; process.exitCode = 1 } finally {
  for (const session of live) try { await session.close() } catch (error) { result.cleanup.push({ error: error.message }) }
  if (browser) try { await browser.close() } catch (error) { result.cleanup.push({ error: error.message }) }
  try { await processes.stop() } catch (error) { result.cleanup.push({ error: error.message }) }
  result.endedAt = new Date().toISOString()
  result.counts = Object.fromEntries(['PASS', 'FAIL', 'UNKNOWN'].map(status => [status, result.reports.reduce((sum, report) => sum + report.counts[status], 0)]))
  result.coveredOccurrences = Object.values(result.counts).reduce((sum, count) => sum + count, 0)
  result.status = result.error || result.cleanup.length || result.coveredOccurrences !== 384 ? 'BLOCKED' : result.counts.FAIL ? 'FAIL' : result.counts.UNKNOWN ? 'INCOMPLETE' : 'COMPUTED-CONTRAST-COMPLETE'
  await writeFile(join(out, 'summary.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ out, status: result.status, coveredOccurrences: result.coveredOccurrences, counts: result.counts, error: result.error?.message, cleanup: result.cleanup }, null, 2))
  if (result.status !== 'COMPUTED-CONTRAST-COMPLETE') process.exitCode = 1
}
