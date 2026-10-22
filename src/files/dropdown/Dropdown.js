import React, { useLayoutEffect, useRef } from 'react'
import { CodeIcon as StrokeCode } from '../../promethity/icons.js'

export const Option = ({ children, onClick, className = '', isCliTutorModeEnabled, onCliTutorMode, ...props }) => (
  isCliTutorModeEnabled && onCliTutorMode
    ? <div className='flex items-center justify-between'>
      <button role='menuitem' className={`bg-animate hover-bg-near-white pa2 pointer flex items-center flex-grow-1 ${className}`} onClick={onClick} {...props}>
        {children}
      </button>
      <button {...props} role='menuitem' aria-label={`${React.Children.toArray(children).filter(child => typeof child === 'string').join(' ')} (CLI)`} onClick={() => onCliTutorMode(true)} className={`bg-animate hover-bg-near-white pa2 pointer flex items-center ${className}`}>
        <StrokeCode aria-hidden='true' className='dib fill-link pointer' style={{ height: 38 }}/>
      </button>
    </div>
    : <button role="menuitem" className={`bg-animate hover-bg-near-white pa2 pointer flex items-center ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
)

const cssLength = value => typeof value === 'number' ? `${value}px` : value

export function DropdownMenu ({ children, ref, width = 200, translateX = 0, translateY = 0, top = '100%', left = `calc(100% - ${width}px)`, open = false, onDismiss, className = '' }) {
  const menu = useRef(null)
  const dismiss = useRef(onDismiss)
  const restoreFocus = useRef(true)
  const opener = useRef(null)
  useLayoutEffect(() => { dismiss.current = onDismiss }, [onDismiss])
  useLayoutEffect(() => {
    if (!open) return
    const element = menu.current
    const trigger = document.activeElement
    opener.current = trigger
    restoreFocus.current = true
    element.querySelector('button:not(:disabled)')?.focus()
    const onPointerDown = event => {
      // The trigger shares the positioning container; its own handler toggles.
      if (!element.parentElement?.contains(event.target)) {
        restoreFocus.current = false
        dismiss.current?.()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      if (restoreFocus.current && (element.contains(document.activeElement) || document.activeElement === document.body)) trigger?.focus?.()
    }
  }, [open])
  const onKeyDown = event => {
    event.stopPropagation()
    if (event.key === 'Escape') {
      event.preventDefault()
      opener.current?.focus?.()
      dismiss.current?.()
    } else if (event.key === 'Tab') {
      restoreFocus.current = false
      dismiss.current?.()
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const items = Array.from(menu.current.querySelectorAll('button:not(:disabled)'))
      const current = items.indexOf(document.activeElement)
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
      items[index]?.focus()
    }
  }
  return <div ref={node => {
    menu.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }} role='menu' tabIndex={-1} aria-hidden={!open} inert={!open} onKeyDown={onKeyDown}
  className={`sans-serif br2 charcoal flex flex-column ${className}`}
  style={{ position: 'absolute', width, top, left, transform: `translate(${cssLength(translateX)}, ${cssLength(translateY)})`, visibility: open ? 'visible' : 'hidden', pointerEvents: open ? 'auto' : 'none', background: 'var(--raised)', zIndex: 30 }}>
    {children}
  </div>
}

export function Dropdown ({ children, className = '', ...props }) {
  return <div className={`relative ${className}`} {...props}>{children}</div>
}
