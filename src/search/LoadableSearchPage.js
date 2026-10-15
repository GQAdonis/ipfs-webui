import React from 'react'
import Loadable from '@loadable/component'
import ComponentLoader from '../loader/ComponentLoader.js'

// The page is a separate chunk: routes.js imports this wrapper, never the page,
// so no other route pays for it. Its code and the search client are fetched only
// when #/search is opened.
const LoadableSearchPage = Loadable(() => import('./SearchPage.js'),
  { fallback: <ComponentLoader /> }
)

export default LoadableSearchPage
