import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { connect } from '../../lib/react-store.js'
import { withTranslation } from 'react-i18next'
import * as d3 from 'd3'
import CountryFlag from '../../components/country-flag/CountryFlag.js'

import Address from '../../components/address/Address.js'
import Popover from '../../components/popover/Popover.js'

// Styles
import './WorldMap.css'
import Cid from '../../components/cid/Cid.js'
import { useChartPalette } from '../../promethity/tokens.js'

const calculateWidth = (windowWidth) => {
  // the d3 generated svg width includes a lot of ocean, that we crop for now, as it looks weird.
  const svgWidthOversizeFactor = 1.7
  // remove a constant amount for the chrome that surronds the map.
  const sidebarAndPadding = 350
  const availableWidth = windowWidth - sidebarAndPadding
  const width = availableWidth * svgWidthOversizeFactor
  // if the map gets too big the dots get lost in the dot grid, also it just overloads the viewers brain.
  if (width > 3000) {
    return 3000
  }
  // if the map gets too small it becomes illegible. There will be some map cropping on mobile.
  if (width < 700) {
    return 700
  }

  return width
}

const calculateHeight = (width) => {
  if (width > 960) {
    if (window.innerHeight < 940) {
      return (window.innerHeight - 180) * 0.6
    }
    return width * 0.273
  }

  return width * 0.5
}

const WorldMap = ({ t, className, selectedPeers, doSetSelectedPeers }) => {
  const [width, setWidth] = useState(calculateWidth(window.innerWidth))
  const [height, setHeight] = useState(calculateHeight(width))
  const selectedTimeoutRef = useRef(null)
  // Dot colour comes from the tokens and follows the theme (webui-dataviz-reskin 1.2).
  const { dot } = useChartPalette()

  useEffect(() => {
    let pending
    const onResize = () => {
      clearTimeout(pending)
      pending = setTimeout(() => {
        const width = calculateWidth(window.innerWidth)
        setWidth(width)
        setHeight(calculateHeight(width))
      }, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(pending)
      clearTimeout(selectedTimeoutRef.current)
    }
  }, [])

  const handleMapPinMouseEnter = useCallback((peerIds, element) => {
    if (!element) return

    clearTimeout(selectedTimeoutRef.current)

    const { x, y, width, height } = element.getBBox()

    doSetSelectedPeers({ peerIds, left: `${x + width / 2}px`, top: `${y - height / 2}px` })
  }, [doSetSelectedPeers])

  const handleMapPinMouseLeave = useCallback(() => {
    selectedTimeoutRef.current = setTimeout(() => doSetSelectedPeers({}), 600)
  }, [doSetSelectedPeers])

  const handlePopoverMouseEnter = useCallback(() => clearTimeout(selectedTimeoutRef.current), [])

  return (
    <div className="flex flex-column">
      <div className={`relative ${className}`}>
        <div className='mb1 flex flex-column items-center'>
          <div className="relative no-events" style={{ width, height }}>
            {/* Land: the static dot-grid map as a mask over a flat token fill (WorldMap.css). */}
            <div className='worldMapLand' aria-hidden='true' />
            <GeoPath width={width} height={height}>
              { ({ path }) => (
                <MapPins width={width} height={height} path={path} dot={dot} handleMouseEnter={ handleMapPinMouseEnter } handleMouseLeave= { handleMapPinMouseLeave } />
              )}
            </GeoPath>
            { selectedPeers?.peerIds && (
              <Popover show={ !!(selectedPeers.top && selectedPeers.left) } top={ selectedPeers.top } left={ selectedPeers.left } align='bottom'
                handleMouseEnter={ handlePopoverMouseEnter } handleMouseLeave={ handleMapPinMouseLeave }>
                <PeerInfo ids={ selectedPeers.peerIds } t={t}/>
              </Popover>)
            }
          </div>
        </div>
        <div className='no-events absolute bottom-0 left-0 right-0'>
          <div className='flex flex-auto flex-column items-center self-end pb5-ns no-select'>
            <div className='f1 fw5 black'><PeersCount /></div>
            <div className='f4 b charcoal-muted'>{t('app:terms.peers')}</div>
          </div>
        </div>
      </div>
      <div className='relative flex justify-end pt2 pb4'>
        <div className='f6 p2 no-select flex items-center'>
          <span className='f6 charcoal-muted pr3'>{t('app:terms.peers')}: </span>
          <i className='mapDotExplanation mr1' style={{ width: getDotsSize(1) * 2, height: getDotsSize(1) * 2, backgroundColor: dot, opacity: getDotsOpacity(1) }}></i>1-10
          <i className='mapDotExplanation ml3 mr1' style={{ width: getDotsSize(50) * 2, height: getDotsSize(50) * 2, backgroundColor: dot, opacity: getDotsOpacity(50) }}></i> 10-100
          <i className='mapDotExplanation ml3 mr1' style={{ width: getDotsSize(110) * 2, height: getDotsSize(110) * 2, backgroundColor: dot, opacity: getDotsOpacity(110) }}></i>100+
        </div>
      </div>
    </div>
  )
}

const PeersCount = connect('selectPeers', ({ peers }) => peers ? peers.length : 0)

const GeoPath = ({ width, height, children }) => {
  // https://github.com/d3/d3-geo/blob/master/README.md#geoEquirectangular
  const path = useMemo(() => {
    const projection = d3.geoEquirectangular()
      .scale(height / Math.PI)
      .translate([width / 2, height / 2])
      .precision(0.1)
    // https://github.com/d3/d3-geo/blob/master/README.md#paths
    return d3.geoPath().projection(projection)
  }, [width, height])

  return children({ path })
}

const getDotsSize = (numberOfDots) => {
  if (numberOfDots < 10) return 5
  if (numberOfDots < 100) return 8
  return 10
}

// One flat token fill; peer density reads from size and from opacity steps.
const getDotsOpacity = (numberOfDots) => {
  if (numberOfDots < 10) return 0.6
  if (numberOfDots < 100) return 0.8
  return 1
}

// Just the dots on the map, this gets called a lot.
export const MapPinsView = ({ width, height, path, dot, peersCoordinates, handleMouseEnter, handleMouseLeave }) => {
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    {(peersCoordinates || []).map(({ peerIds, coordinates }) => <path
      key={coordinates.join(',')}
      d={path.pointRadius(getDotsSize(peerIds.length))({ type: 'Point', coordinates })}
      fill={dot} fillOpacity={getDotsOpacity(peerIds.length)} className='mapDot'
      tabIndex={0} role='img' aria-label={peerIds.join(', ')}
      onMouseEnter={event => handleMouseEnter(peerIds, event.currentTarget)} onMouseLeave={handleMouseLeave}
      onFocus={event => handleMouseEnter(peerIds, event.currentTarget)} onBlur={handleMouseLeave} />)}
  </svg>
}

const MapPins = connect('selectPeersCoordinates', MapPinsView)

const MAX_PEERS = 5

const PeerInfo = connect('selectPeerLocationsForSwarm', ({ ids, peerLocationsForSwarm, t }) => {
  const allPeers = peerLocationsForSwarm || []
  const peers = allPeers.filter(({ peerId }) => ids.includes(peerId))

  const isWindows = useMemo(() => window.navigator.appVersion.indexOf('Win') !== -1, [])

  if (!peers.length) return null
  if (!peerLocationsForSwarm) return null

  return (
    <div className="f6 flex flex-column justify-center">
      { [...peers].sort((a, b) => a.address.localeCompare(b.address)).map((peer, index) => {
        if (index === MAX_PEERS && peers.length > MAX_PEERS) {
          return (<div className="f7 pa1 self-end" key="worldmap-more-label">{t('plusPeers', { number: peers.length - MAX_PEERS })}</div>)
        }

        if (index > MAX_PEERS) return null

        return (
          <div className="pa2 f7 flex items-center monospace" key={peer.peerId}>
            <CountryFlag className='mr1' code={peer.flagCode} svg={isWindows}/>
            <div className="flex flex-auto items-center">
              <Address value={ peer.address }/>
              <span className="charcoal-muted">/p2p/</span>
              <Cid value={peer.peerId}/>
            </div>
            <span className="gray ml1"> ({peer.latency || '???'}ms)</span>
          </div>
        )
      }) }
    </div>
  )
})

export default connect(
  'selectSelectedPeers',
  'doSetSelectedPeers',
  withTranslation('peers')(WorldMap)
)
