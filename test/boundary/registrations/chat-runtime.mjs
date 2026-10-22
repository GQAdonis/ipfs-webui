import { decisionBrowser, selectDecision } from '../accessibility/decisions/browser.mjs'
import { runDecisionUnits } from '../accessibility/decisions/units.mjs'
import { runtimeCase, expectFor } from '../chat-runtime/browser.mjs'
import { focusedUnits } from '../chat-runtime/units.mjs'
import { appHostCase } from '../chat-runtime/app-host.mjs'
import { realBackend, realDecision } from '../chat-runtime/real.mjs'
import { Blocked } from '../processes.mjs'

const chat = (ctx, files, name) => focusedUnits(ctx, 'chat', files.map(file => `tests/unit/${file}.test.ts`), name)
const runtime = (id, extra) => ({ scenario: 'UI-116', id, requires: ['fixture-browser'], async run (ctx) { await runtimeCase(ctx, id); if (extra) await extra(ctx) } })
export default [
  { scenario: 'UI-103', id: 'eleven-presentations', requires: ['browser', 'daemon'], async run (ctx) {
    await runDecisionUnits(ctx)
    const session = await decisionBrowser(ctx), expect = expectFor(ctx), results = []
    try {
      ctx.assert(session.phases.length === 11, 'Actual canonical presentation enum has eleven values')
      for (const surface of session.surfaces) for (const phase of session.phases) {
        const card = await selectDecision(session.page, phase, surface, 'dark'); await expect(card).toHaveAttribute('data-phase', phase)
        const receipt = card.locator('summary', { hasText: 'View receipt' })
        ctx.assert(await receipt.count() === (phase === 'committed' ? 1 : 0), 'Only the successful-evidence presentation exposes View receipt', { surface, phase })
        results.push({ surface, phase }); await ctx.screenshot(session.page, `${surface}-${phase}`)
      }
      await ctx.record('eleven-presentations', { kind: 'supplemental-production-presentation', results })
    } finally { await session.close() }
  } },
  ...['successful-receipt-only', 'failure-and-uncertainty'].map(id => ({ scenario: 'UI-103', id, requires: ['browser', 'daemon'], run: ctx => realDecision(ctx, id) })),
  ...['digest-and-identity-binding', 'exactly-once', 'native-deny-only'].map(id => ({ scenario: 'UI-104', id, requires: ['browser', 'daemon'], async run (ctx) {
    await chat(ctx, ['reviewed', 'reviewed-session', 'session'], 'reviewed-controller-negatives')
    await realDecision(ctx, id)
  } })),
  { scenario: 'UI-106', id: 'five-a2ui-views', requires: ['fixture-browser'], async run (ctx) { await runtimeCase(ctx, 'a2ui-admission'); await appHostCase(ctx, 'five-a2ui-views'); await focusedUnits(ctx, 'app', ['tests/views.test.ts', 'tests/ui/shared-view-fixtures.test.tsx'], 'contract-derived-five-views') } },
  { scenario: 'UI-106', id: 'external-sdk-host', requires: ['fixture-browser'], async run (ctx) { await appHostCase(ctx, 'external-sdk-host'); await focusedUnits(ctx, 'app', ['tests/host/mcp-app.integration.test.tsx', 'tests/host/guarded-transport.test.ts'], 'sdk-host-transport') } },
  { scenario: 'UI-106', id: 'origin-correlation-negative', requires: ['fixture-browser'], run: ctx => appHostCase(ctx, 'origin-correlation-negative') },
  { scenario: 'UI-106', id: 'inert-fallback', requires: ['fixture-browser'], async run (ctx) { await runtimeCase(ctx, 'inert-fallback'); await focusedUnits(ctx, 'chat', ['tests/unit/a2ui-processor-gate.test.tsx'], 'raw-before-processor-negatives'); await focusedUnits(ctx, 'app', ['tests/core/result.test.ts', 'tests/host/operation-lifetime.test.tsx'], 'external-inert-lifetime') } },
  { scenario: 'UI-108', id: 'reference-removal', requires: ['fixture-browser'], async run (ctx) { await runtimeCase(ctx, 'reference-removal'); await focusedUnits(ctx, 'webui', ['src/agent-chat/page-reference.test.js'], 'actual-route-suppression'); await chat(ctx, ['context-session'], 'visible-context-wire') } },
  { scenario: 'UI-108', id: 'both-backend-context', requires: ['browser', 'daemon'], async run (ctx) { for (const mode of ['builtin', 'uar']) await realBackend(ctx, mode, { context: true }) } },
  { scenario: 'UI-108', id: 'effective-run-facts', requires: ['fixture-browser'], async run (ctx) { await runtimeCase(ctx, 'effective-run-facts'); await chat(ctx, ['run-inspector', 'run-inspector-session'], 'strict-current-run-facts') } },
  { scenario: 'UI-108', id: 'untrusted-framing', requires: ['browser', 'daemon'], async run (ctx) {
    await chat(ctx, ['context', 'context-session'], 'untrusted-reference-data')
    for (const mode of ['builtin', 'uar']) await realBackend(ctx, mode, { context: true })
    await ctx.record('remaining-real-framing-prerequisite', { status: 'BLOCKED', reason: 'Documented Claude backend lease has no server egress-disabled configuration or prompt-framing observation control; validated reference/frontend negatives and real accepted-context flows do not prove those server oracles.' })
    throw new Blocked('Real egress-disabled rejection and backend prompt-framing evidence need a Claude-owned lease capability; no such canonical control is delivered')
  } },
  ...['builtin', 'uar'].map(mode => ({ scenario: 'UI-111', id: `${mode}-read-approve-deny`, requires: ['browser', 'daemon'], run: ctx => realBackend(ctx, mode) })),
  { scenario: 'UI-111', id: 'backend-delay-disconnect-negative', requires: ['browser', 'daemon'], async run (ctx) {
    await realDecision(ctx, 'failure-and-uncertainty')
    for (const mode of ['builtin', 'uar']) await realBackend(ctx, mode, { disconnect: true })
    await ctx.record('remaining-real-delay-prerequisite', { status: 'BLOCKED', reason: 'Protected decision-handler pause/failure controls and an actual browser transport disconnect do not establish configured-model server delay behavior. The documented backend lease has no delay control.' })
    throw new Blocked('A Claude-owned backend delay control remains required; decision-handler pause and owned transport loss are separately asserted')
  } },
  runtime('authoritative-projection', ctx => focusedUnits(ctx, 'chat', ['tests/unit/assistant-adapter.test.ts', 'tests/unit/assistant-presentation.test.tsx'], 'actual-assistant-adapter-inheritance-negatives')),
  runtime('one-controlled-composer', ctx => focusedUnits(ctx, 'chat', ['tests/unit/controlled-composer.test.tsx', 'tests/unit/composed-composer.test.tsx'], 'one-controller-composer')),
  runtime('no-upload-or-execution', ctx => focusedUnits(ctx, 'chat', ['tests/unit/assistant-adapter.test.ts', 'tests/unit/assistant-presentation.test.tsx'], 'no-inherited-attachment-cloud-adapter')),
  runtime('generation-retirement', ctx => chat(ctx, ['run-inspector-session', 'context-session'], 'controller-retirement'))
]
