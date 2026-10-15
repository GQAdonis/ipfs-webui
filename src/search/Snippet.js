import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const PREVIEW_CHARS = 480

/**
 * The text of a hit. Untrusted: it is rendered as a text node only, so markup
 * in it stays visible characters and creates no element, and Markdown is not
 * interpreted. `dir="auto"` with plaintext bidi isolation keeps right-to-left
 * text from reordering anything around it. Long passages are cut with a control
 * to show the rest.
 *
 * @param {{ text: string }} props
 */
const Snippet = ({ text }) => {
  const { t } = useTranslation('search')
  const [open, setOpen] = useState(false)
  const long = text.length > PREVIEW_CHARS
  const shown = long && !open ? `${text.slice(0, PREVIEW_CHARS).trimEnd()}…` : text
  return (
    <div className='sr-snippet-wrap'>
      <p className='sr-snippet' dir='auto'>{shown}</p>
      {long
        ? (
          <button type='button' className='sr-text-button' aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? t('results.showLess') : t('results.showMore')}
          </button>
          )
        : null}
    </div>
  )
}

Snippet.propTypes = { text: PropTypes.string.isRequired }

export default Snippet
