import { useRef } from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useListWidth } from './list-width.js'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

it('measures after loading and releases the observer when the list leaves the page', () => {
  let resize
  const disconnect = vi.fn()
  const observe = vi.fn()
  vi.stubGlobal('ResizeObserver', class {
    constructor (callback) { resize = callback }
    observe = observe
    disconnect = disconnect
  })
  let width = 760
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ width }))
  function LoadingList ({ loading }) {
    const container = useRef(null)
    const measuredWidth = useListWidth(container, !loading)
    return <><output>{measuredWidth}</output>{!loading && <div ref={container} data-testid='list-container' />}</>
  }
  const view = render(<LoadingList loading />)
  expect(observe).not.toHaveBeenCalled()
  view.rerender(<LoadingList loading={false} />)
  expect(observe).toHaveBeenCalledWith(screen.getByTestId('list-container'))
  expect(screen.getByRole('status')).toHaveTextContent('760')
  width = 320
  act(() => resize())
  expect(screen.getByRole('status')).toHaveTextContent('320')
  view.unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
