import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Button from '../components/button/button.tsx'
import { StatusLine } from '../promethity/components/index.js'
import { signInAgain, signOut } from './session.js'
import { useSession } from './use-session.js'

/**
 * Who is signed in, and how to sign out (console-session-auth 3.4). It replaces the endpoint and
 * token fields in session mode: the console signs the person in, so there is nothing to enter.
 *
 * `phase` is the settings page's phase. An ended sign-in or a missing second factor puts the one
 * thing to do first: sign in again. Signing out ends the console session only; the sign-in on
 * know-me.tools is separate and the panel says so.
 *
 * @param {{ phase?: string }} props
 */
const SessionPanel = ({ phase }) => {
  const { t } = useTranslation('agentChat')
  const session = useSession()
  if (!session) return null
  const { report, expired } = session
  const ended = expired || phase === 'unauthorized'
  const stepUp = !ended && (phase === 'step-up' || report.admin === 'step_up_required')

  return (
    <div data-id='AgentSessionPanel' className='ac-session-panel'>
      {/* An ended sign-in is said once, by the bar above the page; the panel then only offers the way back. */}
      {ended
        ? null
        : <StatusLine tone='ok' word={t('session.signedIn.word')}>{report.email ? t('session.signedIn.as', { email: report.email }) : t('session.signedIn.anonymous')}</StatusLine>}
      {stepUp ? <StatusLine tone='warn' word={t('session.stepUp.word')}>{t('session.stepUp.text')}</StatusLine> : null}
      <p className='pm-help'>{t('session.help')}</p>
      <div className='as-inline'>
        {ended || stepUp
          ? <Button buttonType='button' minWidth={120} onClick={() => signInAgain()}>{t('session.signInAgain')}</Button>
          : null}
        <Button buttonType='button' bg='bg-charcoal' minWidth={120} onClick={() => signOut()}>{t('session.signOut')}</Button>
      </div>
      <p className='pm-help' data-id='AgentSessionSignOutNote'>{t('session.signOutNote')}</p>
    </div>
  )
}

SessionPanel.propTypes = {
  phase: PropTypes.string
}

export default SessionPanel
