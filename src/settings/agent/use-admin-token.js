import { useEffect, useState } from 'react'
import { getAdminTokenRoot, getAdminTokenVersion, isAdminTokenRemembered, subscribeAdminToken } from './core/admin-token.js'

const read = () => ({ set: getAdminTokenRoot() !== undefined, root: getAdminTokenRoot(), remembered: isAdminTokenRemembered(), version: getAdminTokenVersion() })

/**
 * Subscribe a component to the admin token store. Reports whether a token is
 * held, the settings root it is bound to, whether it is kept for the tab, and a
 * version that changes whenever the token does. The token itself never leaves
 * the store through this hook.
 */
export function useAdminTokenState () {
  const [state, setState] = useState(read)
  useEffect(() => {
    const sync = () => setState(read())
    sync()
    return subscribeAdminToken(sync)
  }, [])
  return state
}
