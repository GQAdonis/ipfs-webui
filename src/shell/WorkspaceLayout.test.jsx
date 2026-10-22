import { useEffect, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { WorkspaceLayout } from './WorkspaceLayout.jsx'

const slots = () => ({
  navigator: <nav aria-label='IPFS navigation'><a href='#/files'>Files</a></nav>,
  header: <input aria-label='IPFS path' />,
  application: <h1>Files operation</h1>,
  conversation: <section aria-label='Agent conversation'><input aria-label='Agent draft' /></section>,
  canvas: <section aria-label='Live canvas'><button type='button'>Inspect result</button></section>,
  route: 'files'
})

it('places navigation, application and one right assistant in application mode', () => {
  const { container } = render(<WorkspaceLayout {...slots()} />)
  const workspace = container.firstElementChild
  expect(workspace).toHaveAttribute('data-workspace-mode', 'application')
  expect([...workspace.querySelectorAll('[data-workspace-slot]')].map(node => node.dataset.workspaceSlot))
    .toEqual(['navigator', 'header', 'application', 'conversation', 'canvas'])
  expect(screen.getByRole('main')).toHaveAttribute('data-route', 'files')
  expect(screen.getByRole('banner')).toContainElement(screen.getByRole('textbox', { name: 'IPFS path' }))
  expect(screen.getByRole('heading', { name: 'Files operation' })).toBeVisible()
  expect(screen.getByRole('region', { name: 'Agent conversation' })).toBeVisible()
  expect(workspace.querySelector('[data-workspace-slot="conversation"]')).toHaveAttribute('data-workspace-placement', 'assistant')
  expect(screen.queryByRole('region', { name: 'Live canvas' })).toBeNull()
  expect(workspace.querySelector('[data-workspace-slot="canvas"]')).toHaveAttribute('hidden')
})

it('uses the same conversation DOM as the thread beside the supplied canvas', () => {
  const supplied = slots()
  const view = render(<WorkspaceLayout {...supplied} />)
  const conversation = screen.getByRole('region', { name: 'Agent conversation' })
  const canvas = view.container.querySelector('[data-workspace-slot="canvas"]').firstElementChild
  const application = screen.getByRole('heading', { name: 'Files operation' })

  view.rerender(<WorkspaceLayout {...supplied} mode='conversation' />)
  expect(screen.getByRole('region', { name: 'Agent conversation' })).toBe(conversation)
  expect(conversation.parentElement).toHaveAttribute('data-workspace-placement', 'thread')
  expect(screen.getByRole('region', { name: 'Live canvas' })).toBe(canvas)
  expect(screen.queryByRole('heading', { name: 'Files operation' })).toBeNull()
  expect(application.parentElement).toHaveAttribute('hidden')
  expect(screen.getAllByRole('main')).toHaveLength(1)

  view.rerender(<WorkspaceLayout {...supplied} />)
  expect(screen.getByRole('heading', { name: 'Files operation' })).toBe(application)
  expect(canvas.parentElement).toHaveAttribute('hidden')
})

it('preserves local application state and one live conversation subscription until unmount', () => {
  const subscribe = vi.fn()
  const dispose = vi.fn()
  function Application () {
    const [selected, setSelected] = useState(false)
    return <button type='button' aria-pressed={selected} onClick={() => setSelected(!selected)}>Selected file</button>
  }
  function Conversation () {
    useEffect(() => { subscribe(); return dispose }, [])
    return <input aria-label='Agent draft' defaultValue='' />
  }
  const supplied = { ...slots(), application: <Application />, conversation: <Conversation /> }
  const view = render(<WorkspaceLayout {...supplied} />)
  const selection = screen.getByRole('button', { name: 'Selected file' })
  const draft = screen.getByRole('textbox', { name: 'Agent draft' })
  fireEvent.click(selection)
  fireEvent.change(draft, { target: { value: 'Unsent work' } })
  draft.focus()

  view.rerender(<WorkspaceLayout {...supplied} mode='conversation' />)
  expect(screen.getByRole('textbox', { name: 'Agent draft' })).toBe(draft)
  expect(draft).toHaveValue('Unsent work')
  expect(draft).toHaveFocus()
  expect(subscribe).toHaveBeenCalledTimes(1)
  expect(dispose).not.toHaveBeenCalled()

  view.rerender(<WorkspaceLayout {...supplied} />)
  expect(screen.getByRole('button', { name: 'Selected file' })).toBe(selection)
  expect(selection).toHaveAttribute('aria-pressed', 'true')
  expect(draft).toHaveFocus()
  expect(subscribe).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(dispose).toHaveBeenCalledTimes(1)
})

it.each([null, undefined, false])('keeps IPFS available with no agent (%s), without mounting canvas or history', conversation => {
  const canvasMounted = vi.fn()
  function Canvas () { useEffect(canvasMounted, []); return <p>Agent result</p> }
  const { container } = render(<WorkspaceLayout {...slots()} mode='conversation' conversation={conversation} canvas={<Canvas />} />)
  expect(container.firstElementChild).toHaveAttribute('data-workspace-mode', 'application')
  expect(screen.getByRole('heading', { name: 'Files operation' })).toBeVisible()
  expect(container.querySelector('[data-workspace-slot="conversation"]')).toBeNull()
  expect(container.querySelector('[data-workspace-slot="canvas"]')).toBeNull()
  expect(canvasMounted).not.toHaveBeenCalled()
})

it('disposes the single conversation when its host disables agent features', () => {
  const dispose = vi.fn()
  function Conversation () {
    useEffect(() => dispose, [])
    return <input aria-label='Agent draft' />
  }
  const supplied = { ...slots(), conversation: <Conversation /> }
  const view = render(<WorkspaceLayout {...supplied} mode='conversation' />)
  expect(screen.getByRole('textbox', { name: 'Agent draft' })).toBeVisible()
  view.rerender(<WorkspaceLayout {...supplied} mode='conversation' conversation={null} />)
  expect(screen.queryByRole('textbox', { name: 'Agent draft' })).toBeNull()
  expect(screen.getByRole('heading', { name: 'Files operation' })).toBeVisible()
  expect(dispose).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(dispose).toHaveBeenCalledTimes(1)
})

it('rejects unknown modes instead of silently presenting an invented layout', () => {
  expect(() => render(<WorkspaceLayout {...slots()} mode='unknown' />)).toThrow('Unknown workspace mode')
})

it('keeps the real application as the live canvas with scroll and selection across full/closed transitions', () => {
  const supplied = { ...slots(), application: <div><input aria-label='File selection' defaultValue='selected file' /><p>Existing file view</p></div>, canvas: null }
  const view = render(<WorkspaceLayout {...supplied} applicationInCanvas />)
  const application = view.container.querySelector('[data-workspace-slot="application"]')
  const conversation = view.container.querySelector('[data-workspace-slot="conversation"]')
  application.scrollTop = 240
  conversation.scrollTop = 120
  const selection = screen.getByRole('textbox', { name: 'File selection' })
  selection.setSelectionRange(2, 6)
  view.rerender(<WorkspaceLayout {...supplied} mode='conversation' applicationInCanvas />)
  expect(application).not.toHaveAttribute('hidden')
  expect(screen.getByRole('textbox', { name: 'File selection' })).toBe(selection)
  expect(application.scrollTop).toBe(240)
  expect(conversation.scrollTop).toBe(120)
  expect(selection.selectionStart).toBe(2)
  view.rerender(<WorkspaceLayout {...supplied} mode='conversation' pane='full' applicationInCanvas />)
  expect(application).toHaveAttribute('hidden')
  expect(screen.queryByRole('textbox', { name: 'File selection' })).toBeNull()
  view.rerender(<WorkspaceLayout {...supplied} pane='closed' applicationInCanvas />)
  expect(application).not.toHaveAttribute('hidden')
  expect(application.scrollTop).toBe(240)
  expect(conversation.scrollTop).toBe(120)
  expect(conversation).toHaveAttribute('hidden')
  expect(screen.queryByRole('textbox', { name: 'Agent draft' })).toBeNull()
})
