import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { Combobox, Field, FieldInput, StatusLine } from '../../promethity/components/index.js'
import { ApiKeyField } from './ApiKeyField.js'
import { useAgentSettings } from './AgentSettings.js'
import { failureText } from './failure-text.js'

/**
 * Fields of the OpenAI-compatible backend (liter-llm and others): base URL,
 * write-only key, test connection, model. The model field stays disabled until
 * a test passes or the node already holds a model for this URL, so the person
 * never types a model against an endpoint nobody has reached.
 */
export const OpenAiBackendForm = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  const [urlTouched, setUrlTouched] = useState(false)
  const { draft, server } = state
  const test = meta.test
  const urlError = urlTouched && !meta.urlCheck.ok ? t(`url.error.${meta.urlCheck.reason}`) : undefined
  const serverUrl = server?.backend?.kind === 'openai' ? server.backend.base_url : undefined
  const modelsKnown = test.state === 'ok'
  const modelEnabled = modelsKnown || (serverUrl !== undefined && serverUrl === draft.baseUrl.trim())

  const options = useMemo(() => {
    const ids = test.state === 'ok' && test.models ? test.models : []
    const withCurrent = draft.model && !ids.includes(draft.model) ? [draft.model, ...ids] : ids
    return withCurrent.map((id) => ({ value: id, label: id }))
  }, [test, draft.model])

  const testing = test.state === 'testing'
  const gated = !meta.confirmation.testAllowed
  const runTest = () => { setUrlTouched(true); if (!gated) void actions.testConnection() }
  const keyStored = server?.backend?.api_key?.set === true || state.key.stagedThisSession

  return (
    <div className='as-fields' data-id='AgentSettingsOpenAi'>
      <Field label={t('url.label')} help={t('url.help')} error={urlError} errorLabel={t('error')}>
        <FieldInput
          type='text'
          inputMode='url'
          autoComplete='off'
          spellCheck={false}
          placeholder={t('url.placeholder')}
          value={draft.baseUrl}
          onChange={(e) => actions.setBaseUrl(e.target.value)}
          onBlur={() => setUrlTouched(true)}
        />
      </Field>

      <ApiKeyField />

      <div className='as-test'>
        <Button buttonType='button' bg='bg-charcoal' minWidth={160} disabled={!meta.urlCheck.ok || testing || gated} aria-busy={testing} onClick={runTest}>
          {testing ? t('test.testing') : t('test.button')}
        </Button>
        <p className='pm-help as-test-note'>{gated ? t('test.gated', { host: meta.confirmation.host }) : t('test.note')}</p>
        <div aria-live='polite'>
          {test.state === 'ok'
            ? (
              <StatusLine tone={keyStored && !test.keySent ? 'warn' : 'ok'} word={keyStored && !test.keySent ? t('test.keyNotSent.word') : t('test.ok.word')}>
                {t('test.ok.text', { host: meta.confirmation.host, ms: test.latencyMs ?? 0 })}{' '}
                {keyStored ? (test.keySent ? t('test.keySent') : t('test.keyNotSent.text')) : ''}{' '}
                {test.models ? t('test.ok.models', { count: test.models.length }) : t('test.ok.noModels')}
              </StatusLine>
              )
            : null}
          {test.state === 'failed' ? <StatusLine tone='err' word={t('test.failed.word')}>{test.detail ?? t('test.failed.text')}</StatusLine> : null}
          {state.phase === 'unauthorized' && test.state === 'failed' ? <p className='pm-help'>{failureText(t, state.failure)}</p> : null}
        </div>
      </div>

      <Field label={t('model.label')} help={modelEnabled ? t('model.help') : t('model.disabled')}>
        <Combobox
          options={options}
          value={draft.model}
          onChange={actions.setModel}
          disabled={!modelEnabled}
          placeholder={t('model.placeholder')}
          toggleLabel={t('model.toggle')}
          countText={(count) => t('model.count', { count })}
          noMatchText={() => t('model.noMatch')}
        />
      </Field>
    </div>
  )
}
