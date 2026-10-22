import React from 'react'

// Same 3.3.0 flag artwork previously fetched from cdnjs, now bundled locally.
const flags = /** @type {Record<string, string>} */ (import.meta.glob('../../../node_modules/flag-icon-css/flags/4x3/*.svg', { query: '?url&no-inline', import: 'default', eager: true, exhaustive: true }))
/** @param {{code?: string, svg?: boolean, styleProps?: import('react').CSSProperties, title?: string, className?: string}} props */
export default function CountryFlag ({ code, svg = false, styleProps, title, className }) {
  if (typeof code !== 'string' || !/^[a-z]{2}$/i.test(code)) return null
  const url = flags[`../../../node_modules/flag-icon-css/flags/4x3/${code.toLowerCase()}.svg`]
  const emoji = code.toUpperCase().replace(/./g, character => String.fromCodePoint(character.charCodeAt(0) + 127397))
  return <span role='img' aria-label={code} title={title || code} className={className}
    style={svg && url ? { position: 'relative', display: 'inline-block', width: '1.3333333333em', height: '1em', backgroundImage: `url("${url}")`, backgroundPosition: '50%', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', fontSize: '1em', lineHeight: '1em', verticalAlign: 'middle', ...styleProps } : { verticalAlign: 'middle', ...styleProps }}>
    {svg && url ? null : emoji}
  </span>
}
