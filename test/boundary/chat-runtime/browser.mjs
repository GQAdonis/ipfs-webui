import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { assertLocalWebuiExport, sha256 } from '../../../scripts/local-artifact.mjs'
import { Blocked } from '../processes.mjs'
import { injectAxe } from '../accessibility/decisions/browser.mjs'
import { inspectFocus, inspectLayout, inspectMotion } from '../accessibility/decisions/inspect.mjs'

export const CHAT_BROWSER_INPUTS = ['build.mjs', 'fixture.tsx', 'browser.mjs', 'units.mjs', 'real.mjs', 'app-host.mjs'].map(name => ({ root: 'webui', path: `test/boundary/chat-runtime/${name}` }))
export const expectFor = ctx => createRequire(join(ctx.root, 'package.json'))('@playwright/test').expect
let sequence = 0
export async function chatBrowser (ctx, { theme = 'dark', width = 1440 } = {}) {
  // Assert existing produced bytes without asking the daemon-backed gateway importer to run.
  const manifest = await assertLocalWebuiExport({ root: ctx.root, kubo: ctx.kubo })
  const directory = join(ctx.scratch, `chat-runtime-${ctx.scenario}-${ctx.slot}-${++sequence}`)
  const command = await ctx.processes.run(process.execPath, [join(ctx.root, 'test/boundary/chat-runtime/build.mjs'), '--out', directory], { cwd: ctx.root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}-produced-chat-fixture`, timeout: 180000 })
  const reportBytes = await readFile(join(directory, 'fixture-provenance.json')); const report = JSON.parse(reportBytes)
  ctx.assert(report.kind === 'supplemental-produced-chat-fixture' && report.htmlSha256 === sha256(await readFile(join(directory, 'index.html'))), 'Supplemental fixture executes the current produced chat entry with bound HTML bytes')
  for (const name of ['react', 'react-dom']) {
    const packages = report.runtime.packages.filter(item => item.name === name)
    ctx.assert(packages.length === 1 && packages[0].version === '19.3.1' && packages[0].modules.length > 0, `Actual fixture compiler resolves one ${name}@19.3.1`)
    ctx.assert(manifest.reactRuntime.packages.find(item => item.name === name)?.packageJsonSha256 === packages[0].packageJsonSha256, `Fixture ${name} package bytes match the production WebUI runtime`)
  }
  for (const item of report.runtime.packages) {
    ctx.assert(sha256(await readFile(resolve(ctx.kubo, 'mcp/chat', item.packageJson))) === item.packageJsonSha256, `Compiled runtime package remains current: ${item.name}`)
    for (const module of item.modules) ctx.assert(sha256(await readFile(resolve(ctx.kubo, 'mcp/chat', module.path))) === module.sha256, 'Actual compiled runtime module bytes remain current')
  }
  if (typeof ctx.serveFixture !== 'function') throw new Blocked('Q1 dedicated scratch fixture host is required; no dev server substitutes')
  const session = await ctx.serveFixture({ directory, theme, width, height: 1000, credentialBearing: false })
  let remoteRequests = 0
  session.context.on('request', request => { const url = new URL(request.url()); if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(session.baseURL).origin) remoteRequests++ })
  await session.page.goto(session.baseURL)
  await session.page.waitForFunction(() => document.documentElement.dataset.chatRuntimeReady === 'true' && Boolean(window.__chatRuntime))
  await session.page.evaluate(theme => window.__chatRuntime.configure('text', theme), theme)
  const state = await session.page.evaluate(() => window.__chatRuntime.state())
  ctx.assert(state.fonts > 0 && state.kind === 'supplemental-produced-entry-fixture', 'Bundled local fonts decode in the actual produced-entry browser fixture')
  await ctx.record('produced-chat-binding', { kind: 'supplemental-frontend-browser', report, command: { argv: command.argv, cwd: command.cwd, exitCode: command.exitCode }, artifactSha256: manifest.artifactSha256 })
  return {
    ...session,
    async close () {
      try {
        for (const input of [...report.inputs, ...report.sources]) ctx.assert(sha256(await readFile(input.path)) === input.sha256, 'Executed fixture/produced module bytes remain current')
        ctx.assert(remoteRequests === 0, 'The supplemental chat/context/A2UI fixture attempted no remote request')
        await ctx.record('chat-fixture-network', { kind: 'supplemental-frontend-browser', remoteRequests, csp: report.csp })
      } finally { await session.close() }
    }
  }
}
export async function configure (session, mode, theme = 'dark') {
  await session.page.evaluate(({ mode, theme }) => window.__chatRuntime.configure(mode, theme), { mode, theme })
  await session.page.waitForFunction(() => { const fields = document.querySelector('#chat-host')?.shadowRoot?.querySelectorAll('textarea[name=message]'); return fields?.length === 1 && fields[0].value === '' })
}
export async function send (page, text) { await page.locator('textarea[name=message]').fill(text); await page.getByRole('button', { name: 'Send message', exact: true }).click() }
export const runtimeState = page => page.evaluate(() => window.__chatRuntime.state())

export async function runtimeCase (ctx, kind) {
  const session = await chatBrowser(ctx); const { page } = session; const expect = expectFor(ctx)
  try {
    if (kind === 'authoritative-projection') {
      await send(page, 'One authoritative question'); await expect(page.getByText('Authoritative controller reply', { exact: true })).toBeVisible()
      const state = await runtimeState(page); const rows = await page.locator('[data-controller-row]').count()
      ctx.assert(state.requests.length === 1 && rows === state.messages.length && state.messages.length === 2, 'assistant-ui visible rows come from the controller messages; one request owns the reply', { rows, messages: state.messages.length, requests: state.requests.length })
    } else if (kind === 'one-controlled-composer') {
      await page.locator('textarea[name=message]').fill('Draft survives movement')
      await page.evaluate(() => window.__chatRuntime.layout(true)); await expect(page.locator('textarea[name=message]')).toHaveCount(1); await expect(page.locator('textarea[name=message]')).toHaveValue('Draft survives movement')
      await page.evaluate(() => window.__chatRuntime.layout(false)); await expect(page.locator('textarea[name=message]')).toHaveCount(1); await expect(page.locator('textarea[name=message]')).toHaveValue('Draft survives movement')
      await page.evaluate(() => window.__chatRuntime.hold()); await page.getByRole('button', { name: 'Send message', exact: true }).dblclick()
      await expect.poll(async () => (await runtimeState(page)).requests.length).toBe(1)
      ctx.assert((await runtimeState(page)).running === true, 'The held request owns the single transport lease during repeated activation')
      await page.evaluate(() => window.__chatRuntime.release()); await expect.poll(async () => (await runtimeState(page)).running).toBe(false)
      ctx.assert((await runtimeState(page)).requests.length === 1, 'Double activation and composer movement created no duplicate request')
    } else if (kind === 'no-upload-or-execution') {
      await page.locator('textarea[name=message]').evaluate(element => { const data = new DataTransfer(); data.items.add(new File(['fixture-only'], 'unrequested.txt', { type: 'text/plain' })); element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data })) })
      ctx.assert(await page.locator('input[type=file]').count() === 0 && (await runtimeState(page)).requests.length === 0, 'Pasting a file exposes no upload input and sends no request')
      await page.getByRole('button', { name: 'Go', exact: true }).click(); await page.locator('textarea[name=message]').fill('/files'); await page.getByRole('button', { name: 'Go to location' }).click()
      const state = await runtimeState(page)
      ctx.assert(state.requests.length === 0 && state.calls.navigation === 1, 'Go uses only the explicit host callback and never executes an agent tool')
    } else if (kind === 'generation-retirement') {
      await page.evaluate(() => window.__chatRuntime.hold()); await send(page, 'Old generation')
      await expect.poll(async () => (await runtimeState(page)).running).toBe(true)
      await page.evaluate(() => { window.__chatRuntime.retire(); window.__chatRuntime.release() })
      await expect(page.getByText('Authoritative controller reply', { exact: true })).toHaveCount(0)
      const state = await runtimeState(page)
      ctx.assert(state.messages.length === 0 && state.references.length === 0 && state.inspector.events.length === 0, 'Credential-generation retirement clears projections; the uncooperative late tail is fenced')
    } else if (kind === 'reference-removal') {
      await configure(session, 'context'); await page.evaluate(() => window.__chatRuntime.select())
      await expect(page.getByRole('list', { name: 'References for Ask' })).toBeVisible()
      await page.getByRole('button', { name: 'Remove reference /notes' }).click()
      await page.evaluate(() => window.__chatRuntime.layout(true)); await send(page, 'No removed reference')
      await expect.poll(async () => (await runtimeState(page)).running).toBe(false)
      const state = await runtimeState(page)
      ctx.assert(state.requests.length === 1 && state.requests[0].forwardedProps?.ipfs?.context === undefined, 'Removed page reference stays absent after a send and pane movement')
    } else if (kind === 'effective-run-facts') {
      await configure(session, 'context'); await send(page, 'Reported facts only'); await expect.poll(async () => (await runtimeState(page)).running).toBe(false)
      await page.getByRole('button', { name: 'Inspect run' }).click(); await page.getByRole('tab', { name: 'Prompt plan' }).click()
      const state = await runtimeState(page)
      ctx.assert(state.inspector.facts?.offered_tools?.join(',') === 'pin_ls', 'Inspector facts retain the actual authored event offer, rather than a global tool list')
      await expect(page.getByText('Offered tool count', { exact: true })).toBeVisible()
      await page.evaluate(() => window.__chatRuntime.facts(false)); await expect(page.getByRole('tablist', { name: 'Run inspector sections' })).toHaveCount(0)
      await page.evaluate(() => window.__chatRuntime.facts(true)); ctx.assert((await runtimeState(page)).inspector.events.length === 0, 'Facts off/on cannot resurrect the previous inspected run')
    } else if (kind === 'inert-fallback') {
      await configure(session, 'a2ui-invalid'); await send(page, 'Reject untrusted surface'); await expect.poll(async () => (await runtimeState(page)).running).toBe(false)
      const state = await runtimeState(page)
      ctx.assert(Object.values(state.surfaces).some(value => value.status === 'rejected'), 'Malformed raw A2UI reaches an inert rejected delivery')
      ctx.assert(await page.locator('[href="https://boundary.invalid/inert"],img[src=x],UnknownExecutable').count() === 0, 'Rejected markup/component content creates no link, image or executable element')
    } else if (kind === 'a2ui-admission') {
      await configure(session, 'a2ui'); await send(page, 'Render negotiated pins'); await expect.poll(async () => (await runtimeState(page)).running).toBe(false)
      ctx.assert(Object.values((await runtimeState(page)).surfaces).some(value => value.status === 'accepted'), 'Exact first-party negotiation admits the validated sealed surface')
      await expect(page.getByText('wiki', { exact: true })).toBeVisible()
      ctx.assert(await page.locator('iframe').count() === 0, 'First-party A2UI renders without loading an HTML resource')
    } else throw new Error(`Unknown concrete runtime case: ${kind}`)
    await ctx.screenshot(page, kind); await ctx.record(kind, { kind: 'supplemental-frontend-browser', state: await runtimeState(page) })
  } finally { await session.close() }
}

export async function accessibilityCase (ctx, family, slot) {
  const session = await chatBrowser(ctx); const expect = expectFor(ctx); const results = []
  try {
    if (slot === 'axe') await injectAxe(ctx, session.page)
    for (const theme of ['light', 'dark']) {
      for (const width of [375, 1440]) {
        await session.page.setViewportSize({ width, height: 1000 }); await session.page.emulateMedia({ colorScheme: theme, reducedMotion: slot === 'reduced-motion' ? 'reduce' : 'no-preference' })
        await configure(session, family === 'a2ui' ? 'a2ui' : family === 'context' ? 'inspector' : 'text', theme)
        if (family === 'context') await session.page.evaluate(() => window.__chatRuntime.select())
        await send(session.page, 'Local accessibility fixture'); await expect.poll(async () => (await runtimeState(session.page)).running).toBe(false)
        if (family === 'context') {
          const toggle = session.page.getByRole('button', { name: /^(Inspect run|Show conversation)$/ })
          if (await toggle.getAttribute('aria-pressed') === 'false') await toggle.click()
          await expect(toggle).toHaveAttribute('aria-pressed', 'true')
        }
        if (family === 'context') {
          const supplemental = session.page.getByRole('region', { name: 'Supplemental bounded event inspector', exact: true })
          await supplemental.getByRole('tab', { name: 'Events', exact: true }).click()
          const retained = supplemental.getByRole('list', { name: 'Retained run event summaries' })
          const rows = await retained.getByRole('listitem').count()
          ctx.assert(rows > 0 && rows < 30, 'Actual >200 event inspector renders a bounded virtual window', { rows })
        }
        if (slot === 'viewport-theme-matrix') {
          const layout = await session.page.evaluate(inspectLayout)
          ctx.assert(layout.documentWidth <= layout.width + 1 && layout.overflow.length === 0, `No actual ${family} overflow at ${theme}/${width}`, layout); results.push({ theme, width, layout })
        } else if (slot === 'keyboard-and-focus') {
          if (family === 'context') {
            const tabs = session.page.getByRole('tablist', { name: 'Run inspector sections' }).first(); const overview = tabs.getByRole('tab', { name: 'Overview' }); const context = tabs.getByRole('tab', { name: 'Context' })
            await overview.focus(); await session.page.keyboard.press('ArrowRight'); await expect(context).toBeFocused(); await expect(overview).toHaveAttribute('aria-selected', 'true'); await session.page.keyboard.press('Enter'); await expect(context).toHaveAttribute('aria-selected', 'true')
          } else {
            await session.page.getByRole('button', { name: 'Ask', exact: true }).focus()
            await session.page.keyboard.press('Tab')
            await expect(session.page.locator('summary').filter({ hasText: /^Add reference$/ })).toBeFocused()
            await session.page.keyboard.press('Tab')
            await expect(session.page.locator('textarea[name=message]')).toBeFocused()
          }
          const focus = await session.page.evaluate(inspectFocus); ctx.assert(focus.visible, `${family} actual keyboard target has visible focus`, focus); results.push({ theme, width, focus })
        } else if (slot === 'axe') {
          const report = await session.page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
          await ctx.record(`${family}-axe-${theme}-${width}`, report)
          await ctx.screenshot(session.page, `${family}-${slot}-${theme}-${width}`)
          ctx.assert(report.passes.length > 0 && report.violations.length === 0, `${family} actual browser axe at ${theme}/${width}`, report); results.push({ theme, width, report })
        } else if (slot === 'reduced-motion') {
          ctx.assert(await session.page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'Reduced motion is actually active')
          const motion = await session.page.evaluate(inspectMotion); ctx.assert(motion.length === 0, `${family} has no inappropriate motion under reduce`, motion); results.push({ theme, width, motion })
        } else throw new Error('Unknown accessibility assertion slot')
        if (slot !== 'axe') await ctx.screenshot(session.page, `${family}-${slot}-${theme}-${width}`)
      }
    }
    await ctx.record(`${family}-${slot}`, { kind: 'supplemental-produced-chat-browser', results })
  } finally { await session.close() }
}
