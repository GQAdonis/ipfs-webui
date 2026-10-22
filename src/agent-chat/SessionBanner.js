import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/button/button.tsx'
import { StatusLine } from '../promethity/components/index.js'
import { REVALIDATE_MS, markSessionExpired, revalidateSession, signInAgain } from './session.js'
import { useSession } from './use-session.js'
import './session.css'

const SESSION_EXPIRED_EVENT = 'ipfs-agent-chat-session-expired'

/**
 * Console session mode only; renders nothing otherwise and starts nothing. It does two jobs.
 * It keeps the page honest about the sign-in: the island reports a 401 by event, the clients by
 * the session store, and a slow re-check (every few minutes and when the tab comes back) catches
 * an ended sign-in that no call has met yet. When the sign-in has ended it shows "Sign in again",
 * which navigates the whole page; no saved credential is tried.
 */
const SessionBanner = () => {
  const { t } = useTranslation('agentChat')
  const session = useSession()
  const active = session !== undefined

  useEffect(() => {
    if (!active) return undefined
    const onExpired = () => markSessionExpired()
    const onVisible = () => { if (globalThis.document?.visibilityState === 'visible') void revalidateSession() }
    globalThis.document?.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    globalThis.document?.addEventListener('visibilitychange', onVisible)
    const timer = setInterval(() => { void revalidateSession() }, REVALIDATE_MS)
    return () => {
      globalThis.document?.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
      globalThis.document?.removeEventListener('visibilitychange', onVisible)
      clearInterval(timer)
    }
  }, [active])

  if (!session?.expired) return null
  return (
    <div className='ac-session-banner' data-id='AgentSessionExpired'>
      <StatusLine tone='err' word={t('session.expired.word')}>{t('session.expired.text')}</StatusLine>
      <Button buttonType='button' minWidth={120} onClick={() => signInAgain()}>{t('session.signInAgain')}</Button>
    </div>
  )
}

export default SessionBanner
