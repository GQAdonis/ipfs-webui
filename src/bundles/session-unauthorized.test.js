/* global it, expect, describe, beforeEach */
import { composeBundlesRaw, createAsyncResourceBundle } from 'redux-bundler'
import sessionUnauthorizedBundle from './session-unauthorized.js'
import { enterSession, getSession, resetSessionForTests } from '../agent-chat/session.js'

const REPORT = { principals: [{ name: 'operator', kind: 'admin' }], email: 'ada@example.org', exp: 1900000000, admin: 'ok' }
const unauthorized = Object.assign(new Error('HTTPError'), { response: { status: 401 } })

const appTime = { name: 'appTime', reducer: () => Date.now(), selectAppTime: (state) => state.appTime, selectIsOnline: () => true }

const makeStore = (getPromise) => composeBundlesRaw(
  appTime,
  createAsyncResourceBundle({ name: 'peers', actionBaseType: 'PEERS', getPromise, persist: false, checkIfOnline: false }),
  sessionUnauthorizedBundle
)()

beforeEach(() => resetSessionForTests())

describe('401 from an async resource bundle', () => {
  it('raises the ended sign-in in session mode', async () => {
    enterSession(REPORT)
    const store = makeStore(() => Promise.reject(unauthorized))
    store.doFetchPeers()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(getSession().expired).toBe(true)
  })

  it('ignores other failures in session mode', async () => {
    enterSession(REPORT)
    const store = makeStore(() => Promise.reject(Object.assign(new Error('x'), { response: { status: 500 } })))
    store.doFetchPeers()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(getSession().expired).toBe(false)
  })

  it('does nothing in token mode', async () => {
    const store = makeStore(() => Promise.reject(unauthorized))
    store.doFetchPeers()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(getSession()).toBeUndefined()
  })
})
