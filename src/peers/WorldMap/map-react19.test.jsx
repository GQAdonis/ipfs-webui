import { vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import * as d3 from 'd3'
import { MapPinsView } from './WorldMap.js'
it('preserves projected peer groups and exposes the same target to pointer/focus selection', () => {
  const enter = vi.fn(); const leave = vi.fn()
  const view = render(<MapPinsView width={700} height={350} path={d3.geoPath(d3.geoEquirectangular())} dot='var(--info)' peersCoordinates={[{ peerIds: ['peer-a', 'peer-b'], coordinates: [4, 50] }]} handleMouseEnter={enter} handleMouseLeave={leave} />)
  const pin = view.getByRole('img', { name: 'peer-a, peer-b' })
  expect(pin.tagName.toLowerCase()).toBe('path')
  expect(pin.getAttribute('d')).toBeTruthy()
  fireEvent.mouseEnter(pin); expect(enter).toHaveBeenLastCalledWith(['peer-a', 'peer-b'], pin)
  fireEvent.focus(pin); expect(enter).toHaveBeenLastCalledWith(['peer-a', 'peer-b'], pin)
  fireEvent.blur(pin); expect(leave).toHaveBeenCalledTimes(1)
})
