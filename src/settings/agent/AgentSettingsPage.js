import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { StatusLine } from '../../promethity/components/index.js'
import { titleWithBrand } from '../../promethity/page-title.js'
import { useChatOn } from './use-chat-on.js'
import { AgentSettingsProvider, useAgentSettings } from './AgentSettings.js'
import { BackendSection } from './BackendSection.js'
import { ConnectionSection } from './ConnectionSection.js'
import { FeaturesSection } from './FeaturesSection.js'
import { failureText } from './failure-text.js'
import { useSettingsClient } from './use-settings-client.js'
import './agent-settings.css'

/** @param {string | undefined} iso */
const timeOf = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')

/**
 * The current truth in one status line: whether the chat is on, which backend
 * is in effect, and when this browser last applied a change. The only history
 * shown is "last applied here"; the node keeps none.
 */
const Header = () => {
  const { t } = useTranslation('agentSettings')
  const { state, actions, meta } = useAgentSettings()
  const chatOn = useChatOn()
  const chat = chatOn ? t('header.chatOn') : t('header.chatOff')
  const backend = state.server?.backend
  const applied = meta.status?.applied

  let line
  if (state.phase === 'loading') {
    line = <StatusLine tone='info' word={t('header.loading.word')}>{t('header.loading.text')}</StatusLine>
  } else if (state.phase === 'needs-connection') {
    line = <StatusLine tone='warn' word={t('header.needsConnection.word')}>{t('header.needsConnection.text')}</StatusLine>
  } else if (state.phase === 'unauthorized') {
    line = <StatusLine tone='err' word={t('header.unauthorized.word')}>{t('header.unauthorized.text')}</StatusLine>
  } else if (state.phase === 'unavailable') {
    line = <StatusLine tone='warn' word={t('header.unavailable.word')}>{t('header.unavailable.text')}</StatusLine>
  } else if (state.phase === 'error') {
    line = <StatusLine tone='err' word={t('header.error.word')}>{t('header.error.text')} {failureText(t, state.failure)}</StatusLine>
  } else if (!backend) {
    line = <StatusLine tone='warn' word={t('header.noBackend.word')}>{t('header.noBackend.text', { chat })}</StatusLine>
  } else {
    line = (
      <StatusLine tone='ok' word={t('header.configured.word')}>
        {t(backend.kind === 'uar' ? 'header.configured.uar' : 'header.configured.openai', { chat, model: backend.model ?? '', host: backend.base_url ?? '' })}
        {applied?.ok ? ` ${t('header.appliedHere', { time: timeOf(applied.at) })}` : ''}
      </StatusLine>
    )
  }

  return (
    <header className='as-header'>
      <a className='as-back' href='#/settings'>{t('header.back')}</a>
      <h1 className='as-h1'>{t('title')}</h1>
      <div aria-live='polite'>{line}</div>
      {state.phase === 'error'
        ? <Button buttonType='button' bg='bg-charcoal' minWidth={120} onClick={() => void actions.load()}>{t('header.retry')}</Button>
        : null}
    </header>
  )
}

const Body = () => {
  const { state } = useAgentSettings()
  // When the only thing the person can do is connect or sign in, Connection comes first.
  const connectFirst = state.phase === 'needs-connection' || state.phase === 'unauthorized'
  return (
    <>
      <Header />
      {connectFirst ? <ConnectionSection /> : null}
      {state.phase === 'ready' ? <BackendSection /> : null}
      <FeaturesSection />
      {connectFirst ? null : <ConnectionSection />}
    </>
  )
}

/**
 * `#/settings/agent`. The transport is chosen once, here: the Desktop bridge
 * when the main process exposed it, else HTTP to the node the chat points at.
 * A `client` prop replaces that choice (tests, and any host with its own).
 *
 * @param {{ client?: import('./core/types.js').SettingsClient, managed?: boolean, now?: () => number }} props
 */
export const AgentSettingsPage = ({ client: injected, managed: injectedManaged, now }) => {
  const { t } = useTranslation('agentSettings')
  const picked = useSettingsClient()
  const client = injected ?? picked.client
  const managed = injectedManaged ?? picked.managed
  return (
    <div data-id='AgentSettingsPage' className='mw8 center as-page'>
      <Helmet>
        <title>{titleWithBrand(t('title'))}</title>
      </Helmet>
      <AgentSettingsProvider client={client} connectionKey={picked.root} managed={managed} now={now}>
        <Body />
      </AgentSettingsProvider>
    </div>
  )
}

export default AgentSettingsPage
