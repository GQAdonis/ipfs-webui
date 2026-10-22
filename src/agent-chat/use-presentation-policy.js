import { useState, useSyncExternalStore } from 'react'
import { getPresentationPolicy } from './presentation-policy.js'

/** Browser-local presentation choices, never server capabilities or resolver grants. */
export function usePresentationPolicy (supplied) {
  const [policy] = useState(() => supplied ?? getPresentationPolicy())
  const preferences = useSyncExternalStore(policy.subscribe, policy.getSnapshot)
  return { policy, preferences }
}
