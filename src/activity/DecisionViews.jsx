import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ApprovalCard, Badge, Button, Dialog, DialogContent, Notice, UiScope, decisionProjectionFromObservation, phaseCopy } from '@gqadonis/ipfs-mcp-ui'
import '@gqadonis/ipfs-mcp-ui/styles.css'
import { useTheme } from '../promethity/use-theme.js'
import { useDecisionFeed, useDecisionRows } from './DecisionFeedProvider.jsx'
import { groupDecisionActivity, projectDecisionRows, selectInboxRows } from './decision-display.js'
import './activity.css'

function useClock (observations, retryAt) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const times = observations.flatMap(record => [record.approval_state === 'pending' ? Date.parse(record.expires_at) : NaN,
      record.execution?.started_at ? Date.parse(record.execution.started_at) + 30001 : record.resolved_at ? Date.parse(record.resolved_at) + 30001 : NaN])
    if (Number.isFinite(retryAt)) times.push(retryAt)
    const next = Math.min(...times.filter(time => Number.isFinite(time) && time > now))
    if (!Number.isFinite(next)) return
    const timer = setTimeout(() => setNow(Date.now()), Math.min(2147483647, Math.max(1, next - Date.now() + 1)))
    return () => clearTimeout(timer)
  }, [observations, retryAt, now])
  return now
}
function readableDate (value) { return Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString() : 'Not reported' }
const blocked = feed => !feed.fresh || feed.status !== 'ready'
const nativeDialogs = () => typeof globalThis.document?.createElement('dialog').showModal === 'function'

export function FeedStatus ({ feed, now }) {
  const words = {
    idle: ['Loading decisions', 'The current authenticated read connection is being prepared.'],
    connecting: ['Connecting to decisions', 'Waiting for the protected subscription before loading observations.'],
    loading: ['Refreshing observations', 'Actions stay unavailable until reconciliation finishes.'],
    reconnecting: ['Reconnecting', 'Previously validated observations may be stale. Actions stay unavailable until a fresh snapshot is reconciled.'],
    'rate-limited': ['Waiting for the node', 'The subscription limit was reached. The node’s Retry-After hold is respected.'],
    unauthenticated: ['Decision reads need authorization', 'The credential or decisions route grant was not accepted. This does not by itself mean your console sign-in ended.'],
    forbidden: ['Decision reads are not permitted', 'This identity or page cannot read the decision surface. No extra authority has been granted.'],
    unavailable: ['Decision history unavailable', 'The server does not expose this read surface. Existing confirmation and system prompts remain authoritative.'],
    error: ['Decision observations could not be read', 'The read failed or could not be validated. No operation was retried.'],
    disabled: ['Decision display is off', 'No decision stream or snapshot is active for this view.'],
    'origin-blocked': ['Agent actions unavailable on this origin', 'Use an isolated or dedicated configured agent origin. Shared content paths cannot offer agent approvals, including on loopback. Ordinary IPFS navigation remains available.'],
    'no-endpoint': ['Decision connection not configured', 'Choose the existing MCP connection in Agent settings.'],
    'no-token': ['A credential is needed', 'Decision reads use the existing authenticated MCP connection.'],
    resolving: ['Checking the connection', 'No decision observations have been read yet.'],
    'session-expired': ['Sign in again', 'The host reported that this console sign-in ended.'],
    'signing-out': ['Signing out', 'The local connection was retired and its observations cleared. Navigation may still be pending.'],
    disposed: ['Decision connection closed', 'No decision subscription is active.']
  }
  if (feed.status === 'ready') return !feed.fresh ? <Notice tone='warn' label='Some history is unavailable'>A detail could no longer be read. No missing outcome is treated as failure. Refresh to reconcile current observations.</Notice> : null
  const [label, text] = words[feed.status] ?? words.error
  const mayRefresh = !['idle', 'connecting', 'loading', 'disabled', 'signing-out', 'disposed', 'origin-blocked', 'no-endpoint', 'no-token', 'resolving', 'session-expired'].includes(feed.status)
  return <div className='decision-feed-status'><Notice tone={['error', 'forbidden', 'unauthenticated'].includes(feed.status) ? 'warn' : 'info'} label={label}>{text}</Notice>
    {mayRefresh ? <Button variant='secondary' disabled={feed.error?.retryAt > now} onClick={feed.refresh}>Refresh observations</Button> : null}
    {['no-endpoint', 'no-token', 'unauthenticated', 'forbidden'].includes(feed.status) ? <a href='#/settings/agent'>Agent connection settings</a> : null}</div>
}
export function HistoryDisclosure ({ feed }) {
  return <aside className='decision-history' aria-label='Decision history limits'>
    <p>These are decision observations, not durable chat history. Missing or evicted outcomes are unavailable history, not evidence of failure.</p>
    {feed.retention ? <p>The server retains at most 200 resolved records globally for up to seven days, whichever limit is reached first. This is not a per-identity allowance. Live requests use their existing server limits.</p> : <p>Current server retention has not been reported.</p>}
    {feed.historyStartedAt ? <p>History started: <time dateTime={feed.historyStartedAt}>{readableDate(feed.historyStartedAt)}</time>. History resets on server restart.</p> : null}
    {feed.historyUnavailable ? <p>Some earlier history became unavailable or the server epoch changed. Earlier handles are not made resumable by this view.</p> : null}
    {feed.truncated || feed.hasMore ? <p>This is a partial loaded view. More retained observations may exist. Loaded counts are not a full current-identity count.</p> : null}
  </aside>
}
function useProjected (adapter) {
  const feed = useDecisionFeed(), observations = useDecisionRows()
  const now = useClock(observations, feed.error?.retryAt)
  const rows = useMemo(() => projectDecisionRows(observations, { nowIso: new Date(now).toISOString(), surface: adapter.surface }), [observations, now, adapter])
  return { feed, rows, now }
}

export function HomeInbox ({ adapter, controller }) {
  const { resolvedTheme } = useTheme()
  const { feed, rows, now } = useProjected(adapter)
  const inbox = selectInboxRows(rows)
  const supported = nativeDialogs()
  return <UiScope theme={resolvedTheme} injectStyles={false} className='decision-inbox'>
    <section aria-labelledby='home-inbox-title'><div className='decision-section-heading'><h2 id='home-inbox-title'>Decisions</h2><a href='#/activity'>Open Activity</a></div>
      <FeedStatus feed={feed} now={now} />
      {feed.status === 'ready' ? <p>{inbox.pendingObserved} pending observations in loaded records.{!feed.complete ? ' This is not a complete current-identity count.' : ''}</p> : null}
      {feed.status === 'ready' && feed.fresh && feed.complete && inbox.pendingObserved === 0 ? <p>No pending decisions were reported in the current retained snapshot.</p> : null}
      <ol className='decision-summary-list'>{inbox.rows.map(({ observation, model }) => <li key={observation.id}>
        <Badge tone={phaseCopy(model).tone}>{phaseCopy(model).word}</Badge><h3>{model.summary}</h3><p>{model.tool}</p>
        <Button variant='secondary' disabled={blocked(feed) || !supported} onClick={() => void adapter.open(observation.id)}>Review decision</Button>
      </li>)}</ol>
      {inbox.hiddenPending > 0 ? <p>{inbox.hiddenPending} more pending observations are loaded. <a href='#/activity'>Inspect them in Activity</a>.</p> : null}
      {!supported ? <p>Decision detail dialogs are unavailable in this browser. Existing native prompts are unchanged.</p> : null}
      <HistoryDisclosure feed={feed} />
    </section>
    <DecisionReview adapter={adapter} controller={controller} />
  </UiScope>
}

export function ActivityView ({ adapter, controller }) {
  const { resolvedTheme } = useTheme()
  const { feed, rows, now } = useProjected(adapter)
  const [visible, setVisible] = useState(40)
  const groups = useMemo(() => groupDecisionActivity(rows.slice(0, visible)), [rows, visible])
  const supported = nativeDialogs()
  return <UiScope theme={resolvedTheme} injectStyles={false} className='decision-activity'>
    <section aria-labelledby='activity-title'><header><h1 id='activity-title'>Activity</h1><p>Current-identity decisions and reported outcomes from the authenticated read surface.</p></header>
      <FeedStatus feed={feed} now={now} />
      {feed.status === 'ready' && feed.fresh && feed.complete && rows.length === 0 ? <p>No decision observations were reported in the current retained snapshot.</p> : null}
      {rows.length > 0 ? <p>Showing {Math.min(visible, rows.length)} of {rows.length} loaded observations.{!feed.complete ? ' More observations may exist; this is not a full count.' : ''}</p> : null}
      <HistoryDisclosure feed={feed} />
      <div className='activity-groups'>{groups.map(group => <section className='activity-group' key={group.key} aria-label={group.activityId ? `Reported Activity ${group.activityId}` : 'Activity not reported'}>
        <h2>{group.activityId ? <>Activity <code>{group.activityId}</code></> : 'Activity not reported'}</h2>
        {!group.activityId ? <p>This observation has no reported Activity identifier and is kept separate.</p> : null}
        <ol>{group.rows.map(({ observation, model }) => <li key={observation.id}>
          <p className='activity-observed-at'>Created <time dateTime={observation.created_at}>{readableDate(observation.created_at)}</time></p>
          <ApprovalCard model={model} onCheckNow={!blocked(feed) && supported ? async () => { await adapter.open(observation.id) } : undefined} />
          <Button variant='secondary' disabled={blocked(feed) || !supported} onClick={() => void adapter.open(observation.id)}>Read current detail</Button>
        </li>)}</ol>
      </section>)}</div>
      {visible < rows.length ? <Button variant='secondary' onClick={() => setVisible(count => Math.min(count + 40, rows.length))}>Show more loaded observations</Button> : null}
    </section>
    <DecisionReview adapter={adapter} controller={controller} />
  </UiScope>
}

function DecisionReview ({ adapter, controller }) {
  const state = useSyncExternalStore(adapter.subscribe, adapter.getSnapshot)
  const feed = useDecisionFeed()
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const record = state.selection?.observation
  const now = useClock(record ? [record] : [], feed.error?.retryAt)
  const context = record && adapter.getContext(record.id)
  const projection = record && decisionProjectionFromObservation(record, { nowIso: new Date(now).toISOString(), currentSurface: adapter.surface,
    ...(context && { authorization: context.authorization }), ...(state.missing && { recordMissing: true }) })
  const session = adapter.sessionFor(controller)
  const [activationRefused, setActivationRefused] = useState(false)
  useEffect(() => { setActivationRefused(false) }, [state.selection])
  let model = projection?.ok ? projection.model : undefined
  const attempt = record && snapshot.decisionActions[record.id]
  if (model) {
    const pending = model.phase === 'pending' || model.phase === 'waiting_system_prompt'
    model = { ...model, ...(pending && attempt && { phase: attempt === 'invalidated' ? 'invalidated' : 'uncertain' }), capabilities: {
      approve: !!context && snapshot.configured && !snapshot.running && !state.busy && !attempt && model.capabilities.approve,
      deny: !!context && snapshot.configured && !snapshot.running && !state.busy && !attempt && model.capabilities.deny } }
    if (state.error === 'changed' && pending) model = { ...model, phase: 'invalidated', capabilities: { approve: false, deny: false } }
  }
  const answer = async (decision, activation) => {
    if (activation?.nativeEvent?.isTrusted !== true || !state.selection || !context) throw new Error('A trusted current activation is required.')
    const result = await session.continueDecision({ observation: projection.observation, review: state.selection.review, decision, surface: adapter.surface })
    if (!result.ok) throw new Error('The continuation was not submitted from the current review.')
  }
  const proposal = async intent => {
    adapter.close()
    const result = await controller.requestFreshProposal(intent)
    if (!result.ok) throw new Error('The fresh proposal was not submitted.')
  }
  return <Dialog open={state.selectedId !== undefined} onOpenChange={open => { if (!open) adapter.close() }}>
    <DialogContent title='Current decision' description='Review the current reported operation and authority. A continuation is checked again by the server.' closeLabel='Close decision detail' className='decision-review-dialog'>
      {state.busy ? <p role='status'>Reading or continuing this decision. No new outcome is reported by this message.</p> : null}
      {activationRefused ? <Notice tone='warn' label='Not answered'>A current user activation is required. No answer was sent.</Notice> : null}
      {state.error === 'refresh-required' ? <Notice tone='warn' label='Refresh required'>The current read was stale, busy or unsuccessful. Read current detail before answering.</Notice> : null}
      {state.error === 'changed' ? <Notice tone='warn' label='Changed since review'>The current operation or binding changed. Read current detail before making a new answer.</Notice> : null}
      {state.error === 'unavailable' ? <Notice tone='warn' label='History unavailable'>The current detail could not be obtained. Missing history is not proof of operation failure.</Notice> : null}
      {state.error === 'attempted' ? <Notice tone='info' label='Continuation attempted'>Only subsequent server observations report approval and actual outcome. No write is retried automatically.</Notice> : null}
      {state.error === 'refused' ? <Notice tone='warn' label='Request not confirmed'>The current continuation was not accepted from this review. Refresh its reported status.</Notice> : null}
      {model ? <div onClickCapture={event => {
        const button = event.target.closest?.('.iu-approval__actions button')
        if (!button) return
        if (!event.nativeEvent.isTrusted) { setActivationRefused(true); event.preventDefault(); event.stopPropagation() }
      }}><ApprovalCard key={`${state.selection.generation}:${state.selection.serverEpoch}:${record.id}:${state.selection.review.record}`} model={model} focusSafeAction
        onApprove={event => answer('approve', event)} onDeny={event => answer('deny', event)}
        onCheckNow={!blocked(feed) ? async () => { await adapter.open(record.id) } : undefined}
        {...(snapshot.configured && { onAskAgain: proposal, onReviewAgain: proposal })} /></div> : !state.busy ? <p>No current decision is available to review.</p> : null}
      {record && !state.busy ? <Button variant='secondary' disabled={blocked(feed)} onClick={() => void adapter.open(record.id)}>Read current decision</Button> : null}
    </DialogContent>
  </Dialog>
}
