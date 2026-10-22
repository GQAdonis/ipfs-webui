import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PinningManagerServiceModal } from './PinningManagerServiceModal.js'

const setup = add => {
  const success = vi.fn()
  render(<PinningManagerServiceModal t={key => key} service={{}} doAddPinningService={add} onSuccess={success} onLeave={() => {}} />)
  return { success, submit: screen.getByRole('button', { name: 'actions.save' }), fill: () => {
    fireEvent.change(screen.getByLabelText('pinningServiceModal.nickname'), { target: { value: 'Local pinning' } })
    fireEvent.change(screen.getByLabelText('pinningServiceModal.apiEndpoint'), { target: { value: 'https://pins.example/api' } })
    fireEvent.change(screen.getByLabelText('pinningServiceModal.secretApiKey'), { target: { value: 'test-key' } })
  } }
}

it('requires each field before issuing the existing service action', async () => {
  const add = vi.fn(); const { submit } = setup(add)
  fireEvent.submit(submit.closest('form'))
  await screen.findByText('errors.nickname')
  expect(add).not.toHaveBeenCalled()
})
it('submits registered values, blocks duplicate submits and closes only after success', async () => {
  let complete
  const add = vi.fn(() => new Promise(resolve => { complete = resolve }))
  const { submit, fill, success } = setup(add)
  fill(); fireEvent.click(submit)
  await waitFor(() => expect(add).toHaveBeenCalledTimes(1))
  expect(add.mock.calls[0][0]).toEqual({ nickname: 'Local pinning', apiEndpoint: 'https://pins.example/api', secretApiKey: 'test-key' })
  expect(submit).toBeDisabled()
  fireEvent.submit(submit.closest('form')); await waitFor(() => expect(add).toHaveBeenCalledTimes(1))
  expect(success).not.toHaveBeenCalled()
  complete(); await waitFor(() => expect(success).toHaveBeenCalledTimes(1))
})
it('keeps a server error visible and clears it when the operator edits', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    const { fill, submit, success } = setup(vi.fn().mockRejectedValue(new Error('Access denied')))
    fill(); fireEvent.click(submit)
    expect(await screen.findByRole('alert')).toHaveTextContent('Access denied')
    expect(success).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('pinningServiceModal.nickname'), { target: { value: 'New name' } })
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  } finally { log.mockRestore() }
})
