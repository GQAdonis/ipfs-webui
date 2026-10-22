import { useEffect } from 'react'
import { connect } from '../lib/react-store.js'
import LoadableExplorePage from './LoadableExplorePage'
import LoadableStartExploringPage from './LoadableStartExploringPage'
import { useExplore, useHelia } from 'ipld-explorer-components/providers'
import 'ipld-explorer-components/css'

const ExplorePageRenderer = ({ routeInfo }) => {
  const { pattern, url } = routeInfo
  const { setExplorePath } = useExplore()
  const { doInitHelia, helia } = useHelia()

  useEffect(() => {
    if (helia == null) {
      doInitHelia()
    }
  }, [helia, doInitHelia])

  useEffect(() => {
    setExplorePath(window.location.hash)
  }, [url, setExplorePath])

  if (pattern === '/explore') {
    return <LoadableStartExploringPage />
  }

  return <LoadableExplorePage />
}

export default connect(
  'selectRouteInfo',
  ExplorePageRenderer
)
