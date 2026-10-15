import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/box/Box.js'
import Title from '../Title.js'
import { StatusLine } from '../../promethity/components/index.js'
import { getBridge } from '../../agent-chat/bridge.js'
import { validateEndpoint } from '../../agent-chat/endpoint.js'
import { useAgentChatSettings } from '../../agent-chat/use-agent-chat-settings.js'
import { getSettings as getWebMcp, subscribe as subscribeWebMcp } from '../../webmcp/settings-store.js'
import { useStore } from '../../webmcp/use-store.js'
import './agent-summary.css'

export const AGENT_SETTINGS_HREF = '#/settings/agent'

/**
 * The one-line Agent row on `/settings`: the two switches in words and a link
 * to the page that holds them. It reads only local preferences, so it makes no
 * request and needs no token.
 */
const AgentSettingsSummary = () => {
  const { t } = useTranslation('agentSettings')
  const { settings } = useAgentChatSettings()
  const webmcp = useStore(getWebMcp, subscribeWebMcp)
  const managed = getBridge() !== undefined
  const chatOn = managed || settings.enabled
  const chatReady = managed || (settings.enabled && validateEndpoint(settings.endpoint).ok)
  const tone = chatOn ? (chatReady ? 'ok' : 'warn') : 'info'
  const word = chatOn ? (chatReady ? t('summary.on') : t('summary.needsEndpoint')) : t('summary.off')

  return (
    <Box className='mb3 pa4-l pa2'>
      <section aria-labelledby='as-summary-title' data-id='AgentSettingsSummary' className='as-summary'>
        <Title props={{ id: 'as-summary-title' }}>{t('title')}</Title>
        <StatusLine tone={tone} word={word}>
          {t('summary.text', { webmcp: webmcp.enabled ? t('summary.webmcpOn') : t('summary.webmcpOff') })}
        </StatusLine>
        <p className='pm-help'>
          <a className='as-link' href={AGENT_SETTINGS_HREF}>{t('summary.link')}</a>
        </p>
      </section>
    </Box>
  )
}

export default AgentSettingsSummary
