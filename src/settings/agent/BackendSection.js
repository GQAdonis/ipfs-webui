import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/box/Box.js'
import Button from '../../components/button/button.tsx'
import Title from '../Title.js'
import { ApplyBar, ApplyForm, Field, FieldInput, SegmentedControl, StatusLine, useFieldControl } from '../../promethity/components/index.js'
import { ApplyStatus } from './ApplyStatus.js'
import { OpenAiBackendForm } from './OpenAiBackendForm.js'
import { UarBackendForm } from './UarBackendForm.js'
import { useAgentSettings } from './AgentSettings.js'
import { useDocumentScrollPadding } from './use-scroll-padding.js'
import { useChatOn } from './use-chat-on.js'

/**
 * The typed host. Described by the help and by a match status; the status is
 * announced only once, when the text becomes the host.
 *
 * @param {{ host: string, value: string, matches: boolean, onChange: (v: string) => void }} props
 */
const HostInput = ({ host, value, matches, onChange }) => {
  const { t } = useTranslation('agentSettings')
  const control = useFieldControl()
  const statusId = `${control.id}-match`
  const typed = value.trim() !== ''
  return (
    <>
      <FieldInput
        type='text'
        autoComplete='off'
        autoCapitalize='off'
        spellCheck={false}
        className='monospace'
        aria-describedby={`${control['aria-describedby'] ?? ''} ${statusId}`.trim()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div id={statusId} className='as-confirm-status'>
        {matches
          ? <StatusLine tone='ok' word={t('confirm.matches.word')}>{t('confirm.matches.text', { host })}</StatusLine>
          : typed ? <p className='pm-help'>{t('confirm.differs')}</p> : null}
      </div>
    </>
  )
}

/**
 * The backend choice and its field set. No backend is preselected on first
 * run (the operator chooses; nothing is chosen for them). Selecting one mounts
 * its fields and unmounts the other's. Apply sends only what changed. A change
 * of backend kind or model host asks for the host typed back before Apply works.
 */
export const BackendSection = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  const chatOn = useChatOn()
  const { draft, server, apply } = state
  const blocked = meta.blockers.length > 0
  const applying = apply.state === 'applying'
  const firstRun = server !== null && server.backend === null && !meta.dirty && draft.kind === ''
  const choiceRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const sectionRef = useRef(/** @type {HTMLElement | null} */ (null))
  useDocumentScrollPadding(sectionRef)

  // First run: focus lands on the segmented control, where the first decision is.
  useEffect(() => {
    if (!firstRun) return
    const first = choiceRef.current?.querySelector('input[type=radio]')
    if (first instanceof HTMLElement && document.activeElement === document.body) first.focus()
  }, [firstRun])

  const submit = (/** @type {React.FormEvent} */ e) => {
    e.preventDefault()
    if (!blocked) void actions.apply()
  }

  return (
    <Box className='mb3 pa4-l pa3'>
      <section ref={sectionRef} aria-labelledby='as-backend-title' data-id='AgentSettingsBackend'>
        <Title props={{ id: 'as-backend-title' }}>{t('backend.title')}</Title>
        {firstRun
          ? (
            <ol className='as-steps' aria-label={t('firstRun.label')}>
              <li><strong>{t('firstRun.step1.title')}</strong></li>
              <li><strong>{t('firstRun.step2.title')}</strong> {t('firstRun.step2.text')}</li>
              {chatOn ? null : <li><strong>{t('firstRun.step3.title')}</strong> {t('firstRun.step3.text')}</li>}
            </ol>
            )
          : null}
        <ApplyForm aria-label={t('backend.title')} aria-busy={applying} onSubmit={submit} noValidate>
          <div ref={choiceRef}>
            <SegmentedControl
              label={t('backend.choose')}
              value={draft.kind}
              onChange={(kind) => actions.setKind(/** @type {'openai' | 'uar'} */ (kind))}
              options={[
                { value: 'openai', label: t('backend.openai') },
                { value: 'uar', label: meta.caps.uarAvailable ? t('backend.uar') : <>{t('backend.uar')} <span className='as-segment-note'>{t('backend.uarSoon')}</span></> }
              ]}
            />
          </div>

          {draft.kind === 'openai' ? <OpenAiBackendForm /> : null}
          {draft.kind === 'uar' ? <UarBackendForm /> : null}

          {meta.confirmation.required
            ? (
              <div className='as-confirm' data-id='AgentSettingsConfirm'>
                <Field
                  label={<>{t('confirm.label')} <code className='monospace as-host'>{meta.confirmation.host}</code></>}
                  help={t('confirm.help')}
                >
                  <HostInput host={meta.confirmation.host} value={state.confirmText} matches={meta.confirmation.matches} onChange={actions.setConfirmText} />
                </Field>
              </div>
              )
            : null}

          <ApplyBar label={t('apply.bar')} status={<ApplyStatus />}>
            {state.elsewhere ? <Button buttonType='button' bg='bg-charcoal' minWidth={120} onClick={() => void actions.load({ keepEdits: false })}>{t('apply.reload')}</Button> : null}
            <Button buttonType='button' bg='bg-charcoal' minWidth={100} disabled={!meta.dirty || applying} onClick={actions.revert}>{t('apply.revert')}</Button>
            <Button buttonType='submit' minWidth={120} disabled={blocked}>
              {applying ? t('apply.applyingButton') : apply.state === 'failed' ? t('apply.retry') : t('apply.apply')}
            </Button>
          </ApplyBar>
        </ApplyForm>
      </section>
    </Box>
  )
}
