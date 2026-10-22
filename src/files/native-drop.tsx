import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeFiles } from '../lib/files.js'
import type { ExtendedFile, FileStream } from './types'

export interface NativeFileItem {
  files?: File[] | FileList
  filesPromise?: Promise<ExtendedFile[]>
}

let error: string | null = null
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
const getError = () => error

export function clearDropError () {
  error = null
  listeners.forEach(listener => listener())
}

export function reportDropError (failure: unknown) {
  // Transient, bounded display text only; never persisted, retried or reported.
  error = failure instanceof Error ? failure.message.slice(0, 1024) : 'FILE_DROP_UNREADABLE'
  listeners.forEach(listener => listener())
}

export async function addNativeFiles (item: NativeFileItem, onAddFiles: (files: FileStream[]) => unknown) {
  clearDropError()
  const files = await (item.filesPromise || Promise.resolve(Array.from(item.files || [])))
  if (files.length) return onAddFiles(normalizeFiles(files))
  return undefined
}

export function FileDropErrorNotice () {
  const message = useSyncExternalStore(subscribe, getError, getError)
  const { t } = useTranslation('files')
  if (!message) return null
  return <div role='alert' className='fixed bottom-1 ph3 pv2 br2' style={{ background: 'var(--err-tint)', color: 'var(--err)', maxWidth: 'calc(100vw - 2rem)', overflowWrap: 'anywhere', left: '1rem', zIndex: 30 }}>
    <p className='ma0'>{message === 'FILE_DROP_UNREADABLE' ? t('filesImportStatus.unknownError') : message}</p>
    <a className='inline-flex items-center mt2 mr3 link' style={{ minHeight: 44 }} href='#/files'>{t('app:actions.import')}</a>
    <button className='mt2 pointer' style={{ minHeight: 44, minWidth: 44 }} onClick={clearDropError}>{t('filesImportStatus.closeDropdown')}</button>
  </div>
}
