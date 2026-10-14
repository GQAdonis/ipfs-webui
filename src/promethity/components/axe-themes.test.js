// webui-settings-primitives 1.4: axe checks on every primitive, run under both
// themes. jsdom has no layout engine or canvas, so axe's colour-contrast rule
// cannot run here; contrast is guarded by ../tokens.test.js, which recomputes
// every token pairing from tokens.css in both themes.

import React, { useState } from 'react'
import { render } from '@testing-library/react'
import axe from 'axe-core'
import {
  Field, FieldInput, Switch, SegmentedControl, Combobox,
  StatusLine, ApplyForm, ApplyBar, PolicyDecision
} from './index.js'

const OPTIONS = [
  { value: 'a', label: 'Alpha', description: 'First' },
  { value: 'b', label: 'Beta' }
]

const Page = () => {
  const [on, setOn] = useState(true)
  const [seg, setSeg] = useState('openai')
  const [model, setModel] = useState('a')
  return (
    <main>
      <h1>Agent settings</h1>
      <ApplyForm aria-label='Agent settings'>
        <Field label='Endpoint' help='Where requests go.' error='Not a valid URL.' required>
          <FieldInput defaultValue='http://localhost' />
        </Field>
        <Field label='Model' help='Any id the endpoint accepts.'>
          <Combobox options={OPTIONS} value={model} onChange={setModel} />
        </Field>
        <Switch label='Agent chat' help='Shows the chat button.' checked={on} onChange={setOn} />
        <Switch label='WebMCP' checked={false} onChange={() => {}} error='Could not save.' />
        <SegmentedControl
          label='Backend'
          help='Pick one.'
          options={[{ value: 'openai', label: 'OpenAI-compatible' }, { value: 'uar', label: 'Cloud agent' }]}
          value={seg}
          onChange={setSeg}
        />
        <PolicyDecision subject='Writes and deletes' decision='ask'>Nothing changes without your approval.</PolicyDecision>
        {['ok', 'warn', 'err', 'info'].map((tone) => <StatusLine key={tone} tone={tone}>Message.</StatusLine>)}
        <ApplyBar label='Apply changes' status={<StatusLine tone='info'>No changes.</StatusLine>}>
          <button type='submit'>Apply</button>
          <button type='reset'>Revert</button>
        </ApplyBar>
      </ApplyForm>
    </main>
  )
}

const run = (container) => axe.run(container, {
  rules: { 'color-contrast': { enabled: false }, region: { enabled: false } }
})

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

describe.each(['dark', 'light'])('primitives in the %s theme', (theme) => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', theme)
  })

  it('has no axe violations in the resting state', async () => {
    const { container } = render(<Page />)
    const results = await run(container)
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })

  it('has no axe violations with the combobox list open', async () => {
    const { container, getByRole } = render(<Page />)
    const input = getByRole('combobox')
    input.focus()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    const results = await run(container)
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
})
