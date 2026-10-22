import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { Home } from './Home.jsx'

it('exposes draft suggestions as a named group and preserves their draft-only actions', () => {
  const controller = { setIntent: vi.fn(), setDraft: vi.fn(), submit: vi.fn() }
  render(<Home controller={controller} assistantStatus='Unavailable' ipfsReady={false} />)
  const suggestions = within(screen.getByRole('group', { name: 'Draft suggestions' }))
  expect(suggestions.getAllByRole('button')).toHaveLength(3)

  fireEvent.click(suggestions.getByRole('button', { name: 'Show my node status' }))
  expect(controller.setIntent).toHaveBeenLastCalledWith('ask')
  expect(controller.setDraft).toHaveBeenLastCalledWith('Show my node status')
  fireEvent.click(suggestions.getByRole('button', { name: 'Open Files' }))
  expect(controller.setIntent).toHaveBeenLastCalledWith('go')
  expect(controller.setDraft).toHaveBeenLastCalledWith('/files')
  fireEvent.click(suggestions.getByRole('button', { name: 'Search my content' }))
  expect(controller.setIntent).toHaveBeenLastCalledWith('search')
  expect(controller.setDraft).toHaveBeenLastCalledWith('')
  expect(controller.submit).not.toHaveBeenCalled()
})
