import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { PROVENANCE_KEY } from './content-kinds.js'

/**
 * Says where a hit's text came from, in words. A description is model output
 * and is labelled "AI description by <model>" with the info tone; the other
 * sources are the file's own text or text read out of it.
 *
 * @param {{ source: import('./content-kinds.js').Source | undefined, describedBy: string }} props
 */
const ProvenanceLabel = ({ source, describedBy }) => {
  const { t } = useTranslation('search')
  if (!source) return null
  const key = PROVENANCE_KEY[source]
  const label = key === 'aiDescription'
    ? (describedBy ? t('provenance.aiDescription', { model: describedBy }) : t('provenance.aiDescriptionUnnamed'))
    : t(`provenance.${key}`)
  return (
    <span className={classNames('sr-badge', key === 'aiDescription' ? 'sr-badge-model' : 'sr-badge-file')} data-source={source}>
      {label}
    </span>
  )
}

ProvenanceLabel.propTypes = {
  source: PropTypes.oneOf(['text', 'extracted', 'ocr', 'transcript', 'description']),
  describedBy: PropTypes.string.isRequired
}

export default ProvenanceLabel
