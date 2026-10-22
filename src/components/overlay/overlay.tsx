import React, { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './overlay.css'

const scrollLocks = new WeakMap<Document, { count: number, overflow: string, overflowPriority: string, padding: string, paddingPriority: string }>()

function lockScroll (document: Document) {
  const body = document.body
  const existing = scrollLocks.get(document)
  if (existing) existing.count++
  else {
    scrollLocks.set(document, {
      count: 1,
      overflow: body.style.getPropertyValue('overflow'),
      overflowPriority: body.style.getPropertyPriority('overflow'),
      padding: body.style.getPropertyValue('padding-right'),
      paddingPriority: body.style.getPropertyPriority('padding-right')
    })
    const view = document.defaultView
    const width = document.documentElement.clientWidth
    const scrollbar = view && width ? Math.max(0, view.innerWidth - width) : 0
    if (view && scrollbar) body.style.paddingRight = `${parseFloat(view.getComputedStyle(body).paddingRight || '0') + scrollbar}px`
    body.style.overflow = 'hidden'
  }
  return () => {
    const state = scrollLocks.get(document)
    if (!state || --state.count) return
    body.style.setProperty('overflow', state.overflow, state.overflowPriority)
    body.style.setProperty('padding-right', state.padding, state.paddingPriority)
    scrollLocks.delete(document)
  }
}

export interface OverlayProps {
  show: boolean
  onLeave: () => void
  hidden?: boolean
  className?: string
  children?: React.ReactNode
}

const Overlay: React.FC<OverlayProps> = ({ children, show, onLeave, hidden, className = '' }) => {
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!show || !dialog) return
    // A nonmodal fallback would silently remove focus/inertness guarantees.
    // Test environments supply their own native-dialog fixture implementation.
    if (typeof dialog.showModal !== 'function') throw new Error('WebUI modals require native HTMLDialogElement.showModal support')
    const document = dialog.ownerDocument
    const opener = document.activeElement as HTMLElement | null
    const unlock = lockScroll(document)
    try { dialog.showModal() } catch (error) { unlock(); throw error }
    return () => {
      const ownedFocus = dialog.contains(document.activeElement) || document.activeElement === document.body
      if (dialog.open) dialog.close()
      unlock()
      if (ownedFocus && opener?.isConnected && !opener.closest('[inert]')) opener.focus({ preventScroll: true })
    }
  }, [show])

  if (!show || typeof document === 'undefined') return null
  // Native dialog cancellation supplies the keyboard equivalent of backdrop dismissal.
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- The native dialog owns Escape via onCancel; backdrop clicks are optional pointer dismissal. */
  return createPortal(
    <dialog
      ref={ref}
      aria-modal='true'
      className={`webui-overlay prom-scrim ${className}`}
      data-hide-scrim={hidden || undefined}
      onCancel={event => {
        event.preventDefault()
        onLeave()
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onLeave()
      }}>
      {children}
    </dialog>,
    document.body
  )
}

export default Overlay
