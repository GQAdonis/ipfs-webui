import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyToClipboard, copyText } from './CopyToClipboard.js'
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (_key, options) => options.defaultValue }) }))
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
it('copies before signalling success and preserves the child action', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  const copied = vi.fn(); const clicked = vi.fn()
  render(<CopyToClipboard text='bafyexample' onCopy={copied}><button onClick={clicked}>Copy</button></CopyToClipboard>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => expect(copied).toHaveBeenCalledWith('bafyexample', true))
  expect(clicked).toHaveBeenCalledTimes(1)
  expect(writeText).toHaveBeenCalledWith('bafyexample')
})
it('offers the synchronous fallback and restores focus', async () => {
  vi.stubGlobal('navigator', {})
  const previous = document.execCommand
  document.execCommand = vi.fn(() => true)
  const button = document.createElement('button'); document.body.appendChild(button); button.focus()
  try { await copyText('hello'); expect(document.execCommand).toHaveBeenCalledWith('copy'); expect(document.activeElement).toBe(button); expect(document.querySelector('textarea')).toBeNull() } finally { button.remove(); document.execCommand = previous }
})
it('does not dismiss or claim copied when both clipboard paths fail', async () => {
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
  const copied = vi.fn()
  render(<CopyToClipboard text='cid' onCopy={copied}><button>Copy</button></CopyToClipboard>)
  fireEvent.click(screen.getByRole('button'))
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not copy')
  expect(copied).not.toHaveBeenCalled()
})
