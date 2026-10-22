import React, { Children, cloneElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** @param {string | number} text */
export async function copyText (text) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(String(text)); return } catch { /* Try the gateway-compatible fallback below. */ }
  }
  // HTTP loopback and older gateway browsers may not expose Clipboard API.
  const selection = document.getSelection()
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : []
  const focused = /** @type {HTMLElement | null} */ (document.activeElement)
  const input = document.createElement('textarea')
  input.value = String(text)
  input.setAttribute('readonly', '')
  input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
  document.body.appendChild(input)
  try {
    input.select()
    if (!document.execCommand?.('copy')) throw new Error('Clipboard unavailable')
  } finally {
    input.remove()
    focused?.focus?.({ preventScroll: true })
    if (selection) { selection.removeAllRanges(); ranges.forEach(range => selection.addRange(range)) }
  }
}

/** @param {{text: string | number, onCopy?: (text: string | number, copied: boolean) => void, children: import('react').ReactElement<{ onClick?: import('react').MouseEventHandler, disabled?: boolean }>}} props */
export function CopyToClipboard ({ text, onCopy, children }) {
  const child = Children.only(children)
  const { t } = useTranslation('app')
  const [failed, setFailed] = useState(false)
  return <>{cloneElement(child, {
    onClick: async event => {
      child.props.onClick?.(event)
      if (event.defaultPrevented || child.props.disabled) return
      try { await copyText(text); setFailed(false); onCopy?.(text, true) } catch { setFailed(true) }
    }
  })}{failed && <span role='alert' className='db red f7'>{t('clipboardFailed', { defaultValue: 'Could not copy. Select and copy the text manually.' })}</span>}</>
}
