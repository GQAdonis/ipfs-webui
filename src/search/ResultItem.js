import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { baseName } from './plain-text.js'
import CidChip from './CidChip.js'
import Snippet from './Snippet.js'
import ProvenanceLabel from './ProvenanceLabel.js'
import { FilesIcon, ExploreIcon } from '../promethity/icons.js'

/** @param {number} score */
const formatScore = (score) => score.toFixed(2)

/**
 * One hit: what file it is, how to open it, where its text came from and the
 * text itself. File name and path are untrusted text; the links are built from
 * the CID alone, which the client has already checked.
 *
 * @param {{ hit: import('./client.js').Hit }} props
 */
const ResultItem = ({ hit }) => {
  const { t } = useTranslation('search')
  const name = baseName(hit.path)
  return (
    <li className='sr-result'>
      <article>
        <header className='sr-result-head'>
          <h3 className='sr-result-title' dir='auto'>{name || t('results.noPath')}</h3>
          {hit.path && hit.path !== name
            ? <p className='sr-result-path' dir='auto'>{hit.path}</p>
            : null}
        </header>
        <ul className='sr-meta'>
          {hit.kind ? <li><span className='sr-badge sr-badge-kind'>{t(`kind.${hit.kind}`)}</span></li> : null}
          {hit.source ? <li><ProvenanceLabel source={hit.source} describedBy={hit.describedBy} /></li> : null}
          <li className='sr-meta-text'>{t('results.score', { score: formatScore(hit.score) })}</li>
          <li className='sr-meta-text'>{t('results.chunk', { number: hit.chunkIndex + 1 })}</li>
        </ul>
        <Snippet text={hit.text} />
        <div className='sr-result-foot'>
          <CidChip cid={hit.cid} />
          <span className='sr-actions'>
            <a className='sr-action' href={`#/ipfs/${hit.cid}`}>
              <FilesIcon aria-hidden='true' />
              {t('results.openFiles')}
            </a>
            <a className='sr-action' href={`#/explore/${hit.cid}`}>
              <ExploreIcon aria-hidden='true' />
              {t('results.openExplore')}
            </a>
          </span>
        </div>
      </article>
    </li>
  )
}

ResultItem.propTypes = {
  hit: PropTypes.shape({
    cid: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    chunkIndex: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    kind: PropTypes.string,
    source: PropTypes.string,
    mimeType: PropTypes.string,
    describedBy: PropTypes.string.isRequired
  }).isRequired
}

export default React.memo(ResultItem)
