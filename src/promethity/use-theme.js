import { useEffect, useState } from 'react'
import { getResolvedTheme, getTheme, subscribe } from './theme.js'

/** Subscribe a component to the theme preference and the resolved theme. */
export function useTheme () {
  const [state, setState] = useState(() => ({ theme: getTheme(), resolvedTheme: getResolvedTheme() }))
  useEffect(() => {
    const sync = () => setState({ theme: getTheme(), resolvedTheme: getResolvedTheme() })
    sync()
    return subscribe(sync)
  }, [])
  return state
}
