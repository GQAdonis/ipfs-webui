import { vi } from 'vitest'
// webui-settings-primitives 1.1: Field, Switch and SegmentedControl each wire
// label, help and error through aria-describedby.

import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Field, FieldInput, Switch, SegmentedControl } from './index.js'

const idsOf = (el) => (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean)

describe('Field', () => {
  it('labels the input and points aria-describedby at help and error', () => {
    const { getByLabelText, container } = render(
      <Field label='Endpoint' help='Where requests go.' error='Not a valid URL.' required>
        <FieldInput defaultValue='x' />
      </Field>
    )
    const input = getByLabelText('Endpoint')
    const described = idsOf(input).map((id) => container.querySelector(`#${id}`))
    expect(described).toHaveLength(2)
    expect(described[0].textContent).toBe('Where requests go.')
    expect(described[1].textContent).toContain('Not a valid URL.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-required')).toBe('true')
  })

  it('leaves aria-describedby off when there is no help or error', () => {
    const { getByLabelText } = render(<Field label='Name'><FieldInput /></Field>)
    const input = getByLabelText('Name')
    expect(input.hasAttribute('aria-describedby')).toBe(false)
    expect(input.hasAttribute('aria-invalid')).toBe(false)
  })

  it('gives two fields on one page distinct ids', () => {
    const { getByLabelText } = render(
      <>
        <Field label='One'><FieldInput /></Field>
        <Field label='Two'><FieldInput /></Field>
      </>
    )
    expect(getByLabelText('One').id).not.toBe(getByLabelText('Two').id)
  })
})

describe('Switch', () => {
  const Harness = (props) => {
    const [on, setOn] = useState(false)
    return <Switch label='Agent chat' checked={on} onChange={setOn} {...props} />
  }

  it('is a switch named by its label, with help and error described', () => {
    const { getByRole, container } = render(<Harness help='Shows the chat button.' error='Could not save.' />)
    const sw = getByRole('switch', { name: 'Agent chat' })
    const described = idsOf(sw).map((id) => container.querySelector(`#${id}`))
    expect(described.map((el) => el.textContent)).toEqual(['Shows the chat button.', 'Error: Could not save.'])
  })

  it('toggles on click, on Space, and from its label text', () => {
    const { getByRole, getByText } = render(<Harness />)
    const sw = getByRole('switch')
    expect(sw.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(sw)
    expect(sw.getAttribute('aria-checked')).toBe('true')
    // The label is a real <label for>, so a click on the text activates the button.
    fireEvent.click(getByText('Agent chat'))
    expect(sw.getAttribute('aria-checked')).toBe('false')
  })

  it('does not toggle while disabled', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Switch label='X' checked={false} onChange={onChange} disabled />)
    fireEvent.click(getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('states on and off as a visible word', () => {
    const { getByText, getByRole } = render(<Harness />)
    expect(getByText('Off')).toBeTruthy()
    fireEvent.click(getByRole('switch'))
    expect(getByText('On')).toBeTruthy()
  })
})

describe('SegmentedControl', () => {
  const options = [
    { value: 'openai', label: 'OpenAI-compatible' },
    { value: 'uar', label: 'Cloud agent' }
  ]
  const Harness = (props) => {
    const [value, setValue] = useState('openai')
    return <SegmentedControl label='Backend' options={options} value={value} onChange={setValue} {...props} />
  }

  it('is a radio group named by its legend with help and error described', () => {
    const { getByRole, container } = render(<Harness help='Pick one.' error='Required.' />)
    const group = getByRole('radiogroup', { name: 'Backend' })
    const described = idsOf(group).map((id) => container.querySelector(`#${id}`))
    expect(described.map((el) => el.textContent)).toEqual(['Pick one.', 'Error: Required.'])
  })

  it('checks the chosen option and reports changes', () => {
    const { getByRole } = render(<Harness />)
    expect(getByRole('radio', { name: 'OpenAI-compatible' }).checked).toBe(true)
    fireEvent.click(getByRole('radio', { name: 'Cloud agent' }))
    expect(getByRole('radio', { name: 'Cloud agent' }).checked).toBe(true)
    expect(getByRole('radio', { name: 'OpenAI-compatible' }).checked).toBe(false)
  })
})
