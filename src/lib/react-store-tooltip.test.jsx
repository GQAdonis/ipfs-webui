import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createTooltipController, TooltipLayer } from '../status/NodeBandwidthChart.js'

describe('bandwidth tooltip portal lifecycle', () => {
  it('updates the tooltip child without re-rendering its chart parent and removes the portal on teardown', () => {
    const controller = createTooltipController()
    const parentRender = vi.fn()
    function ChartParent () {
      parentRender()
      return <TooltipLayer controller={controller} />
    }
    const view = render(<ChartParent />)
    const tooltip = document.getElementById('node_bw_chart')
    expect(tooltip).toBeInTheDocument()
    act(() => controller.set({ show: true, t: word => word, bw: { in: [12, 'KiB'], out: [24, 'KiB'] }, pos: { top: 20, left: 40 } }))
    expect(tooltip).toHaveTextContent('12')
    expect(tooltip).toHaveTextContent('24')
    expect(parentRender).toHaveBeenCalledTimes(1)
    act(() => controller.set({ show: false }))
    expect(tooltip).toBeEmptyDOMElement()
    view.unmount()
    expect(tooltip).not.toBeInTheDocument()
    act(() => controller.set({ show: false }))
    expect(document.getElementById('node_bw_chart')).toBeNull()
  })
})
