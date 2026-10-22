import React from 'react'
import { connect } from '../lib/react-store.js'
import { StartExploringPage } from 'ipld-explorer-components/pages'
import withTour from '../components/tour/withTour.js'
import { EXPLORE_TOKEN_VARS } from '../promethity/explore-tokens.js'

const StartExploringContainer = ({
  toursEnabled,
  handleJoyrideCallback
}) => (
  <div style={EXPLORE_TOKEN_VARS}>
    <StartExploringPage
      runTour={toursEnabled}
      joyrideCallback={handleJoyrideCallback} />
  </div>
)

export default connect(
  'selectToursEnabled',
  withTour(StartExploringContainer)
)
