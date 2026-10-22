import { useState, useSyncExternalStore } from 'react'
import { getOriginPolicy } from './origin-policy.js'

/** @param {ReturnType<typeof getOriginPolicy>} [supplied] */
export function useOriginPolicy (supplied) {
  const [policy] = useState(() => supplied ?? getOriginPolicy())
  const origin = useSyncExternalStore(policy.subscribe, policy.getSnapshot)
  return { policy, origin }
}
