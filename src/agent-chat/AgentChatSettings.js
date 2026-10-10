import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/button/button.tsx'
import Title from '../settings/Title.js'
import { validateEndpoint } from './endpoint.js'
import { forgetToken, setToken, updateSettings } from './settings-store.js'
import { useAgentChatSettings } from './use-agent-chat-settings.js'
import { getBridge } from './bridge.js'

const inputClass = 'w-100 lh-copy monospace f5 pl1 pv1 mb2 charcoal input-reset ba b--black-20 br1'

/**
 * Settings for the agent chat: the switch (off by default), the `ipfs mcp` /agui URL
 * (no default) and the bearer token (saved in this browser profile).
 */
const AgentChatSettings = () => {
  const { t } = useTranslation('agentChat')
  const managed = getBridge() !== undefined
  const { settings, token } = useAgentChatSettings()
  const [endpointDraft, setEndpointDraft] = useState(settings.endpoint)
  const [tokenDraft, setTokenDraft] = useState('')
  const [endpointTouched, setEndpointTouched] = useState(false)

  const check = validateEndpoint(endpointDraft)
  const showEndpointError = endpointTouched && !check.ok
  const origin = globalThis.location?.origin || ''

  const saveEndpoint = (event) => {
    event.preventDefault()
    setEndpointTouched(true)
    if (check.ok) {
      updateSettings({ endpoint: check.value })
      setEndpointDraft(check.value)
    }
  }

  const saveToken = (event) => {
    event.preventDefault()
    if (tokenDraft === '') return
    setToken(tokenDraft)
    setTokenDraft('')
  }

  if (managed) {
    return (
      <div className='lh-copy charcoal' data-id='AgentChatSettings'>
        <Title>{t('title')}</Title>
        <p className='f6' role='status'>{t('desktopManaged')}</p>
      </div>
    )
  }

  return (
    <div className='lh-copy charcoal' data-id='AgentChatSettings'>
        <Title>{t('title')}</Title>
        <p className='f6'>{t('description')}</p>
        <p className='f6'>{t('originAllowlist')}</p>
        {origin ? <p className='f6'>{t('originValue')} <code className='monospace'>{origin}</code></p> : null}

        <label className='flex items-center mb3 pointer' htmlFor='agent-chat-toggle'>
          <input
            id='agent-chat-toggle'
            type='checkbox'
            className='mr2 pointer focus-outline'
            style={{ width: 20, height: 20 }}
            checked={settings.enabled}
            onChange={(e) => updateSettings({ enabled: e.target.checked })} />
          <span className='f5 lh-copy'>{t('toggle.label')}</span>
        </label>

        <form onSubmit={saveEndpoint} className='mb3'>
          <label htmlFor='agent-chat-endpoint' className='db f6 fw6 mb1'>{t('endpoint.label')}</label>
          <input
            id='agent-chat-endpoint'
            type='text'
            inputMode='url'
            autoComplete='off'
            spellCheck={false}
            placeholder={t('endpoint.placeholder')}
            className={`${inputClass} ${showEndpointError ? 'focus-outline-red b--red-muted' : 'focus-outline-green b--green-muted'}`}
            aria-invalid={showEndpointError}
            aria-describedby='agent-chat-endpoint-help'
            value={endpointDraft}
            onChange={(e) => setEndpointDraft(e.target.value)} />
          <p id='agent-chat-endpoint-help' className={`f6 mt0 mb2 ${showEndpointError ? 'maroon' : 'charcoal-muted'}`} role={showEndpointError ? 'alert' : undefined}>
            {showEndpointError ? t(`endpoint.error.${check.reason}`) : t('endpoint.help')}
          </p>
          <div className='tr'>
            <Button minWidth={100} height={40} className='tc' buttonType='submit'
              disabled={endpointDraft.trim() === settings.endpoint}>
              {t('app:actions.save')}
            </Button>
          </div>
        </form>

        <form onSubmit={saveToken} autoComplete='off'>
          <label htmlFor='agent-chat-token' className='db f6 fw6 mb1'>{t('token.label')}</label>
          <input
            id='agent-chat-token'
            type='password'
            autoComplete='off'
            spellCheck={false}
            className={`${inputClass} focus-outline-green b--green-muted`}
            aria-describedby='agent-chat-token-help'
            value={tokenDraft}
            onChange={(e) => setTokenDraft(e.target.value)} />
          <p id='agent-chat-token-help' className='f6 mt0 mb2 charcoal-muted'>{t('token.help')}</p>
          <p className='f6 mt0 mb2' role='status'>{token ? t('token.isSet') : t('token.isNotSet')}</p>
          <div className='tr'>
            <Button minWidth={100} height={40} className='tc' bg='bg-charcoal' buttonType='button'
              disabled={!token} onClick={forgetToken}>
              {t('token.forget')}
            </Button>
            <Button minWidth={100} height={40} className='mt2 mt0-l ml2-l tc' buttonType='submit'
              disabled={tokenDraft === ''}>
              {t('token.set')}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default AgentChatSettings
