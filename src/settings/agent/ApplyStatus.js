import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/button/button.tsx'
import { StatusLine } from '../../promethity/components/index.js'
import { useAgentSettings } from './AgentSettings.js'
import { failureText } from './failure-text.js'
import { focusChatSwitch, useChatOn } from './use-chat-on.js'

/** @param {string | undefined} iso */
const timeOf = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')

/**
 * The one status region of the form (assessment-ui 5.3): unsaved changes,
 * applying, applied, failed. Every state is an icon, a word and a sentence. The
 * apply is hot, so the page never says "restart required". On failure the
 * region takes focus, so the reason is read before the form is touched again.
 */
export const ApplyStatus = () => {
  const { t } = useTranslation('agentSettings')
  const { state, meta } = useAgentSettings()
  const chatOn = useChatOn()
  const failedRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const failedAt = state.apply.state === 'failed' ? state.apply.at : undefined

  useEffect(() => {
    if (failedAt) failedRef.current?.focus()
  }, [failedAt])

  const { apply, draft, server } = state
  const content = (() => {
    if (apply.state === 'applying') return <StatusLine tone='info' word={t('apply.applying.word')}>{t('apply.applying.text')}</StatusLine>
    if (apply.state === 'failed') {
      return (
        <div ref={failedRef} tabIndex={-1} className='as-focus-target' data-testid='apply-failure'>
          <StatusLine tone='err' word={t('apply.failed.word')}>
            {apply.failure?.kind === 'revision_conflict'
              ? t('apply.conflict.text')
              : <>{t(server?.backend ? 'apply.failed.text' : 'apply.failed.textFirst')} {failureText(t, apply.failure, { host: meta.confirmation.host })}</>}
          </StatusLine>
        </div>
      )
    }
    if (apply.state === 'applied' && apply.applied) {
      return (
        <StatusLine tone='ok' word={t('apply.applied.word')}>
          {t(apply.applied.first ? 'apply.applied.textFirst' : 'apply.applied.text', { time: timeOf(apply.at), model: apply.applied.model, host: apply.applied.host })}
          {chatOn
            ? null
            : <> {t('apply.applied.chatOff')} <Button buttonType='button' type='link' minWidth={0} onClick={focusChatSwitch}>{t('apply.applied.goToSwitch')}</Button></>}
        </StatusLine>
      )
    }
    if (state.elsewhere) return <StatusLine tone='warn' word={t('apply.elsewhere.word')}>{t('apply.elsewhere.text')}</StatusLine>
    if (meta.dirty) {
      const reason = meta.blockers.find((b) => b !== 'busy' && b !== 'clean')
      if (reason === 'unavailable') return <StatusLine tone='warn' word={t('uar.unavailable.word')}>{t('apply.blocked.unavailable')}</StatusLine>
      return (
        <StatusLine tone='info' word={t('apply.dirty.word')}>
          {reason ? t(`apply.blocked.${reason}`) : t('apply.dirty.text')}
        </StatusLine>
      )
    }
    if (server && !server.backend && draft.kind === '') return <StatusLine tone='warn' word={t('apply.firstRun.word')}>{t('apply.firstRun.text')}</StatusLine>
    return <StatusLine tone='info' word={t('apply.clean.word')}>{t('apply.clean.text')}</StatusLine>
  })()

  return <div aria-live='polite'>{content}</div>
}
