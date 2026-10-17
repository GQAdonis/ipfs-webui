import { useEffect, useState } from 'react'
import { getSession, subscribeSession } from './session.js'

/** Subscribe a component to the console session state; undefined outside session mode. */
export function useSession () {
  const [session, setSession] = useState(getSession)
  useEffect(() => {
    const sync = () => setSession(getSession())
    sync()
    return subscribeSession(sync)
  }, [])
  return session
}
