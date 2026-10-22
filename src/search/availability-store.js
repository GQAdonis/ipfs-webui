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
import { getConnectionStore } from '../agent-chat/connection-store.js'

/**
 * @typedef {'disabled' | 'unconnected' | 'checking' | 'available' | 'unconfigured' | 'denied'} AvailabilityPhase
 * @typedef {{ phase: AvailabilityPhase, status: import('./client.js').IndexStatus | undefined, error: import('./errors.js').SearchError | undefined, connection: 'none' | 'no-endpoint' | 'no-token' | 'ready' | 'resolving' | 'session-expired' | 'signing-out', generation?: string }} Availability
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
 * @param {ReturnType<typeof getConnectionStore>} [seams.connectionStore]
 */
export function createAvailabilityStore ({ resolve = resolveConnection, makeClient = createSearchClient, isEnabled = () => getSearchSettings().enabled, connectionStore } = {}) {
  /** @type {Availability} */
  let state = INITIAL
  /** @type {Set<() => void>} */
  const listeners = new Set()
  let sequence = 0
  /** @type {AbortController | undefined} */
  let controller
  let detachLifetime = () => {}
  let lastKey = ''
  let users = 0
  /** @type {Array<() => void>} */
  let unsubscribes = []
  // Lazy: boot may still be detecting a validated console session at module import time.
  const lifetimeStore = () => connectionStore ?? (resolve === resolveConnection ? getConnectionStore() : undefined)

  /** @param {Availability} next */
  function set (next) {
    state = Object.freeze(next)
    listeners.forEach((fn) => fn())
  }

  function cancel () {
    sequence += 1
    detachLifetime()
    detachLifetime = () => {}
    controller?.abort()
    controller = undefined
  }

  /**
 * Re-evaluate. Probe for a new opaque generation/root, an explicit refresh, or
 * a denied connection. Root equality alone never establishes auth continuity.
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
    const source = lifetimeStore()
    const generation = source?.getSnapshot().generation
    const sourceRoot = source?.getSnapshot().root
    const sourceKey = generation && sourceRoot ? JSON.stringify([generation, sourceRoot]) : ''
    if (!force && sourceKey && sourceKey === lastKey && ['checking', 'available', 'unconfigured'].includes(state.phase)) return
    // Fence before the first await: a late resolver must not restart an old probe.
    cancel()
    const mine = sequence
    const retainedStatus = state.generation === generation ? state.status : undefined
    let connection
    try {
      connection = await (resolve === resolveConnection ? resolve({ store: source }) : resolve())
    } catch (e) {
      if (mine !== sequence || !isEnabled() || (source && source.getSnapshot().generation !== generation)) return
      lastKey = ''
      set({ phase: 'unconfigured', status: undefined, error: isSearchError(e) ? e : undefined, connection: 'none', ...(generation && { generation }) })
      return
    }
    if (mine !== sequence || !isEnabled() || (source && source.getSnapshot().generation !== generation)) return
    if (!connection.ok) {
      lastKey = ''
      set({ phase: connection.reason === 'resolving' ? 'checking' : 'unconnected', status: undefined, error: undefined, connection: connection.reason, ...(generation && { generation }) })
      return
    }
    if (connection.signal?.aborted || connection.isCurrent?.() === false) return
    const selectedGeneration = connection.generation ?? generation
    lastKey = JSON.stringify([selectedGeneration, connection.root])
    controller = new AbortController()
    const { signal } = controller
    const retire = () => {
      if (mine !== sequence) return
      cancel()
      lastKey = ''
      set({ ...INITIAL, ...(source && { generation: source.getSnapshot().generation }) })
    }
    connection.signal?.addEventListener('abort', retire, { once: true })
    detachLifetime = () => connection.signal?.removeEventListener('abort', retire)
    const current = () => mine === sequence && isEnabled() && !signal.aborted && connection.isCurrent?.() !== false && (!source || source.getSnapshot().generation === generation)
    set({ phase: 'checking', status: retainedStatus, error: undefined, connection: 'ready', ...(selectedGeneration && { generation: selectedGeneration }) })
    try {
      const status = await makeClient({ root: connection.root, getToken: connection.getToken, session: connection.session === true }).status({ signal })
      if (!current()) return
      set({ phase: status.configured ? 'available' : 'unconfigured', status, error: undefined, connection: 'ready', ...(selectedGeneration && { generation: selectedGeneration }) })
    } catch (e) {
      if (!current()) return
      if (/** @type {any} */ (e)?.name === 'AbortError') return
      const error = isSearchError(e) ? e : undefined
      const denied = error?.kind === 'unauthenticated' || error?.kind === 'forbidden'
      set({ phase: denied ? 'denied' : 'unconfigured', status: undefined, error, connection: 'ready', ...(selectedGeneration && { generation: selectedGeneration }) })
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
     * function on unmount. The first user listens to Search's switch and the
     * shared connection lifetime; the last one stops and clears cached status.
     */
    start () {
      users += 1
      if (users === 1) {
        const source = lifetimeStore()
        unsubscribes = [subscribeSearch(() => { void sync() })]
        if (source) {
          unsubscribes.push(source.subscribe(() => {
            if (state.generation !== source.getSnapshot().generation) {
              cancel()
              lastKey = ''
              set({ ...INITIAL, generation: source.getSnapshot().generation })
            }
            void sync()
          }))
        }
      }
      void sync()
      let stopped = false
      return () => {
        if (stopped) return
        stopped = true
        users -= 1
        if (users === 0) {
          unsubscribes.forEach((off) => off())
          unsubscribes = []
          cancel()
          lastKey = ''
          set(INITIAL)
        }
      }
    }
  }
}

export const availabilityStore = createAvailabilityStore()
