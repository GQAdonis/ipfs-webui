import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { composeBundlesRaw } from 'redux-bundler'
import { createInstance } from 'i18next'
import ICU from 'i18next-icu'
import { I18nextProvider } from 'react-i18next'
import { CID } from 'multiformats/cid'
import { Provider } from '../../lib/react-store.js'
import createFilesBundle from '../../bundles/files/index.js'
import { ACTIONS } from '../../bundles/files/consts.js'
import FileImportStatus, { FileImportStatus as Status } from './FileImportStatus.js'
import english from '../../../public/locales/en/files.json'

const cid = CID.parse('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
const deferred = () => {
  let resolvePromise, rejectPromise
  const promise = new Promise((resolve, reject) => { resolvePromise = resolve; rejectPromise = reject })
  return { promise, resolve: resolvePromise, reject: rejectPromise }
}
const file = path => ({ path, size: 400 })
const abortError = () => new DOMException('The operator cancelled this upload', 'AbortError')

// Labelled client fixture: actual Files actions/reducer/component, deferred RPC
// transport only. This does not establish real-node cancellation or rollback.
async function fixture ({ holdCopies = [], ignoreAddAbort = false } = {}) {
  const adds = []
  const copies = []
  const committed = []
  const uploads = []
  let closing = false
  const ipfs = {
    addAll: vi.fn((files, options) => {
      const finish = deferred()
      const request = { files, options, finish, progress: amount => options.progress(amount, files[0].path) }
      adds.push(request)
      return (async function * () {
        const abort = () => { if (!ignoreAddAbort) finish.reject(abortError()) }
        options.signal?.addEventListener('abort', abort, { once: true })
        try {
          request.progress(10)
          await finish.promise
          for (const input of files) yield { path: input.path, size: input.size, cid }
        } finally { options.signal?.removeEventListener('abort', abort) }
      })()
    }),
    files: {
      cp: vi.fn(async (source, destination, options) => {
        const finish = deferred()
        const request = { source, destination, options, finish }
        copies.push(request)
        const abort = () => finish.reject(abortError())
        options?.signal?.addEventListener('abort', abort, { once: true })
        try {
          if (!closing && holdCopies.includes(destination)) await finish.promise
          committed.push(destination)
        } finally { options?.signal?.removeEventListener('abort', abort) }
      })
    }
  }
  const store = composeBundlesRaw({
    name: 'ipfs',
    getExtraArgs: () => ({ getIpfs: () => ipfs }),
    selectIpfsConnected: () => true,
    selectIpfsReady: () => true
  }, {
    name: 'routes',
    selectRouteInfo: () => ({ url: '' })
  }, createFilesBundle())()
  const refresh = vi.spyOn(store, 'doFilesFetch').mockResolvedValue(undefined)
  const i18n = createInstance()
  await i18n.use(ICU).init({ lng: 'en', fallbackLng: 'en', defaultNS: 'files', resources: { en: { files: english } }, initImmediate: false, interpolation: { escapeValue: false } })
  const view = render(<I18nextProvider i18n={i18n}><Provider store={store}><FileImportStatus /></Provider></I18nextProvider>)
  return {
    ipfs,
    store,
    adds,
    copies,
    committed,
    refresh,
    async start (paths) {
      let pending
      await act(async () => {
        pending = store.doFilesWrite(paths.map(file), '/')
        // Attach before any release/rejection, including on the old renderer.
        pending.catch(() => {})
        uploads.push(pending)
      })
      await waitFor(() => expect(adds.some(request => request.files[0].path === paths[0])).toBe(true))
      await waitFor(() => expect(store.selectFilesPending().some(job => job.message.entries[0].path === paths[0])).toBe(true))
      return { pending, request: adds.find(request => request.files[0].path === paths[0]) }
    },
    async close () {
      closing = true
      view.unmount()
      // Every barrier is owned and released even when an old-behavior assertion
      // fails before Cancel can be clicked. No hanging iterator or cp survives.
      for (const request of adds) request.finish.resolve()
      for (const request of copies) request.finish.resolve()
      let timer
      try {
        await Promise.race([
          Promise.allSettled(uploads),
          new Promise((resolve, reject) => { timer = setTimeout(() => reject(new Error('Owned upload fixture did not settle during cleanup')), 1000) })
        ])
      } finally {
        clearTimeout(timer)
        refresh.mockRestore()
        store.destroy()
        i18n.off()
      }
    }
  }
}

const cancel = path => screen.getByRole('button', { name: new RegExp(`cancel.*${path.replaceAll('.', '\\.')}`, 'i') })
const outcome = async pending => {
  let value, failure
  await act(async () => { try { value = await pending } catch (error) { failure = error } })
  return { value, failure }
}

describe('actual Files upload controls and ownership', () => {
  for (const theme of ['light', 'dark']) {
    it(`offers named keyboard cancellation for pending upload in ${theme}`, async () => {
      document.documentElement.dataset.theme = theme
      const f = await fixture()
      try {
        const { pending, request } = await f.start(['keyboard.txt'])
        const button = cancel('keyboard.txt')
        expect(button.tagName).toBe('BUTTON')
        expect(button).toBeEnabled()
        button.focus()
        expect(button).toHaveFocus()
        await userEvent.setup().keyboard('{Enter}')
        expect(request.options.signal.aborted).toBe(true)
        expect((await outcome(pending)).failure).toBeUndefined()
        expect(f.ipfs.files.cp).not.toHaveBeenCalled()
        expect(f.store.selectFilesFinished()).toEqual([])
        expect(f.store.selectFilesErrors()).toEqual([])
        expect(screen.getAllByText(/cancelled/i).length).toBeGreaterThan(0)
        expect(f.refresh).toHaveBeenCalledTimes(1)
      } finally { await f.close(); delete document.documentElement.dataset.theme }
    })
  }

  it('cancels only the selected job and fences late callbacks before a later upload', async () => {
    const f = await fixture({ ignoreAddAbort: true })
    try {
      const first = await f.start(['first.txt'])
      const other = await f.start(['other.txt'])
      const button = cancel('first.txt')
      fireEvent.click(button)
      fireEvent.click(button)
      expect(first.request.options.signal.aborted).toBe(true)
      expect(other.request.options.signal.aborted).toBe(false)
      await act(async () => { first.request.progress(400); first.request.finish.resolve() })
      expect((await outcome(first.pending)).failure).toBeUndefined()
      expect(f.copies).toEqual([])
      expect(f.store.selectFilesPending().some(job => job.message.entries[0].path === 'other.txt')).toBe(true)
      const later = await f.start(['later.txt'])
      await act(async () => { first.request.progress(400); other.request.finish.resolve(); later.request.finish.resolve() })
      expect((await outcome(other.pending)).failure).toBeUndefined()
      expect((await outcome(later.pending)).failure).toBeUndefined()
      expect([...f.committed].sort()).toEqual(['/later.txt', '/other.txt'])
      expect(f.store.selectFilesFinished()).toHaveLength(2)
      expect(screen.getAllByText(/cancelled/i).length).toBeGreaterThan(0)
      expect(f.refresh).toHaveBeenCalledTimes(3)
    } finally { await f.close() }
  })

  it('keeps Cancel at 100 percent bytes, aborts cp and preserves earlier copy effects', async () => {
    const f = await fixture({ holdCopies: ['/second.txt'] })
    try {
      const { pending, request } = await f.start(['first.txt', 'second.txt', 'third.txt'])
      await act(async () => { request.progress(1200); request.finish.resolve() })
      await waitFor(() => expect(f.copies).toHaveLength(2))
      expect(f.committed).toEqual(['/first.txt'])
      expect(screen.getByText(/100%/)).toBeInTheDocument()
      fireEvent.click(cancel('first.txt'))
      expect(f.copies[1].options.signal).toBe(request.options.signal)
      expect(f.copies[1].options.signal.aborted).toBe(true)
      expect((await outcome(pending)).failure).toBeUndefined()
      expect(f.copies).toHaveLength(2)
      expect(f.committed).toEqual(['/first.txt'])
      expect(f.store.selectFilesFinished()).toEqual([])
      expect(f.store.selectFilesErrors()).toEqual([])
      expect(screen.getAllByText(/cancelled/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/does not undo|already (?:completed|copied|imported)/i)).toBeInTheDocument()
      expect(f.refresh).toHaveBeenCalledTimes(1)
    } finally { await f.close() }
  })

  it('dismisses presentation without deleting a live job or breaking later progress', async () => {
    const f = await fixture()
    try {
      const { pending, request } = await f.start(['dismiss.txt'])
      const id = f.store.selectFilesPending()[0].id
      fireEvent.click(screen.getByRole('button', { name: english.filesImportStatus.closeDropdown }))
      expect(f.store.selectFilesPending().map(job => job.id)).toContain(id)
      await act(async () => { request.progress(200); request.finish.resolve() })
      expect((await outcome(pending)).failure).toBeUndefined()
      expect(f.committed).toEqual(['/dismiss.txt'])
      expect(f.store.selectFilesFinished()).toEqual([expect.objectContaining({ id, status: 'Done' })])
      expect(f.refresh).toHaveBeenCalledTimes(1)
    } finally { await f.close() }
  })

  it('keeps actual completion when it wins before an old Cancel control is activated', async () => {
    const f = await fixture()
    try {
      const complete = await f.start(['complete.txt'])
      const oldButton = cancel('complete.txt')
      await act(async () => { complete.request.finish.resolve() })
      expect((await outcome(complete.pending)).failure).toBeUndefined()
      expect(f.store.selectFilesFinished()).toHaveLength(1)
      expect(screen.queryByRole('button', { name: /cancel.*complete\.txt/i })).toBeNull()
      fireEvent.click(oldButton)
      expect(complete.request.options.signal.aborted).toBe(false)
      expect(f.store.selectFilesFinished()[0]).toMatchObject({ status: 'Done' })
      expect(f.committed).toEqual(['/complete.txt'])
      expect(screen.queryByText(/cancelled/i)).toBeNull()
    } finally { await f.close() }
  })

  it('does not offer upload cancellation for unrelated import tasks or completed jobs', async () => {
    const i18n = createInstance()
    await i18n.use(ICU).init({ lng: 'en', defaultNS: 'files', resources: { en: { files: english } }, initImmediate: false })
    const view = render(<Status t={i18n.t.bind(i18n)} doFilesClear={vi.fn()}
      filesPending={[{ type: ACTIONS.ADD_BY_PATH, status: 'Pending', start: 1, message: { progress: 20, entries: [file('remote')] } }]}
      filesFinished={[{ type: ACTIONS.WRITE, status: 'Done', start: 1, message: { entries: [file('done.txt')] } }]} />)
    try { expect(screen.queryByRole('button', { name: /cancel.*(?:remote|done\.txt)/i })).toBeNull() } finally { view.unmount(); i18n.off() }
  })

  it('ignores Cancel after copies complete while reconciliation is still pending', async () => {
    const f = await fixture()
    const refresh = deferred()
    f.refresh.mockImplementation(() => refresh.promise)
    try {
      const complete = await f.start(['refresh-complete.txt'])
      const token = f.store.selectFilesPending()[0].init.uploadToken
      const button = cancel('refresh-complete.txt')
      await act(async () => { complete.request.finish.resolve() })
      await waitFor(() => expect(f.refresh).toHaveBeenCalledTimes(1))
      expect(f.committed).toEqual(['/refresh-complete.txt'])
      expect(f.store.selectFilesPending()).toHaveLength(1)
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Finishing')
      act(() => { fireEvent.click(button); f.store.doFilesCancelUpload(token) })
      expect(complete.request.options.signal.aborted).toBe(false)
      await act(async () => { refresh.resolve() })
      expect((await outcome(complete.pending)).failure).toBeUndefined()
      expect(f.store.selectFilesFinished()).toEqual([expect.objectContaining({ status: 'Done' })])
      expect(f.store.selectFilesErrors()).toEqual([])
      expect(f.store.selectFilesCancelled()).toEqual([])
    } finally { refresh.resolve(); await f.close() }
  })

  it('preserves the upload error when reconciliation also rejects', async () => {
    const f = await fixture()
    const failure = new Error('original upload failure')
    f.refresh.mockRejectedValue(new Error('refresh failure'))
    try {
      const upload = await f.start(['upload-error.txt'])
      await act(async () => { upload.request.finish.reject(failure) })
      expect((await outcome(upload.pending)).failure).toBe(failure)
      expect(f.store.selectFilesErrors()).toEqual([expect.objectContaining({ error: failure })])
      expect(f.refresh).toHaveBeenCalledTimes(1)
      expect(f.committed).toEqual([])
    } finally { await f.close() }
  })

  it('preserves the copy failure when reconciliation also rejects', async () => {
    const f = await fixture()
    f.ipfs.files.cp.mockRejectedValue(new Error('original copy failure'))
    f.refresh.mockRejectedValue(new Error('refresh failure'))
    try {
      const upload = await f.start(['copy-error.txt'])
      await act(async () => { upload.request.finish.resolve() })
      expect((await outcome(upload.pending)).failure).toMatchObject({ code: 'ERR_FILES_CP_FAILED' })
      expect(f.store.selectFilesErrors()).toEqual([expect.objectContaining({ error: expect.objectContaining({ code: 'ERR_FILES_CP_FAILED' }) })])
      expect(f.refresh).toHaveBeenCalledTimes(1)
      expect(f.store.selectFilesCancelled()).toEqual([])
    } finally { await f.close() }
  })

  it('keeps cancellation handled and distinct when reconciliation rejects', async () => {
    const f = await fixture()
    f.refresh.mockRejectedValue(new Error('refresh failure'))
    try {
      const upload = await f.start(['cancel-error.txt'])
      fireEvent.click(cancel('cancel-error.txt'))
      expect((await outcome(upload.pending)).failure).toBeUndefined()
      expect(f.store.selectFilesCancelled()).toHaveLength(1)
      expect(f.store.selectFilesErrors()).toEqual([])
      expect(f.store.selectFilesFinished()).toEqual([])
      expect(f.refresh).toHaveBeenCalledTimes(1)
      expect(f.committed).toEqual([])
    } finally { await f.close() }
  })

  it('reports a refresh-only failure without claiming cancellation or undoing a completed copy', async () => {
    const f = await fixture()
    const failure = new Error('refresh-only failure')
    f.refresh.mockRejectedValue(failure)
    try {
      const upload = await f.start(['refresh-error.txt'])
      await act(async () => { upload.request.finish.resolve() })
      expect((await outcome(upload.pending)).failure).toBe(failure)
      expect(f.committed).toEqual(['/refresh-error.txt'])
      expect(f.store.selectFilesErrors()).toEqual([expect.objectContaining({ error: failure })])
      expect(f.store.selectFilesCancelled()).toEqual([])
      expect(f.refresh).toHaveBeenCalledTimes(1)
    } finally { await f.close() }
  })
})
