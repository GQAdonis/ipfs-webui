import { getFilesFromDataTransferItems } from 'datatransfer-files-promise'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'

// Capture entries during the drop event. Directory traversal preserves filepath.
export function captureDataTransferFiles (transfer) {
  const items = Array.from(transfer?.items || []).filter(item => item.kind === 'file')
  if (!items.length) {
    const files = Array.from(transfer?.files || [])
    return () => Promise.resolve(files)
  }
  try {
    const captured = items.map(item => {
      const entry = item.webkitGetAsEntry?.()
      if (entry) return { webkitGetAsEntry: () => entry }
      const file = item.getAsFile?.()
      if (!file) throw new Error('FILE_DROP_UNREADABLE')
      return { webkitGetAsEntry: () => ({ isFile: true, file: resolve => resolve(file) }) }
    })
    return () => getFilesFromDataTransferItems(captured)
  } catch (error) {
    return () => Promise.reject(error)
  }
}

export const filesFromDataTransfer = transfer => captureDataTransferFiles(transfer)()

const createBackend = (manager, context, options) => {
  const backend = HTML5Backend(manager, context, options)
  const root = options?.rootElement || context || globalThis.window
  const monitor = manager.getMonitor()
  const capture = event => {
    if (monitor.getItemType() !== NativeTypes.FILE) return
    const item = monitor.getItem()
    if (item) {
      const read = captureDataTransferFiles(event.dataTransfer)
      let promise
      // Traversal starts only when an enabled target actually handles the drop.
      Object.defineProperty(item, 'filesPromise', { configurable: true, get: () => { return promise || (promise = read()) } })
    }
  }
  const setup = backend.setup.bind(backend)
  const teardown = backend.teardown.bind(backend)
  backend.setup = () => {
    setup()
    // Backend capture populates the public item first; this adds hierarchy
    // before any target handles the bubble-phase drop. No private fields.
    root?.addEventListener('drop', capture, true)
  }
  backend.teardown = () => {
    root?.removeEventListener('drop', capture, true)
    teardown()
  }
  return backend
}
export default createBackend
