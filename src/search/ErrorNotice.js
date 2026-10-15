import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StatusLine } from '../promethity/components/index.js'
import { SEARCH_EGRESS_DOCS_URL, AGENT_SETTINGS_HASH } from './docs-link.js'

/**
 * Says what went wrong in words, once per error kind, and the one thing to do
 * about it. The text comes from the locale file by kind, never from the node's
 * message. `egress` names the hosts as plain text.
 *
 * @param {{ error: import('./errors.js').SearchError, onRetry?: () => void }} props
 */
const ErrorNotice = ({ error, onRetry }) => {
  const { t } = useTranslation('search')
  const kind = error.kind
  const base = `errors.${kind}`

  let body
  if (kind === 'egress') {
    body = (
      <>
        <p className='sr-error-text'>{error.hosts.length > 0 ? t('errors.egress.body') : t('errors.egress.bodyNoHosts')}</p>
        {error.hosts.length > 0
          ? <ul className='sr-hosts'>{error.hosts.map((host) => <li key={host}><code>{host}</code></li>)}</ul>
          : null}
        <p className='sr-error-text'>{t('errors.egress.fix')}</p>
        <a className='sr-link' href={SEARCH_EGRESS_DOCS_URL} target='_blank' rel='noopener noreferrer'>{t('errors.egress.link')}</a>
      </>
    )
  } else if (kind === 'rate_limited') {
    body = <p className='sr-error-text'>{t('errors.rate_limited.body', { seconds: error.retryAfter ?? 0 })}</p>
  } else {
    body = <p className='sr-error-text'>{t(`${base}.body`)}</p>
  }

  const retry = kind === 'unavailable' || kind === 'network' || kind === 'protocol' || kind === 'internal'
  return (
    <div className='sr-error' data-error-kind={kind}>
      <StatusLine tone={kind === 'rate_limited' ? 'warn' : 'err'} word={t(`${base}.word`)}>{null}</StatusLine>
      {body}
      {kind === 'unauthenticated'
        ? <a className='sr-link' href={AGENT_SETTINGS_HASH}>{t('errors.unauthenticated.link')}</a>
        : null}
      {retry && onRetry
        ? <button type='button' className='sr-secondary-button' onClick={onRetry}>{t(`${base}.retry`)}</button>
        : null}
    </div>
  )
}

ErrorNotice.propTypes = {
  error: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    hosts: PropTypes.arrayOf(PropTypes.string).isRequired,
    retryAfter: PropTypes.number
  }).isRequired,
  onRetry: PropTypes.func
}

export default ErrorNotice
