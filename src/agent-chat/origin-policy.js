import { classifyAgentOrigin } from './origin-classification.js'
import { getBridge } from './bridge.js'
import { getSession, subscribeSession } from './session.js'

function desktopHostBridge () {
  const chat = getBridge()
  if (chat) return chat
  const settings = /** @type {any} */(globalThis).ipfsDesktop?.agentSettings
  return settings && ['get', 'set', 'testConnection', 'setApiKey', 'clearApiKey', 'status', 'onChange'].every(method => typeof settings[method] === 'function') ? settings : undefined
}

/** Testable owner around actual browser/host ingress; no writable trust preference exists. */
export function createOriginPolicy ({
  getLocation = () => globalThis.location, getConsoleSession = getSession, getDesktopBridge = desktopHostBridge,
  subscribeConsole = subscribeSession, events = globalThis.window
} = {}) {
  const read = () => {
    const location = getLocation()
    return classifyAgentOrigin({ href: location?.href ?? (location?.origin ? location.origin + (location.pathname ?? '/') : undefined), consoleConfigured: getConsoleSession() !== undefined, desktopHosted: getDesktopBridge() !== undefined })
  }
  let snapshot = read()
  /** @type {(() => void) | undefined} */
  let detach
  const listeners = new Set()
  const refresh = () => {
    const next = read()
    if (next.allowed !== snapshot.allowed || next.kind !== snapshot.kind) { snapshot = next; [...listeners].forEach(listener => listener()) }
    return snapshot
  }
  return Object.freeze({
    getSnapshot: () => snapshot,
    refresh,
    allowsAgent: () => refresh().allowed,
    /** @param {() => void} listener */
    subscribe (listener) {
      listeners.add(listener)
      if (!detach) {
        const names = ['popstate', 'hashchange', 'pageshow', 'pointerdown', 'click', 'keydown']
        names.forEach(name => events?.addEventListener(name, refresh, true))
        const unsubscribe = subscribeConsole(refresh)
        detach = () => { names.forEach(name => events?.removeEventListener(name, refresh, true)); unsubscribe() }
      }
      refresh()
      return () => { listeners.delete(listener); if (!listeners.size) { detach?.(); detach = undefined } }
    }
  })
}
let singleton
export function getOriginPolicy () { singleton ??= createOriginPolicy(); return singleton }
