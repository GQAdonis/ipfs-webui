import React from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../settings/Title.js'
import { getStatus, subscribe as subscribeStatus } from './registration-status.js'
import { getSettings, subscribe as subscribeSettings, updateSettings } from './settings-store.js'
import { useStore } from './use-store.js'
import './webmcp.css'

/**
 * The sentence that says what the page actually did. Never claims more than the status.
 *
 * @param {import('i18next').TFunction} t
 * @param {import('./registration-status.js').RegistrationStatus} status
 */
function statusText (t, status) {
  switch (status.state) {
    case 'unavailable':
      return t('status.unavailable')
    case 'waiting':
      return t('status.waiting')
    case 'registered': {
      const parts = [
        t('status.registered', { count: status.registered }),
        status.writes > 0 ? t('status.writesCount', { count: status.writes }) : t('status.readOnly')
      ]
      if (status.failed > 0) parts.push(t('status.failed', { count: status.failed }))
      return parts.join(' ')
    }
    default:
      return t('status.off')
  }
}

/**
 * One checkbox with its help text tied to it by aria-describedby.
 *
 * @param {{ id: string, checked: boolean, disabled?: boolean, label: string, help: string, onChange: (checked: boolean) => void }} props
 */
function Toggle ({ id, checked, disabled = false, label, help, onChange }) {
  const helpId = `${id}-help`
  return (
    <div className='mb3'>
      <label className={`flex items-start mb1 ${disabled ? '' : 'pointer'}`} htmlFor={id}>
        <input
          id={id}
          type='checkbox'
          className={`mr2 mt1 ${disabled ? '' : 'pointer'}`}
          style={{ width: 20, height: 20 }}
          checked={checked}
          disabled={disabled}
          aria-describedby={helpId}
          onChange={(e) => onChange(e.target.checked)} />
        <span className='f5 lh-copy'>{label}</span>
      </label>
      <p id={helpId} className='f6 mt0 mb0 ml4'>{help}</p>
    </div>
  )
}

/**
 * Settings for WebMCP: the switch (on by default), the switch for DNSLink names, the switch
 * for tools that change the node (both off by default, and only available while the first is
 * on), and a status line that reports what was registered. The text says what each risk is
 * before the person turns the switch on.
 */
const WebMcpSettings = () => {
  const { t } = useTranslation('webmcp')
  const settings = useStore(getSettings, subscribeSettings)
  const status = useStore(getStatus, subscribeStatus)

  return (
    <div className='lh-copy charcoal webmcp-settings' data-id='WebMcpSettings'>
      <Title>{t('title')}</Title>
      <p className='f6'>{t('description')}</p>

      <Toggle
        id='webmcp-toggle'
        checked={settings.enabled}
        label={t('toggle.label')}
        help={t('toggle.help')}
        onChange={(enabled) => updateSettings({ enabled })} />

      <Toggle
        id='webmcp-dnslink-toggle'
        checked={settings.dnslink}
        disabled={!settings.enabled}
        label={t('dnslink.label')}
        help={settings.enabled ? t('dnslink.help') : `${t('dnslink.help')} ${t('dnslink.needsFirst')}`}
        onChange={(dnslink) => updateSettings({ dnslink })} />

      <Toggle
        id='webmcp-writes-toggle'
        checked={settings.writes}
        disabled={!settings.enabled}
        label={t('writes.label')}
        help={settings.enabled ? t('writes.help') : `${t('writes.help')} ${t('writes.needsFirst')}`}
        onChange={(writes) => updateSettings({ writes })} />

      <p className='f6 mt0 mb2' role='status' data-testid='webmcp-status'>{statusText(t, status)}</p>
      <p className='f6 mt0 mb2'>{t('operator')} <code className='monospace'>Permissions-Policy: tools=()</code></p>
    </div>
  )
}

export default WebMcpSettings
