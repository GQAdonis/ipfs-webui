import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import GatewayForm from './GatewayForm.js'

it('submits one changed URL through native Enter and preserves invalid/cleared off states', async () => {
  const user = userEvent.setup()
  const onUpdate = vi.fn()
  render(<GatewayForm t={key => key} savedValue='http://127.0.0.1:8080' onUpdate={onUpdate} inputId='fixture-gateway' ariaLabel='Local gateway' />)
  const input = screen.getByRole('textbox', { name: 'Local gateway' })
  await user.click(input)
  await user.keyboard('{Enter}')
  expect(onUpdate).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: 'http://127.0.0.1:8081' } })
  await user.keyboard('{Enter}')
  expect(onUpdate).toHaveBeenCalledTimes(1)
  expect(onUpdate).toHaveBeenLastCalledWith('http://127.0.0.1:8081')
  onUpdate.mockClear()
  fireEvent.change(input, { target: { value: 'invalid' } })
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByRole('button', { name: 'actions.submit' })).toBeDisabled()
  await user.keyboard('{Enter}')
  expect(onUpdate).not.toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: 'app:actions.clear' }))
  expect(onUpdate).toHaveBeenCalledTimes(1)
  expect(onUpdate).toHaveBeenLastCalledWith('')
  expect(input).toHaveValue('')
  expect(screen.getByRole('button', { name: 'app:actions.clear' })).toBeDisabled()
})
