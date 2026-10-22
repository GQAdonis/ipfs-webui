import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import filesCopy from '../../../../public/locales/en/files.json'
import appCopy from '../../../../public/locales/en/app.json'
import { ShareModal } from './ShareModal.js'
import { SHARE_LINK_TYPE } from '../../../lib/share-link.js'

vi.mock('react-qr-code', () => ({ default: ({ value }) => <div data-testid='qr-fixture' data-value={value} /> }))
i18n.use(ICU).use(initReactI18next).init({ lng: 'en', fallbackLng: 'en', resources: { en: { files: filesCopy, app: appCopy } }, react: { useSuspense: false } })
const t = (key, options) => i18n.t(key, { ns: 'files', ...options })
const CID = 'bafkqac3imvwgy3zao5xxe3de'
let descriptor
beforeEach(() => { descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard') })
afterEach(() => { if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor); else delete navigator.clipboard })
const show = props => render(<ShareModal t={t} tReady onLeave={vi.fn()} {...props} />)

describe('content-addressed sharing copy preserves actual address behavior', () => {
  it.each([
    [SHARE_LINK_TYPE.NATIVE, `ipfs://${CID}?filename=notes.txt`, false],
    [SHARE_LINK_TYPE.LOCAL_PATH, `http://127.0.0.1:8080/ipfs/${CID}?filename=notes.txt`, false],
    [SHARE_LINK_TYPE.LOCAL_SUBDOMAIN, `http://${CID}.ipfs.localhost:8080/?filename=notes.txt`, false],
    [SHARE_LINK_TYPE.PUBLIC_PATH, `https://gateway.example/ipfs/${CID}?filename=notes.txt`, true],
    [SHARE_LINK_TYPE.PUBLIC_SUBDOMAIN, `https://${CID}.ipfs.gateway.example/?filename=notes.txt`, true]
  ])('keeps %s address/query bytes and QR eligibility unchanged while explaining privacy/availability', (type, link, qr) => {
    show({ type, link })
    const input = screen.getByRole('textbox', { name: filesCopy.shareModal.linkLabel })
    expect(input).toHaveValue(link)
    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveAttribute('aria-describedby')
    expect(Boolean(screen.queryByTestId('qr-fixture'))).toBe(qr)
    if (qr) expect(screen.getByTestId('qr-fixture')).toHaveAttribute('data-value', link)
    const summary = screen.getByText(filesCopy.shareModal.contentHelpTitle)
    fireEvent.click(summary)
    expect(summary.closest('details')).toHaveAttribute('open')
    expect(screen.getByText(filesCopy.shareModal.contentIdentity)).toHaveTextContent('IPNS name can point to changing content')
    expect(screen.getByText(filesCopy.shareModal.availability)).toHaveTextContent('does not guarantee availability')
    expect(screen.getByText(filesCopy.shareModal.accessControl)).toHaveTextContent('not a password or access-control rule')
    expect(screen.getByText(filesCopy.shareModal.encryption)).toHaveTextContent('the CID addresses encrypted bytes')
    expect(screen.getByText(filesCopy.shareModal.encryption)).toHaveTextContent('does not provide that key')
  })
  it('copies exactly the selected public/local/subdomain address, retaining the existing nested-choice reset', async () => {
    const publicLink = `https://gateway.example/ipfs/${CID}`, localLink = `http://127.0.0.1:9000/ipfs/${CID}`, subdomainLocalLink = `http://${CID}.ipfs.localhost:9000/`
    const copy = vi.fn(async () => {}), leave = vi.fn()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } })
    show({ type: SHARE_LINK_TYPE.PUBLIC_PATH, link: publicLink, localLink, subdomainLocalLink, onLeave: leave })
    fireEvent.click(screen.getByRole('checkbox', { name: filesCopy.shareModal.useLocalLink }))
    expect(screen.getByRole('textbox', { name: filesCopy.shareModal.linkLabel })).toHaveValue(localLink)
    expect(screen.queryByTestId('qr-fixture')).toBeNull()
    fireEvent.click(screen.getByRole('checkbox', { name: filesCopy.shareModal.useSubdomains }))
    fireEvent.click(screen.getByRole('button', { name: appCopy.actions.copy }))
    await waitFor(() => expect(copy).toHaveBeenCalledExactlyOnceWith(subdomainLocalLink))
    expect(leave).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('checkbox', { name: filesCopy.shareModal.useLocalLink }))
    expect(screen.getByRole('textbox', { name: filesCopy.shareModal.linkLabel })).toHaveValue(publicLink)
    fireEvent.click(screen.getByRole('checkbox', { name: filesCopy.shareModal.useLocalLink }))
    expect(screen.getByRole('checkbox', { name: filesCopy.shareModal.useSubdomains })).not.toBeChecked()
    expect(screen.getByRole('textbox', { name: filesCopy.shareModal.linkLabel })).toHaveValue(localLink)
  })
  it('offers no invented gateway when no local address exists', () => {
    const link = `ipfs://${CID}`
    show({ type: SHARE_LINK_TYPE.NATIVE, link, localLink: '', subdomainLocalLink: '' })
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('textbox', { name: filesCopy.shareModal.linkLabel })).toHaveValue(link)
  })
})
