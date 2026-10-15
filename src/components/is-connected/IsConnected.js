import React from 'react'
import { withTranslation } from 'react-i18next'
import Box from '../box/Box.js'
import { OkIcon } from '../../promethity/icons.js'

/**
 * @param {Object} props
 * @param {import('i18next').TFunction} props.t
 */
export const IsConnected = ({ t }) => {
  return (
    <Box className='pv3 ph4'>
      <div>
        <div className='flex flex-wrap items-center'>
          <span className='prom-state-mark prom-state-mark-ok mr3'><OkIcon size={28} /></span>
          <div>
            <p className='prom-state-word prom-state-word-ok ma0'>{t('app:status.connectedShort')}</p>
            <h1 className='montserrat fw4 charcoal ma0 f3'>{t('app:status.connectedToIpfs')}</h1>
          </div>
        </div>
        <p className='fw6 mt2 w-100'>{t('connected.paragraph1')}</p>
      </div>
    </Box>
  )
}

export default withTranslation('welcome')(IsConnected)
