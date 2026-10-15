import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { CopyIcon, CheckIcon } from '../promethity/icons.js'

const RESET_MS = 2000

/**
 * A CID, in full, with a copy control. The value is text in a `<code>`; the copy
 * button is named "Copy CID" and, once pressed, announces "CID copied." through
 * a status region. Clipboard access can be refused; then nothing is announced.
 *
 * @param {{ cid: string }} props
 */
const CidChip = ({ cid }) => {
  const { t } = useTranslation('search')
  const [copied, setCopied] = useState(false)
  /** @type {React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>} */
  const timer = useRef()
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const copy = async () => {
    try {
      await globalThis.navigator.clipboard.writeText(cid)
    } catch (_) {
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), RESET_MS)
  }

  const Icon = copied ? CheckIcon : CopyIcon
  return (
    <span className='sr-cid'>
      <span className='sr-cid-label'>{t('results.cid')}</span>
      <code className='sr-cid-value'>{cid}</code>
      <button type='button' className='sr-icon-button' onClick={copy}>
        <Icon aria-hidden='true' />
        <span className='sr-visually-hidden'>{t('results.copy')}</span>
      </button>
      <span className='sr-visually-hidden' role='status'>{copied ? t('results.copied') : ''}</span>
    </span>
  )
}

CidChip.propTypes = { cid: PropTypes.string.isRequired }

export default CidChip
