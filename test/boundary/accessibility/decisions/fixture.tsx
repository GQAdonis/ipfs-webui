import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import {
  APPROVAL_PHASES, ApprovalCard, ApprovalModelSchema, ConfirmationDialog, UiScope,
  decisionModelFromObservation, registerBundledFonts,
  type ApprovalActivation, type ApprovalModel, type ApprovalPhase, type DecisionMappingOptions, type FreshProposalIntent
} from '@gqadonis/ipfs-mcp-ui'
import { OutcomeView } from '../../../../../kubo/mcp/app/src/ui/OutcomeView'
import success from '../../../../../kubo/mcp/contract/confirmation/examples/DecisionObservation/node-success.json'
import appStyles from '../../../../../kubo/mcp/app/src/app.css?inline'

type Surface = 'chat' | 'dialog' | 'app';
interface Selection { model: ApprovalModel; surface: Surface; theme: 'light' | 'dark'; ticket: number; presentationOnly: boolean; reviewedAt: number }
const mapped = decisionModelFromObservation(success)
if (!mapped.ok) throw new Error('The canonical decision fixture is invalid')
const canonical = mapped.model
function modelFor (phase: ApprovalPhase): ApprovalModel {
  const model: ApprovalModel = {
    ...canonical,
    phase,
    execution: undefined,
    evidence: 'unreported',
    requiresNativePrompt: phase === 'waiting_system_prompt',
    capabilities: { approve: phase === 'pending', deny: phase === 'pending' || phase === 'waiting_system_prompt' },
    approvalState: phase === 'pending' || phase === 'waiting_system_prompt' || phase === 'invalidated' || phase === 'needs_resubmit' ? 'pending' : phase === 'denied' || phase === 'expired' ? phase : phase === 'committed' || phase === 'failed_after_approval' || phase === 'uncertain' ? 'executed' : 'approved'
  }
  if (phase === 'committed') { model.execution = canonical.execution; model.evidence = 'valid' }
  if (phase === 'failed_after_approval') model.execution = { state: 'failed', started_at: '2026-10-20T12:00:02Z', completed_at: '2026-10-20T12:00:03Z', error: { code: 'fixture_failure', message: 'Failure after invocation; some effects may remain.' } }
  return ApprovalModelSchema.parse(model)
}
const shadowHost = document.getElementById('shadow-host')
const container = document.getElementById('fixture-root')
if (!container || !shadowHost) throw new Error('Missing isolated decision fixture roots')
const shadow = shadowHost.attachShadow({ mode: 'open' })
let select: (value: Selection) => void; let selectionSerial = 0; let loadedFonts = 0
let active: Selection | undefined
const intents: unknown[] = []
const actions = { copy: async (value: string) => { intents.push({ kind: 'copy', value }) } }
function Fixture () {
  const [state, setState] = useState<Selection>({ model: modelFor('pending'), surface: 'dialog', theme: 'dark', ticket: 0, presentationOnly: true, reviewedAt: performance.now() })
  select = setState
  const { model } = state
  const answer = (kind: string, activation: ApprovalActivation) => { intents.push({ kind, trusted: activation.isTrusted, confirmationId: model.confirmationId, effectDigest: model.effectDigest, elapsedReviewMs: performance.now() - state.reviewedAt }) }
  const proposal = (kind: string, intent: FreshProposalIntent) => { intents.push({ kind, intent }) }
  const handlers = {
    onApprove: (event: ApprovalActivation) => answer('approve', event),
    onDeny: (event: ApprovalActivation) => answer('deny', event),
    onAskAgain: (intent: FreshProposalIntent) => proposal('ask_again', intent),
    onReviewAgain: (intent: FreshProposalIntent) => proposal('review_again', intent),
    onCheckNow: () => { intents.push({ kind: 'check_now' }) }
  }
  const key = state.presentationOnly ? `${state.surface}:${state.ticket}` : `${state.surface}:${model.source}:${model.confirmationId}`
  useEffect(() => { active = state; document.documentElement.dataset.fixtureTicket = String(state.ticket); document.documentElement.dataset.fixtureReady = 'true' }, [state])
  return <>
    <style>{appStyles}</style>
    <UiScope theme={state.theme} paint actions={actions}>
      <div style={{ padding: 16, minHeight: '100vh' }} data-boundary-decision-surface={state.surface}>
        <h1>Decision presentation boundary</h1><h2>{state.surface === 'chat' ? 'Chat decision' : state.surface === 'dialog' ? 'Confirmation dialog' : 'MCP App decision'}</h2>
        {state.surface === 'chat' ? <h3>Conversation</h3> : null}
        {state.surface === 'dialog' ? <ConfirmationDialog key={key} model={model} {...handlers} /> : null}
        {state.surface === 'app'
          ? <OutcomeView key={key} outcome={{ kind: 'empty' }} handlers={{}} denied={false}
          delivery={{
            outcome: { kind: 'empty' },
            recordOnly: true,
            decision: {
              model,
              phase: model.phase,
              execution: model.execution,
              binding: { confirmationId: model.confirmationId, tool: model.tool, effectDigest: model.effectDigest, source: model.source ?? 'kubo' }
            }
          }} />
          : null}
      </div>
    </UiScope>
    {state.surface === 'chat' ? createPortal(<UiScope theme={state.theme} paint actions={actions}><div style={{ padding: 16 }}><ApprovalCard key={key} model={model} {...handlers} focusSafeAction /></div></UiScope>, shadow) : null}
  </>
}
async function start () {
  loadedFonts = await registerBundledFonts(); await document.fonts.ready
  createRoot(container as HTMLElement).render(<Fixture />);
  (window as unknown as Record<string, unknown>).__decisionBoundary = Object.freeze({
    phases: [...APPROVAL_PHASES],
    surfaces: ['chat', 'dialog', 'app'],
    model: (phase: ApprovalPhase) => structuredClone(modelFor(phase)),
    select (phase: ApprovalPhase, surface: Surface, theme: 'light' | 'dark') { const value = ++selectionSerial; select({ model: modelFor(phase), surface, theme, ticket: value, presentationOnly: true, reviewedAt: performance.now() }); return value },
    present (model: unknown, surface: Surface, theme: 'light' | 'dark') { const value = ++selectionSerial; select({ model: ApprovalModelSchema.parse(model), surface, theme, ticket: value, presentationOnly: false, reviewedAt: performance.now() }); return value },
    observe (record: unknown, options: DecisionMappingOptions, surface: Surface, theme: 'light' | 'dark') {
      const mapped = decisionModelFromObservation(record, options)
      if (!mapped.ok) throw new Error(`Actual decision observation is invalid: ${mapped.reason}`)
      const value = ++selectionSerial
      select({ model: mapped.model, surface, theme, ticket: value, presentationOnly: false, reviewedAt: performance.now() })
      return { ticket: value, model: mapped.model }
    },
    intents: () => structuredClone(intents),
    clearIntents: () => { intents.length = 0 },
    facts: () => ({ loadedFonts, fonts: [...document.fonts].map(font => ({ family: font.family, status: font.status })), presentationOnly: active?.presentationOnly })
  })
}
void start()
