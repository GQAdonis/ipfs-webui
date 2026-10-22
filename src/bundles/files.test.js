/* global it, expect */
import { vi, describe } from 'vitest'
import { composeBundlesRaw } from 'redux-bundler'
import createFilesBundle from './files/index.js'
import { CID } from 'multiformats/cid'

const iterate = async function * (items) {
  yield * items
}

function createMockIpfsBundle (ipfs) {
  return {
    name: 'ipfs',
    getExtraArgs: () => ({ getIpfs: () => ipfs }),
    selectIpfsConnected: () => true,
    selectIpfsReady: () => true
  }
}
const createMockIpfs = () => {
  return {
    addAll: vi.fn((files) => iterate(files.map((file) => ({
      path: file.path,
      cid: CID.parse('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'),
      size: file.size
    })))),
    files: {
      cp: vi.fn()
    }
  }
}

function createStore (ipfs) {
  return composeBundlesRaw(
    createMockIpfsBundle(ipfs),
    {
      name: 'mockRoutesBundle',
      selectRouteInfo: () => ({
        url: ''
      })
    },
    createFilesBundle()
  )()
}

it('write single file to root', async () => {
  const ipfs = createMockIpfs()
  const store = createStore(ipfs)

  const input = [{
    path: 'test.txt',
    size: 400
  }]

  await store.doFilesWrite(input, '/')

  expect(ipfs.addAll.mock.calls.length).toBe(1)
  expect(ipfs.addAll.mock.calls[0][0][0]).toBe(input[0])
  expect(ipfs.files.cp.mock.calls.length).toBe(1)
  expect(ipfs.files.cp.mock.calls[0][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[0][1]).toBe('/test.txt')
})

it('write single file to directory', async () => {
  const ipfs = createMockIpfs()
  const store = createStore(ipfs)

  const input = [{
    path: 'test.txt',
    size: 400
  }]

  await store.doFilesWrite(input, '/dir')

  expect(ipfs.addAll.mock.calls.length).toBe(1)
  expect(ipfs.addAll.mock.calls[0][0][0]).toBe(input[0])
  expect(ipfs.files.cp.mock.calls.length).toBe(1)
  expect(ipfs.files.cp.mock.calls[0][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[0][1]).toBe('/dir/test.txt')
})

it('write multiple file', async () => {
  const ipfs = createMockIpfs()
  const store = createStore(ipfs)

  const input = [{
    path: 'wow.txt',
    size: 566
  },
  {
    path: 'test.txt',
    size: 400
  }]

  await store.doFilesWrite(input, '/')

  expect(ipfs.addAll.mock.calls.length).toBe(1)
  expect(ipfs.addAll.mock.calls[0][0][0]).toBe(input[0])
  expect(ipfs.addAll.mock.calls[0][0][1]).toBe(input[1])
  expect(ipfs.files.cp.mock.calls.length).toBe(2)
  expect(ipfs.files.cp.mock.calls[0][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[0][1]).toBe('/wow.txt')
  expect(ipfs.files.cp.mock.calls[1][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[1][1]).toBe('/test.txt')
})

it('write multiple file with ignored file', async () => {
  const ipfs = createMockIpfs()
  const store = createStore(ipfs)

  const input = [{
    path: 'wow.txt',
    size: 566
  },
  {
    path: '.DS_Store',
    size: 566
  },
  {
    path: 'test.txt',
    size: 400
  }]

  await store.doFilesWrite(input, '/')

  expect(ipfs.addAll.mock.calls.length).toBe(1)
  expect(ipfs.addAll.mock.calls[0][0][0]).toBe(input[0])
  expect(ipfs.addAll.mock.calls[0][0][1]).toBe(input[2])
  expect(ipfs.files.cp.mock.calls.length).toBe(2)
  expect(ipfs.files.cp.mock.calls[0][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[0][1]).toBe('/wow.txt')
  expect(ipfs.files.cp.mock.calls[1][0]).toBe('/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
  expect(ipfs.files.cp.mock.calls[1][1]).toBe('/test.txt')
})

describe('upload failure reconciliation', () => {
  it('refreshes Files when the add stream fails during progress, preserving the original error', async () => {
    const failure = new Error('add stream failed after progress')
    let releaseFailure
    const barrier = new Promise(resolve => { releaseFailure = resolve })
    const ipfs = createMockIpfs()
    ipfs.addAll.mockImplementation((_files, options) => (async function * () {
      options.progress(10, 'stream.txt')
      await barrier
      throw failure
    })())
    const store = createStore(ipfs)
    const refresh = vi.spyOn(store, 'doFilesFetch').mockResolvedValue(undefined)
    const pending = store.doFilesWrite([{ path: 'stream.txt', size: 400 }], '/')
    pending.catch(() => {})
    try {
      await vi.waitFor(() => expect(store.selectFilesPending()[0].message.progress).toBe(2.5))
      releaseFailure()
      await expect(pending).rejects.toBe(failure)
      expect(refresh).toHaveBeenCalledTimes(1)
      expect(ipfs.files.cp).not.toHaveBeenCalled()
      expect(store.selectFilesErrors()).toEqual([expect.objectContaining({ error: failure, status: 'Failed' })])
    } finally {
      releaseFailure()
      await pending.catch(() => {})
      refresh.mockRestore()
      store.destroy()
    }
  })

  it('refreshes after a copy failure and keeps it distinct from cancellation', async () => {
    const ipfs = createMockIpfs()
    ipfs.files.cp.mockRejectedValue(new Error('copy unavailable'))
    const store = createStore(ipfs)
    const refresh = vi.spyOn(store, 'doFilesFetch').mockResolvedValue(undefined)
    try {
      await expect(store.doFilesWrite([{ path: 'copy.txt', size: 400 }], '/')).rejects.toMatchObject({ code: 'ERR_FILES_CP_FAILED' })
      expect(refresh).toHaveBeenCalledTimes(1)
      expect(store.selectFilesErrors()).toEqual([expect.objectContaining({ status: 'Failed' })])
      expect(store.selectFilesFinished()).toEqual([])
    } finally {
      refresh.mockRestore()
      store.destroy()
    }
  })
})
