// @vitest-environment node
import assert from 'node:assert/strict'
import { describe, expect, it } from 'vitest'
import { assertTokenOnlyDelta } from './baseline-sources.mjs'
import { rasterDifference } from './baseline-pixels.mjs'

const context = { assert: (condition, message) => assert.ok(condition, message) }
describe('immutable token-only baseline guards', () => {
  it('allows exactly the role alias addition and literal import prefix', () => {
    const incumbent = { 'src/index.css': 'old', 'src/App.js': 'unchanged' }
    const derived = { ...incumbent, 'src/index.css': 'new', 'src/promethity/roles.css': 'roles' }
    expect(() => assertTokenOnlyDelta(context, incumbent, derived, 'roles', 'old CSS', '@import "./promethity/roles.css";\nold CSS')).not.toThrow()
    expect(() => assertTokenOnlyDelta(context, incumbent, { ...derived, 'src/App.js': 'redesigned' }, 'roles', 'old CSS', '@import "./promethity/roles.css";\nold CSS')).toThrow('exactly')
    expect(() => assertTokenOnlyDelta(context, incumbent, derived, 'roles', 'old CSS', '@import "./promethity/roles.css";\nchanged palette')).toThrow('verbatim')
  })
  it('detects one changed pixel or a size change without broad masks/tolerances', () => {
    const original = { width: 1, height: 1, data: Buffer.from([12, 11, 10, 255]) }
    expect(rasterDifference(original, { ...original, data: Buffer.from(original.data) }).equal).toBe(true)
    const perturbed = { ...original, data: Buffer.from([255, 0, 255, 255]) }
    expect(rasterDifference(original, perturbed)).toMatchObject({ equal: false, changedPixels: 1, threshold: 0, masks: [] })
    expect(rasterDifference(original, { width: 2, height: 1, data: Buffer.alloc(8) }).reason).toBe('dimensions')
    expect(() => rasterDifference(original, { width: 0, height: 0, data: Buffer.alloc(0) })).toThrow('nonempty')
  })
})
