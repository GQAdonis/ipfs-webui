import { vi } from 'vitest'
import { render } from '@testing-library/react'
import { NodeBandwidthChart, bandwidthTooltip, defaultSettings } from './NodeBandwidthChart.js'
import Speedometer from './Speedometer.js'
const { line, gauge } = vi.hoisted(() => ({ line: vi.fn(), gauge: vi.fn() }))
vi.mock('../lib/charts.js', () => ({ Line: props => { line(props); return null }, Doughnut: props => { gauge(props); return null } }))
vi.mock('../promethity/tokens.js', () => ({ withChartPalette: component => component, useChartPalette: () => ({ down: 'var(--info)', track: 'var(--raised)' }) }))
const palette = { fontBody: 'Bundled font', textMuted: 'var(--text-muted)', grid: 'var(--raised)', text: 'var(--text)', down: 'var(--info)', up: 'var(--text)' }
it('preserves the supplied timestamp window, series fills and animation cutoff', () => {
  const data = { in: [{ x: 1000, y: 1024 }, { x: 4000, y: 2048 }], out: [{ x: 1000, y: -512 }, { x: 4000, y: -1024 }] }
  render(<NodeBandwidthChart t={key => key} palette={palette} nodeBandwidthChartData={data} animatedPoints={1} />)
  const props = line.mock.lastCall[0]
  expect(props.data.datasets.map(series => series.data)).toEqual([data.out, data.in])
  expect(props.data.datasets.every(series => series.fill === 'origin')).toBe(true)
  expect(props.options.animation.duration).toBe(0)
  expect(defaultSettings(palette).scales.x.type).toBe('linear')
})
it('reads parsed tooltip values by series identity and hides on dismissal', () => {
  const chart = { canvas: { getBoundingClientRect: () => ({ left: 10, top: 20 }) } }
  const snapshot = bandwidthTooltip({ chart, tooltip: { opacity: 1, caretX: 3, caretY: 4, dataPoints: [{ datasetIndex: 1, parsed: { y: 2048 } }, { datasetIndex: 0, parsed: { y: -1024 } }] } }, key => key)
  expect(snapshot.bw.in[0]).toBe(2)
  expect(snapshot.bw.out[0]).toBe(1)
  expect(snapshot.pos).toEqual({ left: 13, top: 24 })
  expect(bandwidthTooltip({ chart, tooltip: { opacity: 0 } })).toEqual({ show: false })
})
it('uses Chart4 degree angles and the original gauge gap/cutout', () => {
  render(<Speedometer filled={25} total={100} title='Inbound' />)
  const props = gauge.mock.lastCall[0]
  expect(props.options.rotation).toBeCloseTo(234)
  expect(props.options.circumference).toBeCloseTo(252)
  expect(props.options.cutout).toBe('80%')
  expect(props.data.datasets[0].data).toEqual([25, 75])
})
