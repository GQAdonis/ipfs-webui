import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import { ConnectedIcon, DisconnectedIcon, ConnectingIcon } from '../../promethity/icons.js'

// Node connection state: an icon plus a state word, never colour alone. The
// icon and word sit at full opacity on `text-muted` (ok/err hues come from the
// tokens through the colour classes), so the 3:1 non-text and 4.5:1 text
// pairings hold in light and dark (WCAG 1.4.3, 1.4.11).
const pickState = (ipfsReady, ipfsConnected, ipfsInitFailed) => {
  if (ipfsReady && ipfsConnected) {
    return { color: 'green', Icon: ConnectedIcon, wordKey: 'app:status.connectedShort', titleKey: 'app:status.connectedToIpfs' }
  }
  if (ipfsReady) {
    return { color: 'red', Icon: DisconnectedIcon, wordKey: 'app:status.disconnectedShort', titleKey: 'ipfsApiRequestFailed' }
  }
  // The first connection attempt failed: the Welcome page says so, and so does the top bar.
  if (ipfsInitFailed) {
    return { color: 'red', Icon: DisconnectedIcon, wordKey: 'app:status.disconnectedShort', titleKey: 'app:status.couldNotConnect' }
  }
  return { color: 'charcoal-muted', Icon: ConnectingIcon, wordKey: 'app:status.connectingShort', titleKey: 'app:status.connectingToIpfs' }
}

export const Connected = ({ t, className = '', size = 20, ipfsReady, ipfsConnected, ipfsInitFailed, doSetIsNodeInfoOpen }) => {
  const { color, Icon, wordKey, titleKey } = pickState(ipfsReady, ipfsConnected, ipfsInitFailed)
  const description = t(titleKey)
  return (
    <a
      title={description}
      aria-label={`${t(wordKey)}. ${description}`}
      className={`inline-flex items-center prom-icon-link prom-status-link ${color} ${className}`}
      href='#/status'
      onClick={() => doSetIsNodeInfoOpen(true)}>
      <Icon size={size} />
      <span className='prom-status-word f6 fw6'>{t(wordKey)}</span>
    </a>
  )
}

export default connect(
  'selectIpfsReady',
  'selectIpfsConnected',
  'selectIpfsInitFailed',
  'doSetIsNodeInfoOpen',
  withTranslation('notify')(Connected)
)
