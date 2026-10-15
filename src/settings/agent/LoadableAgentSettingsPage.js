import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from '../../loader/ComponentLoader.js'

// The page is a separate chunk: routes.js imports this wrapper, never the page,
// so the Status page and every other route pay nothing for it.
const LoadableAgentSettingsPage = Loadable(() => import('./AgentSettingsPage.js'),
  { fallback: <ComponentLoader /> }
)

export default LoadableAgentSettingsPage
