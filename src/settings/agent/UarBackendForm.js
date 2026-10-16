import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldInput, StatusLine } from '../../promethity/components/index.js'
import { ApiKeyField } from './ApiKeyField.js'
import { ConfirmHost } from './ConfirmHost.js'
import { useAgentSettings } from './AgentSettings.js'
import { TestConnection } from './TestConnection.js'

/**
 * Universal Agent Runtime (`backend.kind: uar`, ADR-0010). The same shape as the
 * OpenAI-compatible form, against the same settings API: instance URL, write-only
 * credential, typed host confirmation, test connection. There is no model field: the
 * agent the node creates on the runtime brings its own. Every state here is read from
 * the node or from a request this page just made; nothing is staged locally, so a
 * runtime that is down or misconfigured shows as exactly that.
 */
export const UarBackendForm = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  const [urlTouched, setUrlTouched] = useState(false)
  const test = meta.test
  const urlError = urlTouched && !meta.urlCheck.ok ? t(`url.error.${meta.urlCheck.reason}`) : undefined
  const runTest = () => { setUrlTouched(true); void actions.testConnection() }

  return (
    <div className='as-fields' data-id='AgentSettingsUar'>
      <Field label={t('uar.url.label')} help={t('uar.url.help')} error={urlError} errorLabel={t('error')}>
        <FieldInput
          type='text'
          inputMode='url'
          autoComplete='off'
          spellCheck={false}
          placeholder={t('uar.url.placeholder')}
          value={state.draft.baseUrl}
          onChange={(e) => actions.setBaseUrl(e.target.value)}
          onBlur={() => setUrlTouched(true)}
        />
      </Field>

      <ApiKeyField />

      <ConfirmHost />

      <TestConnection
        noteId='as-uar-test-note'
        note={t('uar.test.note')}
        onRun={runTest}
        failedLead={(host) => `${t('uar.test.failed.text', { host })}${test.detail ? ` ${test.detail}` : ''}`}
        ok={(
          <StatusLine tone='ok' word={t('test.ok.word')}>
            {t('test.ok.text', { host: meta.confirmation.host, ms: test.latencyMs ?? 0 })} {t('uar.test.noKey')}
          </StatusLine>
        )}
      />

      <div className='as-agent-block'>
        <p className='pm-label'>{t('uar.agent.label')}</p>
        <p className='pm-help'>{t('uar.agent.text')}</p>
      </div>
    </div>
  )
}
