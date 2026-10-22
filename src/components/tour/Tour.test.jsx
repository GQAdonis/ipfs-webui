import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tour from './Tour.js'
import AppHintTooltip from './AppHintTooltip.jsx'
import { appTour, settingsTour } from '../../lib/tours.js'
import settings from '../../../public/locales/en/settings.json'
const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('react-joyride', () => ({ Joyride: props => { capture(props); return null } }))
it('keeps translated content, dismissal, local skin and disabled-state on the new API', () => {
  const callback = vi.fn()
  render(<Tour run={false} callback={callback} showProgress disableOverlay styles={{ options: { backgroundColor: 'var(--raised)' }, buttonNext: { color: 'var(--text)' } }} steps={[{ target: 'body', content: 'Localized step', disableBeacon: true }]} />)
  const props = capture.mock.lastCall[0]
  expect(props.run).toBe(false)
  expect(props.onEvent).toBe(callback)
  expect(props.options).toMatchObject({ showProgress: true, hideOverlay: true, backgroundColor: 'var(--raised)' })
  expect(props.steps[0]).toMatchObject({ content: 'Localized step', skipBeacon: true })
  expect(props.styles.buttonPrimary).toEqual({ color: 'var(--text)' })
  expect(props).not.toHaveProperty('callback')
})

it('opts only the nonblocking helper hint into the public custom renderer and disables its trap per step', () => {
  render(<Tour steps={appTour.getSteps({ t: key => key })} styles={appTour.styles} />)
  const hint = capture.mock.lastCall[0]
  expect(hint.steps[0]).toMatchObject({ tooltipComponent: AppHintTooltip, disableFocusTrap: true, skipBeacon: true })
  expect(hint.options).not.toHaveProperty('disableFocusTrap')
  const steps = settingsTour.getSteps({ t: key => key, Trans: ({ children }) => children })
  render(<Tour steps={steps} styles={settingsTour.styles} />)
  const route = capture.mock.lastCall[0]
  expect(route).not.toHaveProperty('tooltipComponent')
  expect(route.options).not.toHaveProperty('disableFocusTrap')
  for (const step of route.steps) {
    expect(step).not.toHaveProperty('tooltipComponent')
    expect(step).not.toHaveProperty('disableFocusTrap')
  }
})

it('renders the existing Settings API-address translation without an unresolved optional paragraph', () => {
  const t = key => key.split('.').reduce((value, part) => value?.[part], settings) ?? key
  const steps = settingsTour.getSteps({ t, Trans: ({ children }) => children })
  const { container } = render(steps[1].content)
  expect(screen.getByRole('heading', { name: settings.tour.step2.title })).toBeVisible()
  expect(screen.getByText(settings.tour.step2.paragraph1)).toBeVisible()
  expect(container.querySelectorAll('p')).toHaveLength(1)
  expect(container.textContent).not.toContain('tour.step2.paragraph2')
})
