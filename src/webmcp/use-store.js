import { useEffect, useState } from 'react'

/**
 * Subscribe a component to a small external store: `read()` returns the current value,
 * `subscribe(fn)` returns an unsubscribe function.
 *
 * @template T
 * @param {() => T} read
 * @param {(fn: () => void) => () => void} subscribe
 * @returns {T}
 */
export function useStore (read, subscribe) {
  const [value, setValue] = useState(read)
  useEffect(() => {
    const sync = () => setValue(read())
    sync()
    return subscribe(sync)
  }, [read, subscribe])
  return value
}
