import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { Field, FieldInput, StatusLine } from '../../promethity/components/index.js'
import { useAgentSettings } from './AgentSettings.js'

/**
 * Universal Agent Runtime, with honest unavailable states. The server refuses
 * `kind: uar` in this build and no UAR release is published, so every control
 * is shown disabled with the reason beside it, nothing is tested, and nothing
 * can be applied: no fake success. `agent-backend-uar` 1.6 turns this form on
 * by passing `uarAvailable` to the provider.
 */
export const UarBackendForm = () => {
  const { t } = useTranslation('agentSettings')
  const { state } = useAgentSettings()
  const configured = state.server?.backend?.kind === 'uar' ? state.server.backend : undefined

  return (
    <div className='as-fields' data-id='AgentSettingsUar'>
      <StatusLine tone='warn' word={t('uar.unavailable.word')}>{t('uar.unavailable.text')}</StatusLine>
      <p className='pm-label as-missing-lead'>{t('uar.missing.label')}</p>
      <ul className='as-missing' aria-label={t('uar.missing.label')}>
        <li>{t('uar.missing.release')}</li>
        <li>{t('uar.missing.server')}</li>
      </ul>
      {configured
        ? <StatusLine tone='info' word={t('uar.configured.word')}>{t('uar.configured.text', { url: configured.base_url ?? '' })}</StatusLine>
        : null}

      <Field label={t('uar.url.label')} help={t('uar.disabledHelp')}>
        <FieldInput type='text' disabled value='' placeholder={t('uar.url.placeholder')} readOnly />
      </Field>
      <Field label={t('uar.credential.label')} help={t('uar.disabledHelp')}>
        <FieldInput type='password' disabled value='' readOnly autoComplete='off' />
      </Field>
      <div className='as-test'>
        <Button buttonType='button' bg='bg-charcoal' minWidth={160} disabled>{t('test.button')}</Button>
      </div>
      <div className='as-agent-block'>
        <p className='pm-label'>{t('uar.agent.label')}</p>
        <StatusLine tone='info' word={t('uar.agent.word')}>{t('uar.agent.text')}</StatusLine>
      </div>
    </div>
  )
}
