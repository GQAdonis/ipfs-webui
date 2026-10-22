import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContextMenu from './ContextMenu.js'
it('uses real DOM menu refs, focuses items and dismisses with Escape', () => {
  const trigger = document.createElement('button')
  document.body.appendChild(trigger); trigger.focus()
  const dismiss = vi.fn()
  try {
    const view = render(<ContextMenu visible target={{ current: trigger }} onDismiss={dismiss}><button role='menuitem'>First</button><button role='menuitem'>Second</button></ContextMenu>)
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'First' }))
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Second' }))
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(dismiss).toHaveBeenCalledTimes(1)
    view.unmount()
    expect(document.getElementById('portal-dropdown')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  } finally { trigger.remove() }
})
