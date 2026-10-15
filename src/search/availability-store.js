// Whether the Search page and its navigation entry exist. One probe, `GET /index/status`,
// decides: the entry shows only when the node answers with a configured index.
//
//   disabled     the Web UI setting search.enabled is off. Nothing is requested.
//   unconnected  there is no chat endpoint, or no token to send. Nothing is requested.
//   checking     the probe is in flight.
//   available    status 200 with enabled true and a mode other than "disabled".
//   unconfigured 404 (route not mounted), enabled false, or the node cannot be reached
//                or answers something unusable. The entry stays hidden.
//   denied       401 or 403: the route is mounted but this token cannot use it. The entry
//                shows and the page says what to do.
//
// The store holds no token; it asks the connection source per probe.

import { createSearchClient } from './client.js'
import { isSearchError } from './errors.js'
import { resolveConnection } from './connection.js'
import { getSettings as getSearchSettings, subscribe as subscribeSearch } from './settings-store.js'
import { subscribe as subscribeChat } from '../agent-chat/settings-store.js'

/**
 * @typedef {'disabled' | 'unconnected' | 'checking' | 'available' | 'unconfigured' | 'denied'} AvailabilityPhase
 * @typedef {{ phase: AvailabilityPhase, status: import('./client.js').IndexStatus | undefined, error: import('./errors.js').SearchError | undefined, connection: 'none' | 'no-endpoint' | 'no-token' | 'ready' }} Availability
 */

/** @type {Availability} */
const INITIAL = Object.freeze({ phase: 'unconnected', status: undefined, error: undefined, connection: 'none' })

/** Whether the navigation entry shows. @param {Availability} a */
export const isNavVisible = (a) => a.phase === 'available' || a.phase === 'denied' || (a.phase === 'checking' && a.status?.configured === true)

/**
 * @param {Object} [seams] test seams
 * @param {typeof resolveConnection} [seams.resolve]
 * @param {typeof createSearchClient} [seams.makeClient]
 * @param {() => boolean} [seams.isEnabled]
 */
export function createAvailabilityStore ({ resolve = resolveConnection, makeClient = createSearchClient, isEnabled = () => getSearchSettings().enabled } = {}) {
  /** @type {Availability} */
  let state = INITIAL
  /** @type {Set<() => void>} */
  const listeners = new Set()
  let sequence = 0
  /** @type {AbortController | undefined} */
  let controller
  let lastKey = ''
  let users = 0
  /** @type {Array<() => void>} */
  let unsubscribes = []

  /** @param {Availability} next */
  function set (next) {
    state = Object.freeze(next)
    listeners.forEach((fn) => fn())
  }

  function cancel () {
    sequence += 1
    controller?.abort()
    controller = undefined
  }

  /**
   * Re-evaluate. Probes when the connection changed, when `force` is set, or
   * while denied (a replaced token gets a fresh chance).
   *
   * @param {{ force?: boolean }} [opts]
   */
  async function sync ({ force = false } = {}) {
    if (!isEnabled()) {
      cancel()
      lastKey = ''
      if (state.phase !== 'disabled') set({ phase: 'disabled', status: undefined, error: undefined, connection: 'none' })
      return
    }
    const connection = await resolve()
    if (!isEnabled()) return sync()
    if (!connection.ok) {
      cancel()
      lastKey = ''
      set({ phase: 'unconnected', status: undefined, error: undefined, connection: connection.reason })
      return
    }
    const key = connection.root
    if (!force && key === lastKey && state.phase !== 'denied' && state.phase !== 'unconnected' && state.phase !== 'disabled') return
    lastKey = key
    cancel()
    const mine = sequence
    controller = new AbortController()
    const { signal } = controller
    set({ phase: 'checking', status: state.status, error: undefined, connection: 'ready' })
    try {
      const status = await makeClient({ root: connection.root, getToken: connection.getToken }).status({ signal })
      if (mine !== sequence) return
      set({ phase: status.configured ? 'available' : 'unconfigured', status, error: undefined, connection: 'ready' })
    } catch (e) {
      if (mine !== sequence) return
      if (/** @type {any} */ (e)?.name === 'AbortError') return
      const error = isSearchError(e) ? e : undefined
      const denied = error?.kind === 'unauthenticated' || error?.kind === 'forbidden'
      set({ phase: denied ? 'denied' : 'unconfigured', status: undefined, error, connection: 'ready' })
    }
  }

  return {
    getState: () => state,
    sync,
    refresh: () => sync({ force: true }),
    /** Test seam: forget the last answer, as a reload does. */
    resetForTests () {
      cancel()
      lastKey = ''
      state = INITIAL
    },
    /** @param {() => void} fn */
    subscribe (fn) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    /**
     * A component that needs the answer calls this on mount and the returned
     * function on unmount. The first user starts listening to the two settings
     * stores, the last one stops.
     */
    start () {
      users += 1
      if (users === 1) {
        unsubscribes = [subscribeSearch(() => { void sync() }), subscribeChat(() => { void sync() })]
      }
      void sync()
      return () => {
        users -= 1
        if (users === 0) {
          unsubscribes.forEach((off) => off())
          unsubscribes = []
          cancel()
          lastKey = ''
        }
      }
    }
  }
}

export const availabilityStore = createAvailabilityStore()
