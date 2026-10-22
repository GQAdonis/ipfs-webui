import React from 'react'
import { useTranslation } from 'react-i18next'
import { useOriginPolicy } from './use-origin-policy.js'
import { StatusLine } from '../promethity/components/index.js'

/** No alternate URL is inferred from storage, the gateway host or an agent service endpoint. */
export function OriginGuardNotice () {
  const { t } = useTranslation('agentChat')
  const { origin } = useOriginPolicy()
  if (origin.allowed) return null
  return <aside className='pa3' aria-label={t('originGuard.title')}>
    <StatusLine tone='warn' word={t('originGuard.title')}>{t(origin.kind === 'shared-gateway' ? 'originGuard.shared' : 'originGuard.unconfigured')}</StatusLine>
    <p className='pm-help'>{t('originGuard.destination')}</p>
    <p className='pm-help'>{t('originGuard.auth')}</p>
  </aside>
}
