/* global window, document */
import React, { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { composeBundlesRaw } from 'redux-bundler'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Provider, connect } from '../../../src/lib/react-store.js'
import ConnectedIpnsManager from '../../../src/components/ipns-manager/IpnsManager.js'
import ipns from '../../../src/bundles/ipns.js'
import settings from '../../../public/locales/en/settings.json'
import app from '../../../public/locales/en/app.json'
import '../../../src/index.css'
import 'react-virtualized/styles.css'
import '../../../src/promethity/fonts.css'
import '../../../src/promethity/tokens.css'
import '../../../src/promethity/roles.css'
import '../../../src/promethity/theme-overrides.css'
import '../../../src/promethity/components.css'

// This boundary replaces only the RPC/client provider, never the connected
// component, its request reducer, rendering or keyboard implementations.
const pending = []; const calls = []; const preEffects = []
const publishedId = 'k51qzi5uqu5dl2yn0d6xu8q5aqa61jh8zeyixz9tsju80n15ssiyew48912c63'
const keys = [{ id: publishedId, name: 'zeta' }, { id: 'fixture-self', name: 'self' }, { id: 'fixture-alpha', name: 'alpha' }]
let scope = 0
const makeClient = () => {
  const owner = ++scope
  return {
    key: {
      list: () => new Promise((resolve, reject) => { calls.push({ operation: 'key.list', owner, args: [] }); pending.push({ resolve, reject, owner }) }),
      gen: async (...args) => { calls.push({ operation: 'key.gen', owner, args }) },
      rename: async (...args) => { calls.push({ operation: 'key.rename', owner, args }) },
      rm: async (...args) => { calls.push({ operation: 'key.rm', owner, args }) }
    },
    name: { resolve: async function * (...args) { calls.push({ operation: 'name.resolve', owner, args }); if (args[0] === `/ipns/${publishedId}`) yield '/ipfs/fixture-only' } }
  }
}
let current = makeClient()
const store = composeBundlesRaw({
  name: 'ipfs',
  reducer: (state = { ready: false }, action) => {
    if (action.type === 'FIXTURE_READY') return { ready: action.ready }
    if (action.type === 'IPFS_STOPPED' || action.type === 'IPFS_API_ADDRESS_UPDATED') return { ready: false }
    return state
  },
  getExtraArgs: () => ({ getIpfs: () => current }),
  selectIpfsReady: state => state.ipfs.ready,
  selectLocalGatewayUrl: () => 'http://127.0.0.1:18080',
  selectPublicGateway: () => '',
  selectShareLinkType: () => 'local-path'
}, ipns)()
const i18n = createInstance()
await i18n.init({ lng: 'en', fallbackLng: 'en', defaultNS: 'settings', resources: { en: { settings, app } }, interpolation: { escapeValue: false } })
const t = i18n.getFixedT('en', 'settings')
const Observe = connect('selectIpfsReady', ({ ipfsReady }) => {
  useLayoutEffect(() => { preEffects.push({ ready: ipfsReady, text: document.querySelector('[role=status]')?.textContent }) }, [ipfsReady])
  return <ConnectedIpnsManager t={t} />
})
const root = createRoot(document.getElementById('root'))
root.render(<I18nextProvider i18n={i18n}><Provider store={store}><main style={{ padding: 16 }}><h1>IPNS publishing keys</h1><p>Supplemental fixture: mocked client/provider and RPC transport; no live node.</p><button id='before'>Before keys</button><section aria-label='Publishing key controls'><Observe /></section><button id='after'>After keys</button></main></Provider></I18nextProvider>)
window.__ipnsFixture = {
  kind: 'production-component-store-mocked-transport',
  connect: () => store.dispatch({ type: 'FIXTURE_READY', ready: true }),
  refresh: () => { void store.doFetchIpnsKeys() },
  retire: () => store.dispatch({ type: 'IPFS_STOPPED' }),
  replace: () => { store.dispatch({ type: 'IPFS_API_ADDRESS_UPDATED' }); current = makeClient() },
  complete: (index, result) => { const request = pending[index]; if (!request) throw new Error('Missing real pending request'); if (result === 'error') request.reject(new Error('Mocked RPC rejection')); else request.resolve(result === 'populated' ? keys : []) },
  facts: () => ({ status: store.selectIpnsKeysStatus(), keys: store.selectIpnsKeys(), calls, pending: pending.length, preEffects, publishedId }),
  dispose: () => { root.unmount(); store.destroy() }
}
