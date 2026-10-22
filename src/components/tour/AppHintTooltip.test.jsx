import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import AppHintTooltip from './AppHintTooltip.jsx'

const props = () => ({
  index: 0,
  tooltipProps: { role: 'alertdialog', 'aria-modal': true },
  closeProps: { 'aria-label': 'Schließen', title: 'Schließen', 'data-action': 'close', role: 'button', onClick: vi.fn() },
  step: {
    content: <p>Hier können Sie die Führung starten.</p>,
    styles: {
      tooltip: { color: 'var(--text)', backgroundColor: 'var(--accent-tint)', borderRadius: 'var(--radius-md)' },
      tooltipContainer: { textAlign: 'center' },
      tooltipContent: { padding: '0 20px 0 0' },
      buttonClose: { color: 'var(--text)', height: 12, width: 12, padding: 8, position: 'absolute' }
    }
  }
})

it('names the nonmodal hint with its translated content and preserves the resolved skin and Close action', () => {
  const input = props()
  render(<AppHintTooltip {...input} />)
  const hint = screen.getByRole('dialog', { name: 'Hier können Sie die Führung starten.' })
  expect(hint).toHaveAttribute('aria-modal', 'false')
  expect(screen.queryByRole('alertdialog')).toBeNull()
  expect(hint).toHaveClass('react-joyride__tooltip')
  expect(hint.style.backgroundColor).toBe('var(--accent-tint)')
  expect(hint.style.borderRadius).toBe('var(--radius-md)')
  expect(hint.querySelector('p').parentElement.style.paddingRight).toBe('20px')
  const close = screen.getByRole('button', { name: 'Schließen' })
  expect(close).toHaveAttribute('type', 'button')
  expect(close).toHaveAttribute('data-action', 'close')
  expect(close.querySelector('svg')).toHaveAttribute('width', '12')
  expect(close.querySelector('svg')).toHaveAttribute('height', '12')
  expect(close.querySelector('path')).toHaveAttribute('fill', 'var(--text)')
  fireEvent.click(close)
  expect(input.closeProps.onClick).toHaveBeenCalledTimes(1)
  expect(screen.getAllByRole('button')).toHaveLength(1)
  expect(hint.querySelector('[data-action=primary]')).toBeNull()
})

it('uses an instance-owned name association and does not claim control of ordinary page focus', () => {
  const first = props()
  const second = props()
  second.step.content = <p>Another translated hint</p>
  render(<><input aria-label='Ordinary page control' /><AppHintTooltip {...first} /><AppHintTooltip {...second} /></>)
  const one = screen.getByRole('dialog', { name: 'Hier können Sie die Führung starten.' })
  const two = screen.getByRole('dialog', { name: 'Another translated hint' })
  expect(one.getAttribute('aria-labelledby')).not.toBe(two.getAttribute('aria-labelledby'))
  const input = screen.getByRole('textbox', { name: 'Ordinary page control' })
  input.focus()
  expect(input).toHaveFocus()
})
