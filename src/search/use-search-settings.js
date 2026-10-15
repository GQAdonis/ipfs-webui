import { useEffect, useState } from 'react'
import { getSettings, subscribe } from './settings-store.js'

/** Subscribe a component to the Web UI setting `search.enabled`. */
export function useSearchSettings () {
  const [settings, setSettings] = useState(getSettings)
  useEffect(() => {
    const sync = () => setSettings(getSettings())
    sync()
    return subscribe(sync)
  }, [])
  return settings
}
