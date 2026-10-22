import all from 'it-all'
import { readSetting, writeSetting } from './local-storage.js'
import { dispatchAsyncProvide } from './files/utils.js'

const init = () => ({
  keys: [],
  keysStatus: 'idle',
  keysRequest: 0,
  expectedPublishTime: readSetting('expectedPublishTime') || 60
})

const ipnsBundle = {
  name: 'ipns',
  reducer: (state = init(), action) => {
    const retire = () => ({ ...state, keys: [], keysStatus: 'idle', keysRequest: (state.keysRequest || 0) + 1 })
    if (action.type === 'IPFS_STOPPED' || action.type === 'IPFS_API_ADDRESS_UPDATED' ||
        (action.type === 'IPFS_INIT' && action.task?.status === 'Init')) return retire()

    if (action.type === 'IPNS_KEYS_REQUESTED') {
      return { ...state, keysStatus: 'loading', keysRequest: (state.keysRequest || 0) + 1 }
    }

    if (action.type === 'IPNS_KEYS_RETIRED' && action.request === state.keysRequest) return retire()

    if (action.type === 'CACHE_IPNS_KEYS') {
      return action.request === state.keysRequest && state.keysStatus === 'loading'
        ? { ...state, keys: action.payload, keysStatus: 'ready' }
        : state
    }

    if (action.type === 'IPNS_KEYS_FAILED') {
      return action.request === state.keysRequest && state.keysStatus === 'loading'
        ? { ...state, keysStatus: 'error' }
        : state
    }

    if (action.type === 'SET_EXPECTED_PUBLISH_TIME') {
      return { ...state, expectedPublishTime: action.payload }
    }

    return state
  },

  selectIpnsKeys: (state) => state.ipns.keys || [],
  selectIpnsKeysStatus: (state) => state.ipns.keysStatus || 'idle',

  selectExpectedPublishTime: (state) => state.ipns.expectedPublishTime,

  doFetchIpnsKeys: () => async ({ getIpfs, dispatch, getState, store }) => {
    // PublishModal also calls this read directly. An unavailable initialized
    // client must not acquire a pending request or an empty-success result.
    if (!store.selectIpfsReady()) return
    // Reserve our sequence before notifying subscribers; a synchronous listener
    // may start a newer read while this dispatch is still returning.
    const request = (getState().ipns.keysRequest || 0) + 1
    dispatch({ type: 'IPNS_KEYS_REQUESTED' })
    let ipfs
    const isCurrent = () => {
      if (getState().ipns.keysRequest !== request) return false
      if (!store.selectIpfsReady() || getIpfs() !== ipfs) {
        dispatch({ type: 'IPNS_KEYS_RETIRED', request })
        return false
      }
      return true
    }

    try {
      ipfs = getIpfs()
      if (!isCurrent()) return
      const rawKeys = await ipfs.key.list()
      if (!isCurrent()) return
      const keys = []
      for (const { id, name } of rawKeys) {
        const names = await all(ipfs.name.resolve(`/ipns/${id}`, { offline: true }))
        if (!isCurrent()) return
        const published = names.length > 0
        keys.push({ id, name, published })
      }
      dispatch({ type: 'CACHE_IPNS_KEYS', request, payload: keys })
    } catch (_) {
      // Existing effect/mutation-refresh callers do not await this promise.
      // Keep prior cached keys for other consumers; only current status changes.
      if (isCurrent()) dispatch({ type: 'IPNS_KEYS_FAILED', request })
    }
  },

  doGenerateIpnsKey: (name) => async ({ getIpfs, store }) => {
    const ipfs = getIpfs()
    await ipfs.key.gen(name)
    store.doFetchIpnsKeys()
  },

  doRemoveIpnsKey: (name) => async ({ getIpfs, store }) => {
    const ipfs = getIpfs()
    await ipfs.key.rm(name)

    store.doFetchIpnsKeys()
  },

  doRenameIpnsKey: (oldName, newName) => async ({ getIpfs, store }) => {
    const ipfs = getIpfs()
    await ipfs.key.rename(oldName, newName)

    store.doFetchIpnsKeys()
  },

  doPublishIpnsKey: (cid, key) => async ({ getIpfs, dispatch }) => {
    const ipfs = getIpfs()

    try {
      await ipfs.name.publish(cid, { key })
    } catch (err) {
      // Surface the RPC failure as a toast and re-throw so the publish modal
      // leaves its progress state instead of hanging on a finished-looking bar.
      console.error(`unexpected error publishing IPNS record for ${cid} (key: ${key})`, err)
      dispatch({ type: 'IPNS_PUBLISH_FAILED', msgArgs: { keyName: key, errorMsg: err.toString() } })
      throw err
    }

    // Trigger background provide operation for the published CID
    dispatchAsyncProvide(cid, ipfs, 'IPNS')
  },

  doUpdateExpectedPublishTime: (time) => async ({ store, dispatch }) => {
    // moderate expectation: publishing should take no longer than average
    // between old expectation and the length of the last publish + some buffer
    const oldExpectedTime = store.selectExpectedPublishTime()
    const avg = Math.floor((time * 1.5 + oldExpectedTime) / 2)
    await writeSetting('expectedPublishTime', avg)
    dispatch({ type: 'SET_EXPECTED_PUBLISH_TIME', payload: avg })
  }
}

export default ipnsBundle
