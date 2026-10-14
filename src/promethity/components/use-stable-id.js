import { useState } from 'react'

// React 16 has no useId, and this shell does not migrate React (see
// docs/PROMETHITY-FORK.md non-goals). A lazily initialised counter gives each
// component instance one id that never changes across renders.
let counter = 0

/**
 * @param {string} prefix
 * @returns {string}
 */
export function useStableId (prefix) {
  const [id] = useState(() => `${prefix}-${++counter}`)
  return id
}
