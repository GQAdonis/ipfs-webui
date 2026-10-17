// Where the search routes live and which token opens them. Both come from the
// same source as the agent chat and nowhere else: under IPFS Desktop the frozen
// bridge (`window.ipfsDesktop.agentChat`) owns the endpoint and the token; on the
// console, the endpoint the chat is set to and the chat's `ui` token. Search adds
// no setting for either and writes no token anywhere. The routes sit on the same
// listener as /agui, so the root is the endpoint without its `/agui` suffix.

import { getBridge } from '../agent-chat/bridge.js'
import { validateEndpoint } from '../agent-chat/endpoint.js'
import { isSessionMode } from '../agent-chat/session.js'
import { getSettings as getChatSettings, getToken as getChatToken } from '../agent-chat/settings-store.js'

const AGUI_SUFFIX = '/agui'

/**
 * @typedef {{ ok: true, root: string, getToken: () => string | undefined | Promise<string | undefined>, session?: boolean }
 *   | { ok: false, reason: 'no-endpoint' | 'no-token' }} Connection
 */

/** @param {string} endpoint a validated /agui URL */
const rootOf = (endpoint) => endpoint.slice(0, -AGUI_SUFFIX.length)

/**
 * The connection right now, or why there is none. Nothing is requested here
 * except the Desktop bridge's own two async getters.
 *
 * @param {Object} [seams] test seams
 * @param {ReturnType<typeof getBridge>} [seams.bridge]
 * @param {{ endpoint: string }} [seams.settings]
 * @param {string | undefined} [seams.token]
 * @returns {Promise<Connection>}
 */
export async function resolveConnection (seams = {}) {
  const { bridge = getBridge(), settings = getChatSettings(), token = getChatToken() } = seams
  if (bridge) {
    let endpoint
    try {
      endpoint = validateEndpoint(await bridge.getEndpoint())
    } catch (_) {
      return { ok: false, reason: 'no-endpoint' }
    }
    if (!endpoint.ok) return { ok: false, reason: 'no-endpoint' }
    return { ok: true, root: rootOf(endpoint.value), getToken: bridge.getToken }
  }
  const endpoint = validateEndpoint(settings.endpoint)
  if (!endpoint.ok) return { ok: false, reason: 'no-endpoint' }
  // Session mode: the cookie session is the credential and the endpoint is the page's own origin.
  if (isSessionMode()) return { ok: true, root: rootOf(endpoint.value), getToken: () => undefined, session: true }
  if (!token) return { ok: false, reason: 'no-token' }
  return { ok: true, root: rootOf(endpoint.value), getToken: getChatToken }
}
