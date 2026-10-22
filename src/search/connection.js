// Where the search routes live and which token opens them. Both come from the
// same source as the agent chat and nowhere else: under IPFS Desktop the frozen
// bridge (`window.ipfsDesktop.agentChat`) owns the endpoint and the token; on the
// console, the endpoint the chat is set to and the chat's `ui` token. Search adds
// no setting for either and writes no token anywhere. The routes sit on the same
// listener as /agui, so the root is the endpoint without its `/agui` suffix.

import { createConnectionStore, getConnectionStore } from '../agent-chat/connection-store.js'
import { getSettings as getChatSettings, getToken as getChatToken } from '../agent-chat/settings-store.js'

/**
 * @typedef {'no-endpoint' | 'no-token' | 'resolving' | 'session-expired' | 'signing-out' | 'origin-blocked'} ConnectionReason
 * @typedef {{ ok: true, root: string, getToken: () => Promise<string | undefined>, session: boolean, generation: string, signal: AbortSignal, isCurrent: () => boolean }
 *   | { ok: false, reason: ConnectionReason }} Connection
 */

/**
 * Project the one shared connection lifetime; never resolve Desktop/session/Settings again.
 * Search's own enabled flag is checked by its consumers, independently of chatEnabled.
 *
 * @param {Object} [seams] test seams
 * @param {{ getEndpoint: () => Promise<string>, getToken: () => Promise<string> }} [seams.bridge]
 * @param {{ endpoint: string }} [seams.settings]
 * @param {string | undefined} [seams.token]
 * @param {ReturnType<typeof createConnectionStore>} [seams.store]
 * @returns {Promise<Connection>}
 */
export async function resolveConnection (seams = {}) {
  let store = seams.store
  // Preserve historical injected-source test seams through the same implementation. These
  // isolated test stores subscribe to nothing and are not the production shared controller.
  if (!store && ['bridge', 'settings', 'token'].some(key => Object.hasOwn(seams, key))) {
    store = createConnectionStore({
      ...(Object.hasOwn(seams, 'bridge') && { getBridge: () => seams.bridge }),
      getSettings: () => seams.settings ?? getChatSettings(),
      getToken: () => Object.hasOwn(seams, 'token') ? seams.token : getChatToken(),
      subscribeSettings: () => () => {},
      subscribeSession: () => () => {}
    })
    if (store.getSnapshot().status === 'resolving') {
      const pending = store
      await new Promise(resolve => {
        const off = pending.subscribe(() => { off(); resolve() })
      })
    }
  }
  store ??= getConnectionStore()
  const capture = store.capture()
  if (capture) return { ok: true, root: capture.root, getToken: capture.getToken, session: capture.session, generation: capture.generation, signal: capture.signal, isCurrent: capture.isCurrent }
  const status = store.getSnapshot().status
  const reason = ['no-token', 'resolving', 'session-expired', 'signing-out', 'origin-blocked'].includes(status) ? status : 'no-endpoint'
  return { ok: false, reason }
}
