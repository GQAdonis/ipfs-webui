import { describe, expect, it, vi } from 'vitest'
import { composeBundlesRaw } from 'redux-bundler'
import ipns from './ipns.js'

const deferred = () => {
  let complete, fail
  const promise = new Promise((resolve, reject) => { complete = resolve; fail = reject })
  return { promise, resolve: complete, reject: fail }
}
const client = (list = async () => []) => ({
  key: { list: vi.fn(list), gen: vi.fn(async () => {}), rename: vi.fn(async () => {}), rm: vi.fn(async () => {}) },
  name: { resolve: vi.fn(async function * () {}) }
})
function fixture (initial = client()) {
  let current = initial
  const store = composeBundlesRaw({
    name: 'ipfs',
    reducer: (state = { ready: true }, action) => {
      if (action.type === 'FIXTURE_READY') return { ready: action.ready }
      if (action.type === 'IPFS_STOPPED' || action.type === 'IPFS_API_ADDRESS_UPDATED' || (action.type === 'IPFS_INIT' && action.task.status === 'Init')) return { ready: false }
      return state
    },
    getExtraArgs: () => ({ getIpfs: () => current }),
    selectIpfsReady: state => state.ipfs.ready
  }, ipns)()
  return { store, replace: next => { current = next }, ready: ready => store.dispatch({ type: 'FIXTURE_READY', ready }) }
}
const keys = [{ id: 'key-one', name: 'alpha', published: false }]

it('keeps an unguarded unavailable-client caller idle without making RPC calls', async () => {
  const rpc = client()
  const { store, ready } = fixture(rpc)
  ready(false)
  await expect(store.doFetchIpnsKeys()).resolves.toBeUndefined()
  expect(store.selectIpnsKeysStatus()).toBe('idle')
  expect(rpc.key.list).not.toHaveBeenCalled()
  expect(rpc.name.resolve).not.toHaveBeenCalled()
})

it('distinguishes no request, real pending work and a completed empty result', async () => {
  const pending = deferred()
  const { store } = fixture(client(() => pending.promise))
  expect(store.selectIpnsKeysStatus()).toBe('idle')
  const request = store.doFetchIpnsKeys()
  expect(store.selectIpnsKeysStatus()).toBe('loading')
  pending.resolve([])
  await request
  expect(store.selectIpnsKeysStatus()).toBe('ready')
  expect(store.selectIpnsKeys()).toEqual([])
})

it('preserves exact list/offline-resolution calls and publishes only a completed result', async () => {
  const resolve = deferred()
  const rpc = client(async () => [{ id: 'one', name: 'self' }, { id: 'two', name: 'notes' }])
  rpc.name.resolve = vi.fn(async function * (path) {
    if (path === '/ipns/one') { await resolve.promise; yield '/ipfs/reported' }
  })
  const { store } = fixture(rpc)
  const request = store.doFetchIpnsKeys()
  await Promise.resolve()
  expect(store.selectIpnsKeysStatus()).toBe('loading')
  expect(store.selectIpnsKeys()).toEqual([])
  resolve.resolve()
  await request
  expect(rpc.key.list).toHaveBeenCalledExactlyOnceWith()
  expect(rpc.name.resolve.mock.calls).toEqual([['/ipns/one', { offline: true }], ['/ipns/two', { offline: true }]])
  expect(store.selectIpnsKeys()).toEqual([{ id: 'one', name: 'self', published: true }, { id: 'two', name: 'notes', published: false }])
  expect(store.selectIpnsKeysStatus()).toBe('ready')
})

it.each(['list', 'resolve'])('handles actual %s rejection without successful-empty state or an unhandled refresh promise', async stage => {
  const rpc = client(async () => { if (stage === 'list') throw new Error('private endpoint failure'); return [{ id: 'one', name: 'alpha' }] })
  rpc.name.resolve = vi.fn(async function * () { throw new Error('private resolve failure') })
  const { store } = fixture(rpc)
  await expect(store.doFetchIpnsKeys()).resolves.toBeUndefined()
  expect(store.selectIpnsKeysStatus()).toBe('error')
  expect(JSON.stringify(store.getState().ipns)).not.toMatch(/private|endpoint/)
})

it('keeps the existing cached array during ordinary refresh/failure for other consumers', async () => {
  const rpc = client(async () => [{ id: 'key-one', name: 'alpha' }])
  const { store } = fixture(rpc)
  await store.doFetchIpnsKeys()
  const cached = store.selectIpnsKeys()
  const pending = deferred()
  rpc.key.list.mockImplementation(() => pending.promise)
  const request = store.doFetchIpnsKeys()
  expect(store.selectIpnsKeys()).toBe(cached)
  expect(store.selectIpnsKeysStatus()).toBe('loading')
  pending.reject(new Error('read refresh failed'))
  await request
  expect(store.selectIpnsKeys()).toBe(cached)
  expect(store.selectIpnsKeysStatus()).toBe('error')
})

describe('request lifetime', () => {
  it('keeps ownership when a synchronous subscription starts a newer request', async () => {
    const rpc = client(async () => [{ id: 'key-one', name: 'alpha' }])
    const { store } = fixture(rpc)
    let started = false
    let newer
    const unsubscribe = store.subscribe(() => {
      if (!started && store.selectIpnsKeysStatus() === 'loading') {
        started = true
        newer = store.doFetchIpnsKeys()
      }
    })
    try {
      await store.doFetchIpnsKeys()
      await newer
      expect(store.selectIpnsKeysStatus()).toBe('ready')
      expect(store.selectIpnsKeys()).toEqual(keys)
      expect(rpc.key.list).toHaveBeenCalledTimes(1)
    } finally { unsubscribe() }
  })

  it.each(['resolve', 'reject'])('ignores an older %s after the newer request succeeds', async completion => {
    const older = deferred()
    const newer = deferred()
    const rpc = client().key
    rpc.list.mockImplementationOnce(() => older.promise).mockImplementationOnce(() => newer.promise)
    const { store } = fixture({ key: rpc, name: client().name })
    const first = store.doFetchIpnsKeys()
    const second = store.doFetchIpnsKeys()
    newer.resolve([{ id: 'key-one', name: 'alpha' }])
    await second
    const state = store.getState().ipns
    if (completion === 'resolve') older.resolve([])
    else older.reject(new Error('retired request'))
    await first
    expect(store.getState().ipns).toBe(state)
    expect(store.selectIpnsKeys()).toEqual(keys)
    expect(store.selectIpnsKeysStatus()).toBe('ready')
  })

  it('does not turn a newer failure into success when an older request finally succeeds', async () => {
    const older = deferred()
    const rpc = client(() => older.promise)
    const { store } = fixture(rpc)
    const first = store.doFetchIpnsKeys()
    rpc.key.list.mockRejectedValueOnce(new Error('current failure'))
    await store.doFetchIpnsKeys()
    older.resolve([])
    await first
    expect(store.selectIpnsKeysStatus()).toBe('error')
  })

  it.each([
    { type: 'IPFS_STOPPED' },
    { type: 'IPFS_API_ADDRESS_UPDATED', payload: 'fixture-address' },
    { type: 'IPFS_INIT', task: { status: 'Init' } }
  ])('retires cached data and pending results for $type', async event => {
    const rpc = client(async () => [{ id: 'key-one', name: 'alpha' }])
    const { store, ready } = fixture(rpc)
    await store.doFetchIpnsKeys()
    const pending = deferred()
    rpc.key.list.mockImplementationOnce(() => pending.promise)
    const old = store.doFetchIpnsKeys()
    store.dispatch(event)
    expect(store.selectIpnsKeys()).toEqual([])
    expect(store.selectIpnsKeysStatus()).toBe('idle')
    ready(true)
    await store.doFetchIpnsKeys()
    const current = store.getState().ipns
    pending.resolve([])
    await old
    expect(store.getState().ipns).toBe(current)
    expect(store.selectIpnsKeys()).toEqual(keys)
  })

  it('fences a replaced client even if a provider notification has not yet arrived', async () => {
    const pending = deferred()
    const old = client(() => pending.promise)
    const { store, replace } = fixture(old)
    const request = store.doFetchIpnsKeys()
    replace(client())
    pending.resolve([{ id: 'retired', name: 'old' }])
    await request
    expect(old.name.resolve).not.toHaveBeenCalled()
    expect(store.selectIpnsKeys()).toEqual([])
    expect(store.selectIpnsKeysStatus()).toBe('idle')
  })

  it('checks readiness after pending work and during offline resolution', async () => {
    const pending = deferred()
    const rpc = client(async () => [{ id: 'one', name: 'alpha' }, { id: 'two', name: 'beta' }])
    rpc.name.resolve = vi.fn(async function * () { await pending.promise; yield '/ipfs/fixture' })
    const { store, ready } = fixture(rpc)
    const request = store.doFetchIpnsKeys()
    await Promise.resolve()
    ready(false)
    pending.resolve()
    await request
    expect(rpc.name.resolve).toHaveBeenCalledTimes(1)
    expect(store.selectIpnsKeysStatus()).toBe('idle')
    expect(store.selectIpnsKeys()).toEqual([])
  })

  it('uses independent request sequences for independent stores', async () => {
    const one = deferred()
    const two = deferred()
    const a = fixture(client(() => one.promise))
    const b = fixture(client(() => two.promise))
    const first = a.store.doFetchIpnsKeys()
    const second = b.store.doFetchIpnsKeys()
    a.store.dispatch({ type: 'IPFS_STOPPED' })
    two.resolve([])
    await second
    one.resolve([])
    await first
    expect(a.store.selectIpnsKeysStatus()).toBe('idle')
    expect(b.store.selectIpnsKeysStatus()).toBe('ready')
  })
})

it.each([
  ['doGenerateIpnsKey', 'gen', ['notes']],
  ['doRemoveIpnsKey', 'rm', ['notes']],
  ['doRenameIpnsKey', 'rename', ['notes', 'renamed']]
])('preserves %s arguments and performs only the existing read refresh', async (action, method, args) => {
  const rpc = client()
  const { store } = fixture(rpc)
  await store[action](...args)
  await Promise.resolve()
  expect(rpc.key[method]).toHaveBeenCalledExactlyOnceWith(...args)
  expect(rpc.key.list).toHaveBeenCalledTimes(1)
})

it('does not retry a failed mutation or mistake read refresh failure for mutation rollback', async () => {
  const rpc = client(async () => { throw new Error('read failure') })
  const { store } = fixture(rpc)
  await expect(store.doGenerateIpnsKey('notes')).resolves.toBeUndefined()
  await Promise.resolve()
  expect(rpc.key.gen).toHaveBeenCalledTimes(1)
  expect(store.selectIpnsKeysStatus()).toBe('error')
  rpc.key.rm.mockRejectedValueOnce(new Error('mutation refused'))
  await expect(store.doRemoveIpnsKey('notes')).rejects.toThrow('mutation refused')
  expect(rpc.key.rm).toHaveBeenCalledTimes(1)
  expect(rpc.key.list).toHaveBeenCalledTimes(1)
})
