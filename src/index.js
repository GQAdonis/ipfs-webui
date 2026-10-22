import React from 'react'
import { Provider } from './lib/react-store.js'
import { startStoreRoot } from './lib/react-store-root.js'
import './index.css'
import 'react-virtualized/styles.css'
import './promethity/fonts.css'
import './promethity/tokens.css'
import './promethity/roles.css'
import './promethity/theme-overrides.css'
import './promethity/components.css'
import App from './App.js'
import getStore from './bundles/index.js'
import bundleCache from './lib/bundle-cache.js'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'
import { DndProvider } from 'react-dnd'
import DndBackend from './lib/dnd-backend.js'
import { HeliaProvider, ExploreProvider } from 'ipld-explorer-components/providers'
import { ContextBridgeProvider, contextBridge } from './helpers/context-bridge.js'
import { initTheme } from './promethity/theme.js'
import { migrateAgentDefaults } from './agent-chat/boot.js'
import { bootSession } from './agent-chat/session-boot.js'

// Apply the persisted Promethity theme (D16) before first render.
initTheme()

// Agent features ship on: fill only absent `enabled` keys; a stored opt-out stays (D18).
migrateAgentDefaults()

const appVersion = process.env.REACT_APP_VERSION
const gitRevision = process.env.REACT_APP_GIT_REV

console.log(`IPFS Web UI - v${appVersion} - https://github.com/ipfs-shipyard/ipfs-webui/commit/${gitRevision}`)

async function loadInitialData () {
  const initialData = await bundleCache.getAll()
  if (initialData && process.env.NODE_ENV !== 'production') {
    console.log('intialising store with data from cache', initialData)
  }
  console.log(
    '%cStop!',
    'color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 black;'
  )
  console.log(
    '%cThis is a browser feature intended for developers. If someone told you to paste something here, they might be trying to steal your data!',
    'color: black; font-size: 16px; font-weight: bold; background: yellow; padding: 4px; border-radius: 4px;'
  )
  return initialData
}

const container = document.getElementById('root')
if (!container) throw new Error('The Web UI root container is missing')

const application = startStoreRoot({
  container,
  // Console session discovery still precedes the cache and any store initializer
  // that reads a saved API address (ADR-0013).
  beforeStore: bootSession,
  loadData: loadInitialData,
  createStore: getStore,
  renderStore: store => (
    <Provider store={store}>
      <ContextBridgeProvider>
        <I18nextProvider i18n={i18n} >
          <DndProvider backend={DndBackend}>
            <HeliaProvider>
              <ExploreProvider>
                <App />
              </ExploreProvider>
            </HeliaProvider>
          </DndProvider>
        </I18nextProvider>
      </ContextBridgeProvider>
    </Provider>
  )
})

export const startup = application.ready.catch(error => {
  unmount()
  throw error
})

export function unmount () {
  window.removeEventListener('pagehide', onPageHide)
  try {
    application.unmount()
  } finally {
    contextBridge.clear()
  }
}

function onPageHide (event) {
  // A bfcache entry resumes the same live document; retain its store/root.
  if (!event.persisted) unmount()
}

window.addEventListener('pagehide', onPageHide)

if (import.meta.hot) import.meta.hot.dispose(unmount)
