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
 * `phase` is the settings page's phase.
 *  - Ended sign-in: said once, by the bar above the page (so no status line here); the panel offers
 *    "Sign in again" (a reload, which sends the page back through the console's sign-in) and sign out.
 *  - Step-up: the console cookie is still good, so a reload would return the same token without the
 *    second factor. The one working way back is to sign out of the console (which ends its session and
 *    starts a fresh login) and sign in again with the second factor, so that is the primary action.
 *    The settings header announces the state; this panel's line is announced only when the header does
 *    not (the pre-warning while the page still loads).
 * Signing out ends the console session only; the sign-in on know-me.tools is separate and the panel says so.
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
      {ended
        ? null
        : <StatusLine tone='ok' word={t('session.signedIn.word')}>{report.email ? t('session.signedIn.as', { email: report.email }) : t('session.signedIn.anonymous')}</StatusLine>}
      {stepUp ? <StatusLine tone='warn' word={t('session.stepUp.word')} announce={phase !== 'step-up'}>{t('session.stepUp.text')}</StatusLine> : null}
      <p className='pm-help'>{t('session.help')}</p>
      <div className='as-inline'>
        {ended
          ? <Button buttonType='button' minWidth={120} onClick={() => signInAgain()}>{t('session.signInAgain')}</Button>
          : null}
        {stepUp
          ? <Button buttonType='button' minWidth={120} onClick={() => signOut()}>{t('session.stepUp.action')}</Button>
          : <Button buttonType='button' bg='bg-charcoal' minWidth={120} onClick={() => signOut()}>{t('session.signOut')}</Button>}
      </div>
      <p className='pm-help' data-id='AgentSessionSignOutNote'>{t('session.signOutNote')}</p>
    </div>
  )
}

SessionPanel.propTypes = {
  phase: PropTypes.string
}

export default SessionPanel
