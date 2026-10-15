// webui-vector-search 1.6 (review H1): the Search off switch is a control on the Agent settings
// page, next to the chat and WebMCP switches, and flipping it there takes the Search entry
// out of the navigation bar. No devtools, no direct storage write.

import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import agentSettingsEn from '../../../public/locales/en/agentSettings.json'
import agentChatEn from '../../../public/locales/en/agentChat.json'
import webmcpEn from '../../../public/locales/en/webmcp.json'
import searchEn from '../../../public/locales/en/search.json'
import { AgentSettingsPage } from './AgentSettingsPage.js'
import { NavBar } from '../../navigation/NavBar.js'
import { availabilityStore } from '../../search/availability-store.js'
import { STORAGE_KEY as SEARCH_KEY, resetForTests as resetSearch } from '../../search/settings-store.js'
import { resetForTests as resetChat, setToken, updateSettings as updateChat } from '../../agent-chat/settings-store.js'
import { resetForTests as resetWebMcp } from '../../webmcp/settings-store.js'
import { resetAdminTokenForTests, setAdminToken } from './core/admin-token.js'
import { reply, CONFIGURED } from '../../search/test-helpers.js'

jest.mock('../../components/box/Box.js', () => ({
  __esModule: true,
  default: ({ className, children }) => <section className={className}>{children}</section>
}))
jest.mock('../../components/button/button.tsx', () => ({
  __esModule: true,
  default: ({ buttonType, children, minWidth, ...rest }) => <button type={buttonType} {...rest}>{children}</button>
}))
jest.mock('../../promethity/brand-wordmark.js', () => ({ __esModule: true, default: () => null }))
jest.mock('../../promethity/brand-p-icon.js', () => ({ __esModule: true, default: () => null }))

i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['agentSettings', 'agentChat', 'webmcp', 'search', 'app'],
  defaultNS: 'agentSettings',
  resources: { en: { agentSettings: agentSettingsEn, agentChat: agentChatEn, webmcp: webmcpEn, search: searchEn, app: {} } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

const client = () => ({
  get: jest.fn(async () => ({ revision: 'r', backend: null, system_prompt: { safety_prefix: 'p', custom: '' } })),
  set: jest.fn(),
  testConnection: jest.fn(),
  setApiKey: jest.fn(),
  clearApiKey: jest.fn(),
  status: jest.fn(async () => ({ transport: 'http', managed_by_desktop: false })),
  onChange: jest.fn(() => () => {})
})

let fetchMock
beforeEach(() => {
  localStorage.clear()
  resetChat()
  resetWebMcp()
  resetSearch()
  resetAdminTokenForTests()
  setAdminToken(undefined)
  availabilityStore.resetForTests()
  fetchMock = jest.fn(async () => reply(200, CONFIGURED))
  globalThis.fetch = fetchMock
  updateChat({ enabled: true, endpoint: 'http://127.0.0.1:5050/agui' })
  setToken('tok-1')
  globalThis.location.hash = '#/settings/agent'
})
afterEach(() => {
  cleanup()
  delete globalThis.fetch
})

const searchCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).includes('/index/'))

describe('Search switch on Agent settings', () => {
  it('is a switch in Features, on by default, next to the chat and WebMCP switches', async () => {
    render(<AgentSettingsPage client={client()} />)
    const toggle = await screen.findByRole('switch', { name: 'Search your files' })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(document.querySelector('[data-id="AgentSettingsFeatures"] [data-id="SearchSettings"]')).not.toBeNull()
    expect(screen.getByRole('switch', { name: 'Enable agent chat' })).toBeInTheDocument()
  })

  it('turning it off hides the Search entry, stores false and stops the requests', async () => {
    render(
      <>
        <NavBar t={(key) => key} />
        <AgentSettingsPage client={client()} />
      </>
    )
    await waitFor(() => expect(document.querySelector('a[href="#/search"]')).not.toBeNull())
    fireEvent.click(await screen.findByRole('switch', { name: 'Search your files' }))
    await waitFor(() => expect(document.querySelector('a[href="#/search"]')).toBeNull())
    expect(JSON.parse(localStorage.getItem(SEARCH_KEY))).toEqual({ enabled: false })
    const before = searchCalls().length
    // Nothing more is requested while it is off.
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(searchCalls()).toHaveLength(before)
    fireEvent.click(screen.getByRole('switch', { name: 'Search your files' }))
    await waitFor(() => expect(document.querySelector('a[href="#/search"]')).not.toBeNull())
  })
})
