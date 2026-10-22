import { createRef } from 'react'
import { vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import Tooltip from './Tooltip'

it('preserves and disposes the child React19 ref', () => {
  const cleanup = vi.fn()
  const ref = vi.fn(() => cleanup)
  const view = render(<Tooltip text='Full label'><span ref={ref}>Label</span></Tooltip>)
  expect(ref).toHaveBeenCalledWith(view.getByText('Label'))
  view.unmount()
  expect(cleanup).toHaveBeenCalledTimes(1)
})

it('releases a replaced object ref and removes its resize listener with the file row', () => {
  const oldRef = createRef<HTMLSpanElement>()
  const nextRef = createRef<HTMLSpanElement>()
  const added = vi.spyOn(window, 'addEventListener')
  const removed = vi.spyOn(window, 'removeEventListener')
  const view = render(<Tooltip text='Full name'><span ref={oldRef}>File name</span></Tooltip>)
  const child = view.getByText('File name')
  expect(oldRef.current).toBe(child)
  view.rerender(<Tooltip text='Full name'><span ref={nextRef}>File name</span></Tooltip>)
  expect(oldRef.current).toBeNull()
  expect(nextRef.current).toBe(child)
  fireEvent.resize(window)
  view.unmount()
  expect(nextRef.current).toBeNull()
  for (const [, listener] of added.mock.calls.filter(([type]) => type === 'resize')) {
    expect(removed).toHaveBeenCalledWith('resize', listener)
  }
  added.mockRestore()
  removed.mockRestore()
})
