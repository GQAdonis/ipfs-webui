import React from 'react'
import ReactDOM from 'react-dom'
import { Line } from 'react-chartjs-2'
import { withTranslation } from 'react-i18next'
import { connect } from 'redux-bundler-react'
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

// Chart.js 2 reads canvas colours, not CSS, so axis, grid and legend colours
// come from the token palette (src/promethity/tokens.js). Grid lines are a
// `raised` fill step on the panel, not a drawn rule.
const defaultSettings = (palette) => ({
  defaultFontFamily: palette.fontBody,
  defaultFontColor: palette.textMuted,
  responsive: true,
  tooltips: {
    mode: 'x',
    position: 'nearest',
    enabled: false
  },
  hover: { mode: 'index' },
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        minUnit: 'second'
      },
      gridLines: { color: palette.grid, zeroLineColor: palette.grid },
      ticks: { fontColor: palette.textMuted, fontFamily: palette.fontBody }
    }],
    yAxes: [{
      stacked: true,
      gridLines: { color: palette.grid, zeroLineColor: palette.grid },
      ticks: {
        callback: v => chartsize(v) + '/s',
        suggestedMax: 200000,
        maxTicksLimit: 5,
        fontColor: palette.textMuted,
        fontFamily: palette.fontBody
      }
    }]
  },
  legend: {
    reverse: true,
    display: true,
    position: 'bottom',
    labels: { fontColor: palette.text, fontFamily: palette.fontBody }
  }
})

const Tooltip = ({ t, bw, show, pos }) => {
  if (!show) {
    return null
  }

  // A `raised` fill over the chart, text on tokens; no shadow (DESIGN.md).
  // The caret is a clip-path triangle in the same fill.
  return (
    <div className='sans-serif absolute pa2 prom-chart-tooltip' style={{
      top: `${pos.top + window.scrollY}px`,
      left: `${pos.left}px`,
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

class NodeBandwidthChart extends React.Component {
  static propTypes = {
    nodeBandwidthChartData: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
    animatedPoints: PropTypes.number
  }

  static defaultProps = {
    animatedPoints: 500 // Only animate for the first 500 points
  }

  // getTooltip adds the tooltip element to the DOM if it doesn't
  // exist yet and returns the element.
  getTooltip = (t) => {
    let tooltip = document.getElementById('node_bw_chart')

    if (!tooltip) {
      tooltip = document.createElement('div')
      tooltip.id = 'node_bw_chart'
      document.body.appendChild(tooltip)
    }

    ReactDOM.render(<Tooltip t={t} show={false} />, tooltip)
    return tooltip
  }

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
          cubicInterpolationMode: 'monotone'
        },
        {
          label: t('app:terms.in'),
          data: nodeBandwidthChartData.in,
          borderColor: palette.down,
          backgroundColor: palette.down,
          pointRadius: 2,
          cubicInterpolationMode: 'monotone'
        }
      ]
    }
  }

  componentDidMount () {
    // Setup tooltip
    this.tooltip = document.createElement('div')
    this.tooltip.id = 'node_bw_chart'
    document.body.appendChild(this.tooltip)
  }

  componentDidUpdate () {
    ReactDOM.render(<Tooltip show={false} />, this.tooltip)
  }

  render () {
    const { t, animatedPoints, nodeBandwidthChartData, palette } = this.props

    if (nodeBandwidthChartData.in.length === 0) {
      return null
    }

    const tooltip = this.tooltip
    const settings = defaultSettings(palette)

    const options = {
      ...settings,
      tooltips: {
        ...settings.tooltips,
        custom: function (model) {
          const data = { show: true }

          if (model.opacity === 0) {
            data.show = false
          } else {
            data.bw = {
              out: tootltipSize(Math.abs(model.dataPoints[0].yLabel)),
              in: tootltipSize(Math.abs(model.dataPoints[1].yLabel))
            }

            const rect = this._chart.canvas.getBoundingClientRect()
            data.pos = {
              left: rect.left + model.caretX,
              top: rect.top + model.caretY
            }
          }

          // I know this isn't a very React-y way of doing this, but there was a simple issue:
          // re-rendering the tooltip was also re-rendering the chart which then lost its focus
          // state causing the Tooltip to stick and not disappear.
          ReactDOM.render(<Tooltip t={t} {...data} />, tooltip)
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
      </div>
    )
  }
}

export default connect('selectNodeBandwidthChartData', withTranslation('status')(withChartPalette(NodeBandwidthChart)))
