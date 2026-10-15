import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldInput, StatusLine, useFieldControl } from '../../promethity/components/index.js'
import { useAgentSettings } from './AgentSettings.js'

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
 * The typed host confirmation, shown when the backend kind or host changes. It sits above
 * Test connection: the host is decided first, then the test, then the model.
 */
export const ConfirmHost = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  if (!meta.confirmation.required) return null
  // ADR-0012: a key stored through this page stays with the backend it was stored for and is
  // removed by a move to another host. A key the server supplies by reference (an environment
  // variable or a file) follows the move. Say which one applies before Apply, never both.
  const moves = meta.confirmation.sendsEgressConfirmation
  const keyHelp = moves && meta.keyStored
    ? t(meta.keyServerManaged ? 'confirm.helpKeyServer' : 'confirm.helpKey')
    : ''
  const help = [t('confirm.help'), keyHelp].filter(Boolean).join(' ')
  return (
    <div className='as-confirm' data-id='AgentSettingsConfirm'>
      <Field
        label={<>{t('confirm.label')} <code className='monospace as-host'>{meta.confirmation.host}</code></>}
        help={help}
      >
        <HostInput host={meta.confirmation.host} value={state.confirmText} matches={meta.confirmation.matches} onChange={actions.setConfirmText} />
      </Field>
      {meta.keyServerManaged && moves
        ? <StatusLine tone='info' word={t('confirm.serverManaged.word')}>{t('confirm.serverManaged.text')}</StatusLine>
        : null}
    </div>
  )
}
