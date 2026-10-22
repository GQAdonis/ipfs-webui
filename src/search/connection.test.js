import { describe, expect, it, vi } from 'vitest'
import { createConnectionStore } from '../agent-chat/connection-store.js'
import { resolveConnection } from './connection.js'

function fixture () {
  let session
  let token = 'fixture-token'
  const listeners = new Set()
  const getToken = vi.fn(() => token)
  const store = createConnectionStore({
    getBridge: () => undefined,
    getSession: () => session,
    getSessionEndpoint: () => 'https://console.example/agui',
    getSettings: () => ({ endpoint: 'http://127.0.0.1:5050/agui', enabled: false }),
    getToken,
    subscribeSettings: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    subscribeSession: listener => { listeners.add(listener); return () => listeners.delete(listener) }
  })
  return { store, getToken, setToken (value) { token = value; listeners.forEach(fn => fn()) }, setSession (value) { session = value; listeners.forEach(fn => fn()) } }
}

describe('Search connection projection', () => {
  it('reuses the shared capture without treating chat enablement as the Search switch', async () => {
    const f = fixture()
    try {
      const result = await resolveConnection({ store: f.store })
      expect(result).toMatchObject({ ok: true, root: 'http://127.0.0.1:5050', generation: f.store.getSnapshot().generation })
      expect(result.signal).toBe(f.store.capture().signal)
      expect(await result.getToken()).toBe('fixture-token')
      f.setToken('replacement-fixture')
      expect(result.signal.aborted).toBe(true)
      expect(result.isCurrent()).toBe(false)
      expect(await result.getToken()).toBeUndefined()
    } finally { f.store.dispose() }
  })

  it.each([
    [{ expired: true }, 'session-expired'],
    [{ expired: false, retiring: true }, 'signing-out']
  ])('does not fall back to a bearer for an unavailable console lifetime', async (state, reason) => {
    const f = fixture()
    try {
      f.getToken.mockClear()
      f.setSession(state)
      expect(await resolveConnection({ store: f.store })).toEqual({ ok: false, reason })
      expect(f.getToken).not.toHaveBeenCalled()
      expect(f.store.getSnapshot().session).toBe(true)
    } finally { f.store.dispose() }
  })
})
