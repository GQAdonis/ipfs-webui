import { StrictMode } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPresentationPolicy } from '../agent-chat/presentation-policy.js'
import { PraxisWorkspace } from './PraxisWorkspace.jsx'
import { searchHandoff } from './search-handoff.js'
import { LAYOUT_STORAGE_KEY } from './layout-preferences.js'

const host = vi.hoisted(() => ({ controllers: [], availability: { phase: 'available', generation: 'owner-a', refresh: () => {} }, enabled: true, subscriptions: new Map() }))
vi.mock('@gqadonis/ipfs-agent-chat/react', async importOriginal => {
  const actual = await importOriginal()
  return { ...actual, createChatController: options => { const controller = actual.createChatController(options); let count = 0; const subscribe = controller.subscribe; controller.subscribe = fn => { count++; const off = subscribe(fn); return () => { count--; off() } }; host.subscriptions.set(controller, () => count); host.controllers.push(controller); return controller } }
})
vi.mock('../search/use-availability.js', () => ({ useSearchAvailability: () => host.availability }))
vi.mock('../search/use-search-settings.js', () => ({ useSearchSettings: () => ({ enabled: host.enabled }) }))
vi.mock('../promethity/use-theme.js', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }))
vi.mock('./PhoneNavigation.jsx', () => ({ PhoneNavigation: () => null }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }))

function connectionStore () {
  let state = Object.freeze({ generation: 'owner-a', chatEnabled: false, source: 'settings', status: 'ready', session: false, endpoint: 'http://127.0.0.1:5050/agui' })
  let lifetime = new AbortController()
  const subscribers = new Set()
  return {
    getSnapshot: () => state,
    subscribe: fn => { subscribers.add(fn); return () => subscribers.delete(fn) },
    capture: () => ({ ...state, root: 'http://127.0.0.1:5050', signal: lifetime.signal, isCurrent: () => !lifetime.signal.aborted, getToken: async () => 'fixture-token' }),
    replace () {
      const old = lifetime
      lifetime = new AbortController()
      state = Object.freeze({ ...state, generation: 'owner-b' })
      old.abort()
      subscribers.forEach(fn => fn())
    },
    subscribers
  }
}
function fields (container) {
  return [...container.querySelectorAll('.praxis-chat-host')].flatMap(node => [...(node.shadowRoot?.querySelectorAll('textarea') ?? [])])
}
function visibleField (container) {
  return fields(container).find(field => {
    const host = field.getRootNode().host
    return !host.closest('[hidden]')
  })
}
let matchMedia
beforeEach(() => {
  searchHandoff.clear()
  host.controllers = []
  host.subscriptions.clear()
  host.enabled = true
  host.availability = { phase: 'available', generation: 'owner-a', refresh: () => {} }
  localStorage.clear()
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ version: 1, mode: 'application', pane: 'closed' }))
  matchMedia = window.matchMedia
  window.matchMedia = query => ({ matches: query.includes('min-width'), addEventListener () {}, removeEventListener () {} })
})
afterEach(() => { window.matchMedia = matchMedia; localStorage.clear() })
const props = store => ({ route: '/', navigate: vi.fn(), browse: vi.fn(), ipfsReady: true, navigator: <nav>IPFS</nav>, header: null, application: <p>Files view</p>, connectionStore: store })

describe('one composed WebUI conversation', () => {
  it('moves the sole draft editor between Home and pane, retaining focus and selection and mounted transcript', async () => {
    const store = connectionStore()
    const view = render(<PraxisWorkspace {...props(store)} />)
    await waitFor(() => expect(fields(view.container)).toHaveLength(1))
    const field = visibleField(view.container)
    act(() => { host.controllers[0].setIntent('go'); host.controllers[0].setDraft('/files') })
    field.focus()
    field.setSelectionRange(1, 4)
    const pane = view.container.querySelector('.praxis-conversation').shadowRoot.querySelector('aside')
    fireEvent.click(screen.getByRole('button', { name: /Open conversation/ }))
    await waitFor(() => expect(visibleField(view.container)).not.toBe(field))
    const moved = visibleField(view.container)
    expect(fields(view.container)).toHaveLength(1)
    expect(moved.value).toBe('/files')
    expect(moved.getRootNode().activeElement).toBe(moved)
    expect(moved.selectionStart).toBe(1)
    expect(moved.selectionEnd).toBe(4)
    expect(view.container.querySelector('.praxis-conversation').shadowRoot.querySelector('aside')).toBe(pane)
    expect(host.controllers).toHaveLength(1)
  })
  it('keeps Go available with agent off and never sends Ask or executes suggestion buttons', async () => {
    const callbacks = props(connectionStore())
    const view = render(<PraxisWorkspace {...callbacks} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Files' }))
    expect(callbacks.navigate).not.toHaveBeenCalled()
    expect(host.controllers[0].getSnapshot().draft).toBe('/files')
    await act(async () => { expect((await host.controllers[0].submit()).ok).toBe(true) })
    expect(callbacks.navigate).toHaveBeenCalledTimes(1)
    expect(callbacks.navigate).toHaveBeenCalledWith('/files')
    expect(host.controllers[0].getSnapshot().draft).toBe('')
    act(() => { host.controllers[0].setIntent('ask'); host.controllers[0].setDraft('kept') })
    await act(async () => { expect((await host.controllers[0].submit()).ok).toBe(false) })
    expect(host.controllers[0].getSnapshot().draft).toBe('kept')
    expect(fields(view.container)).toHaveLength(1)
  })
  it('retires the draft on a new connection without allocating another controller', async () => {
    const store = connectionStore()
    const view = render(<PraxisWorkspace {...props(store)} />)
    act(() => host.controllers[0].setDraft('private unsent text'))
    act(() => store.replace())
    expect(host.controllers[0].getSnapshot().draft).toBe('')
    expect(host.controllers[0].getSnapshot().generation).toBe('owner-b')
    expect(host.controllers).toHaveLength(1)
    view.unmount()
    await act(async () => {})
    expect(host.controllers[0].getSnapshot().disposed).toBe(true)
    expect(store.subscribers.size).toBe(0)
  })
  it('leaves StrictMode discarded initializers unowned and disposes only the real final owner', async () => {
    const store = connectionStore()
    const view = render(<StrictMode><PraxisWorkspace {...props(store)} /></StrictMode>)
    await act(async () => {})
    const active = host.controllers.filter(controller => host.subscriptions.get(controller)() > 0)
    expect(active).toHaveLength(1)
    expect(active[0].getSnapshot().disposed).toBe(false)
    for (const discarded of host.controllers.filter(controller => controller !== active[0])) expect(host.subscriptions.get(discarded)()).toBe(0)
    view.unmount()
    await act(async () => {})
    expect(store.subscribers.size).toBe(0)
    // Discarded factories are side-effect free; only the committed controller gained subscriptions.
    expect(active[0].getSnapshot().disposed).toBe(true)
    expect(host.subscriptions.get(active[0])()).toBe(0)
  })
})

it('starts on Home with agent off on a fresh phone and leaves ordinary navigation available', async () => {
  localStorage.removeItem(LAYOUT_STORAGE_KEY)
  window.matchMedia = query => ({ matches: query.includes('max-width'), addEventListener () {}, removeEventListener () {} })
  const callbacks = props(connectionStore())
  const view = render(<PraxisWorkspace {...callbacks} />)
  expect(screen.getByRole('heading', { name: 'What would you like to do?' })).toBeVisible()
  expect(view.container.querySelector('[data-workspace-slot="conversation"]')).toHaveAttribute('hidden')
  await waitFor(() => expect(fields(view.container)).toHaveLength(1))
  act(() => { host.controllers[0].setIntent('go'); host.controllers[0].setDraft('/settings') })
  await act(async () => { await host.controllers[0].submit() })
  expect(callbacks.navigate).toHaveBeenCalledWith('/settings')
})


it('accepts one explicit current supported Search handoff with the agent off', async () => {
  const callbacks = props(connectionStore())
  render(<PraxisWorkspace {...callbacks} />)
  const controller = host.controllers[0]
  act(() => { controller.setIntent('search'); controller.setDraft('IPFS project notes') })
  await act(async () => { expect((await controller.submit()).ok).toBe(true) })
  expect(callbacks.navigate).toHaveBeenCalledTimes(1)
  expect(callbacks.navigate).toHaveBeenCalledWith('/search')
  expect(searchHandoff.getSnapshot()).toEqual({ query: 'IPFS project notes', generation: 'owner-a' })
  expect(controller.getSnapshot().draft).toBe('')
})

it.each(['denied', 'checking', 'unconfigured'])('retains unsupported Search drafts while capability is %s', async phase => {
  host.availability = { ...host.availability, phase }
  const callbacks = props(connectionStore())
  render(<PraxisWorkspace {...callbacks} />)
  const controller = host.controllers[0]
  act(() => { controller.setIntent('search'); controller.setDraft('kept query') })
  await act(async () => { expect((await controller.submit()).ok).toBe(false) })
  expect(callbacks.navigate).not.toHaveBeenCalled()
  expect(searchHandoff.getSnapshot()).toBeNull()
  expect(controller.getSnapshot().draft).toBe('kept query')
})

it('forwards the current decision ID to the host lookup without creating a second controller', async () => {
  const lookup = vi.fn(() => undefined)
  render(<PraxisWorkspace {...props(connectionStore())} decisionCallbacks={{ getDecisionContext: lookup }} />)
  const controller = host.controllers[0]
  await act(async () => { await controller.checkDecision({ generation: 'owner-a', serverEpoch: 'epoch_fixture_0001', decisionId: 'cf_pending_fixture_1', record: '{}' }) })
  expect(lookup).toHaveBeenCalledExactlyOnceWith('cf_pending_fixture_1')
  expect(host.controllers).toHaveLength(1)
})


it('applies local generated-UI, run-facts and reference policies synchronously without replacing the sole owner or draft', () => {
  const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
  const view = render(<PraxisWorkspace {...props(connectionStore())} route='/files' presentationPolicy={policy}
    application={({ presentation }) => <p data-testid='presentation-policy'>{JSON.stringify(presentation)}</p>} />)
  const controller = host.controllers[0]
  act(() => {
    controller.setDraft('Keep the ordinary draft')
    controller.setReferences([{ id: 'page_fixture', provenance: 'page', route: '/files' }])
  })
  const lifetime = controller.captureLifetime(), thread = controller.getSnapshot().threadId
  act(() => {
    policy.update({ a2ui: false, contextReferences: false, runFacts: false })
    expect(controller.getSnapshot().a2uiEnabled).toBe(false)
    expect(controller.getSnapshot().runFactsEnabled).toBe(false)
    expect(controller.getSnapshot().runInspector.events).toEqual([])
    expect(controller.getSnapshot().runInspector.facts).toBeUndefined()
    expect(controller.getSnapshot().surfaceDeliveries).toEqual({})
    expect(controller.getSnapshot().references).toEqual([])
    expect(controller.getSnapshot().draft).toBe('Keep the ordinary draft')
  })
  expect(host.controllers).toHaveLength(1)
  expect(controller.getSnapshot().threadId).toBe(thread)
  expect(lifetime.isCurrent()).toBe(true)
  expect(screen.getByTestId('presentation-policy')).toHaveTextContent('"runFacts":false')
  act(() => policy.update({ a2ui: true, contextReferences: true, runFacts: true }))
  expect(controller.getSnapshot().a2uiEnabled).toBe(true)
  expect(controller.getSnapshot().runFactsEnabled).toBe(true)
  expect(controller.getSnapshot().runInspector.events).toEqual([])
  expect(controller.getSnapshot().references).toEqual([])
  expect(controller.getSnapshot().draft).toBe('Keep the ordinary draft')
  view.unmount()
})
it('forwards only run-facts policy synchronously while retaining plain chat, generated UI and references', () => {
  const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
  render(<PraxisWorkspace {...props(connectionStore())} route='/files' presentationPolicy={policy} />)
  const controller = host.controllers[0]
  act(() => controller.setDraft('Keep this conversation'))
  const before = controller.getSnapshot(), lifetime = controller.captureLifetime()
  const setter = vi.spyOn(controller, 'setRunFactsEnabled')
  act(() => {
    policy.update({ runFacts: false })
    expect(setter).toHaveBeenCalledExactlyOnceWith(false)
    expect(controller.getSnapshot().runFactsEnabled).toBe(false)
    expect(controller.getSnapshot().a2uiEnabled).toBe(before.a2uiEnabled)
    expect(controller.getSnapshot().references).toEqual(before.references)
    expect(controller.getSnapshot().draft).toBe(before.draft)
    expect(controller.getSnapshot().threadId).toBe(before.threadId)
    expect(lifetime.isCurrent()).toBe(true)
  })
  act(() => policy.update({ runFacts: true }))
  expect(setter).toHaveBeenLastCalledWith(true)
  expect(controller.getSnapshot().runInspector.events).toEqual([])
  expect(host.controllers).toHaveLength(1)
})
it('honors a stored generated-UI off choice before first use, while Go remains available with chat off', async () => {
  const policy = createPresentationPolicy({ storage: { getItem: () => JSON.stringify({ a2ui: false, contextReferences: false, runFacts: false }), setItem () {} } })
  const callbacks = props(connectionStore())
  render(<PraxisWorkspace {...callbacks} presentationPolicy={policy} />)
  const controller = host.controllers[0]
  expect(controller.getSnapshot().a2uiEnabled).toBe(false)
  expect(controller.getSnapshot().runFactsEnabled).toBe(false)
  act(() => { controller.setIntent('go'); controller.setDraft('/files') })
  await act(async () => { expect(await controller.submit()).toEqual({ ok: true }) })
  expect(callbacks.navigate).toHaveBeenCalledExactlyOnceWith('/files')
  expect(host.controllers).toHaveLength(1)
})

it('offers a visible new page reference only on actual route changes and preserves same-route removal/off suppression', async () => {
  const policy = createPresentationPolicy({ storage: { getItem: () => null, setItem () {} } })
  const callbacks = props(connectionStore())
  const view = render(<PraxisWorkspace {...callbacks} route='/files/notes' presentationPolicy={policy} />)
  const controller = host.controllers[0]
  fireEvent.click(screen.getByRole('button', { name: /Open conversation/ }))
  await waitFor(() => expect(visibleField(view.container)).toBeDefined())
  expect(controller.getSnapshot().references).toEqual([{ id: 'page_current', provenance: 'page', route: '/files/notes', path: '/notes', path_kind: 'mfs' }])
  const root = visibleField(view.container).getRootNode()
  expect(root.querySelector('[aria-label="References for Ask"]')).toHaveTextContent('Logical MFS path: /notes')
  const remove = root.querySelector('[aria-label="Remove reference /notes"]')
  fireEvent.click(remove)
  expect(controller.getSnapshot().references).toEqual([])
  view.rerender(<PraxisWorkspace {...callbacks} route='/files/notes' presentationPolicy={policy} />)
  expect(controller.getSnapshot().references).toEqual([])
  act(() => policy.update({ contextReferences: false }))
  expect(controller.getSnapshot().contextReferencesEnabled).toBe(false)
  view.rerender(<PraxisWorkspace {...callbacks} route='/files/next' presentationPolicy={policy} />)
  expect(controller.getSnapshot().references).toEqual([])
  act(() => policy.update({ contextReferences: true }))
  expect(controller.getSnapshot().references).toEqual([])
  view.rerender(<PraxisWorkspace {...callbacks} route='/files/final' presentationPolicy={policy} />)
  expect(controller.getSnapshot().references[0].path).toBe('/final')
  expect(visibleField(view.container).getRootNode().querySelector('[aria-label="References for Ask"]')).toHaveTextContent('/final')
  act(() => { controller.setIntent('go'); controller.setDraft('/files') })
  await act(async () => { expect(await controller.submit()).toEqual({ ok: true }) })
  expect(callbacks.navigate).toHaveBeenCalledExactlyOnceWith('/files')
  expect(host.controllers).toHaveLength(1)
})
