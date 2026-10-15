import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StatusLine } from '../promethity/components/index.js'
import { formatBytes, formatCount } from './format.js'
import { AGENT_SETTINGS_HASH } from './docs-link.js'

/** @param {{ label: string, children: React.ReactNode }} props */
const Row = ({ label, children }) => (
  <div className='sr-kv'>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
)
Row.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node }

const RUN_TONE = Object.freeze({ running: 'info', paused: 'warn', completed: 'ok', cancelled: 'warn', failed: 'err', unknown: 'warn' })

/**
 * The last bulk run, read only. There is no control that starts, pauses or
 * resumes a run: the panel says to ask the agent, which asks the person to
 * confirm.
 *
 * @param {{ run: import('./client.js').BulkRun | undefined }} props
 */
const BulkRunView = ({ run }) => {
  const { t } = useTranslation('search')
  if (!run) {
    return (
      <div className='sr-run' data-run-state='none'>
        <StatusLine tone='info' word={t('status.bulk.none')}>{null}</StatusLine>
      </div>
    )
  }
  const state = run.state in RUN_TONE ? run.state : 'unknown'
  const reasons = Object.entries(run.skippedByReason).filter(([, n]) => n > 0)
  return (
    <div className='sr-run' data-run-state={state}>
      <StatusLine tone={/** @type {'ok' | 'warn' | 'err' | 'info'} */ (RUN_TONE[/** @type {keyof typeof RUN_TONE} */ (state)])} word={t(`status.bulk.state.${state}`)}>
        {t(`status.bulk.stateText.${state}`)}
      </StatusLine>
      <dl className='sr-kvs'>
        <Row label={t('status.bulk.seen')}>{formatCount(run.filesSeen)}</Row>
        <Row label={t('status.bulk.indexed')}>{formatCount(run.filesIndexed)}</Row>
        <Row label={t('status.bulk.skipped')}>{formatCount(run.filesSkipped)}</Row>
        <Row label={t('status.bulk.passages')}>{formatCount(run.chunksIndexed)}</Row>
        <Row label={t('status.bulk.bytes')}>{formatBytes(run.bytesRead)}</Row>
        {run.startedBy ? <Row label={t('status.bulk.startedBy')}>{run.startedBy}</Row> : null}
      </dl>
      {state === 'failed' && run.lastError
        ? <p className='sr-run-error'><strong>{t('status.bulk.lastError')}</strong> <span dir='auto'>{run.lastError}</span></p>
        : null}
      {reasons.length > 0
        ? (
          <>
            <h4 className='sr-subheading'>{t('status.bulk.skippedHeading')}</h4>
            <ul className='sr-reasons'>
              {reasons.map(([reason, n]) => (
                <li key={reason}>
                  <span>{t(`status.bulk.reason.${reason}`, { defaultValue: reason })}</span>
                  <span className='sr-num'>{formatCount(n)}</span>
                </li>
              ))}
            </ul>
          </>
          )
        : null}
    </div>
  )
}
BulkRunView.propTypes = { run: PropTypes.object }

/**
 * The index status panel (read only). One variant per situation, so no variant
 * shows a control or a number it cannot back.
 *
 * @param {Object} props
 * @param {import('./availability-store.js').Availability} props.availability
 * @param {() => void} props.onRefresh
 */
const IndexStatusPanel = ({ availability, onRefresh }) => {
  const { t } = useTranslation('search')
  const { phase, status } = availability

  let body
  if (phase === 'checking' && !status) {
    body = <StatusLine tone='info' word={t('status.checking')}>{null}</StatusLine>
  } else if (status?.configured) {
    body = (
      <>
        {status.storeReachable === false
          ? <StatusLine tone='err' word={t('status.storeDownWord')}>{t('status.storeDown')}</StatusLine>
          : <StatusLine tone='ok' word={t('status.configuredWord')}>{t('status.configured', { mode: status.mode, model: status.model || '-' })}</StatusLine>}
        <dl className='sr-kvs'>
          <Row label={t('status.files')}>{formatCount(status.indexedCids)}</Row>
          <Row label={t('status.chunks')}>{formatCount(status.chunkCount)}</Row>
          {status.dimensions ? <Row label={t('status.model')}>{status.model} <span className='sr-muted'>{t('status.dimensions', { count: status.dimensions })}</span></Row> : null}
        </dl>
        <p className='sr-note'>{t('status.counts')}</p>
        <h3 className='sr-subheading'>{t('status.bulk.heading')}</h3>
        <BulkRunView run={status.bulkRun} />
        <p className='sr-note'>{t('status.bulk.askAgent')}</p>
      </>
    )
  } else if (phase === 'denied') {
    // The words follow the answer: a 401 means the token was not accepted, a 403 means it was
    // accepted and has no search access. Never the one for the other.
    body = <p className='sr-note'>{availability.error?.kind === 'forbidden' ? t('status.forbidden') : t('errors.unauthenticated.body')}</p>
  } else if (phase === 'unconnected') {
    body = <p className='sr-note'>{t('status.unconnected')}</p>
  } else if (phase === 'unconfigured' && availability.error && availability.error.kind !== 'not_configured') {
    body = <StatusLine tone='warn' word={t('status.unreachableWord')}>{t('status.unreachable')}</StatusLine>
  } else {
    body = (
      <>
        <StatusLine tone='warn' word={t('status.notConfiguredWord')}>{t('status.notConfigured')}</StatusLine>
      </>
    )
  }

  return (
    <section className='sr-status' aria-labelledby='sr-status-heading' aria-busy={phase === 'checking'}>
      <div className='sr-status-head'>
        <h2 id='sr-status-heading' className='sr-h2'>{t('status.heading')}</h2>
        {phase !== 'unconnected' ? <button type='button' className='sr-text-button' onClick={onRefresh}>{t('status.refresh')}</button> : null}
      </div>
      {body}
      {phase === 'denied' && availability.error?.kind !== 'forbidden'
        ? <a className='sr-link' href={AGENT_SETTINGS_HASH}>{t('gate.unconnected.link')}</a>
        : null}
    </section>
  )
}

IndexStatusPanel.propTypes = {
  availability: PropTypes.shape({
    phase: PropTypes.string.isRequired,
    status: PropTypes.object,
    error: PropTypes.object,
    connection: PropTypes.string.isRequired
  }).isRequired,
  onRefresh: PropTypes.func.isRequired
}

export default IndexStatusPanel
