import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { Field, FieldInput, StatusLine } from '../../promethity/components/index.js'
import { useAgentSettings } from './AgentSettings.js'
import { failureText } from './failure-text.js'

/**
 * The write-only key. It is never rendered with a value: the input is always
 * empty, what the node holds is reported as "stored" with its source, and a
 * saved key is gone from the field the moment the request succeeds. On a host
 * that answers secrets_not_accepted the field is replaced by a statement that
 * the key is set on the server. Test connection and chats use the stored key,
 * so a new key is saved first, then tested.
 */
export const ApiKeyField = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  const [replacing, setReplacing] = useState(false)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const confirmRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const storedRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [refocusRemove, setRefocusRemove] = useState(false)
  // Cancel is the default: focus lands there, so Enter or Space does not remove the key.
  useEffect(() => {
    if (!confirmingRemove) return
    const cancel = confirmRef.current?.querySelector('[data-cancel]')
    if (cancel instanceof HTMLElement) cancel.focus()
  }, [confirmingRemove])
  // Cancel brings the Remove button back; focus returns to it rather than dropping to the page.
  useEffect(() => {
    if (!refocusRemove || confirmingRemove) return
    setRefocusRemove(false)
    const remove = storedRef.current?.querySelector('[data-remove]')
    if (remove instanceof HTMLElement) remove.focus()
  }, [refocusRemove, confirmingRemove])
  const stored = state.server?.backend?.api_key
  const hasKey = stored?.set === true || (state.key.stagedThisSession && state.key.state !== 'cleared')
  const refused = state.key.failure?.kind === 'secrets_not_accepted'
  const saving = state.key.state === 'saving'

  // The Remove button and its confirmation are gone once the key is: keep focus in the form.
  const cleared = state.key.state === 'cleared'
  useEffect(() => {
    if (!cleared) return
    const input = document.querySelector('[data-id="AgentSettingsKey"] input')
    if (input instanceof HTMLElement) input.focus()
  }, [cleared])

  if (refused) {
    return (
      <div className='as-key' data-id='AgentSettingsKeyServerManaged'>
        <StatusLine tone='info' word={t('key.serverManaged.word')}>{t('key.serverManaged.text')}</StatusLine>
      </div>
    )
  }

  const save = (/** @type {React.SyntheticEvent} */ e) => {
    e.preventDefault()
    void actions.saveKey().then(() => setReplacing(false))
  }

  const showInput = !hasKey || replacing
  return (
    <div className='as-key' data-id='AgentSettingsKey'>
      {showInput
        ? (
          <Field label={t('key.label')} help={t(meta.keyServerManaged ? 'key.helpServer' : 'key.help')}>
            <div className='as-inline'>
              <FieldInput
                type='password'
                autoComplete='off'
                data-1p-ignore='true'
                spellCheck={false}
                value={state.keyDraft}
                onChange={(e) => actions.setKeyDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') save(e) }}
              />
              <Button buttonType='button' bg='bg-charcoal' minWidth={120} disabled={state.keyDraft === '' || saving} aria-busy={saving} onClick={save}>
                {saving ? t('key.saving') : t('key.save')}
              </Button>
              {replacing ? <Button buttonType='button' type='link' minWidth={80} onClick={() => { actions.setKeyDraft(''); setReplacing(false) }}>{t('key.cancel')}</Button> : null}
            </div>
          </Field>
          )
        : (
          <div ref={storedRef} className='as-key-stored'>
            <p className='pm-label as-key-label'>{t('key.label')}</p>
            <StatusLine tone='ok' word={t('key.stored.word')}>
              {t(`key.stored.source.${stored?.set ? stored.source : 'settings_api'}`)}
            </StatusLine>
            <div className='as-inline'>
              <Button buttonType='button' bg='bg-charcoal' minWidth={120} onClick={() => setReplacing(true)}>{t('key.replace')}</Button>
              {confirmingRemove ? null : <Button buttonType='button' bg='bg-charcoal' minWidth={120} data-remove='' disabled={saving} onClick={() => setConfirmingRemove(true)}>{t('key.remove')}</Button>}
            </div>
            {confirmingRemove
              ? (
                <div ref={confirmRef} className='as-confirm-remove' role='group' aria-label={t('key.removeConfirm.label')}>
                  <p className='pm-help'>{t('key.removeConfirm.text')}</p>
                  <div className='as-inline'>
                    <Button buttonType='button' bg='bg-charcoal' minWidth={120} disabled={saving} onClick={() => { setConfirmingRemove(false); void actions.clearKey() }}>{t('key.removeConfirm.yes')}</Button>
                    <Button buttonType='button' type='link' minWidth={80} data-cancel='' onClick={() => { setRefocusRemove(true); setConfirmingRemove(false) }}>{t('key.cancel')}</Button>
                  </div>
                </div>
                )
              : null}
          </div>
          )}
      {state.key.state === 'saved' ? <StatusLine tone='ok' word={t('key.saved.word')}>{t('key.saved.text')}</StatusLine> : null}
      {state.key.state === 'cleared' ? <StatusLine tone='ok' word={t('key.cleared.word')}>{t('key.cleared.text')}</StatusLine> : null}
      {state.key.state === 'failed' ? <StatusLine tone='err' word={t('key.failed.word')}>{failureText(t, state.key.failure)}</StatusLine> : null}
    </div>
  )
}
