import { useEffect, useState } from 'react'
import { getSettings, getToken, subscribe } from './settings-store.js'

/** Subscribe a component to the agent chat settings and the in-memory token. */
export function useAgentChatSettings () {
  const [state, setState] = useState(() => ({ settings: getSettings(), token: getToken() }))
  useEffect(() => {
    const sync = () => setState({ settings: getSettings(), token: getToken() })
    sync()
    return subscribe(sync)
  }, [])
  return state
}
