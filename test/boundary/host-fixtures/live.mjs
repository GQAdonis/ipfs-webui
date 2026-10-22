import { expect } from '@playwright/test'
import { hostFixture } from './browser.mjs'
import { startDecisionLease } from '../accessibility/decisions/lease.mjs'
import { Blocked } from '../processes.mjs'

/** Real protected ingress + current host-owned adapter/controller + trusted browser activation. */
export async function decisionHost (ctx) {
  const session = await hostFixture(ctx)
  let lease, connected = false
  try {
    lease = await startDecisionLease(ctx, new URL(session.baseURL).origin)
    session.allowOrigin(lease.descriptor.agui_url)
    const control = {
      ...lease,
      async prepare (mode) {
        const prepared = await lease.prepare(mode)
        if (!connected) {
          await lease.credential.use(bearer => session.page.evaluate(input => window.__frontendHost.configure(input), { endpoint: lease.descriptor.agui_url, bearer, chatEnabled: true }))
          connected = true
        }
        await session.page.waitForFunction(id => window.__frontendHost.status()?.fresh && window.__frontendHost.status().ids.includes(id), prepared.decision_id)
        return prepared
      },
      async answer (prepared, approved) {
        await session.page.evaluate(id => window.__frontendHost.open(id), prepared.decision_id)
        const dialog = session.page.getByRole('dialog', { name: 'Current decision' })
        await expect(dialog).toBeVisible()
        const button = dialog.getByRole('button', { name: approved ? /^Approve/ : 'Deny', exact: !approved }).first()
        if (!await button.count()) throw new Blocked('Actual canonical protected detail offers no permitted current-surface continuation; no display observation can manufacture it')
        await expect(button).toBeEnabled({ timeout: 15000 })
        await button.click()
        await ctx.record(`trusted-browser-decision-${prepared.case_id}`, { decisionId: prepared.decision_id, choice: approved ? 'approve' : 'deny', ingress: 'fresh authenticated feed/detail', transport: 'existing typed AGUI controller continuation', activation: 'actual Playwright browser input; no native presence claim' })
      }
    }
    return { ...session, lease: control, async close () { try { await session.close() } finally { await lease.close() } } }
  } catch (error) { try { await session.close() } finally { await lease?.close() } throw error }
}
