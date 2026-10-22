import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import filesCopy from '../../../../public/locales/en/files.json'
import appCopy from '../../../../public/locales/en/app.json'
import frenchFiles from '../../../../public/locales/fr/files.json'
import { RemoveModal } from './RemoveModal.js'

i18n.use(ICU).use(initReactI18next).init({ lng: 'en', fallbackLng: 'en', resources: { en: { files: filesCopy, app: appCopy }, fr: { files: frenchFiles } }, react: { useSuspense: false } })
const t = (key, options) => i18n.t(key, { ns: 'files', ...options })
const CID = 'bafkqac3imvwgy3zao5xxe3de'
const file = pinned => ({ name: 'notes.txt', path: '/notes.txt', type: 'file', pinned, cid: { toString: () => CID } })
const show = extra => {
  const onRemove = vi.fn(), onCancel = vi.fn()
  render(<RemoveModal t={t} tReady files={[file(false)]} filesCount={1} pinningServices={[]} remotePins={[]} onRemove={onRemove} onCancel={onCancel} {...extra} />)
  return { onRemove, onCancel }
}
describe('MFS removal describes the actual selected local and remote scopes', () => {
  it('describes MFS path removal without promising immediate block deletion or irreversible network removal', () => {
    const { onRemove } = show()
    expect(screen.getByText(/Remove this file from this node’s Mutable File System/)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.removeModal.mfsRetention)).toHaveTextContent('does not immediately delete all underlying blocks')
    expect(screen.getByText(filesCopy.removeModal.mfsRetention)).toHaveTextContent('another MFS path or protected by a pin can remain')
    expect(screen.getByText(filesCopy.removeModal.localPinUnchanged)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.removeModal.remotePinsUnchanged)).toBeInTheDocument()
    expect(screen.queryByText(/permanently removed in the next scheduled cleanup/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: appCopy.actions.remove }))
    expect(onRemove).toHaveBeenCalledExactlyOnceWith({ removeLocally: false, removeRemotely: false, remoteServices: [] })
  })
  it('lists exact configured remote targets only when remote unpin is selected and leaves local pin choice independent', async () => {
    const services = [{ name: 'Vault North' }, { name: 'Archive West' }]
    const { onRemove } = show({ files: [file(true)], pinningServices: services, remotePins: [`Vault North:${CID}`] })
    const local = screen.getByRole('checkbox', { name: filesCopy.removeModal.checkboxRemoveLocalPinScope })
    const remote = await screen.findByRole('checkbox', { name: filesCopy.removeModal.checkboxUnpinFromServicesScope })
    expect(local).toBeChecked(); expect(remote).not.toBeChecked()
    expect(screen.queryByText('Vault North')).toBeNull()
    fireEvent.click(local); fireEvent.click(remote)
    expect(screen.getByText(filesCopy.removeModal.localPinUnchanged)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.removeModal.remoteServicesRequested)).toBeInTheDocument()
    expect(screen.getByText('Vault North')).toBeInTheDocument(); expect(screen.getByText('Archive West')).toBeInTheDocument()
    expect(screen.getByText(filesCopy.removeModal.remotePinHelp)).toHaveTextContent('If MFS removal succeeds')
    fireEvent.click(screen.getByRole('button', { name: appCopy.actions.remove }))
    expect(onRemove).toHaveBeenCalledExactlyOnceWith({ removeLocally: false, removeRemotely: true, remoteServices: ['Vault North', 'Archive West'] })
  })
  it('keeps a requested local unpin distinct from remote retention and sends no mutation on cancel', () => {
    const { onRemove, onCancel } = show({ files: [file(true)] })
    expect(screen.getByText(filesCopy.removeModal.localPinRequested)).toBeInTheDocument()
    expect(screen.getByText(filesCopy.removeModal.localPinHelp)).toHaveTextContent('not immediate block deletion')
    expect(screen.getByText(filesCopy.removeModal.remotePinsUnchanged)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: appCopy.actions.cancel }))
    expect(onCancel).toHaveBeenCalledTimes(1); expect(onRemove).not.toHaveBeenCalled()
  })
  it('falls back to truthful scope copy instead of retaining an obsolete translated deletion promise', () => {
    show({ files: [file(true)], t: (key, options) => i18n.t(key, { lng: 'fr', ns: 'files', ...options }) })
    expect(screen.getByText(/Remove this file from this node’s Mutable File System/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: filesCopy.removeModal.checkboxRemoveLocalPinScope })).toBeChecked()
    expect(screen.getByText(filesCopy.removeModal.mfsRetention)).toBeInTheDocument()
  })
  it('names mixed files/folders with ICU count while keeping the same action payload', () => {
    show({ files: [file(false), { ...file(false), name: 'folder', type: 'directory' }], filesCount: 1, foldersCount: 1 })
    expect(screen.getByText(/Remove these 2 items from this node’s Mutable File System/)).toBeInTheDocument()
  })
})
