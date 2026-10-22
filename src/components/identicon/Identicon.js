import React from 'react'
import md5 from 'blueimp-md5'
import theme from 'ipfs-css/theme.json'

const { colors } = theme
const identiconPalette = [colors.navy, colors.aqua, colors.gray, colors.charcoal, colors.red, colors.yellow, colors.teal, colors.green]

// Geometry and palette selection retained from react-identicons 1.2.5 (ISC).
// See provenance.md beside this file. SVG replaces its canvas lifecycle only.
/** @param {string | {toString: () => string}} cid @param {number} size @param {string[]} [palette] */
export function identiconCells (cid, size, palette = identiconPalette) {
  const hash = md5(String(cid || ''))
  const cell = Math.floor(size / 5)
  const index = Math.floor(parseInt(hash.slice(-3), 16) / 4095 * palette.length)
  const color = palette[index] || '#' + hash.slice(0, 6)
  const bits = hash.split('').map(character => parseInt(character, 16) >= 8)
  const columns = [bits.slice(0, 5), bits.slice(5, 10), bits.slice(10, 15), bits.slice(5, 10), bits.slice(0, 5)]
  return { cell, color, cells: columns.flatMap((column, x) => column.flatMap((filled, y) => filled ? [{ x, y }] : [])) }
}

/** @param {{size?: number, cid: string | {toString: () => string}, className?: string}} props */
export const Identicon = ({ size = 14, cid, className = 'v-btm' }) => {
  const { cell, color, cells } = identiconCells(cid, size)
  return <svg width={size} height={size} viewBox={`0 0 ${cell * 5} ${cell * 5}`} className={className} aria-hidden='true' shapeRendering='crispEdges'>
    {cells.map(({ x, y }) => <rect key={`${x},${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />)}
  </svg>
}
export default Identicon
