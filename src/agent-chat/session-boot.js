// Runs once at app boot, before the store reads the saved API address (decision: console-session-auth 3.1, 3.2).
//
// It asks the page's own origin for a session report. Without a 200 it does nothing at all, so a
// loopback node, IPFS Desktop and every other deployment keep their existing behaviour. With a 200
// it switches the page to session mode and deletes what the interim credentials left in this browser
// profile: the saved chat token, any saved API address that carries userinfo or an Authorization
// header, and the admin token for this tab. From then on the stores refuse to write a credential.

import { TOKEN_STORAGE_KEY, reload as reloadChatSettings } from './settings-store.js'
import { getBridge } from './bridge.js'
import { enterSession, probeSession } from './session.js'
import { apiAddressHasCredential } from './api-address.js'
import { forgetAdminToken } from '../settings/agent/core/admin-token.js'

/** The Web UI's saved API address (bundles/ipfs-provider.js). */
export const API_ADDRESS_KEY = 'ipfsApi'

/** Delete the saved chat token and any credentialed API address. The admin token is forgotten through its own module. */
export function purgeStoredCredentials () {
  try {
    globalThis.localStorage?.removeItem(TOKEN_STORAGE_KEY)
    const raw = globalThis.localStorage?.getItem(API_ADDRESS_KEY)
    if (typeof raw === 'string' && apiAddressHasCredential(raw)) globalThis.localStorage.removeItem(API_ADDRESS_KEY)
  } catch (_) {
    // Blocked storage holds nothing to delete.
  }
}

/**
 * @param {Parameters<typeof probeSession>[0]} [seams] test seams
 * @returns {Promise<boolean>} whether the page is now in session mode
 */
export async function bootSession (seams) {
  // IPFS Desktop owns its connection through the bridge: nothing is asked of any origin.
  if (getBridge()) return false
  const answer = await probeSession(seams)
  if (answer === undefined || answer === 'expired') return false
  enterSession(answer)
  purgeStoredCredentials()
  forgetAdminToken()
  reloadChatSettings()
  return true
}
