// webui-settings-primitives 1.3: StatusLine (word and icon per tone),
// ApplyBar (form scroll-padding-bottom equals the bar height, WCAG 2.4.11)
// and the PolicyDecision row.

import React from 'react'
import { render } from '@testing-library/react'
import { StatusLine, ApplyForm, ApplyBar, PolicyDecision } from './index.js'

describe('StatusLine', () => {
  it.each([
    ['ok', 'OK', 'status'],
    ['warn', 'Warning', 'status'],
    ['err', 'Error', 'alert'],
    ['info', 'Note', 'status']
  ])('%s shows the word %s and an icon', (tone, word, role) => {
    const { getByRole } = render(<StatusLine tone={tone}>Something happened.</StatusLine>)
    const line = getByRole(role)
    expect(line.querySelector('.pm-status-word').textContent).toBe(word)
    expect(line.querySelector('svg')).not.toBeNull()
    expect(line.querySelector('svg').getAttribute('aria-hidden')).toBe('true')
    expect(line.className).toContain(`pm-tone-${tone}`)
    expect(line.textContent).toContain('Something happened.')
  })

  it('takes a specific word instead of the default', () => {
    const { getByRole } = render(<StatusLine tone='warn' word='Needs restart'>Restart the node.</StatusLine>)
    expect(getByRole('status').querySelector('.pm-status-word').textContent).toBe('Needs restart')
  })
})

describe('ApplyBar', () => {
  const realRect = Element.prototype.getBoundingClientRect

  afterEach(() => {
    Element.prototype.getBoundingClientRect = realRect
  })

  it('sets the form scroll-padding-bottom to the bar height', () => {
    Element.prototype.getBoundingClientRect = function () {
      const isBar = this.classList && this.classList.contains('pm-apply-bar')
      return { width: 0, height: isBar ? 72 : 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }
    }
    const { container, getByRole } = render(
      <ApplyForm aria-label='Agent settings'>
        <input aria-label='x' />
        <ApplyBar label='Apply changes' status={<StatusLine tone='info'>2 changes</StatusLine>}>
          <button type='submit'>Apply</button>
        </ApplyBar>
      </ApplyForm>
    )
    const form = container.querySelector('form')
    expect(form.style.scrollPaddingBottom).toBe('72px')
    expect(form.style.getPropertyValue('--pm-apply-bar-height')).toBe('72px')
    expect(getByRole('group', { name: 'Apply changes' })).toBeTruthy()
  })

  it('releases the reserved space when the bar goes away', () => {
    Element.prototype.getBoundingClientRect = () => ({ width: 0, height: 64, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) })
    const Harness = ({ show }) => (
      <ApplyForm>
        {show ? <ApplyBar label='Apply'><button type='submit'>Apply</button></ApplyBar> : null}
      </ApplyForm>
    )
    const { container, rerender } = render(<Harness show />)
    expect(container.querySelector('form').style.scrollPaddingBottom).toBe('64px')
    rerender(<Harness show={false} />)
    expect(container.querySelector('form').style.scrollPaddingBottom).toBe('0px')
  })

  it('renders without a form around it', () => {
    const { getByRole } = render(<ApplyBar label='Apply'><button type='button'>Apply</button></ApplyBar>)
    expect(getByRole('group', { name: 'Apply' })).toBeTruthy()
  })
})

describe('PolicyDecision', () => {
  it.each([
    ['ask', 'Asks you first'],
    ['permitted', 'Permitted'],
    ['denied', 'Denied']
  ])('%s decision states the word %s with an icon', (decision, word) => {
    const { container } = render(
      <PolicyDecision subject='Writes and deletes' decision={decision}>Nothing changes without your approval.</PolicyDecision>
    )
    expect(container.querySelector('.pm-policy-subject').textContent).toBe('Writes and deletes')
    expect(container.querySelector('.pm-policy-decision strong').textContent).toBe(word)
    expect(container.querySelector('.pm-policy-decision svg')).not.toBeNull()
    expect(container.querySelector('.pm-policy-note').textContent).toBe('Nothing changes without your approval.')
  })
})
