// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPresentationPolicy, PRESENTATION_STORAGE_KEY } from './presentation-policy.js'

const defaults = { decisions: true, a2ui: true, contextReferences: true, runFacts: true }
function memoryStorage (initial) {
  const values = new Map(initial === undefined ? [] : [[PRESENTATION_STORAGE_KEY, initial]])
  return { values, getItem: vi.fn(key => values.get(key) ?? null), setItem: vi.fn((key, value) => values.set(key, value)) }
}
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules() })

describe('local presentation policy storage boundary', () => {
  it('defaults to four enabled frozen booleans, reads one preference key and has stable snapshots', () => {
    const storage = memoryStorage(); const policy = createPresentationPolicy({ storage })
    expect(policy.getSnapshot()).toEqual(defaults)
    expect(Object.isFrozen(policy.getSnapshot())).toBe(true)
    expect(policy.getSnapshot()).toBe(policy.getSnapshot())
    expect(storage.getItem.mock.calls).toEqual([[PRESENTATION_STORAGE_KEY]])
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('preserves explicit false on reload and defaults absent or invalid fields independently', () => {
    const storage = memoryStorage(JSON.stringify({ decisions: false, a2ui: false, contextReferences: 'false', runFacts: null }))
    expect(createPresentationPolicy({ storage }).getSnapshot()).toEqual({ ...defaults, decisions: false, a2ui: false })
    const policy = createPresentationPolicy({ storage })
    policy.update({ contextReferences: false, runFacts: false })
    expect(createPresentationPolicy({ storage }).getSnapshot()).toEqual({ decisions: false, a2ui: false, contextReferences: false, runFacts: false })
  })

  it.each(['', '{broken', 'null', '[]', 'false', '7', '"false"'])('ignores malformed/nonobject stored preference %s', raw => {
    const storage = memoryStorage(raw)
    expect(createPresentationPolicy({ storage }).getSnapshot()).toEqual(defaults)
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('never projects or persists unknown stored fields or caller secrets', () => {
    const storage = memoryStorage(JSON.stringify({ decisions: false, token: 'fixture-private-value', endpoint: 'https://fixture.invalid/private', authorization: true }))
    const policy = createPresentationPolicy({ storage })
    expect(policy.getSnapshot()).toEqual({ ...defaults, decisions: false })
    policy.update({ a2ui: false, token: 'different-fixture-value', subject: 'fixture-subject' })
    const [key, raw] = storage.setItem.mock.calls[0]
    expect(key).toBe(PRESENTATION_STORAGE_KEY)
    expect(JSON.parse(raw)).toEqual({ ...defaults, decisions: false, a2ui: false })
    expect(raw).not.toContain('fixture-')
    expect(storage.getItem.mock.calls.every(([readKey]) => readKey === PRESENTATION_STORAGE_KEY)).toBe(true)
  })

  it('keeps updates page-local if reads and writes are blocked', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('Blocked') }), setItem: vi.fn(() => { throw new Error('Blocked') }) }
    const policy = createPresentationPolicy({ storage }); const listener = vi.fn()
    policy.subscribe(listener)
    expect(policy.update({ decisions: false })).toEqual({ ...defaults, decisions: false })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(policy.getSnapshot().decisions).toBe(false)
    // A separate page cannot inherit an update that storage refused to retain.
    expect(createPresentationPolicy({ storage }).getSnapshot()).toEqual(defaults)
  })

  it('continues updating when the browser localStorage getter itself is blocked', () => {
    vi.stubGlobal('localStorage', undefined)
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw new Error('Storage denied') } })
    const policy = createPresentationPolicy()
    expect(policy.update({ runFacts: false }).runFacts).toBe(false)
  })

  it('works with explicitly absent storage and never needs network or global event listeners', () => {
    const network = vi.fn(); const globalListener = vi.fn()
    vi.stubGlobal('fetch', network); vi.stubGlobal('addEventListener', globalListener)
    const policy = createPresentationPolicy({ storage: null })
    const off = policy.subscribe(() => {})
    policy.update({ a2ui: false }); off()
    expect(policy.getSnapshot().a2ui).toBe(false)
    expect(network).not.toHaveBeenCalled(); expect(globalListener).not.toHaveBeenCalled()
  })
})

describe('strict synchronous presentation updates', () => {
  it.each(Object.keys(defaults))('turns %s off and on without affecting sibling presentation preferences', field => {
    const storage = memoryStorage(); const policy = createPresentationPolicy({ storage }); const listener = vi.fn()
    policy.subscribe(listener)
    policy.update({ [field]: false })
    expect(policy.getSnapshot()).toEqual({ ...defaults, [field]: false })
    expect(listener).toHaveBeenCalledTimes(1)
    policy.update({ [field]: true })
    expect(policy.getSnapshot()).toEqual(defaults)
    expect(listener).toHaveBeenCalledTimes(2)
    expect(Object.keys(JSON.parse(storage.setItem.mock.calls[0][1]))).toEqual(Object.keys(defaults))
  })

  it('publishes one stable new snapshot before synchronous listeners run and unsubscribe stops delivery', () => {
    const policy = createPresentationPolicy({ storage: null }); const observed = []; const before = policy.getSnapshot()
    const off = policy.subscribe(() => observed.push(policy.getSnapshot()))
    const next = policy.update({ decisions: false, a2ui: false })
    expect(next).not.toBe(before)
    expect(observed).toEqual([next])
    expect(observed[0]).toBe(policy.getSnapshot())
    expect(Object.isFrozen(next)).toBe(true)
    expect(before).toEqual(defaults)
    off(); policy.update({ runFacts: false })
    expect(observed).toHaveLength(1)
  })

  it('does not persist, notify or replace the snapshot for no-op/unknown/nonboolean patches', () => {
    const storage = memoryStorage(); const policy = createPresentationPolicy({ storage }); const listener = vi.fn(); const before = policy.getSnapshot()
    policy.subscribe(listener)
    for (const patch of [undefined, null, [], 'off', {}, { decisions: true }, { a2ui: 'false', runFacts: 0, contextReferences: null }, { enabled: false, token: 'fixture-value' }]) {
      expect(policy.update(patch)).toBe(before)
    }
    expect(storage.setItem).not.toHaveBeenCalled(); expect(listener).not.toHaveBeenCalled()
  })

  it('accepts only own boolean data fields without invoking inherited or accessor values', () => {
    const storage = memoryStorage(); const policy = createPresentationPolicy({ storage }); const getter = vi.fn(() => false)
    const patch = Object.create({ decisions: false })
    Object.defineProperty(patch, 'a2ui', { enumerable: true, get: getter })
    patch.runFacts = false
    expect(policy.update(patch)).toEqual({ ...defaults, runFacts: false })
    expect(getter).not.toHaveBeenCalled()
    expect(JSON.parse(storage.setItem.mock.calls[0][1])).toEqual({ ...defaults, runFacts: false })
  })

  it('only retains the four booleans when a patch includes prototype-named or nested authority data', () => {
    const storage = memoryStorage(); const policy = createPresentationPolicy({ storage })
    const patch = JSON.parse('{"decisions":false,"__proto__":{"polluted":true},"authorization":{"approve":true},"runFacts":{"enabled":false}}')
    policy.update(patch)
    expect(policy.getSnapshot()).toEqual({ ...defaults, decisions: false })
    expect(JSON.parse(storage.setItem.mock.calls[0][1])).toEqual({ ...defaults, decisions: false })
    expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false)
  })

  it('loads the default singleton only on first explicit use and reuses that policy instance', async () => {
    vi.resetModules()
    const storage = memoryStorage(JSON.stringify({ contextReferences: false }))
    vi.stubGlobal('localStorage', storage)
    const module = await import('./presentation-policy.js')
    expect(storage.getItem).not.toHaveBeenCalled()
    const first = module.getPresentationPolicy(); const second = module.getPresentationPolicy()
    expect(first).toBe(second)
    expect(first.getSnapshot()).toEqual({ ...defaults, contextReferences: false })
    expect(storage.getItem).toHaveBeenCalledTimes(1)
    first.update({ runFacts: false })
    expect(second.getSnapshot().runFacts).toBe(false)
  })
})
