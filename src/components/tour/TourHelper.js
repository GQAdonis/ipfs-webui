import React from 'react'
import { connect } from '../../lib/react-store.js'
import { withTranslation } from 'react-i18next'
import { HelpIcon } from '../../promethity/icons.js'

export const TourHelper = ({ doDisableTooltip, doEnableTours, className = '', size = 20, t }) => {
  const handleClick = () => {
    doDisableTooltip()
    doEnableTours()
  }

  return (
    <button
      type='button'
      className={`joyride-app-tour inline-flex items-center pointer prom-icon-link prom-icon-btn ${className}`}
      onClick={handleClick}
      aria-label={t('startTourHelper')}
      title={t('startTourHelper')}>
      <HelpIcon size={size} />
    </button>
  )
}

export default connect(
  'doDisableTooltip',
  'doEnableTours',
  withTranslation('app')(TourHelper)
)
