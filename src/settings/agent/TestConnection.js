import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { StatusLine } from '../../promethity/components/index.js'
import { useAgentSettings } from './AgentSettings.js'
import { failureText } from './failure-text.js'

/**
 * The Test connection control shared by both backend forms: the button (off for an invalid
 * URL, while testing, or while the host confirmation gates it), the note beneath it, and a
 * polite region for the result. What a passing test says depends on the backend, so the
 * caller passes the note and the ok result; the failed state is the same in both.
 *
 * @param {Object} props
 * @param {string} props.noteId
 * @param {string} props.note the sentence under the button
 * @param {React.ReactNode} props.ok the status line for a passing test, or null
 * @param {(host: string) => string} props.failedLead the sentence before a failed test's detail
 * @param {() => void} props.onRun called when the button is pressed and the test is allowed
 */
export const TestConnection = ({ noteId, note, ok, failedLead, onRun }) => {
  const { t } = useTranslation('agentSettings')
  const { state, meta } = useAgentSettings()
  const test = meta.test
  const testing = test.state === 'testing'
  const gated = !meta.confirmation.testAllowed
  return (
    <div className='as-test'>
      <Button buttonType='button' bg='bg-charcoal' minWidth={160} disabled={!meta.urlCheck.ok || testing || gated} aria-describedby={noteId} aria-busy={testing} onClick={() => { if (!gated) onRun() }}>
        {testing ? t('test.testing') : t('test.button')}
      </Button>
      <p id={noteId} className='pm-help as-test-note'>{note}</p>
      <div aria-live='polite'>
        {test.state === 'ok' ? ok : null}
        {test.state === 'failed'
          ? <StatusLine tone='err' word={t('test.failed.word')}>{failedLead(meta.confirmation.host)}</StatusLine>
          : null}
        {state.phase === 'unauthorized' && test.state === 'failed' ? <p className='pm-help'>{failureText(t, state.failure)}</p> : null}
      </div>
    </div>
  )
}
