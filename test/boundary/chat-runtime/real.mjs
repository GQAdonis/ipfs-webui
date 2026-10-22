import { Blocked, delay } from '../processes.mjs'
import { assertNegativeObservation, NEGATIVE_KINDS } from '../accessibility/decisions/lease.mjs'
import { decisionHost } from '../host-fixtures/live.mjs'
import { expectFor, send } from './browser.mjs'

async function observed (lease, prepared, predicate, label) {
  const deadline = Date.now() + 45000
  do { const value = await lease.observe(prepared); if (predicate(value)) return value; await delay(75) } while (Date.now() < deadline)
  throw new Error(`Real decision did not reach ${label}`)
}
async function present (ctx, page, observation, forbidden = []) {
  await page.waitForFunction(observation => { const current = window.__frontendHost.projection(observation.id); return current && current.approvalState === observation.approval_state && current.execution?.state === observation.execution?.state }, observation)
  const model = await page.evaluate(id => window.__frontendHost.projection(id), observation.id)
  ctx.assert(model && !forbidden.includes(model.phase), 'Actual current protected feed projection never claims unsupported success/authority', { phase: model?.phase })
  return model
}
/** Real handler/receipt controls plus actual current production presentation; fixtures alone cannot pass. */
export async function realDecision (ctx, kind) {
  const session = await decisionHost(ctx)
  let lease
  try {
    lease = session.lease
    const evidence = []
    if (kind === 'successful-receipt-only') {
      const prepared = await lease.prepare('success'), pending = await lease.observe(prepared)
      await present(ctx, session.page, pending, ['committed'])
      await lease.answer(prepared, true)
      const value = await observed(lease, prepared, value => value.execution?.state === 'succeeded', 'successful execution')
      const model = await present(ctx, session.page, value)
      ctx.assert(model.phase === 'committed' && model.execution?.receipt?.decision_id === prepared.decision_id && model.execution.receipt.effect_digest === prepared.effect_digest, 'Only the real matching successful receipt yields Done')
      const duplicate = await lease.negative(prepared.case_id, 'duplicate_dispatch'); assertNegativeObservation(ctx, duplicate, 'duplicate_dispatch')
      ctx.assert(duplicate.invocations_before === 1 && duplicate.invocations_after === 1, 'The real handler ran exactly once, including a duplicate dispatch attempt')
      evidence.push({ phase: model.phase, receipt: model.execution.receipt, duplicate })
    } else if (kind === 'failure-and-uncertainty') {
      for (const mode of ['pause_after_claim', 'fail_after_approval', 'unknown']) {
        const prepared = await lease.prepare(mode)
        const answering = lease.answer(prepared, true)
        // Attach immediately; paused control must be released even if a later observation fails.
        answering.catch(() => {})
        try {
          if (mode === 'pause_after_claim') {
            const value = await observed(lease, prepared, value => value.approval_state === 'executed' || value.execution?.state === 'running', 'claim before handler completion')
            const model = await present(ctx, session.page, value, ['committed', 'failed_after_approval'])
            ctx.assert(model.execution?.receipt === undefined, 'A paused consumed claim exposes no success receipt')
            evidence.push({ mode, phase: model.phase })
          }
        } finally { if (mode === 'pause_after_claim') await lease.release(prepared.case_id) }
        await answering
        if (mode !== 'pause_after_claim') {
          const value = await observed(lease, prepared, value => value.execution?.state === (mode === 'fail_after_approval' ? 'failed' : 'unknown'), mode)
          const model = await present(ctx, session.page, value, ['committed'])
          ctx.assert(model.phase === (mode === 'fail_after_approval' ? 'failed_after_approval' : 'uncertain') && model.execution?.receipt === undefined, 'Known failure and uncertain completion remain distinct without a successful receipt')
          evidence.push({ mode, phase: model.phase })
        }
      }
    } else if (kind === 'digest-and-identity-binding' || kind === 'exactly-once') {
      const prepared = await lease.prepare('success')
      const kinds = kind === 'exactly-once' ? ['duplicate_answer', 'duplicate_dispatch'] : NEGATIVE_KINDS.filter(value => !value.startsWith('duplicate_'))
      for (const negativeKind of kinds) { const value = await lease.negative(prepared.case_id, negativeKind); assertNegativeObservation(ctx, value, negativeKind); evidence.push(value) }
      const expired = await lease.prepare('expired'); const before = await lease.observe(expired); const expiredNegative = await lease.negative(expired.case_id, 'duplicate_answer'); assertNegativeObservation(ctx, expiredNegative, 'duplicate_answer')
      const after = await lease.observe(expired)
      ctx.assert(after.execution?.receipt === undefined && before.effect_digest === after.effect_digest, 'An expired decision creates no successful execution receipt')
      const expiredModel = await present(ctx, session.page, after, ['committed'])
      ctx.assert(expiredModel.capabilities.approve === false, 'Actual current expired presentation exposes no approval capability')
      if (kind === 'exactly-once') {
        const actual = await lease.prepare('success'); await lease.answer(actual, true)
        const success = await observed(lease, actual, value => value.execution?.state === 'succeeded', 'original execution')
        const duplicate = await lease.negative(actual.case_id, 'duplicate_dispatch'); assertNegativeObservation(ctx, duplicate, 'duplicate_dispatch')
        ctx.assert(duplicate.invocations_before === 1 && duplicate.invocations_after === 1 && success.execution.receipt !== undefined, 'One original reviewed operation executes at most once and has actual receipt evidence')
        evidence.push(duplicate)
      }
    } else if (kind === 'native-deny-only') {
      const prepared = await lease.prepare('native_required'), observation = await lease.observe(prepared)
      const model = await present(ctx, session.page, observation, ['committed'])
      ctx.assert(model.requiresNativePrompt === true && model.capabilities.approve === false, 'Actual native-required observation cannot approve in the web surface')
      await lease.answer(prepared, false)
      const denied = await observed(lease, prepared, value => value.approval_state === 'denied', 'native denial')
      ctx.assert(denied.execution?.receipt === undefined, 'Actual web denial grants no native execution or receipt')
      evidence.push({ phase: model.phase, approval_state: denied.approval_state })
    } else throw new Error('Unknown real decision assertion')
    await ctx.screenshot(session.page, kind); await ctx.record(kind, { kind: 'real-protected-handler-and-production-presentation', evidence })
  } finally { await session.close() }
}

async function pins (api) { const values = []; for await (const pin of api.pin.ls({ type: 'all' })) values.push(pin.cid.toString()); return values.sort() }
async function needsUnavailableNative (ctx, lease) {
  if (lease.descriptor.native_node_confirmation_available !== false) return false
  const origin = await ctx.productionOrigin()
  return lease.credential.use(async bearer => {
    const response = await fetch(lease.descriptor.decisions_url, { headers: { Authorization: `Bearer ${bearer}`, Origin: origin }, signal: AbortSignal.timeout(15000) })
    if (!response.ok) { await response.body?.cancel(); return false }
    const reader = response.body?.getReader()
    if (!reader) return false
    const chunks = []; let size = 0
    try {
      while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 1048576) throw new Error('Protected native-state observation exceeds its bounded response'); chunks.push(value) }
    } finally { await reader.cancel().catch(() => {}) }
    const page = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return Array.isArray(page.items) && page.items.some(item => item.actions?.authorized_surface === 'native_system_prompt' && item.approval_state === 'pending')
  })
}
async function protectedDecisions (lease, origin) {
  return lease.credential.use(async bearer => {
    const response = await fetch(lease.descriptor.decisions_url, { headers: { Authorization: `Bearer ${bearer}`, Origin: origin }, signal: AbortSignal.timeout(15000) })
    if (!response.ok) { await response.body?.cancel(); throw new Blocked(`Actual Activity observation unavailable: HTTP ${response.status}`) }
    const reader = response.body?.getReader()
    if (!reader) throw new Blocked('Actual Activity observation has no bounded body')
    let size = 0; const chunks = []
    try { while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 1048576) throw new Error('Actual Activity observation exceeds 1MiB'); chunks.push(value) } }
    finally { await reader.cancel().catch(() => {}) }
    const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)))
    if (!Array.isArray(body.items) || typeof body.server_epoch !== 'string' || typeof body.revision !== 'string') throw new Blocked('Actual Activity list omitted canonical scope/revision fields')
    return body.items
  })
}
const targetsCid = (record, cid) => record?.summary?.tool === 'pin_add' && record.summary.targets?.some(target => target.kind === 'cid' && target.value === cid)
/** Real configured model through the actual dedicated production WebUI and real disposable RPC. */
export async function realBackend (ctx, mode, { context = false, disconnect = false } = {}) {
  if (typeof ctx.acquireBackendLease !== 'function') throw new Blocked('Validated Claude backend executable/receipt intake is required')
  await ctx.productionOrigin()
  const lease = await ctx.acquireBackendLease(mode)
  let session
  try {
    session = await ctx.browserSession({ hosting: 'dedicated', backendLease: lease, credentialBearing: true })
    const { page } = session, expect = expectFor(ctx), [approveCid, denyCid] = lease.descriptor.fixture_cids
    const before = await pins(lease.api)
    ctx.assert(!before.includes(approveCid) && !before.includes(denyCid), 'Both explicit real fixture CIDs start unpinned')
    await page.goto(`${session.baseURL}#/`)
    await expect(page.locator('textarea[name=message]')).toHaveCount(1)
    if (context) {
      const summary = page.locator('summary', { hasText: 'Add reference' }); await summary.click()
      await page.getByRole('combobox', { name: 'Reference kind' }).selectOption('cid')
      await page.getByRole('textbox', { name: 'Logical reference' }).fill(approveCid)
      await page.getByRole('button', { name: 'Add reference', exact: true }).click()
      await expect(page.getByRole('list', { name: 'References for Ask' })).toBeVisible()
    }
    await send(page, 'Use pin_ls once to list the current pins. Do not change anything. Report the tool result.')
    await expect(page.getByRole('article', { name: 'Tool call pin_ls' })).toBeVisible({ timeout: 120000 })
    await expect(page.getByRole('button', { name: 'Stop run', exact: true })).toHaveCount(0, { timeout: 120000 })
    ctx.assert(JSON.stringify(await pins(lease.api)) === JSON.stringify(before), 'The actual model read caused no pin mutation')
    if (context) {
      await page.getByRole('button', { name: 'Inspect run' }).click()
      const tabs = page.getByRole('tablist', { name: 'Run inspector sections' }); await expect(tabs).toBeVisible()
      await tabs.getByRole('tab', { name: 'Context' }).click()
      const panel = page.getByRole('tabpanel'); const text = await panel.innerText()
      ctx.assert(text.includes(approveCid) || text.includes('Not reported by this server'), 'Real backend reports the accepted reference snapshot or explicit absence')
      await tabs.getByRole('tab', { name: 'Prompt plan' }).click()
      const plan = await page.getByRole('tabpanel').innerText()
      ctx.assert(plan.includes('Not reported by this server') || plan.includes('pin_ls'), 'Real prompt plan uses actual reported tools or explicit absence')
      await ctx.screenshot(page, `${mode}-actual-context-facts`)
      await page.getByRole('button', { name: 'Show conversation' }).click()
    }
    await send(page, `Use pin_add to recursively pin only ${approveCid}. Ask for approval; do not use any other write tool.`)
    const approve = page.getByRole('button', { name: /^Approve/ }).first()
    try { await expect(approve).toBeEnabled({ timeout: 120000 }) }
    catch (error) { if (await needsUnavailableNative(ctx, lease)) throw new Blocked('Actual pending operation requires genuine native node confirmation; the Claude lease explicitly has no native presence'); throw error }
    const pendingRecord = (await protectedDecisions(lease, new URL(session.baseURL).origin)).find(record => record.approval_state === 'pending' && targetsCid(record, approveCid))
    let resumedFromActivity = false
    if (pendingRecord?.activity_id && pendingRecord.actions?.authorized_surface === 'owned_chat') {
      await page.locator('a[href="#/activity"]').first().click()
      await expect(page.getByRole('heading', { name: 'Activity', exact: true })).toBeVisible()
      const row = page.locator('.activity-group li').filter({ hasText: approveCid }).first()
      await row.getByRole('button', { name: 'Read current detail', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Current decision' })
      const currentApprove = dialog.getByRole('button', { name: /^Approve/ }).first()
      await expect(currentApprove).toBeEnabled({ timeout: 15000 }); await currentApprove.click()
      resumedFromActivity = true
      if (await dialog.count()) await dialog.getByRole('button', { name: 'Close decision detail' }).click()
    } else await approve.click()
    try { await expect.poll(() => pins(lease.api), { timeout: 120000 }).toContain(approveCid) }
    catch (error) { if (await needsUnavailableNative(ctx, lease)) throw new Blocked('Actual UAR acknowledgment left a node native confirmation pending; native presence is unavailable and no node execution is claimed'); throw error }
    await send(page, `Use pin_add to recursively pin only ${denyCid}. Ask for approval; do not use any other write tool.`)
    const deny = page.getByRole('button', { name: 'Deny', exact: true }).last(); await expect(deny).toBeEnabled({ timeout: 120000 }); await deny.click()
    await expect(page.getByText('Denied', { exact: true }).last()).toBeVisible({ timeout: 120000 })
    const after = await pins(lease.api)
    ctx.assert(after.includes(approveCid) && !after.includes(denyCid), 'Real authorized approval changes RPC pin state while actual denial leaves its target unpinned')
    if (disconnect) {
      await send(page, 'Use pin_ls to inspect current pins without changes.')
      try { await expect(page.getByRole('button', { name: 'Stop run', exact: true })).toBeVisible({ timeout: 10000 }) }
      catch { throw new Blocked('Actual model request did not remain pending long enough for transport loss; Claude lease has no delay control to make this negative reproducible') }
      await session.context.setOffline(true)
      await expect(page.getByRole('button', { name: 'Stop run', exact: true })).toHaveCount(0, { timeout: 120000 })
      await page.getByRole('button', { name: 'Inspect run' }).click()
      await expect(page.getByText('Outcome unknown', { exact: true })).toBeVisible()
      await session.context.setOffline(false)
      const cancelled = await pins(lease.api)
      ctx.assert(JSON.stringify(cancelled) === JSON.stringify(after), 'Disconnecting an observed pending real read stream reports unknown and creates no extra write effects')
    }
    const completedRecords = await protectedDecisions(lease, new URL(session.baseURL).origin)
    const completed = completedRecords.find(record => record.id === pendingRecord?.id && targetsCid(record, approveCid))
    const receipt = completed?.execution?.receipt
    if (!resumedFromActivity || !completed?.activity_id || completed.activity_id !== pendingRecord.activity_id || completed.execution?.state !== 'succeeded' ||
      !receipt || receipt.outcome !== 'succeeded' || receipt.decision_id !== completed.id || receipt.tool !== completed.summary.tool || receipt.effect_digest !== completed.effect_digest) {
      await ctx.record(`${mode}-actual-partial-flow`, { mode, fixtureCids: [approveCid, denyCid], before, after, resumedFromActivity, activityReported: Boolean(completed?.activity_id), successfulMatchingReceiptReported: Boolean(receipt && receipt.outcome === 'succeeded'), note: 'RPC effects alone do not satisfy Activity continuity or successful receipt oracle.' })
      throw new Blocked('Actual backend omitted a resumable owned Activity or matching successful receipt; real read/approval/denial/RPC effects were attempted but do not satisfy the complete oracle')
    }
    await page.locator('a[href="#/activity"]').first().click()
    await expect(page.getByText(completed.activity_id, { exact: true })).toBeVisible()
    const successCard = page.locator('.activity-group li').filter({ hasText: approveCid }).first()
    await expect(successCard.locator('[data-phase="committed"]')).toBeVisible()
    await expect(successCard.locator('summary', { hasText: 'View receipt' })).toBeVisible()
    await ctx.record(`${mode}-actual-activity-receipt`, { activityId: completed.activity_id, decisionId: completed.id, receipt, resumedFromActivity })
    await ctx.screenshot(page, `${mode}-real-read-approve-deny`)
    await ctx.record(`${mode}-real-flow`, { kind: 'real-backend-production-webui-rpc', mode, leaseId: lease.descriptor.lease_id, configFingerprint: lease.descriptor.config_fingerprint, fixtureCids: [approveCid, denyCid], before, after, context, disconnect, trace: 'omitted', credentials: 'omitted' })
  } finally { try { await session?.close() } finally { await lease.close() } }
}
