import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Checkbox from './Checkbox.js'

it('names and focuses the native input through a React 19 ref and keeps controlled/disabled behavior', () => {
  const ref = createRef()
  const changed = vi.fn()
  const view = render(<Checkbox ref={ref} aria-label='Select fixture.txt' checked={null} onChange={changed} />)
  const input = screen.getByRole('checkbox', { name: 'Select fixture.txt' })
  expect(ref.current).toBe(input)
  ref.current.focus()
  expect(input).toHaveFocus()
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(changed).toHaveBeenCalledWith(true)
  view.rerender(<Checkbox ref={ref} aria-label='Select fixture.txt' checked disabled onChange={changed} />)
  expect(input).toBeChecked()
  expect(input).toBeDisabled()
  changed.mockClear()
  input.click()
  expect(changed).not.toHaveBeenCalled()
  view.unmount()
  expect(ref.current).toBeNull()
})
