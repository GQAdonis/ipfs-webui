import { vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import AutoSizer from './AutoSizer.js'
it('measures the table width and disposes its observer', () => {
  let resize; let width = 320
  const disconnect = vi.fn()
  vi.stubGlobal('ResizeObserver', class { constructor (callback) { resize = callback } observe () {} disconnect = disconnect })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ width }))
  try {
    const view = render(<AutoSizer>{({ width }) => <span>{width}</span>}</AutoSizer>)
    expect(screen.getByText('320')).toBeVisible()
    width = 640; act(() => resize())
    expect(screen.getByText('640')).toBeVisible()
    view.unmount(); expect(disconnect).toHaveBeenCalledTimes(1)
  } finally { vi.restoreAllMocks(); vi.unstubAllGlobals() }
})
