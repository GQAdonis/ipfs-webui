import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from './lib/react-store.js'
import { getNavHelper } from 'internal-nav-helper'
import ReactJoyride from './components/tour/Tour.js'
import { withTranslation } from 'react-i18next'
// React DnD
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { addNativeFiles, FileDropErrorNotice, reportDropError } from './files/native-drop.js'
// Lib
import { appTour } from './lib/tours.js'
import { getJoyrideLocales } from './helpers/i8n.js'
// Components
import { DecisionFeedProvider } from './activity/index.js'
import { OriginGuardNotice } from './agent-chat/OriginGuardNotice.js'
import { DecisionWorkspace } from './activity/DecisionWorkspace.jsx'
import NavBar from './navigation/NavBar.js'
import ComponentLoader from './loader/ComponentLoader.js'
import Notify from './components/notify/Notify.js'
import Connected from './components/connected/Connected.js'
import TourHelper from './components/tour/TourHelper.js'
import FilesExploreForm from './files/explore-form/files-explore-form.tsx'
import { SessionBanner } from './agent-chat/index.js'
import { WebMcpHost } from './webmcp/index.js'
// Promethity shell tokens (fork override layer)
import './promethity/shell.css'

export class App extends Component {
  static propTypes = {
    doSetupLocalStorage: PropTypes.func.isRequired,
    doTryInitIpfs: PropTypes.func.isRequired,
    doUpdateUrl: PropTypes.func.isRequired,
    doUpdateHash: PropTypes.func.isRequired,
    doFilesWrite: PropTypes.func.isRequired,
    routeInfo: PropTypes.object.isRequired,
    filesPathInfo: PropTypes.object,
    // Injected by the hook-based drop boundary
    isOver: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    props.doSetupLocalStorage()
  }

  componentDidMount () {
    this.props.doTryInitIpfs()
  }

  handleJoyrideCb = (data) => {
    if (data.action === 'close') {
      this.props.doDisableTooltip()
    }
  }

  render () {
    const { t, route: Page, ipfsReady, doFilesNavigateTo, routeInfo: { url }, dropRef, canDrop, isOver, showTooltip } = this.props
    const tourHelperAvailable = !url.startsWith('/diagnostics')
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div ref={dropRef} className='sans-serif h-100 relative' onClick={getNavHelper(this.props.doUpdateUrl)}>
        {!url.startsWith('/settings/agent') ? <OriginGuardNotice /> : null}
        <SessionBanner />
        {/* Tinted overlay that appears when dragging and dropping an item */}
        { canDrop && isOver && <div className='h-100 top-0 right-0 fixed appOverlay' /> }
        <DecisionWorkspace
          navigate={this.props.doUpdateHash}
          browse={doFilesNavigateTo}
          ipfsReady={ipfsReady}
          navigator={<NavBar />}
          header={
            <div className='flex items-center ph3 ph4-l app-topbar'>
              <div className='joyride-app-explore' style={{ width: '100%', maxWidth: 560 }}>
                <FilesExploreForm onBrowse={doFilesNavigateTo} />
              </div>
              <div className='app-topbar-status flex flex-auto items-center justify-end'>
                {tourHelperAvailable && <TourHelper />}
                <Connected className='joyride-app-status' />
              </div>
            </div>
          }
          applicationClassName={`pv3 pa3 pa4-l${url.startsWith('/explore') ? ' prom-explore' : ''}`}
          route={url}
          application={(ipfsReady || url === '/welcome' || url.startsWith('/settings'))
            ? <Page />
            : <ComponentLoader />}
        />

        <ReactJoyride
          run={showTooltip && tourHelperAvailable}
          steps={appTour.getSteps({ t })}
          styles={appTour.styles}
          callback={this.handleJoyrideCb}
          scrollToFirstStep
          disableOverlay
          locale={getJoyrideLocales(t)}
        />

        <Notify />
        <WebMcpHost />
      </div>
    )
  }
}

export function AppWithDropTarget (props) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    canDrop: () => props.filesPathInfo ? props.filesPathInfo.isMfs : true,
    drop: (item, monitor) => {
      if (monitor.didDrop()) return
      const isFilesPage = props.routeInfo.pattern === '/files*'
      const path = isFilesPage ? (props.filesPathInfo?.realPath || props.routeInfo.params.path) : '/'
      void addNativeFiles(item, files => {
        const result = props.doFilesWrite(files, path)
        if (!isFilesPage) props.doUpdateHash('/files')
        return result
      }).catch(reportDropError)
    },
    collect: monitor => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() })
  }), [props.filesPathInfo, props.routeInfo, props.doFilesWrite, props.doUpdateHash])
  return <DecisionFeedProvider><App {...props} canDrop={canDrop} isOver={isOver} dropRef={node => { drop(node) }} /><FileDropErrorNotice /></DecisionFeedProvider>
}

export default connect(
  'selectRoute',
  'selectRouteInfo',
  'selectIpfsReady',
  'selectShowTooltip',
  'doFilesNavigateTo',
  'doUpdateUrl',
  'doUpdateHash',
  'doSetupLocalStorage',
  'doTryInitIpfs',
  'doFilesWrite',
  'doDisableTooltip',
  'selectFilesPathInfo',
  withTranslation('app')(AppWithDropTarget)
)
