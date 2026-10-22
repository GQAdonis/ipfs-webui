import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import filesCopy from '../../../../public/locales/en/files.json'
import appCopy from '../../../../public/locales/en/app.json'
import { PinningModal } from './PinningModal.js'

i18n.use(ICU).use(initReactI18next).init({ lng: 'en', fallbackLng: 'en', resources: { en: { files: filesCopy, app: appCopy } }, react: { useSuspense: false } })
const t = (key, options) => i18n.t(key, { ns: 'files', ...options })
const show = ({ pinned = true, previousRemote = ['Vault', 'Archive'] } = {}) => {
  const file = { cid: 'bafkqac3imvwgy3zao5xxe3de', name: 'notes.txt', pinned }
  const onPinningSet = vi.fn(), onCancel = vi.fn()
  render(<PinningModal t={t} tReady file={file} onPinningSet={onPinningSet} onCancel={onCancel}
    pinningServices={[{ name: 'Vault' }, { name: 'Archive' }]} remotePins={[]} notRemotePins={[]} pendingPins={[]}
    doSelectRemotePinsForFile={() => previousRemote} doFetchPinningServices={vi.fn()} doFetchRemotePins={vi.fn()} doGetFileSizeThroughCid={async () => 0} />)
  return { file, onPinningSet, onCancel, previousRemote }
}
const choose = name => fireEvent.click(screen.getByRole('button', { name }))
const apply = () => choose(appCopy.actions.apply)

describe('pin-location confirmation keeps remote requests separate from local pin and MFS changes', () => {
  it('names only the removed remote service and preserves the selected local pin and other remote service', () => {
    const { file, onPinningSet, previousRemote } = show()
    choose('Vault')
    expect(screen.getByText(filesCopy.pinningModal.remoteOnlyRemoval)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.pinningModal.remoteRemoval)).toHaveTextContent('Deletion or retention at a service is not guaranteed')
    expect(screen.getByRole('list')).toHaveTextContent('Vault')
    expect(screen.getByRole('list')).not.toHaveTextContent('Archive')
    expect(screen.queryByText(filesCopy.pinningModal.localRemoval)).toBeNull()
    expect(onPinningSet).not.toHaveBeenCalled()
    apply()
    expect(onPinningSet).toHaveBeenCalledExactlyOnceWith(file, ['Archive', 'local'], true, previousRemote)
  })
  it('describes a local unpin without asserting remote removal or immediate block deletion', () => {
    const { file, onPinningSet, previousRemote } = show({ previousRemote: ['Vault'] })
    choose(filesCopy.pinningModal.localNode)
    expect(screen.getByText(filesCopy.pinningModal.localRemoval)).toHaveTextContent('MFS')
    expect(screen.getByText(filesCopy.pinningModal.retentionHelp)).toHaveTextContent('Unpinning is not block deletion')
    expect(screen.queryByText(filesCopy.pinningModal.remoteRemoval)).toBeNull()
    apply()
    expect(onPinningSet).toHaveBeenCalledExactlyOnceWith(file, ['Vault'], true, previousRemote)
  })
  it('shows both scopes for a mixed local and named remote unpin without claiming network deletion', () => {
    const { file, onPinningSet, previousRemote } = show({ previousRemote: ['Vault'] })
    choose(filesCopy.pinningModal.localNode)
    choose('Vault')
    expect(screen.getByText(filesCopy.pinningModal.localRemoval)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.pinningModal.remoteRemoval)).toBeInTheDocument()
    expect(screen.queryByText(filesCopy.pinningModal.remoteOnlyRemoval)).toBeNull()
    apply()
    expect(onPinningSet).toHaveBeenCalledExactlyOnceWith(file, [], true, previousRemote)
  })
  it('keeps an added local pin separate from a removed remote pin', () => {
    const { file, onPinningSet, previousRemote } = show({ pinned: false, previousRemote: ['Vault'] })
    choose(filesCopy.pinningModal.localNode)
    choose('Vault')
    expect(screen.getByText(filesCopy.pinningModal.localAddition)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.pinningModal.remoteRemoval)).toBeInTheDocument()
    expect(screen.queryByText(filesCopy.pinningModal.remoteOnlyRemoval)).toBeNull()
    apply()
    expect(onPinningSet).toHaveBeenCalledExactlyOnceWith(file, [false, 'local'], false, previousRemote)
  })
  it('discloses missing local state instead of claiming it is unchanged and never applies on cancel', () => {
    const { onPinningSet, onCancel } = show({ pinned: null, previousRemote: ['Vault'] })
    choose('Vault')
    expect(screen.getByText(filesCopy.pinningModal.localUnknown)).toBeInTheDocument()
    expect(screen.queryByText(filesCopy.pinningModal.remoteOnlyRemoval)).toBeNull()
    choose(appCopy.actions.cancel)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onPinningSet).not.toHaveBeenCalled()
  })
})
