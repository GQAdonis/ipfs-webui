import React, { useEffect } from 'react'
import { connect } from '../lib/react-store.js'
import { ExplorePage } from 'ipld-explorer-components/pages'
import withTour from '../components/tour/withTour.js'
import { EXPLORE_TOKEN_VARS } from '../promethity/explore-tokens.js'

const ExploreContainer = ({
  toursEnabled,
  handleJoyrideCallback,
  availableGatewayUrl,
  publicGateway,
  publicSubdomainGateway,
  explorerNeedsReload
}) => {
  // The explorer's Helia node reads the gateway config (kuboGateway) only when
  // it boots, so a local gateway change made elsewhere cannot take effect in
  // place. Reload lazily, only when the user actually opens Explore. The flag
  // lives in non-persisted redux state, so the reload itself clears it.
  useEffect(() => {
    if (explorerNeedsReload) {
      window.location.reload()
    }
  }, [explorerNeedsReload])

  // "View on Public Gateway" appears only when the user configured a public
  // gateway; prefer the subdomain one. null (not '') hides the link, since
  // ExplorePage only falls back to its dweb.link default for undefined.
  const publicGatewayUrl = publicSubdomainGateway || publicGateway || null

  return (
    <div className="e2e-explorePage" style={EXPLORE_TOKEN_VARS}>
      <ExplorePage
        runTour={toursEnabled}
        joyrideCallback={handleJoyrideCallback}
        gatewayUrl={availableGatewayUrl}
        publicGatewayUrl={publicGatewayUrl}
      />
    </div>
  )
}

export default connect(
  'selectToursEnabled',
  'selectAvailableGatewayUrl',
  'selectPublicGateway',
  'selectPublicSubdomainGateway',
  'selectExplorerNeedsReload',
  withTour(ExploreContainer)
)
