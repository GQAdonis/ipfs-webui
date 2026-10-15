import { useEffect, useState } from 'react'
import { availabilityStore, isNavVisible } from './availability-store.js'

/**
 * Subscribe a component to the search availability. Mounting starts the probe
 * (which sends nothing while search is off or there is no connection); the last
 * unmount stops listening.
 *
 * @param {ReturnType<typeof import('./availability-store.js').createAvailabilityStore>} [store]
 */
export function useSearchAvailability (store = availabilityStore) {
  const [state, setState] = useState(store.getState)
  useEffect(() => {
    const off = store.subscribe(() => setState(store.getState()))
    const stop = store.start()
    setState(store.getState())
    return () => {
      off()
      stop()
    }
  }, [store])
  return { ...state, visible: isNavVisible(state), refresh: store.refresh }
}
