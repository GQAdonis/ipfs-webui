// B1, M1 and M2 of the group 3 UI review: what the buttons do, what a 401 from the RPC does, and what an
// ended sign-in does to the chat. Navigation is mocked at the session module's two actions.

import React from 'react'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import agentChatEn from '../../public/locales/en/agentChat.json'
import { AgentChatLauncher, SessionBanner, SessionPanel } from './index.js'
import { enterSession, markSessionExpired, reportUnauthorized, resetSessionForTests, getSession } from './session.js'
import { resetForTests as resetChat, updateSettings } from './settings-store.js'
import { perform } from '../bundles/task.js'

const mockSignOut = jest.fn()
const mockSignIn = jest.fn()
jest.mock('./session.js', () => ({ ...jest.requireActual('./session.js'), signOut: (...a) => mockSignOut(...a), signInAgain: (...a) => mockSignIn(...a) }))

i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['agentChat', 'app'],
  defaultNS: 'agentChat',
  resources: { en: { agentChat: agentChatEn, app: {} } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

const REPORT = { principals: [{ name: 'operator', kind: 'admin' }], email: 'ada@example.org', exp: 1900000000, admin: 'step_up_required' }

beforeEach(() => {
  localStorage.clear()
  resetSessionForTests()
  resetChat()
  mockSignOut.mockClear()
  mockSignIn.mockClear()
})
afterEach(() => {
  cleanup()
  document.querySelectorAll('ipfs-agent-chat').forEach((el) => el.remove())
})

describe('B1 step-up primary action', () => {
  it('navigates to /oauth2/logout (a sign-out), and a reload is not offered', () => {
    enterSession(REPORT)
    render(<SessionPanel phase='step-up' />)
    expect(screen.queryByRole('button', { name: 'Sign in again' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Sign out and verify again' }))
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(mockSignIn).not.toHaveBeenCalled()
    expect(screen.getByText(/sign out there too/)).toBeInTheDocument()
  })

  it('an ended sign-in still offers Sign in again as the reload', () => {
    enterSession({ ...REPORT, admin: 'ok' })
    act(() => { markSessionExpired() })
    render(<SessionPanel phase='unauthorized' />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in again' }))
    expect(mockSignIn).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('the banner is the only live announcement of an ended sign-in', () => {
    enterSession({ ...REPORT, admin: 'ok' })
    render(<><SessionBanner /><SessionPanel phase='unauthorized' /></>)
    act(() => { markSessionExpired() })
    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })
})

describe('M1 a 401 from the RPC', () => {
  const unauthorized = Object.assign(new Error('HTTPError'), { response: { status: 401 } })

  it('marks the session expired in session mode, from a failed task and from reportUnauthorized', async () => {
    enterSession({ ...REPORT, admin: 'ok' })
    const dispatch = jest.fn()
    await expect(perform('X', async () => { throw unauthorized })({ dispatch })).rejects.toBe(unauthorized)
    expect(getSession().expired).toBe(true)
  })

  it('ignores other failures in session mode', async () => {
    enterSession({ ...REPORT, admin: 'ok' })
    reportUnauthorized(Object.assign(new Error('x'), { response: { status: 500 } }))
    reportUnauthorized(new Error('network'))
    reportUnauthorized(undefined)
    expect(getSession().expired).toBe(false)
  })

  it('does nothing in token mode (no session)', async () => {
    const dispatch = jest.fn()
    await expect(perform('X', async () => { throw unauthorized })({ dispatch })).rejects.toBe(unauthorized)
    expect(getSession()).toBeUndefined()
  })
})

describe('M2 an ended sign-in and the chat', () => {
  class StubChat extends HTMLElement {
    get token () { return undefined }
    set token (v) {}
    get session () { return false }
    set session (v) {}
    toggle () {}
  }
  const chat = () => document.querySelectorAll('ipfs-agent-chat')

  it('takes the chat and its launcher away, so nothing covers the Sign in again bar', async () => {
    if (!customElements.get('ipfs-agent-chat')) customElements.define('ipfs-agent-chat', StubChat)
    enterSession({ ...REPORT, admin: 'ok' })
    updateSettings({ enabled: true })
    render(<><SessionBanner /><AgentChatLauncher loadIsland={async () => {}} /></>)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Agent chat' })) })
    expect(chat()).toHaveLength(1)

    act(() => { markSessionExpired() })
    expect(chat()).toHaveLength(0)
    expect(screen.queryByRole('button', { name: 'Agent chat' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Sign in again' })).toBeInTheDocument()
  })

  it('leaves the launcher alone while the sign-in is good', () => {
    enterSession({ ...REPORT, admin: 'ok' })
    updateSettings({ enabled: true })
    render(<AgentChatLauncher loadIsland={async () => {}} />)
    expect(screen.getByRole('button', { name: 'Agent chat' })).toBeInTheDocument()
  })
})
