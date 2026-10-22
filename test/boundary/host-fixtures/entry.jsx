// Test-owned visible host. Real production components/factories; no HTTP response mocks.
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { UiScope, Dialog, DialogTrigger, DialogContent, DialogClose, registerBundledFonts, decisionProjectionFromObservation } from '@gqadonis/ipfs-mcp-ui'
import '@gqadonis/ipfs-mcp-ui/styles.css'
import { createChatController, createAguiClient } from '@gqadonis/ipfs-agent-chat/react'
import { createPresentationPolicy } from '../../../src/agent-chat/presentation-policy.js'
import { DecisionFeedProvider, DecisionProjectionScope, useDecisionFeed, useDecisionFeedApi, useDecisionRows } from '../../../src/activity/DecisionFeedProvider.jsx'
import { createInboxDecisionAdapter } from '../../../src/activity/inbox-adapter.js'
import { HomeInbox, ActivityView } from '../../../src/activity/DecisionViews.jsx'
import { setTheme } from '../../../src/promethity/theme.js'
import '../../../src/index.css'
import 'react-virtualized/styles.css'
import '../../../src/promethity/fonts.css'
import '../../../src/promethity/tokens.css'
import '../../../src/promethity/roles.css'
import '../../../src/promethity/theme-overrides.css'
import '../../../src/promethity/components.css'
import '../../../src/activity/activity.css'
let bearer; let endpoint; let lifetime = new AbortController(); let sequence = 0
let state = Object.freeze({ generation: 'fixture_0', status: 'no-endpoint', chatEnabled: false, session: false })
const listeners = new Set()
const connectionStore = {
  getSnapshot: () => state,
  subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
  capture () {
    if (state.status !== 'ready') return null
    const owner = lifetime; const facts = state
    return Object.freeze({
      ...facts,
      root: endpoint.slice(0, -5),
      signal: owner.signal,
      isCurrent: () => !owner.signal.aborted && facts === state,
      getToken: async () => owner.signal.aborted || facts !== state ? undefined : bearer
    })
  }
}
const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
let feed; let adapter; let controller; let rows = []; let summary; let hostVersion = 0
function configure (input) {
  const old = lifetime; lifetime = new AbortController()
  bearer = input?.bearer; endpoint = input?.endpoint
  state = Object.freeze({ generation: `fixture_${++sequence}`, status: endpoint && bearer ? 'ready' : 'no-endpoint', endpoint, root: endpoint?.slice(0, -5), chatEnabled: !!input?.chatEnabled, session: false })
  old.abort(); listeners.forEach(listener => listener())
  const capture = connectionStore.capture()
  controller?.updateConnection({ generation: state.generation, signal: lifetime.signal, client: capture ? createAguiClient({ endpoint: new URL(endpoint), getToken: capture.getToken }) : null })
  return state.generation
}
function Probe () {
  const current = useDecisionFeed(); const observations = useDecisionRows()
  feed = useDecisionFeedApi(); rows = observations
  summary = {
    generation: current.generation,
    epoch: current.epoch,
    status: current.status,
    revision: current.revision,
    fresh: current.fresh,
    complete: current.complete,
    truncated: current.truncated,
    hasMore: current.hasMore,
    historyUnavailable: current.historyUnavailable,
    historyStartedAt: current.historyStartedAt,
    retention: current.retention,
    ids: observations.map(row => row.id),
    entities: Object.keys(current.graph.getState().entities),
    list: current.graph.getState().lists['ipfs:current-decisions']
  }
  return <output aria-label='Observed feed status'>{current.status}: {observations.length} observed records</output>
}
function Inbox ({ activity }) {
  const currentFeed = useDecisionFeedApi()
  const [owner] = useState(() => createInboxDecisionAdapter({ feed: currentFeed, connectionStore }))
  const [chat] = useState(() => createChatController({ connection: { generation: state.generation, client: null, signal: lifetime.signal }, ...owner.callbacks }))
  adapter = owner; controller = chat
  useEffect(() => { owner.start(); return () => { owner.stop(); chat.dispose() } }, [owner, chat])
  return <DecisionProjectionScope><Probe />{activity ? <ActivityView adapter={owner} controller={chat} /> : <HomeInbox adapter={owner} controller={chat} />}</DecisionProjectionScope>
}
function Overlays ({ theme, name }) {
  return <UiScope theme={theme} paint><section aria-label={`${name} overlay host`} data-host={name}>
    <h2>{name} shared overlays</h2><Dialog><DialogTrigger>Open outer {name}</DialogTrigger>
      <DialogContent title={`Outer ${name}`} description='Source-owned outer dialog with nested modality.'><label>Outer field <input /></label>
        <Dialog><DialogTrigger>Open nested {name}</DialogTrigger><DialogContent title={`Nested ${name}`} description='Nested shared dialog on the same trusted host.'><button>Nested action</button><DialogClose>Close nested {name}</DialogClose></DialogContent></Dialog>
        <DialogClose>Close outer {name}</DialogClose></DialogContent></Dialog>
  </section></UiScope>
}
let shadow, frameRoot
function Fixture () {
  const [theme, selectTheme] = useState('dark'); const [mode, selectMode] = useState('inbox')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const node = document.getElementById('shadow-host'); shadow = node.attachShadow({ mode: 'open' })
    const frame = document.getElementById('iframe-host')
    const setup = () => { const body = frame.contentDocument.body; frameRoot = body.appendChild(frame.contentDocument.createElement('div')); setReady(true) }
    frame.addEventListener('load', setup, { once: true }); frame.srcdoc = '<!doctype html><html lang="en"><head><title>Trusted iframe host</title></head><body></body></html>'
  }, [])
  useEffect(() => {
    window.__frontendHost.theme = value => { setTheme(value); selectTheme(value) }
    window.__frontendHost.mode = selectMode
    window.__frontendHost.version = ++hostVersion
    document.documentElement.dataset.fixtureReady = 'true'
  }, [])
  return <div className='sans-serif h-100 relative'><h1>Current frontend host fixture</h1><p>Test-owned composition; authenticated reads require a real lease. This fixture does not certify native presence or backend execution.</p>
    {['inbox', 'activity'].includes(mode) ? <DecisionFeedProvider connectionStore={connectionStore} presentationPolicy={policy}><Inbox activity={mode === 'activity'} /></DecisionFeedProvider> : null}
    <div hidden={mode !== 'overlays'}><Overlays theme={theme} name='browser' /><div id='shadow-host' /><iframe id='iframe-host' title='Trusted same-owner iframe' style={{ width: '100%', height: 700 }} />
      {ready && shadow ? createPortal(<Overlays theme={theme} name='shadow' />, shadow) : null}
      {ready && frameRoot ? createPortal(<Overlays theme={theme} name='iframe' />, frameRoot) : null}
    </div>
  </div>
}
window.__frontendHost = {
  presentRows (input) {
    const records = input.map(row => { const parsed = decisionProjectionFromObservation(row); if (!parsed.ok) throw new Error('Invalid canonical presentation fixture'); return parsed.observation })
    feed.getSnapshot().graph.getState().ingestFetchedList('ipfsDecisionObservation', records.map(observation => ({ id: observation.id, data: { observation } })), { lists: [{ key: 'ipfs:current-decisions', mode: 'replace', meta: { entityType: 'ipfsDecisionObservation', total: null, hasNextPage: false, nextCursor: null } }] })
    return records.map(row => row.id)
  },
  configure,
  theme: () => {},
  mode: () => {},
  status: () => structuredClone(summary),
  observation: id => rows.find(row => row.id === id),
  projection: id => { const observation = feed.getValidated(id)?.observation; if (!observation) return undefined; const parsed = decisionProjectionFromObservation(observation, { nowIso: new Date().toISOString() }); return parsed.ok ? parsed.model : undefined },
  transportEvidence: () => ({ running: controller.getSnapshot().running, decisions: { ...controller.getSnapshot().decisionActions }, timelineItems: controller.getSnapshot().chat.messages.length }),
  refresh: () => feed.refresh(),
  read: id => feed.readDecisionResult(id).then(result => ({ kind: result.kind })),
  off: () => policy.update({ decisions: false }),
  on: () => policy.update({ decisions: true }),
  retire: () => configure(),
  rotateSameConnection: () => configure({ bearer, endpoint, chatEnabled: state.chatEnabled }),
  graphSummary: () => ({ graph: summary?.entities, total: summary?.list?.total ?? null }),
  canAuthorizeCopiedRow: id => adapter.getContext(id) !== undefined,
  open: id => adapter.open(id),
  close: () => adapter.close(),
  patchGraph: row => feed.getSnapshot().graph.getState().replaceEntity('ipfsDecisionObservation', row.id, { observation: row }),
  validated: id => feed.getValidated(id) !== undefined,
  requests: () => ({ connectionListeners: listeners.size })
}
await registerBundledFonts()
setTheme('dark')
createRoot(document.getElementById('root')).render(<Fixture />)
