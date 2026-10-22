import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AgentChat, ChatComposer, createAguiClient, createChatController } from '@gqadonis/ipfs-agent-chat/react'
import { UiScope } from '@gqadonis/ipfs-mcp-ui'
import { Workspace } from './Workspace.jsx'
import { Home } from './Home.jsx'
import { PhoneNavigation } from './PhoneNavigation.jsx'
import { ComposedChat } from '../agent-chat/ComposedChat.jsx'
import { createPageReferenceAdapter } from '../agent-chat/page-reference.js'
import { usePresentationPolicy } from '../agent-chat/use-presentation-policy.js'
import { getConnectionStore } from '../agent-chat/connection-store.js'
import { useTheme } from '../promethity/use-theme.js'
import { useSearchAvailability } from '../search/use-availability.js'
import { useSearchSettings } from '../search/use-search-settings.js'
import { submitGo } from './go-navigation.js'
import { composerShortcut } from './layout-keyboard.js'
import { searchHandoff } from './search-handoff.js'
import './praxis.css'

function connectionFor (store) {
  const state = store.getSnapshot()
  const capture = state.chatEnabled ? store.capture() : null
  return { generation: state.generation, signal: capture?.signal, client: capture ? createAguiClient({ endpoint: new URL(capture.endpoint), getToken: capture.getToken, session: capture.session }) : null }
}

function ComposerView ({ controller, theme, blockedReason, memory }) {
  const node = useRef(null)
  useLayoutEffect(() => {
    const field = node.current?.querySelector('textarea')
    if (field && memory.current.focused) {
      field.focus({ preventScroll: true })
      field.setSelectionRange(memory.current.start, memory.current.end)
      memory.current.focused = false
    }
    return () => {
      if (field && field.getRootNode().activeElement === field) memory.current = { focused: true, start: field.selectionStart, end: field.selectionEnd }
    }
  }, [memory])
  const rememberSelection = event => {
    if (event.target.tagName === 'TEXTAREA') { memory.current.start = event.target.selectionStart; memory.current.end = event.target.selectionEnd }
  }
  return <UiScope theme={theme} injectStyles={false}><div ref={node} className='praxis-composer' onSelect={rememberSelection} onKeyUp={rememberSelection}
    onFocusCapture={event => { if (event.target.tagName === 'TEXTAREA') memory.current.focused = true }}
    onBlurCapture={event => { rememberSelection(event); memory.current.focused = false }}><ChatComposer controller={controller} blockedReason={blockedReason} /></div></UiScope>
}

/** Single application lifetime, independent of route and pane mounts. No transcript persistence. */
export function PraxisWorkspace ({ route, navigate, browse, ipfsReady, header, navigator, application, applicationClassName, decisions = null, canvas = null, decisionCallbacks, connectionStore, presentationPolicy }) {
  const [store] = useState(() => connectionStore ?? getConnectionStore())
  const { policy, preferences } = usePresentationPolicy(presentationPolicy)
  const connection = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const search = useSearchAvailability()
  const { enabled: searchEnabled } = useSearchSettings()
  const { resolvedTheme: theme } = useTheme()
  const current = useRef(null)
  current.current = { ipfsReady, navigate, browse, search, searchEnabled, connection, decisionCallbacks }
  const [controller] = useState(() => createChatController({
    connection: connectionFor(store),
    ...(decisionCallbacks?.getDecisionContext && { getDecisionContext: (...args) => current.current.decisionCallbacks?.getDecisionContext(...args) }),
    ...(decisionCallbacks?.readDecision && { readDecision: (...args) => current.current.decisionCallbacks.readDecision(...args) }),
    ...(decisionCallbacks?.onDecisionInvalidated && { onDecisionInvalidated: (...args) => current.current.decisionCallbacks?.onDecisionInvalidated?.(...args) }),
    onGo: ({ text }, lifetime) => lifetime.generation !== store.getSnapshot().generation ? { accepted: false } : submitGo(text, current.current, lifetime),
    onSearch: ({ text }, lifetime) => {
      const host = current.current
      if (lifetime.generation !== store.getSnapshot().generation || !lifetime.isCurrent() || !host.searchEnabled || host.search.phase !== 'available' ||
        host.connection.status !== 'ready' || (host.search.generation && host.search.generation !== host.connection.generation)) return { accepted: false }
      if (!searchHandoff.offer(text, host.connection.generation)) return { accepted: false }
      if (!lifetime.isCurrent()) { searchHandoff.clear(); return { accepted: false } }
      try { host.navigate('/search'); return { accepted: true } } catch { searchHandoff.clear(); return { accepted: false } }
    }
  }))
  const [pageReferences] = useState(() => createPageReferenceAdapter({ controller }))
  const currentRoute = useRef(route)
  currentRoute.current = route
  useLayoutEffect(() => {
    const sync = () => {
      const selected = policy.getSnapshot()
      controller.setA2uiEnabled(selected.a2ui)
      controller.setRunFactsEnabled(selected.runFacts)
      pageReferences.update({ route: currentRoute.current, enabled: selected.contextReferences })
    }
    sync()
    return policy.subscribe(sync)
  }, [controller, policy, pageReferences])
  useLayoutEffect(() => { pageReferences.update({ route, enabled: policy.getSnapshot().contextReferences }) }, [pageReferences, policy, route])
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const connectedSnapshot = useRef(connection)
  useLayoutEffect(() => {
    if (connectedSnapshot.current === connection) return
    connectedSnapshot.current = connection
    controller.updateConnection(connectionFor(store))
    searchHandoff.retire(connection.generation)
  }, [controller, store, connection])
  // StrictMode replays effects: final disposal waits until a replacement setup can claim ownership.
  const owner = useRef(0)
  useEffect(() => {
    const ticket = ++owner.current
    return () => { controller.stop(); queueMicrotask(() => { if (owner.current === ticket) { controller.dispose(); searchHandoff.clear() } }) }
  }, [controller])
  const [layoutRequest, setLayoutRequest] = useState(null)
  const open = () => { memory.current.focused = true; focusComposer.current = true; setLayoutRequest({ action: { type: 'mode', mode: 'conversation' } }) }
  const focusComposer = useRef(false)
  useEffect(() => {
    const key = event => {
      if (!composerShortcut(event, document)) return
      event.preventDefault()
      focusComposer.current = true
      open()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])
  const previousRoute = useRef(route)
  useEffect(() => {
    if (!searchEnabled || (previousRoute.current === '/search' && route !== '/search')) searchHandoff.clear()
    previousRoute.current = route
  }, [route, searchEnabled])
  const wasRunning = useRef(false)
  useEffect(() => {
    if (snapshot.running && !wasRunning.current) open()
    wasRunning.current = snapshot.running
  }, [snapshot.running])
  const memory = useRef({ focused: false, start: 0, end: 0 })
  const home = route === '/' || route === ''
  const status = !connection.chatEnabled ? 'Off' : ({ ready: 'Connection configured', resolving: 'Checking connection', 'no-endpoint': 'Not configured', 'no-token': 'Needs token', 'signing-out': 'Signing out', 'session-expired': 'Sign in again', disposed: 'Disconnected', 'origin-blocked': 'Agent actions unavailable on this origin' }[connection.status])
  const readiness = connection.status === 'ready' && connection.chatEnabled ? { state: 'ready' }
    : ['resolving', 'signing-out', 'session-expired', 'no-token'].includes(connection.status) ? { state: connection.status }
      : { state: 'no-endpoint', reason: connection.status === 'origin-blocked' ? 'Use an isolated or dedicated configured agent origin. Ordinary IPFS navigation remains available.' : connection.chatEnabled ? 'Choose a connection in Settings.' : 'Agent chat is off in Settings.' }
  const blockedReason = snapshot.intent === 'search' && (!searchEnabled || search.phase !== 'available') ? (searchEnabled ? 'Indexed search is not available on this connection.' : 'Indexed search is off in Settings.')
    : snapshot.intent === 'ask' && (!connection.chatEnabled || connection.status !== 'ready') ? status : undefined
  const homeOwns = layout => home && layout.mode === 'application' && layout.pane !== 'full'
  const projectionScope = { controller, generation: connection.generation, presentation: preferences }
  const composer = <ComposerView controller={controller} theme={theme} blockedReason={blockedReason} memory={memory} />
  return <div className='praxis-shell'>
    <Workspace route={home ? 'home' : route.split('/')[1]} navigator={navigator} layoutRequest={layoutRequest}
      header={<>{header}<div className='praxis-assistant-entry'><button type='button' onClick={open}>Open conversation <kbd>⌘ / Ctrl K</kbd></button><span>{status}</span></div></>}
      applicationClassName={applicationClassName} applicationInCanvas={canvas === null}
      application={layout => home ? <Home controller={controller} composer={homeOwns(layout) ? <ComposedChat>{composer}</ComposedChat> : null} assistantStatus={status} ipfsReady={ipfsReady} decisions={typeof decisions === 'function' ? decisions(projectionScope) : decisions} /> : typeof application === 'function' ? application(projectionScope) : application}
      conversation={layout => <ComposedChat className='praxis-conversation'><AgentChat controller={controller} open={layout.pane !== 'closed'} theme={theme} readiness={readiness} showComposer={false}
        onOpenChange={value => { if (!value) layout.updateLayout({ type: 'pane', pane: 'closed' }) }} />
        {!homeOwns(layout) ? composer : null}
        <FocusRequest requested={focusComposer} open={layout.pane !== 'closed'} />
      </ComposedChat>}
      canvas={typeof canvas === 'function' ? canvas(projectionScope) : canvas} />
    <PhoneNavigation route={route} theme={theme} />
  </div>
}

function FocusRequest ({ requested, open }) {
  const anchor = useRef(null)
  useLayoutEffect(() => {
    if (!open || !requested.current) return
    const field = anchor.current?.getRootNode().querySelector('textarea:not([disabled])')
    if (field) { field.focus({ preventScroll: true }); requested.current = false }
  })
  return <span ref={anchor} />
}
