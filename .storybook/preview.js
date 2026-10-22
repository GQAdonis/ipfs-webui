import React, { useEffect, useState } from 'react'
import { Provider } from '../src/lib/react-store.js'
import { I18nextProvider } from 'react-i18next'
import { DndProvider } from 'react-dnd'
import 'react-virtualized/styles.css'
import '../src/index.css'

import getStore from '../src/bundles/index.js'
import i18n from '../src/i18n.js'
import DndBackend from '../src/lib/dnd-backend.js'
import { HeliaProvider, ExploreProvider } from 'ipld-explorer-components/providers'
import { ContextBridgeProvider } from '../src/helpers/context-bridge.tsx'

function StoryProviders ({ children }) {
  const [store] = useState(() => getStore({ ipfs: { apiAddress: null, provider: null, failed: false, ready: false, invalidAddress: false, pendingFirstConnection: false } }))
  useEffect(() => () => store.destroy(), [store])
  return <Provider store={store}>
    <ContextBridgeProvider><I18nextProvider i18n={i18n}><DndProvider backend={DndBackend}>
      <HeliaProvider><ExploreProvider>{children}</ExploreProvider></HeliaProvider>
    </DndProvider></I18nextProvider></ContextBridgeProvider>
  </Provider>
}

export const decorators = [(Story) => <StoryProviders><Story /></StoryProviders>]
export const argTypes = { onChange: { action: 'changed' }, onClick: { action: 'clicked' } }
