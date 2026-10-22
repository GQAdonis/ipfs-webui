import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import agentChatEn from '../../../public/locales/en/agentChat.json'
import { createPresentationPolicy, PRESENTATION_STORAGE_KEY } from '../../agent-chat/presentation-policy.js'
import { PresentationPreferences } from './PresentationPreferences.js'

const copy = agentChatEn.presentation
const fields = ['decisions', 'a2ui', 'contextReferences', 'runFacts']
const defaults = { decisions: true, a2ui: true, contextReferences: true, runFacts: true }
function storageWith (saved) {
  const values = new Map(saved === undefined ? [] : [[PRESENTATION_STORAGE_KEY, JSON.stringify(saved)]])
  return { values, getItem: vi.fn(key => values.get(key) ?? null), setItem: vi.fn((key, value) => values.set(key, value)) }
}
function mount (policy, wrapper = children => children) {
  return render(<I18nextProvider i18n={i18n}>{wrapper(<PresentationPreferences policy={policy} />)}</I18nextProvider>)
}
const toggle = field => screen.getByRole('switch', { name: copy[field].label })

beforeEach(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: { default: ['en'] }, ns: ['agentChat'], defaultNS: 'agentChat',
    resources: { en: { agentChat: agentChatEn }, fr: { agentChat: { title: 'Conversation' } } },
    interpolation: { escapeValue: false }, react: { useSuspense: false }
  })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('browser-local presentation preferences', () => {
  it('provides four labelled, described, enabled switches in an accessible named section', () => {
    const policy = createPresentationPolicy({ storage: null })
    mount(policy)
    const section = screen.getByRole('region', { name: copy.title })
    expect(within(section).getByRole('heading', { level: 3, name: copy.title })).toBeInTheDocument()
    expect(within(section).getAllByRole('switch')).toHaveLength(4)
    for (const field of fields) {
      const control = toggle(field)
      expect(control).toHaveAttribute('aria-checked', 'true')
      expect(control).toHaveAccessibleDescription(copy[field].help)
      expect(control).toBeEnabled()
      expect(control).toHaveAttribute('type', 'button')
    }
  })

  it.each(fields)('applies %s immediately and persists only local booleans without an Apply request', field => {
    const storage = storageWith(), policy = createPresentationPolicy({ storage })
    const fetch = vi.fn(), serverSubmit = vi.fn(event => event.preventDefault())
    vi.stubGlobal('fetch', fetch)
    // No AgentSettingsProvider, authenticated admin client, connection or server capability required.
    mount(policy, children => <form onSubmit={serverSubmit}>{children}</form>)
    fireEvent.click(toggle(field))
    expect(toggle(field)).toHaveAttribute('aria-checked', 'false')
    expect(policy.getSnapshot()).toEqual({ ...defaults, [field]: false })
    expect(storage.setItem.mock.calls).toEqual([[PRESENTATION_STORAGE_KEY, JSON.stringify({ ...defaults, [field]: false })]])
    const row = toggle(field).closest('.pm-switch')
    expect(within(row).getByText(copy.off)).toBeInTheDocument()
    fireEvent.click(toggle(field))
    expect(toggle(field)).toHaveAttribute('aria-checked', 'true')
    expect(policy.getSnapshot()).toEqual(defaults)
    expect(within(row).getByText(copy.on)).toBeInTheDocument()
    expect(serverSubmit).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /^apply/i })).not.toBeInTheDocument()
  })

  it('restores each explicit false in a new policy/component lifetime', () => {
    const stored = { decisions: false, a2ui: false, contextReferences: false, runFacts: false }
    const storage = storageWith(stored), first = createPresentationPolicy({ storage })
    const view = mount(first)
    for (const field of fields) expect(toggle(field)).toHaveAttribute('aria-checked', 'false')
    expect(storage.setItem).not.toHaveBeenCalled()
    view.unmount()
    mount(createPresentationPolicy({ storage }))
    for (const field of fields) expect(toggle(field)).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggle('a2ui'))
    expect(JSON.parse(storage.values.get(PRESENTATION_STORAGE_KEY))).toEqual({ ...stored, a2ui: true })
    expect(toggle('decisions')).toHaveAttribute('aria-checked', 'false')
  })

  it('receives policy changes synchronously without requiring a remount or server connection', () => {
    const policy = createPresentationPolicy({ storage: null })
    mount(policy)
    const control = toggle('runFacts')
    act(() => policy.update({ runFacts: false, contextReferences: false }))
    expect(toggle('runFacts')).toBe(control)
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(toggle('contextReferences')).toHaveAttribute('aria-checked', 'false')
    expect(toggle('decisions')).toHaveAttribute('aria-checked', 'true')
  })

  it('keeps all controls usable for this page when local preference storage is blocked', () => {
    const storage = { getItem: () => { throw new Error('Storage blocked') }, setItem: () => { throw new Error('Storage blocked') } }
    const policy = createPresentationPolicy({ storage })
    mount(policy)
    for (const field of fields) {
      fireEvent.click(toggle(field))
      expect(toggle(field)).toHaveAttribute('aria-checked', 'false')
      expect(toggle(field)).toBeEnabled()
    }
    expect(policy.getSnapshot()).toEqual({ decisions: false, a2ui: false, contextReferences: false, runFacts: false })
    expect(screen.getByText(copy.localOnly)).toHaveTextContent(/storage is blocked, they last for this page only/i)
  })

  it('supports tab, Space and Enter using the actual labelled switch buttons', async () => {
    const policy = createPresentationPolicy({ storage: null }), user = userEvent.setup()
    mount(policy)
    for (const field of fields) {
      await user.tab()
      expect(toggle(field)).toHaveFocus()
      await user.keyboard(' ')
      expect(toggle(field)).toHaveAttribute('aria-checked', 'false')
      await user.keyboard('{Enter}')
      expect(toggle(field)).toHaveAttribute('aria-checked', 'true')
    }
    expect(policy.getSnapshot()).toEqual(defaults)
  })

  it('activates switches through their visible text labels', async () => {
    const policy = createPresentationPolicy({ storage: null }), user = userEvent.setup()
    mount(policy)
    await user.click(screen.getByText(copy.decisions.label))
    expect(toggle('decisions')).toHaveAttribute('aria-checked', 'false')
    expect(policy.getSnapshot().decisions).toBe(false)
  })

  it('states local scope and truthful feature-off effects without claiming server changes or grants', () => {
    mount(createPresentationPolicy({ storage: null }))
    expect(screen.getByText(copy.localOnly)).toHaveTextContent(/this Web UI origin in this browser profile/i)
    expect(screen.getByText(copy.localOnly)).toHaveTextContent(/not server settings, route permissions or approval grants/i)
    expect(toggle('decisions')).toHaveAccessibleDescription(/does not answer or cancel a server decision/i)
    expect(toggle('a2ui')).toHaveAccessibleDescription(/Plain chat and reported tool results remain available/i)
    expect(toggle('contextReferences')).toHaveAccessibleDescription(/does not read content or attach bytes/i)
    expect(toggle('runFacts')).toHaveAccessibleDescription(/does not change what the server collects or returns/i)
  })

  it('discloses server/native/independent-control/history/unpin caveats in expandable help', () => {
    mount(createPresentationPolicy({ storage: null }))
    const summary = screen.getByText(copy.helpTitle)
    expect(summary.tagName).toBe('SUMMARY')
    const details = summary.closest('details')
    expect(details).not.toHaveAttribute('open')
    fireEvent.click(summary)
    expect(details).toHaveAttribute('open')
    expect(within(details).getByText(copy.serverControls)).toHaveTextContent(/hidden local view is not proof that the server is off/i)
    expect(within(details).getByText(copy.native)).toHaveTextContent(/cannot replace a required native prompt, grant approval or disable its protection/i)
    expect(within(details).getByText(copy.independent)).toHaveTextContent(/separate controls/i)
    expect(within(details).getByText(copy.history)).toHaveTextContent(/not durable chat history/i)
    expect(within(details).getByText(copy.history)).toHaveTextContent(/unknown outcomes never authorize an automatic retry/i)
    expect(within(details).getByText(copy.unpin)).toHaveTextContent(/does not by itself delete the blocks or copies held by other nodes/i)
  })

  it('uses the existing English fallback for untranslated presentation keys in agentChat', async () => {
    await i18n.changeLanguage('fr')
    expect(i18n.language).toBe('fr')
    expect(i18n.t('title', { ns: 'agentChat' })).toBe('Conversation')
    const policy = createPresentationPolicy({ storage: null })
    mount(policy)
    expect(screen.getByRole('heading', { name: copy.title })).toBeInTheDocument()
    for (const field of fields) {
      expect(toggle(field)).toHaveAccessibleDescription(copy[field].help)
      expect(toggle(field)).toHaveAttribute('aria-checked', 'true')
    }
    fireEvent.click(toggle('contextReferences'))
    expect(toggle('contextReferences')).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByText('presentation.contextReferences.label')).not.toBeInTheDocument()
  })
})
