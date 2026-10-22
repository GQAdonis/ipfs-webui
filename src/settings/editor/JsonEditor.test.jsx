import { vi } from 'vitest'
import { render } from '@testing-library/react'
const { capture, setModuleUrl } = vi.hoisted(() => ({ capture: vi.fn(), setModuleUrl: vi.fn() }))
vi.mock('react-ace', () => ({ default: props => { capture(props); return null } }))
vi.mock('ace-builds/src-noconflict/ace.js', () => ({ default: { define: vi.fn(), config: { setModuleUrl } } }))
vi.mock('ace-builds/src-noconflict/mode-json', () => ({}))
it('keeps JSON editing/read-only behavior and points its worker at a bundled asset', async () => {
  const { default: JsonEditor } = await import('./JsonEditor.js')
  const changed = vi.fn()
  const view = render(<JsonEditor value='{}' onChange={changed} readOnly />)
  expect(capture.mock.lastCall[0]).toMatchObject({ mode: 'json', theme: 'ipfs_dark', value: '{}', readOnly: true, onChange: changed, height: '500px' })
  const [module, url] = setModuleUrl.mock.calls[0]
  expect(module).toBe('ace/mode/json_worker')
  expect(url).not.toMatch(/^https?:/)
  view.rerender(<JsonEditor value='{ "a": 1 }' onChange={changed} readOnly={false} />)
  capture.mock.lastCall[0].onChange('{ "a": 2 }')
  expect(changed).toHaveBeenCalledWith('{ "a": 2 }')
})
