import { describe, expect, it, vi } from 'vitest'
import { captureDataTransferFiles, filesFromDataTransfer } from '../lib/dnd-backend.js'

function fileEntry (name, bytes = 'x') {
  const file = new File([bytes], name)
  return { isFile: true, file: resolve => resolve(file) }
}

function directory (name, batches) {
  const createReader = vi.fn(() => ({ readEntries: callback => callback(batches.shift() || []) }))
  return { name, isDirectory: true, createReader }
}

describe('native file capture contract', () => {
  it('captures entries during the event and delays traversal until an enabled target reads them', async () => {
    const child = directory('child', [[fileEntry('a.txt')]])
    const folder = directory('folder', [[child], [fileEntry('b.txt')]])
    const item = { kind: 'file', webkitGetAsEntry: vi.fn(() => folder) }
    const read = captureDataTransferFiles({ items: [item] })
    expect(item.webkitGetAsEntry).toHaveBeenCalledTimes(1)
    expect(folder.createReader).not.toHaveBeenCalled()
    item.webkitGetAsEntry = () => { throw new Error('event access expired') }
    const files = await read()
    expect(files.map(file => file.filepath)).toEqual(['folder/child/a.txt', 'folder/b.txt'])
  })

  it('ignores mixed text items and supports ordinary file getters and FileList fallback', async () => {
    const file = new File(['x'], 'plain.txt')
    const files = await filesFromDataTransfer({ items: [{ kind: 'string' }, { kind: 'file', getAsFile: () => file }] })
    expect(files[0].filepath).toBe('plain.txt')
    expect(await filesFromDataTransfer({ files: [file] })).toEqual([file])
    expect(await filesFromDataTransfer({ items: [{ kind: 'string' }] })).toEqual([])
  })

  it('keeps an unreadable entry as a rejected import instead of silently flattening or writing it', async () => {
    const read = captureDataTransferFiles({ items: [{ kind: 'file', getAsFile: () => null }] })
    await expect(read()).rejects.toThrow('FILE_DROP_UNREADABLE')
  })
})
