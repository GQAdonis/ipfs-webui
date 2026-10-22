import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/box/Box.js'
import Title from '../Title.js'
import { PolicyDecision, StatusLine, Switch } from '../../promethity/components/index.js'
import SearchSettingsSwitch from '../../search/SearchSettingsSwitch.js'
import { getBridge } from '../../agent-chat/bridge.js'
import { validateEndpoint } from '../../agent-chat/endpoint.js'
import { updateSettings as updateChat } from '../../agent-chat/settings-store.js'
import { useAgentChatSettings } from '../../agent-chat/use-agent-chat-settings.js'
import { getSettings as getWebMcp, subscribe as subscribeWebMcp, updateSettings as updateWebMcp } from '../../webmcp/settings-store.js'
import { getStatus as getWebMcpStatus, subscribe as subscribeWebMcpStatus } from '../../webmcp/registration-status.js'
import { useStore } from '../../webmcp/use-store.js'
import { getDesktopConfirmSwitch } from './core/desktop-client.js'
import { useAgentSettings } from './AgentSettings.js'
import { PresentationPreferences } from './PresentationPreferences.js'

/**
 * What WebMCP really did, in the words of the webmcp namespace. Never claims
 * more than the registration status.
 *
 * @param {import('i18next').TFunction} tw
 * @param {import('../../webmcp/registration-status.js').RegistrationStatus} status
 */
function webMcpStatusText (tw, status) {
  switch (status.state) {
    case 'unavailable': return tw('status.unavailable')
    case 'origin-restricted': return tw('status.originRestricted')
    case 'waiting': return tw('status.waiting')
    case 'registered': {
      const parts = [
        tw('status.registered', { count: status.registered }),
        status.writes > 0 ? tw('status.writesCount', { count: status.writes }) : tw('status.readOnly')
      ]
      if (status.failed > 0) parts.push(tw('status.failed', { count: status.failed }))
      return parts.join(' ')
    }
    default: return tw('status.off')
  }
}

/** The Agent chat switch. Under Desktop the main process owns the connection and there is no switch here. */
const ChatFeature = () => {
  const { t } = useTranslation('agentSettings')
  const { t: tc } = useTranslation('agentChat')
  const { settings } = useAgentChatSettings()
  const managed = getBridge() !== undefined

  if (managed) {
    return (
      <div className='as-feature' data-id='AgentChatSettings'>
        <p className='pm-label'>{t('features.chat.title')}</p>
        <StatusLine tone='info' word={t('features.managed')}>{tc('desktopManaged')}</StatusLine>
      </div>
    )
  }

  const usable = settings.enabled && validateEndpoint(settings.endpoint).ok
  return (
    <div className='as-feature' data-id='AgentChatSettings'>
      <Switch
        label={tc('toggle.label')}
        help={t('features.chat.help')}
        checked={settings.enabled}
        onChange={(enabled) => updateChat({ enabled })}
        onText={t('on')}
        offText={t('off')}
      />
      {/* The switch says on or off; a line appears only when it has something to add. */}
      <div data-testid='agent-chat-status'>
        {settings.enabled && !usable
          ? <StatusLine tone='warn' word={t('features.chat.needs.word')}>{t('features.chat.needs.text')}</StatusLine>
          : null}
      </div>
    </div>
  )
}

/**
 * The Search switch (`search.enabled`, Web UI preference). Off hides the Search entry,
 * redirects #/search and stops every request to the search routes. Under Desktop the same
 * switch applies to this window; Desktop's own Search setting controls the index.
 */
const SearchFeature = () => {
  const { t } = useTranslation('agentSettings')
  return (
    <div className='as-feature' data-id='SearchSettings'>
      <SearchSettingsSwitch onText={t('on')} offText={t('off')} />
    </div>
  )
}

/** The WebMCP switch and its two sub-options. `writes` is per page load and never stored. */
const WebMcpFeature = () => {
  const { t } = useTranslation('agentSettings')
  const { t: tw } = useTranslation('webmcp')
  const settings = useStore(getWebMcp, subscribeWebMcp)
  const status = useStore(getWebMcpStatus, subscribeWebMcpStatus)
  const tone = status.state === 'registered' ? 'ok' : 'warn'
  const word = status.state === 'registered' ? t('features.on') : t('features.webmcp.attention')

  return (
    <div className='as-feature' data-id='WebMcpSettings'>
      <Switch
        label={tw('toggle.label')}
        help={tw('toggle.help')}
        checked={settings.enabled}
        onChange={(enabled) => updateWebMcp({ enabled })}
        onText={t('on')}
        offText={t('off')}
      />
      <div className='as-sub'>
        <Switch
          label={tw('dnslink.label')}
          help={settings.enabled ? tw('dnslink.help') : `${tw('dnslink.help')} ${tw('dnslink.needsFirst')}`}
          checked={settings.dnslink}
          disabled={!settings.enabled}
          onChange={(dnslink) => updateWebMcp({ dnslink })}
          onText={t('on')}
          offText={t('off')}
        />
        <Switch
          label={tw('writes.label')}
          help={settings.enabled ? tw('writes.help') : `${tw('writes.help')} ${tw('writes.needsFirst')}`}
          checked={settings.writes}
          disabled={!settings.enabled}
          onChange={(writes) => updateWebMcp({ writes })}
          onText={t('on')}
          offText={t('off')}
        />
      </div>
      <div data-testid='webmcp-status'>
        {status.state === 'off' ? null : <StatusLine tone={tone} word={word}>{webMcpStatusText(tw, status)}</StatusLine>}
      </div>
      <p className='pm-help'>{tw('operator')} <code className='monospace'>Permissions-Policy: tools=()</code></p>
    </div>
  )
}

/**
 * The Desktop confirmation window. It exists only under IPFS Desktop. The
 * switch needs the Desktop to expose a read and a write for it; without them
 * the page states where the setting lives instead of showing a control that
 * cannot work.
 */
const DesktopConfirmFeature = () => {
  const { t } = useTranslation('agentSettings')
  const { meta } = useAgentSettings()
  const [sw] = useState(() => getDesktopConfirmSwitch())
  const [checked, setChecked] = useState(/** @type {boolean | undefined} */ (undefined))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!sw) return undefined
    let cancelled = false
    sw.get().then((v) => { if (!cancelled) setChecked(Boolean(v)) }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [sw])

  if (!meta.managedByDesktop) return null
  if (!sw) {
    return (
      <div className='as-feature' data-id='DesktopConfirmSettings'>
        <p className='pm-label'>{t('features.confirm.title')}</p>
        <StatusLine tone='info' word={t('features.managed')}>{t('features.confirm.tray')}</StatusLine>
      </div>
    )
  }
  return (
    <div className='as-feature' data-id='DesktopConfirmSettings'>
      <Switch
        label={t('features.confirm.title')}
        help={t('features.confirm.help')}
        checked={checked === true}
        disabled={checked === undefined}
        error={failed ? t('features.confirm.failed') : undefined}
        errorLabel={t('error')}
        onChange={(next) => {
          setFailed(false)
          sw.set(next).then(() => setChecked(next)).catch(() => setFailed(true))
        }}
        onText={t('on')}
        offText={t('off')}
      />
    </div>
  )
}

/**
 * The feature switches. Each is its own preference and takes effect as soon as
 * it is chosen; none of them is part of the backend that Apply sends. The
 * writes rule is a fixed statement, not a switch, so nobody looks for one.
 */
export const FeaturesSection = () => {
  const { t } = useTranslation('agentSettings')
  return (
    <Box className='mb3 pa4-l pa3'>
      <section aria-labelledby='as-features-title' data-id='AgentSettingsFeatures'>
        <Title props={{ id: 'as-features-title' }}>{t('features.title')}</Title>
        <p className='pm-help as-lede'>{t('features.lede')}</p>
        <ChatFeature />
        <SearchFeature />
        <PresentationPreferences />
        <WebMcpFeature />
        <DesktopConfirmFeature />
        <PolicyDecision subject={t('policy.subject')} decision='ask' word={t('policy.word')}>
          {t('policy.note')}
        </PolicyDecision>
      </section>
    </Box>
  )
}
