import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Overlay from './overlay'

// This jsdom fixture models only native open/close calls and initial focus.
// Browser fixtures must establish actual top-layer focus trapping and inertness.
const prototype = HTMLDialogElement.prototype
const originalShow = Object.getOwnPropertyDescriptor(prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(prototype, 'close')

beforeEach(() => {
  Object.defineProperty(prototype, 'showModal', {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
      this.querySelector<HTMLElement>('button, input')?.focus()
    })
  })
  Object.defineProperty(prototype, 'close', {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) { this.removeAttribute('open') })
  })
})

afterEach(() => {
  cleanup()
  if (originalShow) Object.defineProperty(prototype, 'showModal', originalShow)
  else Reflect.deleteProperty(prototype, 'showModal')
  if (originalClose) Object.defineProperty(prototype, 'close', originalClose)
  else Reflect.deleteProperty(prototype, 'close')
  document.body.style.cssText = ''
})

describe('native controlled overlay', () => {
  it('portals into the body and keeps cancel/backdrop dismissal controlled', () => {
    const leave = vi.fn()
    const view = render(<Overlay show onLeave={leave}><button>Continue</button></Overlay>)
    const dialog = screen.getByRole('dialog') as HTMLDialogElement
    expect(dialog.parentElement).toBe(document.body)
    expect(view.container).not.toContainElement(dialog)
    expect(dialog.open).toBe(true)
    expect(fireEvent(dialog, new Event('cancel', { cancelable: true }))).toBe(false)
    expect(leave).toHaveBeenCalledTimes(1)
    expect(dialog.open).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(leave).toHaveBeenCalledTimes(1)
    fireEvent.click(dialog)
    expect(leave).toHaveBeenCalledTimes(2)
    view.rerender(<Overlay show={false} onLeave={leave}><button>Continue</button></Overlay>)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(prototype.close).toHaveBeenCalledTimes(1)
  })

  it('restores scroll styles and a connected opener after teardown', () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    document.body.style.overflow = 'scroll'
    document.body.style.paddingRight = '7px'
    const view = render(<Overlay show onLeave={() => {}}><button>Close</button></Overlay>)
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    view.unmount()
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.body.style.paddingRight).toBe('7px')
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('keeps nested scroll locks until the final modal unmounts', () => {
    const first = render(<Overlay show onLeave={() => {}}><button>First</button></Overlay>)
    const second = render(<Overlay show onLeave={() => {}} hidden><button>Second</button></Overlay>)
    expect(screen.getAllByRole('dialog')[1]).toHaveAttribute('data-hide-scrim', 'true')
    first.unmount()
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()
    second.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('does not silently render nonmodally without the native API', () => {
    Object.defineProperty(prototype, 'showModal', { configurable: true, value: undefined })
    expect(() => render(<Overlay show onLeave={() => {}}>Content</Overlay>)).toThrow(/native HTMLDialogElement.showModal/)
    expect(document.body.style.overflow).toBe('')
  })

  it('renders nothing and takes no scroll lock while switched off', () => {
    render(<Overlay show={false} onLeave={() => {}}>Content</Overlay>)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(prototype.showModal).not.toHaveBeenCalled()
  })
})
