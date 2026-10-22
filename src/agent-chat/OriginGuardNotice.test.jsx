import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import copy from '../../public/locales/en/agentChat.json'
import { OriginGuardNotice } from './OriginGuardNotice.js'
import { getOriginPolicy } from './origin-policy.js'

const move = href => { vi.stubGlobal('location', new URL(href)); getOriginPolicy().refresh() }
beforeEach(async () => { await i18n.use(initReactI18next).init({ lng: 'en', fallbackLng: 'en', resources: { en: { agentChat: copy } }, react: { useSuspense: false } }) })
afterEach(() => { cleanup(); vi.unstubAllGlobals(); getOriginPolicy().refresh(); localStorage.clear() })
const show = () => render(<I18nextProvider i18n={i18n}><OriginGuardNotice /></I18nextProvider>)
describe('origin guidance never manufactures a trusted destination', () => {
  it('renders no warning for an actual dedicated local page', () => {
    move('http://localhost:5001/webui/')
    const view = show()
    expect(view.container).toBeEmptyDOMElement()
  })
  it('explains shared origin danger and read navigation while refusing stored fake trust or safe links', () => {
    move('https://arbitrary-gateway.example/ipfs/bafyfixture/?trusted=true')
    localStorage.setItem('safeOrigin', 'http://localhost:5001')
    localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify({ endpoint: 'https://attacker.example/agui', trusted: true }))
    show()
    expect(screen.getByLabelText(copy.originGuard.title)).toBeInTheDocument()
    expect(screen.getByText(copy.originGuard.shared)).toHaveTextContent('including on a loopback path gateway')
    expect(screen.getByText(copy.originGuard.shared)).toHaveTextContent('Ordinary IPFS navigation and read-only browser tools remain available')
    expect(screen.getByText(copy.originGuard.destination)).toHaveTextContent('No verified alternate Web UI address is known')
    expect(screen.queryByRole('link')).toBeNull()
    expect(document.body.textContent).not.toContain('https://attacker.example')
  })
  it('does not equate subdomain separation with content trust or permission', () => {
    move('https://unknown-static.example/')
    show()
    expect(screen.getByText(copy.originGuard.unconfigured)).toBeInTheDocument()
    expect(screen.getByText(copy.originGuard.auth)).toHaveTextContent('not trusted content or permission')
    expect(screen.getByText(copy.originGuard.auth)).toHaveTextContent('Authentication, endpoint origin policy, current capabilities and required native confirmation still apply')
    act(() => move('http://localhost:5001/webui/'))
    expect(screen.queryByLabelText(copy.originGuard.title)).toBeNull()
  })
})
