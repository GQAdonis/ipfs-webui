// @vitest-environment node
import { expect, it } from 'vitest'
import { createSessionArtifactNames } from './session-artifacts.mjs'

it('concurrent same-viewport/theme sessions retain distinct record and trace paths regardless of close order', () => {
  const allocate = createSessionArtifactNames()
  const sessions = Array.from({ length: 5 }, () => allocate('dark', 1440))
  const closes = [sessions[4], sessions[1], sessions[3], sessions[0], sessions[2]]
  expect(new Set(closes.map(item => item.record)).size).toBe(5)
  expect(new Set(closes.map(item => item.trace)).size).toBe(5)
  expect(closes.every(item => !item.record.includes('/') && item.trace.endsWith('.zip'))).toBe(true)
  expect(() => allocate('../escape', 1440)).toThrow('identity')
})
