import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/box/Box.js'
import Button from '../../components/button/button.tsx'
import Title from '../Title.js'
import { Field, FieldInput, StatusLine, Switch } from '../../promethity/components/index.js'
import { validateEndpoint } from '../../agent-chat/endpoint.js'
import { settingsRootFromEndpoint } from './core/url.js'
import { forgetToken, setToken, updateSettings } from '../../agent-chat/settings-store.js'
import { useAgentChatSettings } from '../../agent-chat/use-agent-chat-settings.js'
import { forgetAdminToken, forgetAdminTokenUnless, setAdminToken, setAdminTokenRemembered } from './core/admin-token.js'
import { useAdminTokenState } from './use-admin-token.js'
import { useAgentSettings } from './AgentSettings.js'

/** Under Desktop the main process owns the connection; the manual fields are not rendered at all. */
const ManagedConnection = () => {
  const { t } = useTranslation('agentSettings')
  const { meta } = useAgentSettings()
  const sidecar = meta.status?.sidecar
  return (
    <div data-id='AgentSettingsManaged'>
      {sidecar?.running === false
        ? <StatusLine tone='warn' word={t('connection.managed.stopped.word')}>{t('connection.managed.stopped.text')}</StatusLine>
        : (
          <StatusLine tone='info' word={t('connection.managed.word')}>
            {sidecar?.port ? t('connection.managed.port', { port: sidecar.port }) : t('connection.managed.text')}
          </StatusLine>
          )}
      <p className='pm-help'>{t('connection.managed.help')}</p>
    </div>
  )
}

/** The chat endpoint and the chat's own token (the ui principal), as before this page existed. */
const ChatConnection = () => {
  const { t } = useTranslation('agentSettings')
  const { t: tc } = useTranslation('agentChat')
  const { settings, token } = useAgentChatSettings()
  const [endpointDraft, setEndpointDraft] = useState(settings.endpoint)
  const [tokenDraft, setTokenDraft] = useState('')
  const [touched, setTouched] = useState(false)
  const check = validateEndpoint(endpointDraft)
  const showError = touched && !check.ok
  const origin = globalThis.location?.origin || ''

  const saveEndpoint = (/** @type {React.SyntheticEvent} */ e) => {
    e.preventDefault()
    setTouched(true)
    if (check.ok) {
      // The admin bearer was typed for the node the endpoint named; another endpoint is another node.
      forgetAdminTokenUnless(settingsRootFromEndpoint(check.value))
      updateSettings({ endpoint: check.value })
      setEndpointDraft(check.value)
    }
  }
  const saveToken = (/** @type {React.SyntheticEvent} */ e) => {
    e.preventDefault()
    if (tokenDraft === '') return
    setToken(tokenDraft)
    setTokenDraft('')
  }

  return (
    <div data-id='AgentChatConnection'>
      <p className='pm-help'>{tc('originAllowlist')}</p>
      {origin ? <p className='pm-help'>{tc('originValue')} <code className='monospace'>{origin}</code></p> : null}

      <form onSubmit={saveEndpoint} className='as-conn-form'>
        <Field label={tc('endpoint.label')} help={tc('endpoint.help')} error={showError ? tc(`endpoint.error.${check.ok ? 'invalid' : check.reason}`) : undefined} errorLabel={t('error')}>
          <div className='as-inline'>
            <FieldInput
              type='text'
              inputMode='url'
              autoComplete='off'
              spellCheck={false}
              placeholder={tc('endpoint.placeholder')}
              value={endpointDraft}
              onChange={(e) => setEndpointDraft(e.target.value)}
              onBlur={() => setTouched(true)}
            />
            <Button buttonType='submit' bg='bg-charcoal' minWidth={100} disabled={endpointDraft.trim() === settings.endpoint}>{t('save')}</Button>
          </div>
        </Field>
      </form>

      <form onSubmit={saveToken} autoComplete='off' className='as-conn-form'>
        <Field label={tc('token.label')} help={tc('token.help')}>
          <div className='as-inline'>
            <FieldInput type='password' autoComplete='off' data-1p-ignore='true' spellCheck={false} value={tokenDraft} onChange={(e) => setTokenDraft(e.target.value)} />
            <Button buttonType='submit' bg='bg-charcoal' minWidth={100} disabled={tokenDraft === ''}>{tc('token.set')}</Button>
            <Button buttonType='button' type='link' minWidth={100} disabled={!token} onClick={forgetToken}>{tc('token.forget')}</Button>
          </div>
        </Field>
        <p className='pm-help' role='status'>{token ? tc('token.isSet') : tc('token.isNotSet')}</p>
      </form>
    </div>
  )
}

/**
 * The admin token, which can change the model backend. Held in memory; the
 * person can keep it for this tab (sessionStorage). It is never put in
 * localStorage. A refused token (HTTP 401) puts this field in front of the page
 * with "Sign in again".
 */
const AdminAccess = () => {
  const { t } = useTranslation('agentSettings')
  const { state } = useAgentSettings()
  const { settings } = useAgentChatSettings()
  const { set: hasToken, root: tokenRoot, remembered } = useAdminTokenState()
  const [draft, setDraft] = useState('')
  const refused = state.phase === 'unauthorized'
  const root = settingsRootFromEndpoint(settings.endpoint)

  const use = (/** @type {React.SyntheticEvent} */ e) => {
    e.preventDefault()
    if (draft === '' || !root) return
    setAdminToken(draft, { remember: remembered, root })
    setDraft('')
  }

  return (
    <form onSubmit={use} autoComplete='off' className='as-conn-form' data-id='AgentSettingsAdmin'>
      {refused ? <StatusLine tone='err' word={t('admin.refused.word')}>{t('admin.refused.text')}</StatusLine> : null}
      {root ? null : <StatusLine tone='warn' word={t('admin.noRoot.word')}>{t('admin.noRoot.text')}</StatusLine>}
      <Field label={t('admin.label')} help={t('admin.help')}>
        <div className='as-inline'>
          <FieldInput type='password' autoComplete='off' data-1p-ignore='true' spellCheck={false} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Button buttonType='submit' bg='bg-charcoal' minWidth={100} disabled={draft === '' || !root}>{refused ? t('admin.signIn') : t('admin.use')}</Button>
          <Button buttonType='button' type='link' minWidth={100} disabled={!hasToken} onClick={forgetAdminToken}>{t('admin.forget')}</Button>
        </div>
      </Field>
      <p className='pm-help' role='status'>{hasToken ? (remembered ? t('admin.heldTab', { root: tokenRoot }) : t('admin.heldMemory', { root: tokenRoot })) : t('admin.none')}</p>
      <Switch
        label={t('admin.keep.label')}
        help={t('admin.keep.help')}
        checked={remembered}
        disabled={!hasToken}
        onChange={setAdminTokenRemembered}
        onText={t('on')}
        offText={t('off')}
      />
    </form>
  )
}

/**
 * How the page reaches the node. Under Desktop that is the bridge and there is
 * nothing to enter; elsewhere it is the chat endpoint (whose origin locates the
 * settings route) plus the chat token and the admin token.
 */
export const ConnectionSection = () => {
  const { t } = useTranslation('agentSettings')
  const { meta } = useAgentSettings()
  return (
    <Box className='mb3 pa4-l pa3'>
      <section aria-labelledby='as-connection-title' data-id='AgentSettingsConnection'>
        <Title props={{ id: 'as-connection-title' }}>{t('connection.title')}</Title>
        {meta.managedByDesktop
          ? <ManagedConnection />
          : (
            <>
              <p className='pm-help as-lede'>{t('connection.lede')}</p>
              <ChatConnection />
              <AdminAccess />
            </>
            )}
      </section>
    </Box>
  )
}
