import { afterEach } from 'vitest'
import { composedAncestors, paneStepFromKeyboard } from './layout-keyboard.js'

const owned = []
function append (tag, attributes = {}) {
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  document.body.append(element); owned.push(element)
  return element
}
const event = (target, overrides = {}) => ({ key: ']', target, composedPath: () => composedAncestors(target), ...overrides })
afterEach(() => { owned.splice(0).forEach(node => node.remove()) })

it('handles only plain nonrepeating bracket keys outside editing', () => {
  expect(paneStepFromKeyboard(event(document.body), document)).toBe(1)
  expect(paneStepFromKeyboard(event(document.body, { key: '[' }), document)).toBe(-1)
  for (const overrides of [{ key: 'x' }, { repeat: true }, { defaultPrevented: true }, { ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { isComposing: true }, { keyCode: 229 }]) {
    expect(paneStepFromKeyboard(event(document.body, overrides), document)).toBeNull()
  }
})

it.each([['input', {}], ['textarea', {}], ['select', {}], ['div', { role: 'textbox' }], ['div', { contenteditable: '' }], ['div', { contenteditable: 'plaintext-only' }], ['div', { role: 'dialog' }], ['dialog', { open: '' }]])('leaves editing and modal keys alone in %s', (tag, attributes) => {
  const parent = append(tag, attributes)
  const child = document.createElement('span'); parent.append(child)
  expect(paneStepFromKeyboard(event(child), document)).toBeNull()
})

it('respects the nearest contenteditable=false boundary', () => {
  const parent = append('div', { contenteditable: 'true' })
  const child = document.createElement('button'); child.setAttribute('contenteditable', 'false'); parent.append(child)
  expect(paneStepFromKeyboard(event(child), document)).toBe(1)
})

it('finds an editor in the composed path and through the active open shadow root', () => {
  const host = append('div')
  const shadow = host.attachShadow({ mode: 'open' })
  const editor = document.createElement('textarea'); shadow.append(editor); editor.focus()
  expect(paneStepFromKeyboard(event(editor), document)).toBeNull()
  // Even a retargeted/synthetic host path must not miss the active editor.
  expect(paneStepFromKeyboard(event(host, { composedPath: () => [host, document] }), document)).toBeNull()
})

it('allows an opaque/closed-shadow editor host to reserve its own shortcuts', () => {
  const host = append('div', { 'data-workspace-shortcuts': 'off' })
  host.attachShadow({ mode: 'closed' }).append(document.createElement('input'))
  expect(paneStepFromKeyboard(event(host), document)).toBeNull()
})

describe('composer shortcut', () => {
  it('opens only from a nonediting command shortcut, including shadow focus', async () => {
    const { composerShortcut } = await import('./layout-keyboard.js')
    const button = document.createElement('button')
    document.body.append(button)
    button.focus()
    const event = { key: 'k', metaKey: true, composedPath: () => [button] }
    expect(composerShortcut(event, document)).toBe(true)
    for (const patch of [{ isComposing: true }, { keyCode: 229 }, { defaultPrevented: true }, { repeat: true }]) expect(composerShortcut({ ...event, ...patch }, document)).toBe(false)
    const host = document.createElement('div')
    document.body.append(host)
    const root = host.attachShadow({ mode: 'open' })
    const input = document.createElement('textarea')
    root.append(input)
    input.focus()
    expect(composerShortcut({ ...event, composedPath: () => [host] }, document)).toBe(false)
    host.remove()
    button.remove()
  })
})

it('does not steal shortcuts from a closed standalone chat editor', async () => {
  const { composerShortcut } = await import('./layout-keyboard.js')
  const host = append('ipfs-agent-chat')
  const root = host.attachShadow({ mode: 'closed' })
  const input = document.createElement('textarea')
  root.append(input)
  input.focus()
  expect(document.activeElement).toBe(host)
  expect(paneStepFromKeyboard(event(host), document)).toBeNull()
  expect(composerShortcut({ ...event(host), key: 'k', ctrlKey: true }, document)).toBe(false)
})
