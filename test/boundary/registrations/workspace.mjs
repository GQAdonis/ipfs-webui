import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { expect } from '@playwright/test'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { Blocked } from '../processes.mjs'
import { runOwnedUnits } from '../owned-units.mjs'
import { hostFixture } from '../host-fixtures/browser.mjs'
import { startDecisionLease, assertNegativeObservation } from '../accessibility/decisions/lease.mjs'

async function home (ctx, options) {
  const session = await ctx.browserSession(options)
  await session.page.goto(`${session.baseURL}#/`)
  await expect(session.page.getByRole('heading', { name: 'What would you like to do?' })).toBeVisible()
  await session.page.getByRole('button', { name: 'Go', exact: true }).click()
  return session
}
const editor = page => page.locator('textarea:visible')
async function liveFeed (ctx) {
  const session = await hostFixture(ctx)
  let lease
  try {
    lease = await startDecisionLease(ctx, new URL(session.baseURL).origin)
    session.allowOrigin(lease.descriptor.agui_url)
    const prepared = await lease.prepare('success')
    const order = []
    session.page.on('request', request => { const url = new URL(request.url()); if (url.origin === new URL(lease.descriptor.agui_url).origin && url.pathname.startsWith('/decisions')) order.push({ method: request.method(), path: url.pathname }) })
    await lease.credential.use(bearer => session.page.evaluate(input => window.__frontendHost.configure(input), { endpoint: lease.descriptor.agui_url, bearer, chatEnabled: true }))
    await session.page.waitForFunction(id => { const current = window.__frontendHost.status(); return current?.fresh && current.ids.includes(id) }, prepared.decision_id)
    return { ...session, lease, prepared, order, async close () { try { await session.close() } finally { await lease.close() } } }
  } catch (error) { try { await session.close() } finally { if (lease) await lease.close() } throw error }
}
async function readSummary (session) { return session.page.evaluate(() => window.__frontendHost.status()) }

export default [
  { scenario: 'UI-105', id: 'composer-modes', requires: ['browser', 'daemon'], async run (ctx) {
    const session = await home(ctx)
    try {
      await expect(editor(session.page)).toHaveCount(1)
      await session.page.getByRole('button', { name: 'Open Files', exact: true }).click()
      await expect(editor(session.page)).toHaveValue('/files')
      await editor(session.page).press('Enter')
      await expect(session.page).toHaveURL(/#\/files/)
      ctx.assert(await session.page.locator('[data-id="FilesPage"]').count() === 1, 'Go uses the existing real Files route and owned node')
      await session.page.goto(`${session.baseURL}#/`)
      await session.page.getByRole('button', { name: 'Search my content', exact: true }).click()
      await expect(editor(session.page)).toHaveCount(1)
      ctx.assert(await session.page.getByText(/Indexed search is (?:not available|off)/).count() > 0, 'Unsupported Search reports actual unavailable capability without becoming Ask')
      await session.page.getByRole('button', { name: 'Show my node status', exact: true }).click()
      await expect(editor(session.page)).toHaveValue('Show my node status')
      ctx.assert(await session.page.getByText('Agent actions unavailable on this origin', { exact: false }).count() > 0, 'Shared-path Ask is accurately unavailable while Go remains supported')
      await ctx.screenshot(session.page, 'one-composer-real-host')
      await ctx.record('host-composer', { production: true, hosting: 'shared-path', unsupportedAgent: true })
    } finally { await session.close() }
  } },
  { scenario: 'UI-105', id: 'draft-and-back', requires: ['browser', 'daemon'], async run (ctx) {
    const session = await home(ctx)
    try {
      await editor(session.page).fill('Visible draft kept across panes')
      await editor(session.page).focus()
      await editor(session.page).evaluate(field => field.setSelectionRange(2, 9))
      await session.page.getByRole('button', { name: /Open conversation/ }).click()
      await expect(editor(session.page)).toHaveCount(1)
      await expect(editor(session.page)).toHaveValue('Visible draft kept across panes')
      const selection = await editor(session.page).evaluate(field => ({ start: field.selectionStart, end: field.selectionEnd, active: field.getRootNode().activeElement === field }))
      ctx.assert(selection.start === 2 && selection.end === 9 && selection.active, 'Actual shadow editor selection/focus follows the sole draft into conversation')
      await editor(session.page).press('['); await editor(session.page).press(']')
      ctx.assert((await editor(session.page).inputValue()).includes('[]'), 'Pane shortcuts do not consume characters typed inside the owned shadow editor')
      await editor(session.page).press('ControlOrMeta+k')
      ctx.assert(await editor(session.page).evaluate(field => field.getRootNode().activeElement === field), 'Editing-safe composer shortcut retains current text focus')
      await ctx.screenshot(session.page, 'draft-focus-continuity')
      await runOwnedUnits(ctx, ['src/shell/PraxisWorkspace.test.jsx', 'src/shell/WorkspaceLayout.test.jsx', 'src/shell/layout-keyboard.test.js'])
    } finally { await session.close() }
  } },
  { scenario: 'UI-105', id: 'phone-navigation', requires: ['browser', 'daemon'], async run (ctx) {
    const session = await home(ctx, { width: 375, height: 650 })
    try {
      await editor(session.page).fill('Draft retained by Back')
      await session.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      const scrollBefore = await session.page.evaluate(() => window.scrollY)
      ctx.assert(scrollBefore > 0, 'The actual phone Home has a nonzero ordinary document scroll position before navigation')
      const nav = session.page.getByRole('navigation', { name: 'Primary navigation', exact: true })
      await expect(nav).toBeVisible()
      for (const name of ['Home', 'Files', 'Pins', 'Activity']) await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
      const more = nav.getByRole('button', { name: 'More', exact: true })
      await more.click()
      const sheet = session.page.getByRole('dialog', { name: 'More destinations' })
      await expect(sheet).toBeVisible()
      for (const name of ['Explore', 'Peers', 'Status', 'Diagnostics', 'Settings']) await expect(sheet.getByRole('link', { name, exact: true })).toBeVisible()
      await session.page.keyboard.press('Escape'); await expect(sheet).toHaveCount(0)
      await expect(more).toBeFocused()
      await more.click(); await sheet.getByRole('link', { name: 'Explore', exact: true }).click()
      await expect(session.page).toHaveURL(/#\/explore/)
      await expect(sheet).toHaveCount(0)
      await session.page.goBack(); await expect(session.page).toHaveURL(/#\/$/)
      await expect(editor(session.page)).toHaveValue('Draft retained by Back')
      await expect.poll(() => session.page.evaluate(() => window.scrollY)).toBe(scrollBefore)
      ctx.assert(true, 'Actual browser Back restores the same draft and ordinary-route scroll position')
      await ctx.screenshot(session.page, 'phone-home-files-pins-activity-more')
      ctx.assert(await nav.isVisible(), 'Real phone primary destinations remain reachable after More navigation and Back')
      await ctx.record('phone-navigation', { width: 375, breakpoint: 540, exactDestinations: ['Home', 'Files', 'Pins', 'Activity', 'More'] })
    } finally { await session.close() }
  } },
  { scenario: 'UI-105', id: 'suggestion-negative', requires: ['browser', 'daemon'], async run (ctx) {
    const session = await home(ctx), calls = []
    try {
      session.page.on('request', request => { const path = new URL(request.url()).pathname; if (path === '/agui' || path.startsWith('/search')) calls.push(path) })
      for (const name of ['Show my node status', 'Open Files', 'Search my content']) await session.page.getByRole('button', { name, exact: true }).click()
      await expect(editor(session.page)).toHaveValue('')
      ctx.assert(calls.length === 0 && new URL(session.page.url()).hash === '#/', 'All real suggestion buttons set draft/intent without model/Search requests or navigation')
      await ctx.screenshot(session.page, 'suggestions-do-not-execute'); await ctx.record('suggestion-negative', { requests: calls })
    } finally { await session.close() }
  } },
  { scenario: 'UI-109', id: 'shared-origin-guard', requires: ['browser', 'daemon'], async run (ctx) {
    await runOwnedUnits(ctx, ['src/agent-chat/origin-classification.test.js', 'src/agent-chat/origin-policy.test.js', 'src/webmcp/webmcp.test.js', 'src/settings/agent/core/origin-guards.test.js'])
    const session = await home(ctx)
    try {
      ctx.assert(new URL(session.page.url()).pathname.includes('/ipfs/'), 'Actual negative host is the owned gateway shared content path, even on loopback')
      await expect(session.page.getByRole('status').filter({ hasText: /origin|gateway/i }).first()).toBeVisible()
      await session.page.getByRole('button', { name: 'Show my node status', exact: true }).click()
      ctx.assert(await session.page.getByText('Agent actions unavailable on this origin', { exact: false }).count() > 0, 'Production origin guard refuses Ask on the actual shared path')
      await session.page.getByRole('button', { name: 'Open Files', exact: true }).click(); await editor(session.page).press('Enter')
      await expect(session.page).toHaveURL(/#\/files/)
      await ctx.screenshot(session.page, 'shared-path-read-navigation-preserved')
      await ctx.record('origin-negative', { actualOrigin: new URL(session.baseURL).origin, sharedPath: new URL(session.baseURL).pathname, readNavigation: true, fixtureAuthority: false })
    } finally { await session.close() }
  } },
  { scenario: 'UI-109', id: 'cid-copy-and-warning', requires: [], async run (ctx) {
    await runOwnedUnits(ctx, ['src/files/modals/share-modal/ShareModal.test.jsx', 'src/files/modals/remove-modal/RemoveModal.test.jsx', 'src/files/modals/pinning-modal/PinningModal.test.jsx', 'src/lib/share-link.test.js'])
    await ctx.record('scope-evidence', { kind: 'frontend-content-explanation', actualCallbacksPreserved: true, backendSummary: 'BE-05 remains independently required; no frontend replacement' })
  } },
  { scenario: 'UI-109', id: 'no-implicit-fetch', requires: ['browser', 'daemon'], async run (ctx) {
    const session = await home(ctx), reads = []
    try {
      session.page.on('request', request => { const path = new URL(request.url()).pathname; if (/\/(?:cat|block\/get|dag\/get)$/.test(path) || path === '/agui') reads.push(path) })
      await editor(session.page).fill('/ipfs/bafkqac3imvwgy3zao5xxe3de')
      await expect(editor(session.page)).toHaveValue('/ipfs/bafkqac3imvwgy3zao5xxe3de')
      await session.page.getByRole('button', { name: /Open conversation/ }).click()
      ctx.assert(reads.length === 0, 'Typing a reference and moving its composer does not implicitly fetch bytes or start a run')
      await ctx.screenshot(session.page, 'reference-text-no-fetch'); await ctx.record('no-implicit-content-requests', { reads })
      await runOwnedUnits(ctx, ['src/agent-chat/page-reference.test.js', 'src/settings/agent/PresentationPreferences.test.jsx'])
    } finally { await session.close() }
  } },
  { scenario: 'UI-113', id: 'documented-off-switches', requires: ['browser', 'daemon'], async run (ctx) {
    await runOwnedUnits(ctx, ['src/agent-chat/presentation-policy.test.js', 'src/agent-chat/connection-store.test.js', 'src/activity/DecisionFeedProvider.test.jsx', 'src/settings/agent/PresentationPreferences.test.jsx', 'src/search/use-search.test.js'])
    const session = await home(ctx)
    try {
      await session.page.goto(`${session.baseURL}#/settings/agent`)
      for (const label of ['Show Home decisions and Activity', 'Show agent-generated UI', 'Show context references when available', 'Show run facts when available']) {
        const control = session.page.getByRole('switch', { name: label, exact: true })
        await expect(control).toBeVisible(); if (await control.isChecked()) await control.click()
      }
      await session.page.goto(`${session.baseURL}#/activity`)
      ctx.assert(await session.page.getByRole('button', { name: /Review decision|Read current detail|Approve/ }).count() === 0, 'Display-off Activity exposes no review/approval controls')
      await session.page.goto(`${session.baseURL}#/files`)
      await expect(session.page.locator('[data-id="FilesPage"]')).toBeVisible()
      await ctx.screenshot(session.page, 'off-features-ordinary-files')
      await ctx.record('frontend-off-state', { localPreferences: ['decisions', 'a2ui', 'contextReferences', 'runFacts'], ordinaryFiles: true, serverSwitches: 'not established by local hiding; BE-05' })
    } finally { await session.close() }
  } },
  { scenario: 'UI-107', id: 'identity-snapshot', requires: ['fixture-browser'], async run (ctx) {
    await runOwnedUnits(ctx, ['src/activity/decision-feed.test.js', 'src/activity/DecisionFeedProvider.test.jsx'])
    const session = await liveFeed(ctx)
    try {
      const current = await readSummary(session)
      ctx.assert(current.ids.includes(session.prepared.decision_id) && current.fresh && current.complete, 'Actual authenticated protected snapshot admits the lease-owned decision after stream subscription')
      ctx.assert(session.order[0]?.path.endsWith('/events'), 'Actual protected subscription begins before its first snapshot request', session.order)
      const negative = await session.lease.negative(session.prepared.case_id, 'different_subject')
      assertNegativeObservation(ctx, negative, 'different_subject')
      await ctx.screenshot(session.page, 'authenticated-current-identity-inbox'); await ctx.record('protected-snapshot', current)
      throw new Blocked('BE-04 lacks two independent OIDC-subject read credentials sharing a principal; handler-negative subject refusal does not certify list isolation')
    } finally { await session.close() }
  } },
  { scenario: 'UI-107', id: 'idle-feed-reconcile', requires: ['fixture-browser'], async run (ctx) {
    const session = await liveFeed(ctx)
    try {
      const before = await readSummary(session), added = await session.lease.prepare('success')
      await session.page.waitForFunction(id => window.__frontendHost.status()?.ids.includes(id), added.decision_id)
      const after = await readSummary(session)
      ctx.assert(after.ids.includes(added.decision_id) && before.revision !== after.revision, 'An actual protected SSE invalidation reconciles idle Home without a button refresh')
      await session.page.context().setOffline(true)
      await session.page.waitForFunction(() => window.__frontendHost.status()?.status === 'reconnecting')
      await session.page.context().setOffline(false)
      await session.page.waitForFunction(() => window.__frontendHost.status()?.fresh)
      ctx.assert(session.order.filter(item => item.path === '/decisions').length >= 2, 'Actual reconnect rereads current protected snapshot instead of relying on event state as receipt')
      await ctx.screenshot(session.page, 'idle-sse-and-reconnect'); await ctx.record('idle-feed-reconciliation', { before, after, requestOrder: session.order })
      await runOwnedUnits(ctx, ['src/agent-chat/decision-sse.test.js', 'src/agent-chat/decisions-client.test.js'])
    } finally { await session.close() }
  } },
  { scenario: 'UI-107', id: 'bounded-history', requires: ['fixture-browser'], async run (ctx) {
    const session = await liveFeed(ctx)
    try {
      const snapshot = await readSummary(session)
      ctx.assert(snapshot.ids.length <= 400 && snapshot.retention?.scope === 'server', 'Actual feed discloses global bounded retention and local projection limit')
      await expect(session.page.getByText(/200 resolved records globally/)).toBeVisible()
      await expect(session.page.getByText(/History resets on server restart/)).toBeVisible()
      ctx.assert(snapshot.complete || snapshot.hasMore || snapshot.truncated, 'Partial loaded state is explicitly distinguished from complete reconciliation')
      await ctx.screenshot(session.page, 'bounded-retention-disclosure'); await ctx.record('observed-bounds', snapshot)
      await runOwnedUnits(ctx, ['src/activity/decision-feed.test.js', 'src/activity/DecisionViews.test.jsx'])
      throw new Blocked('BE-04 supplies no actual retained-history overflow/time/restart control; frontend bounded-state scenarios cannot certify global server retention')
    } finally { await session.close() }
  } },
  { scenario: 'UI-107', id: 'observation-no-authority', requires: ['fixture-browser'], async run (ctx) {
    await runOwnedUnits(ctx, ['src/activity/inbox-adapter.test.js', 'src/activity/decision-display.test.js'])
    const session = await liveFeed(ctx)
    try {
      const before = await session.lease.snapshot(session.prepared.case_id)
      await session.page.evaluate(id => window.__frontendHost.read(id), session.prepared.decision_id)
      const after = await session.lease.snapshot(session.prepared.case_id)
      if (!Number.isInteger(before.invocations) || !Number.isInteger(after.invocations) || !Number.isInteger(before.rpc_mutations) || !Number.isInteger(after.rpc_mutations) || typeof before.pinned !== 'boolean' || typeof after.pinned !== 'boolean') throw new Blocked('Live control snapshot omitted actual invocation/RPC/pin effect counters; absence cannot prove no effects')
      ctx.assert(before.invocations === after.invocations && before.rpc_mutations === after.rpc_mutations && before.pinned === after.pinned, 'Actual authenticated detail GET never executes or changes fixture pin state')
      await session.page.evaluate(() => window.__frontendHost.off())
      ctx.assert(await session.page.evaluate(() => window.__frontendHost.requests().connectionListeners) === 0, 'Local decision-off retires the actual protected feed owner')
      await ctx.screenshot(session.page, 'off-protected-read-owner'); await ctx.record('detail-read-before-after', { before, after })
    } finally { await session.close() }
  } },
  { scenario: 'UI-117', id: 'exact-entity-trio', requires: [], async run (ctx) {
    const require = createRequire(join(ctx.root, 'package.json')), packages = []
    for (const name of ['@prometheus-ags/prometheus-entity-management', '@prometheus-ags/entity-graph-react', '@prometheus-ags/entity-graph-core']) {
      const entry = require.resolve(name)
      let current = dirname(entry), found
      for (let depth = 0; depth < 10; depth++) { try { const path = join(current, 'package.json'), bytes = await readFile(path), metadata = JSON.parse(bytes); if (metadata.name?.includes('entity-')) { found = { requested: name, name: metadata.name, version: metadata.version, path, sha256: sha256(bytes), entry, entrySha256: sha256(await readFile(entry)) }; break } } catch {} current = dirname(current) }
      ctx.assert(found?.version === '4.2.0', `Actual installed ${name} implementation resolves exactly 4.2.0`, found)
      packages.push(found)
    }
    const declared = JSON.parse(await readFile(join(ctx.root, 'package.json'), 'utf8'))
    ctx.assert(packages.every(pkg => declared.dependencies[pkg.requested] === '4.2.0'), 'Alias and both implementation/core declarations use exact versions')
    await ctx.record('actual-entity-packages', packages)
  } },
  { scenario: 'UI-117', id: 'generation-epoch-isolation', requires: ['fixture-browser'], async run (ctx) {
    await runOwnedUnits(ctx, ['src/activity/decision-feed.test.js', 'src/activity/DecisionFeedProvider.test.jsx'])
    const session = await liveFeed(ctx)
    try {
      const before = await readSummary(session)
      const generation = await session.page.evaluate(() => window.__frontendHost.rotateSameConnection())
      ctx.assert(generation !== before.generation, 'Known credential/lifetime transition rotates at the same live endpoint')
      await session.page.waitForFunction(generation => window.__frontendHost.status()?.generation === generation, generation)
      await session.page.evaluate(() => window.__frontendHost.retire())
      ctx.assert((await readSummary(session)).ids.length === 0, 'Retiring actual feed capture clears old scoped graph immediately')
      await ctx.screenshot(session.page, 'retired-current-generation-graph'); await ctx.record('generation-retirement', { before, after: await readSummary(session) })
      throw new Blocked('BE-04 lacks same-endpoint subject replacement and controlled server restart; actual epoch replacement remains a collaborator prerequisite')
    } finally { await session.close() }
  } },
  { scenario: 'UI-117', id: 'live-reconciliation', requires: ['fixture-browser'], async run (ctx) {
    const session = await liveFeed(ctx)
    try {
      const prepared = await session.lease.prepare('success')
      await session.page.waitForFunction(id => window.__frontendHost.status()?.ids.includes(id), prepared.decision_id)
      const current = await readSummary(session)
      ctx.assert(current.fresh && current.ids.includes(prepared.decision_id), 'Actual live invalidation reconciles strict observations into explicit scoped entity store')
      ctx.assert(current.list?.total === null, 'Observed entity list never invents API total from partial loaded rows')
      await ctx.screenshot(session.page, 'live-entity-reconciliation'); await ctx.record('live-read-projection', current)
    } finally { await session.close() }
  } },
  { scenario: 'UI-117', id: 'no-authority-or-persistence', requires: ['fixture-browser'], async run (ctx) {
    const session = await hostFixture(ctx)
    try {
      const record = JSON.parse(await readFile(join(ctx.kubo, 'mcp/contract/confirmation/examples/DecisionObservation/activity-pending.json'), 'utf8'))
      const keys = await session.page.evaluate(() => Object.keys(localStorage))
      await session.page.evaluate(row => window.__frontendHost.patchGraph(row), record)
      ctx.assert(await session.page.evaluate(id => !window.__frontendHost.validated(id) && !window.__frontendHost.canAuthorizeCopiedRow(id), record.id), 'A generic entity-store replacement cannot mint private validated ingress or approval authorization')
      ctx.assert(JSON.stringify(await session.page.evaluate(() => Object.keys(localStorage))) === JSON.stringify(keys), 'Entity mutation writes no persistence/history storage')
      await session.page.evaluate(() => window.__frontendHost.retire())
      ctx.assert((await readSummary(session)).ids.length === 0, 'Retirement leaves no copied observation in the current scoped view')
      await ctx.screenshot(session.page, 'graph-row-has-no-authority'); await ctx.record('entity-no-authority', { copiedId: record.id, persistenceAdded: false })
    } finally { await session.close() }
  } }
]
