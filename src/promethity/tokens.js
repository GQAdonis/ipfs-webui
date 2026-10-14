// Chart and map colours resolved from the Promethity CSS tokens
// (webui-dataviz-reskin 1.1). Canvas (Chart.js) and SVG attribute fills cannot
// use var(), so the data-viz files read the live token values here instead of
// carrying hex. A chart reads this at render and again whenever the resolved
// theme changes (useChartPalette), so light and dark both hold without a
// reload. tokens.css stays the only place a colour value is written.
//
// Series assignment (kubo DESIGN.md, Color): ember `accent` stays out of data
// marks (it is the one decision per view), neutrals carry labels and tracks,
// and the four state hues double as the categorical set because they hold at
// least 4.9:1 on `surface` in both themes. A chart that colours by series
// always names each series in its legend, so colour never carries meaning
// alone.

import React, { useMemo } from 'react'
import { useTheme } from './use-theme.js'

/**
 * Read one custom property from the document root.
 * Returns '' when the token is not defined (a test document without
 * tokens.css), which canvas and SVG treat as "use the default".
 *
 * @param {string} name token name without the leading dashes, e.g. 'surface'
 * @returns {string}
 */
export function readToken (name) {
  if (typeof document === 'undefined') return ''
  const root = document.documentElement
  return getComputedStyle(root).getPropertyValue(`--${name}`).trim()
}

/**
 * @typedef {Object} ChartPalette
 * @property {string} down inbound traffic series
 * @property {string} up outbound traffic series
 * @property {string[]} categorical ordered categorical series
 * @property {string} other the "everything else" slice and neutral marks
 * @property {string} track the unfilled remainder of a meter
 * @property {string} surface the panel the chart sits on, used as slice gaps
 * @property {string} text primary label colour
 * @property {string} textMuted tick and legend colour
 * @property {string} grid axis grid lines (a fill step, not a rule)
 * @property {string} dot peer markers on the map
 * @property {string} fontBody the body font stack for axis and legend text
 */

/**
 * Resolve the full chart palette from the current theme's tokens.
 *
 * @returns {ChartPalette}
 */
export function chartPalette () {
  const info = readToken('info')
  const warn = readToken('warn')
  const ok = readToken('ok')
  const textMuted = readToken('text-muted')
  return {
    down: info,
    // Outgoing traffic is the neutral `text` colour, not `warn`: warn means
    // "waiting" everywhere else in the system, and outgoing data is not a warning.
    up: readToken('text'),
    categorical: [info, warn, ok],
    other: textMuted,
    track: readToken('raised'),
    surface: readToken('surface'),
    text: readToken('text'),
    textMuted,
    grid: readToken('raised'),
    dot: info,
    fontBody: readToken('font-body')
  }
}

/**
 * The palette for the current theme, recomputed when the resolved theme
 * changes. Charts that take this as a render input redraw on a theme switch.
 *
 * @returns {ChartPalette}
 */
export function useChartPalette () {
  const { resolvedTheme } = useTheme()
  // resolvedTheme is the invalidation key: the token values behind it change
  // with it, so the memo must not outlive a theme switch.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => chartPalette(), [resolvedTheme])
}

/**
 * Class-component adapter: injects `palette` as a prop and re-renders the
 * wrapped component when the theme changes.
 *
 * @template P
 * @param {React.ComponentType<P & { palette: ChartPalette }>} Component
 * @returns {React.FC<P>}
 */
export function withChartPalette (Component) {
  /** @param {P} props */
  const WithChartPalette = (props) => {
    const palette = useChartPalette()
    return <Component {...props} palette={palette} />
  }
  WithChartPalette.displayName = `withChartPalette(${Component.displayName || Component.name || 'Component'})`
  return WithChartPalette
}
