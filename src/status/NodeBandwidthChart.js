import React, { useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Line } from '../lib/charts.js'
import { withTranslation } from 'react-i18next'
import { connect } from '../lib/react-store.js'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import { Title } from './Commons.js'
import { withChartPalette } from '../promethity/tokens.js'

// matching units returned by 'ipfs stats bw' in CLI
const bwUnits = {
  standard: 'iec',
  base: 2,
  bits: false
}

const chartsize = filesize.partial({ round: 1, exponent: 2, ...bwUnits })
const tootltipSize = filesize.partial({ round: 0, output: 'array', ...bwUnits })

// Numeric millisecond timestamps retain real elapsed spacing and the existing
// rolling window. Intl formats labels locally without a bundled date runtime.
export const defaultSettings = (palette) => ({
  responsive: true,
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: {
      type: 'linear',
      grid: { color: palette.grid },
      border: { color: palette.grid },
      ticks: { callback: value => new Date(value).toLocaleTimeString(), color: palette.textMuted, font: { family: palette.fontBody } }
    },
    y: {
      stacked: true,
      suggestedMax: 200000,
      grid: { color: palette.grid },
      border: { color: palette.grid },
      ticks: { callback: value => chartsize(value) + '/s', maxTicksLimit: 5, color: palette.textMuted, font: { family: palette.fontBody } }
    }
  },
  plugins: {
    tooltip: { enabled: false, position: 'nearest' },
    legend: { reverse: true, display: true, position: 'bottom', labels: { color: palette.text, font: { family: palette.fontBody } } }
  }
})

export function bandwidthTooltip ({ chart, tooltip }, t) {
  if (!tooltip.opacity || !tooltip.dataPoints?.length) return { show: false }
  const value = index => Math.abs(tooltip.dataPoints.find(point => point.datasetIndex === index)?.parsed?.y || 0)
  const rect = chart.canvas.getBoundingClientRect()
  return { t, show: true, bw: { out: tootltipSize(value(0)), in: tootltipSize(value(1)) }, pos: { left: rect.left + tooltip.caretX, top: rect.top + tooltip.caretY } }
}

const Tooltip = ({ t, bw, show, pos }) => {
  if (!show) {
    return null
  }

  // A `raised` fill over the chart, text on tokens; no shadow (DESIGN.md).
  // The caret is a clip-path triangle in the same fill.
  return (
    <div className='sans-serif absolute pa2 prom-chart-tooltip' style={{
      top: `${pos.top + window.scrollY}px`,
      left: `${pos.left + window.scrollX}px`,
      transform: 'translateY(calc(-100% - 20px))'
    }}>
      <div className='prom-chart-tooltip-caret' />
      <div className='dt'>
        <div className='dt-row'>
          <span className='dtc f7 tr prom-chart-tooltip-label'>{t('app:terms.in').toLowerCase()}:</span>
          <span className='f4 ml1 prom-chart-tooltip-value'>{bw.in[0]}</span>
          <span className='f7 prom-chart-tooltip-label'>{bw.in[1]}/s</span>
        </div>
        <div className='dt-row'>
          <span className='dtc f7 tr prom-chart-tooltip-label'>{t('app:terms.out').toLowerCase()}:</span>
          <span className='f4 ml1 prom-chart-tooltip-value'>{bw.out[0]}</span>
          <span className='f7 prom-chart-tooltip-label'>{bw.out[1]}/s</span>
        </div>
      </div>
    </div>
  )
}

// An independent subscribed child updates the tooltip without re-rendering the
// canvas or resetting its hover state. The portal shares the application's root
// and is removed with the chart, rather than leaving a separate React root alive.
export function createTooltipController () {
  let snapshot = { show: false }
  const listeners = new Set()
  return {
    getSnapshot: () => snapshot,
    subscribe: listener => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set: value => {
      snapshot = value
      listeners.forEach(listener => listener())
    }
  }
}

export function TooltipLayer ({ controller }) {
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot)
  const [container] = useState(() => {
    const element = document.createElement('div')
    element.id = 'node_bw_chart'
    return element
  })
  useLayoutEffect(() => {
    document.body.appendChild(container)
    return () => container.remove()
  }, [container])
  return createPortal(<Tooltip {...snapshot} />, container)
}

export class NodeBandwidthChart extends React.Component {
  static propTypes = {
    nodeBandwidthChartData: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
    animatedPoints: PropTypes.number
  }

  static defaultProps = {
    animatedPoints: 500 // Only animate for the first 500 points
  }

  tooltipController = createTooltipController()

  // Flat series fills from the token palette (webui-dataviz-reskin 1.1), one
  // fill per series. Both series are named in the legend.
  data = () => {
    const { t, nodeBandwidthChartData, palette } = this.props

    return {
      datasets: [
        {
          label: t('app:terms.out'),
          data: nodeBandwidthChartData.out,
          borderColor: palette.up,
          backgroundColor: palette.up,
          pointRadius: 2,
          fill: 'origin',
          cubicInterpolationMode: 'monotone'
        },
        {
          label: t('app:terms.in'),
          data: nodeBandwidthChartData.in,
          borderColor: palette.down,
          backgroundColor: palette.down,
          pointRadius: 2,
          fill: 'origin',
          cubicInterpolationMode: 'monotone'
        }
      ]
    }
  }

  componentDidUpdate () {
    this.tooltipController.set({ show: false })
  }

  render () {
    const { t, animatedPoints, nodeBandwidthChartData, palette } = this.props

    if (nodeBandwidthChartData.in.length === 0) {
      return null
    }

    const tooltipController = this.tooltipController
    const settings = defaultSettings(palette)

    const options = {
      ...settings,
      plugins: {
        ...settings.plugins,
        tooltip: {
          ...settings.plugins.tooltip,
          external: context => tooltipController.set(bandwidthTooltip(context, t))
        }
      },
      animation: {
        // Only animate the 500 points
        duration: nodeBandwidthChartData.in.length <= animatedPoints ? 1000 : 0
      }
    }

    return (
      <div>
        <Title>{t('bandwidthOverTime')}</Title>
        <Line data={this.data()} options={options} />
        <TooltipLayer controller={this.tooltipController} />
      </div>
    )
  }
}

export default connect('selectNodeBandwidthChartData', withTranslation('status')(withChartPalette(NodeBandwidthChart)))
