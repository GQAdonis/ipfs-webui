import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import { HelpIcon } from '../../promethity/icons.js'

export const TourHelper = ({ doEnableTours, className = '', size = 20, t }) => {
  const handleClick = () => {
    doEnableTours()
  }

  return (
    <button
      type='button'
      className={`inline-flex items-center pointer prom-icon-link prom-icon-btn ${className}`}
      onClick={handleClick}
      aria-label={t('startTourHelper')}
      title={t('startTourHelper')}>
      <HelpIcon size={size} />
    </button>
  )
}

export default connect(
  'doEnableTours',
  withTranslation('app')(TourHelper)
)
