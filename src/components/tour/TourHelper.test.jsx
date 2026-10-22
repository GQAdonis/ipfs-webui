import { afterEach, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TourHelper } from './TourHelper.js'
import { appTour } from '../../lib/tours.js'
import tours from '../../bundles/tours.js'
import app from '../../../public/locales/en/app.json'

const t = key => app[key] || key
afterEach(() => { localStorage.removeItem('tourTooltip') })

it('provides the actual step target on the accessible helper without dropping its caller skin or icon size', () => {
  const { container } = render(<TourHelper t={t} doDisableTooltip={vi.fn()} doEnableTours={vi.fn()} className='caller-skin' size={28} />)
  const button = screen.getByRole('button', { name: app.startTourHelper })
  expect(container.querySelector(appTour.getSteps({ t })[0].target)).toBe(button)
  expect(button).toHaveClass('caller-skin', 'prom-icon-link', 'prom-icon-btn')
  expect(button).toHaveAttribute('type', 'button')
  expect(button.querySelector('svg')).toHaveAttribute('width', '28')
})

it('dismisses the first-visit hint before enabling the independently owned page tour on every manual activation', () => {
  const events = []
  const doDisableTooltip = vi.fn(() => events.push('dismiss-hint'))
  const doEnableTours = vi.fn(() => events.push('start-page-tour'))
  render(<TourHelper t={t} doDisableTooltip={doDisableTooltip} doEnableTours={doEnableTours} />)
  const button = screen.getByRole('button', { name: app.startTourHelper })
  fireEvent.click(button)
  fireEvent.click(button)
  expect(events).toEqual(['dismiss-hint', 'start-page-tour', 'dismiss-hint', 'start-page-tour'])
})

it('preserves the existing stored dismissal across reload while a page tour can still be replayed and stopped', () => {
  localStorage.removeItem('tourTooltip')
  let state = tours.reducer(undefined, {})
  const dispatch = action => { state = tours.reducer(state, action) }
  const doDisableTooltip = () => tours.doDisableTooltip()({ dispatch })
  const actions = { doDisableTooltip, doEnableTours: () => tours.doEnableTours()({ dispatch }) }
  expect(state).toEqual({ enabled: false, tooltip: true })
  render(<TourHelper t={t} {...actions} />)
  fireEvent.click(screen.getByRole('button', { name: app.startTourHelper }))
  expect(state).toEqual({ enabled: true, tooltip: false })
  expect(localStorage.getItem('tourTooltip')).toBe('false')
  tours.doDisableTours()({ dispatch })
  expect(state).toEqual({ enabled: false, tooltip: false })
  state = tours.reducer(undefined, {})
  tours.init({ doDisableTooltip })
  expect(state).toEqual({ enabled: false, tooltip: false })
  actions.doEnableTours()
  expect(state).toEqual({ enabled: true, tooltip: false })
  tours.doDisableTours()({ dispatch })
  expect(state).toEqual({ enabled: false, tooltip: false })
})
