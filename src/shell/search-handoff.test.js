import { describe, expect, it, vi } from 'vitest'
import { createSearchHandoff } from './search-handoff.js'

describe('explicit Search handoff', () => {
  it('transfers one bounded submitted query without putting it in navigation or storage', () => {
    const handoff = createSearchHandoff()
    const changed = vi.fn()
    const off = handoff.subscribe(changed)
    expect(handoff.offer('notes about IPFS', 'connection-a')).toBe(true)
    expect(handoff.take('connection-a')).toEqual({ query: 'notes about IPFS', generation: 'connection-a' })
    expect(handoff.take('connection-a')).toBeNull()
    off()
    expect(changed).toHaveBeenCalledTimes(2)
  })
  it('drops work across same-endpoint authentication generations and cannot replay it', () => {
    const handoff = createSearchHandoff()
    handoff.offer('private query', 'old-owner')
    expect(handoff.take('new-owner')).toBeNull()
    expect(handoff.take('old-owner')).toBeNull()
    handoff.offer('another query', 'old-owner')
    handoff.retire('new-owner')
    expect(handoff.getSnapshot()).toBeNull()
  })
  it('refuses empty, oversized and invalid submissions without replacing an accepted handoff', () => {
    const handoff = createSearchHandoff()
    handoff.offer('kept', 'owner')
    for (const query of ['', '   ', 'a'.repeat(2001), '😀'.repeat(1001), null]) expect(handoff.offer(query, 'owner')).toBe(false)
    expect(handoff.getSnapshot().query).toBe('kept')
  })
})

it('cancels an unconsumed transfer on explicit Search-off or abandoned navigation', () => {
  const handoff = createSearchHandoff()
  handoff.offer('never replay this', 'same-owner')
  handoff.clear()
  expect(handoff.take('same-owner')).toBeNull()
})
