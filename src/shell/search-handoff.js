// Explicit submits only. No query, reference or credential is serialized to navigation/storage.
export function createSearchHandoff () {
  let pending = null
  const listeners = new Set()
  const publish = () => listeners.forEach(listener => listener())
  return {
    getSnapshot: () => pending,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    offer (query, generation) {
      if (typeof query !== 'string' || query.trim() === '' || query.length > 2000 || typeof generation !== 'string') return false
      pending = Object.freeze({ query, generation })
      publish()
      return true
    },
    take (generation) {
      const request = pending
      pending = null
      if (request) publish()
      return request?.generation === generation ? request : null
    },
    clear () { if (pending) { pending = null; publish() } },
    retire (generation) {
      if (pending && pending.generation !== generation) { pending = null; publish() }
    }
  }
}
export const searchHandoff = createSearchHandoff()
