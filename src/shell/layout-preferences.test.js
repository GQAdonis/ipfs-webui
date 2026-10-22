import { vi } from 'vitest'
import { changeLayout, DEFAULT_LAYOUT, effectivePane, LAYOUT_STORAGE_KEY, parseLayoutPreference, readLayoutPreference, stepPane, writeLayoutPreference } from './layout-preferences.js'

it.each([null, '', '{', '[]', 'null', 'x'.repeat(161),
  '{"version":2,"mode":"application","pane":"docked"}',
  '{"version":1,"mode":"invented","pane":"docked"}',
  '{"version":1,"mode":"application","pane":"560px"}',
  '{"version":1,"mode":"conversation","pane":"closed"}',
  '{"version":1,"mode":"application","pane":"full","token":"must not accept"}'
])('falls back from malformed/unbounded device preference %s', raw => {
  expect(parseLayoutPreference(raw)).toEqual(DEFAULT_LAYOUT)
})

it('persists only the exact versioned, noncontent layout enums for a later mount', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key), setItem: vi.fn((key, value) => values.set(key, value)) }
  const chosen = { version: 1, mode: 'conversation', pane: 'expanded' }
  expect(writeLayoutPreference(chosen, storage)).toBe(true)
  expect([...values.keys()]).toEqual([LAYOUT_STORAGE_KEY])
  expect(JSON.parse(values.get(LAYOUT_STORAGE_KEY))).toEqual(chosen)
  expect(readLayoutPreference(storage)).toEqual(chosen)
  expect(writeLayoutPreference({ ...chosen, draft: 'Unsent content' }, storage)).toBe(false)
  expect(storage.setItem).toHaveBeenCalledTimes(1)
})

it('keeps defaults and memory-only control usable when storage is denied or full', () => {
  const storage = { getItem: () => { throw new DOMException('Denied', 'SecurityError') }, setItem: () => { throw new DOMException('Full', 'QuotaExceededError') } }
  expect(readLayoutPreference(storage)).toEqual(DEFAULT_LAYOUT)
  const changed = changeLayout(DEFAULT_LAYOUT, { type: 'pane', pane: 'expanded' })
  expect(writeLayoutPreference(changed, storage)).toBe(false)
  expect(changed.pane).toBe('expanded')
})

it('bounds the ordered keyboard steps without wraparound', () => {
  expect(['closed', 'docked', 'expanded', 'full'].map(value => stepPane(value, 1))).toEqual(['docked', 'expanded', 'full', 'full'])
  expect(['closed', 'docked', 'expanded', 'full'].map(value => stepPane(value, -1))).toEqual(['closed', 'closed', 'docked', 'expanded'])
  expect(() => stepPane('unknown', 1)).toThrow()
  expect(() => stepPane('closed', 2)).toThrow()
})

it('returns to the application on close and opens a closed thread explicitly', () => {
  const closed = changeLayout({ version: 1, mode: 'conversation', pane: 'full' }, { type: 'pane', pane: 'closed' })
  expect(closed).toEqual({ version: 1, mode: 'application', pane: 'closed' })
  expect(changeLayout(closed, { type: 'mode', mode: 'conversation' })).toEqual({ version: 1, mode: 'conversation', pane: 'docked' })
})

it('coerces open panes to full only when their current width cannot fit', () => {
  expect(effectivePane('docked', { dockedFits: true })).toBe('docked')
  expect(effectivePane('docked', { dockedFits: false })).toBe('full')
  expect(effectivePane('expanded', { expandedFits: true })).toBe('expanded')
  expect(effectivePane('expanded', { expandedFits: false })).toBe('full')
  expect(effectivePane('closed', { dockedFits: false, expandedFits: false })).toBe('closed')
})

it('shows Home on a fresh phone visit instead of coercing an inherited dock to full', () => {
  expect(DEFAULT_LAYOUT).toEqual({ version: 1, mode: 'application', pane: 'closed' })
  expect(effectivePane(readLayoutPreference({ getItem: () => null }).pane, { dockedFits: false, expandedFits: false, phone: true })).toBe('closed')
  const saved = { version: 1, mode: 'application', pane: 'expanded' }
  expect(readLayoutPreference({ getItem: () => JSON.stringify(saved) })).toEqual(saved)
})
