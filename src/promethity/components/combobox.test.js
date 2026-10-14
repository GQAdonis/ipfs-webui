// webui-settings-primitives 1.2: keyboard behaviour of the APG editable
// combobox with list autocomplete.

import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Combobox, Field } from './index.js'

const OPTIONS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { value: 'claude-sonnet', label: 'Claude Sonnet' }
]

const Harness = ({ initial = '', onChange = () => {} }) => {
  const [value, setValue] = useState(initial)
  return (
    <>
      <Combobox
        aria-label='Model'
        options={OPTIONS}
        value={value}
        onChange={(next) => { setValue(next); onChange(next) }}
      />
      <span data-testid='value'>{value}</span>
    </>
  )
}

const setup = (props) => {
  const utils = render(<Harness {...props} />)
  const input = utils.getByRole('combobox')
  const key = (k, extra = {}) => fireEvent.keyDown(input, { key: k, ...extra })
  const type = (text) => fireEvent.change(input, { target: { value: text } })
  const committed = () => utils.getByTestId('value').textContent
  return { ...utils, input, key, type, committed }
}

it('exposes the combobox, listbox and option roles with the APG attributes', () => {
  const { input, getByRole } = setup()
  expect(input.getAttribute('aria-autocomplete')).toBe('list')
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(input.getAttribute('aria-controls')).toBe(getByRole('listbox', { hidden: true }).id)
})

it('ArrowDown opens the list and moves aria-activedescendant through the options', () => {
  const { input, key, getAllByRole } = setup()
  key('ArrowDown')
  expect(input.getAttribute('aria-expanded')).toBe('true')
  const options = getAllByRole('option')
  expect(options).toHaveLength(3)
  expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id)
  expect(options[0].getAttribute('aria-selected')).toBe('true')

  key('ArrowDown')
  expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id)
  key('ArrowDown')
  key('ArrowDown')
  // wraps from the last back to the first
  expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id)
  key('ArrowUp')
  expect(input.getAttribute('aria-activedescendant')).toBe(options[2].id)
})

it('Alt+ArrowDown opens the list without highlighting an option', () => {
  const { input, key } = setup()
  key('ArrowDown', { altKey: true })
  expect(input.getAttribute('aria-expanded')).toBe('true')
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
})

it('Enter selects the highlighted option and closes the list', () => {
  const { input, key, committed } = setup()
  key('ArrowDown')
  key('ArrowDown')
  key('Enter')
  expect(committed()).toBe('gpt-4o-mini')
  expect(input.value).toBe('GPT-4o mini')
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
})

it('Escape closes the list and restores the committed value in the input', () => {
  const { input, key, type, committed } = setup({ initial: 'gpt-4o' })
  expect(input.value).toBe('GPT-4o')
  type('clau')
  expect(input.getAttribute('aria-expanded')).toBe('true')
  key('Escape')
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(input.value).toBe('GPT-4o')
  expect(committed()).toBe('gpt-4o')
  expect(document.activeElement === input || document.activeElement === document.body).toBe(true)
})

it('typing filters the options and opens the list', () => {
  const { input, type, getAllByRole } = setup()
  type('mini')
  expect(input.getAttribute('aria-expanded')).toBe('true')
  const options = getAllByRole('option')
  expect(options).toHaveLength(1)
  expect(options[0].textContent).toBe('GPT-4o mini')
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
})

it('accepts free text on Enter when nothing is highlighted', () => {
  const { input, type, key, committed } = setup()
  type('my-local-model:7b')
  key('Enter')
  expect(committed()).toBe('my-local-model:7b')
  expect(input.value).toBe('my-local-model:7b')
  expect(input.getAttribute('aria-expanded')).toBe('false')
})

it('maps text that names an option to that option value', () => {
  const { type, key, committed } = setup()
  type('claude sonnet')
  key('Enter')
  expect(committed()).toBe('claude-sonnet')
})

it('says so when typing matches nothing, and leaves the list closed', () => {
  const { input, type, getByRole } = setup()
  type('zzz')
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(getByRole('status').textContent).toMatch(/No match/)
})

it('does not submit an enclosing form on Enter', () => {
  const onSubmit = jest.fn((e) => e.preventDefault())
  const { getByRole } = render(
    <form onSubmit={onSubmit}>
      <Combobox aria-label='Model' options={OPTIONS} value='' onChange={() => {}} />
    </form>
  )
  const input = getByRole('combobox')
  const prevented = !fireEvent.keyDown(input, { key: 'Enter' })
  expect(prevented).toBe(true)
})

it('clicking an option selects it without blurring the input first', () => {
  const { input, key, getAllByRole, committed } = setup()
  key('ArrowDown', { altKey: true })
  fireEvent.click(getAllByRole('option')[2])
  expect(committed()).toBe('claude-sonnet')
  expect(input.value).toBe('Claude Sonnet')
})

it('commits typed text when the field loses focus', () => {
  const { input, type, committed } = setup()
  type('typed-id')
  fireEvent.blur(input)
  expect(committed()).toBe('typed-id')
})

it('takes its label, help and error from a surrounding Field', () => {
  const { getByRole, container } = render(
    <Field label='Model' help='Any id the endpoint accepts.'>
      <Combobox options={OPTIONS} value='' onChange={() => {}} />
    </Field>
  )
  const input = getByRole('combobox', { name: 'Model' })
  const help = container.querySelector(`#${input.getAttribute('aria-describedby')}`)
  expect(help.textContent).toBe('Any id the endpoint accepts.')
})
