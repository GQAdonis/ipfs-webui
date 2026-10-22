import React from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '../../promethity/components/index.js'
import { usePresentationPolicy } from '../../agent-chat/use-presentation-policy.js'

/** These controls never enter AgentSettingsProvider's server Apply payload. */
export function PresentationPreferences ({ policy: supplied }) {
  const { t } = useTranslation('agentChat')
  const { policy, preferences } = usePresentationPolicy(supplied)
  return <section className='as-feature' aria-labelledby='agent-presentation-title' data-id='AgentPresentationPreferences'>
    <h3 id='agent-presentation-title' className='pm-label'>{t('presentation.title')}</h3>
    <p className='pm-help'>{t('presentation.localOnly')}</p>
    {['decisions', 'a2ui', 'contextReferences', 'runFacts'].map(field => <Switch key={field}
      label={t(`presentation.${field}.label`)} help={t(`presentation.${field}.help`)} checked={preferences[field]}
      onChange={enabled => policy.update({ [field]: enabled })} onText={t('presentation.on')} offText={t('presentation.off')} />)}
    <details className='pm-help'>
      <summary>{t('presentation.helpTitle')}</summary>
      <p>{t('presentation.serverControls')}</p>
      <p>{t('presentation.independent')}</p>
      <p>{t('presentation.native')}</p>
      <p>{t('presentation.history')}</p>
      <p>{t('presentation.unpin')}</p>
    </details>
  </section>
}
