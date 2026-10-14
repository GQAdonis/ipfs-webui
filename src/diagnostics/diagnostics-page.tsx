import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import IsNotConnected from '../components/is-not-connected/is-not-connected'
import DiagnosticsContent from './diagnostics-content'
import { useBridgeSelector } from '../helpers/context-bridge'
import { titleWithBrand } from '../promethity/page-title.js'

const DiagnosticsPage: React.FC = () => {
  const { t } = useTranslation('diagnostics')
  const ipfsConnected = useBridgeSelector('selectIpfsConnected')

  const Component = useMemo(() => {
    if (ipfsConnected) {
      return DiagnosticsContent
    }
    return IsNotConnected
  }, [ipfsConnected])

  return (
    <div data-id='DiagnosticsPage' className='mw9 center'>
      <Helmet>
        <title>{titleWithBrand(t('title'))}</title>
      </Helmet>
      <div className='flex'>
        <div className='flex-auto'>
          <Component key={ipfsConnected ? 'connected' : 'not-connected'} />
        </div>
      </div>
    </div>
  )
}

/**
 * @template {ReduxBundlerProps}
 */
export default DiagnosticsPage
