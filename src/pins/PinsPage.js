import React from 'react'
import { connect } from '../lib/react-store.js'
import { withTranslation } from 'react-i18next'
import PinsStatuses from './PinsStatuses.js'

/**
 * @param {Object} props
 * @param {string[]} props.pendingPins
 * @param {string[]} props.failedPins
 * @param {string[]} props.completedPins
 * @param {(pin: string) => void} props.doDismissCompletedPin
 * @param {(pin: string) => void} props.doDismissFailedPin
 * @param {(pin: string) => void} props.doCancelPendingPin
 */
const PinsPage = ({ pendingPins, failedPins, completedPins, doDismissCompletedPin, doDismissFailedPin, doCancelPendingPin }) => {
  return (
    <div data-id='PinsPage' className='mw9 center'>
      <>
        <title>Pins Status</title>
      </>

      <PinsStatuses
        pendingPins={pendingPins}
        failedPins={failedPins}
        completedPins={completedPins}
        doCancelPendingPin={doCancelPendingPin}
        onDismissCompletedPin={doDismissCompletedPin}
        onDismissFailedPin={doDismissFailedPin} />
    </div>
  )
}

export default connect(
  'selectPendingPins',
  'selectFailedPins',
  'selectCompletedPins',
  'doDismissCompletedPin',
  'doDismissFailedPin',
  'doCancelPendingPin',
  withTranslation('files')(PinsPage)
)
