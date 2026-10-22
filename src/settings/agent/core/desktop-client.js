// The IPFS Desktop implementation of SettingsClient: the frozen bridge the
// preload exposes as `window.ipfsDesktop.agentSettings` (one method per IPC
// channel of mcp/contract/settings/client, answered by the main process for the
// trusted main frame only). The page never holds an endpoint or a secret under
// Desktop: the main process stores the key in safeStorage and applies it. This
// wrapper only normalises what a rejected IPC call looks like.

import { getOriginPolicy } from '../../../agent-chat/origin-policy.js'
import { SettingsError, isSettingsError, toSettingsError } from './errors.js'

const METHODS = Object.freeze(['get', 'set', 'testConnection', 'setApiKey', 'clearApiKey', 'status', 'onChange'])

/**
 * The bridge, when the main process created this window with it. All seven
 * methods must exist: a partial bridge is treated as absent, so the page never
 * offers a control that cannot work.
 *
 * @param {any} [scope]
 * @returns {import('./types.js').SettingsClient | undefined}
 */
export function createDesktopSettingsClient (scope = globalThis) {
  if (!getOriginPolicy().allowsAgent()) return undefined
  const bridge = scope?.ipfsDesktop?.agentSettings
  if (!bridge || !METHODS.every((m) => typeof bridge[m] === 'function')) return undefined

  /**
   * @template T
   * @param {() => Promise<T>} call
   * @returns {Promise<T>}
   */
  const guard = async (call) => {
    const origin = getOriginPolicy()
    let retired = false
    const unsubscribe = origin.subscribe(() => { if (!origin.allowsAgent()) retired = true })
    try {
      if (retired || !origin.allowsAgent()) throw new SettingsError('unavailable', 'Agent settings are unavailable on this page origin.')
      const result = await call()
      if (retired || !origin.allowsAgent()) throw new SettingsError('unavailable', 'The page origin changed while the request was pending. Check reported outcomes before retrying.')
      return result
    } catch (e) {
      const known = toSettingsError(e)
      // The main process rejects with a plain Error for Touch ID declined, service not running,
      // keystore unavailable and invalid request. Those sentences are authored by Desktop, carry no
      // secret, and are shown as the error state's detail.
      if (!isSettingsError(e) && known.kind === 'unavailable' && e instanceof Error && e.message) {
        throw new SettingsError('unavailable', known.message, { detail: e.message })
      }
      throw known
    } finally { unsubscribe() }
  }

  return {
    get: () => guard(() => bridge.get()),
    set: (req) => guard(() => bridge.set(req)),
    testConnection: (req) => guard(() => bridge.testConnection(req)),
    setApiKey: (req) => guard(() => bridge.setApiKey(req)),
    clearApiKey: (req) => guard(() => bridge.clearApiKey(req)),
    status: () => guard(() => bridge.status()),
    onChange: (cb) => {
      const origin = getOriginPolicy()
      if (!origin.allowsAgent()) return () => {}
      /** @type {(() => void) | undefined} */
      let unsubscribeOrigin
      /** @type {(() => void) | undefined} */
      let release
      let live = true
      const stop = () => { live = false; release?.(); release = undefined; unsubscribeOrigin?.(); unsubscribeOrigin = undefined }
      try {
        const off = bridge.onChange((/** @type {import('./types.js').SettingsChangedEvent} */ event) => { if (!live) return; if (origin.allowsAgent()) cb(event); else stop() })
        release = typeof off === 'function' ? off : undefined
        unsubscribeOrigin = origin.subscribe(() => { if (!origin.allowsAgent()) stop() })
        if (!origin.allowsAgent()) stop()
        return stop
      } catch (_) { stop(); return () => {} }
    }
  }
}

/**
 * The optional Desktop confirmation-window switch. The agentSettings contract
 * carries no such channel (the switch is a Desktop store key, `desktopConfirm.enabled`),
 * so it is used only when the main process exposes a `desktopConfirm` object
 * with `get()` and `set(enabled)`. Without it the page renders no switch.
 *
 * @param {any} [scope]
 * @returns {{ get: () => Promise<boolean>, set: (enabled: boolean) => Promise<void> } | undefined}
 */
export function getDesktopConfirmSwitch (scope = globalThis) {
  if (!getOriginPolicy().allowsAgent()) return undefined
  const sw = scope?.ipfsDesktop?.desktopConfirm
  if (!sw || typeof sw.get !== 'function' || typeof sw.set !== 'function') return undefined
  /** @template T
   * @param {() => Promise<T>} call */
  const guarded = async call => {
    const origin = getOriginPolicy()
    let retired = false
    const unsubscribe = origin.subscribe(() => { if (!origin.allowsAgent()) retired = true })
    try {
      if (retired || !origin.allowsAgent()) throw new SettingsError('unavailable', 'Native settings are unavailable on this page origin.')
      const result = await call()
      if (retired || !origin.allowsAgent()) throw new SettingsError('unavailable', 'The page origin changed while the request was pending. Check reported outcomes before retrying.')
      return result
    } finally { unsubscribe() }
  }
  return { get: () => guarded(() => sw.get()), set: enabled => guarded(() => sw.set(enabled)) }
}
