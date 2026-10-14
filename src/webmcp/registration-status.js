// What the page really did with WebMCP, for the Settings panel to show. Not persisted.
//
//   off          the feature is switched off; nothing is registered
//   unavailable  switched on, but this browser has no document.modelContext
//   waiting      switched on and available, waiting for the node connection
//   registered   tools are registered (some may have failed: see `failed`)

/** @typedef {{ state: 'off' | 'unavailable' | 'waiting' | 'registered', registered: number, failed: number, writes: number }} RegistrationStatus */

/** @type {RegistrationStatus} */
const OFF = Object.freeze({ state: 'off', registered: 0, failed: 0, writes: 0 })

/** @type {RegistrationStatus} */
let status = OFF
/** @type {Set<() => void>} */
const listeners = new Set()

/** @returns {RegistrationStatus} */
export function getStatus () {
  return status
}

/** @param {Partial<RegistrationStatus> & { state: RegistrationStatus['state'] }} next */
export function setStatus (next) {
  status = Object.freeze({ ...OFF, ...next })
  listeners.forEach((fn) => fn())
}

/** @param {() => void} fn */
export function subscribe (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function resetForTests () {
  setStatus({ state: 'off' })
}
