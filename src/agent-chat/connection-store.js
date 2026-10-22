// One frontend lifetime for the connection shared by chat and Search. Generations are local
// retirement tokens, never server identity or permission. Credentials remain in private closures.
// Actual page-origin policy is checked at capture and credential completion; loss retires this
// lifetime before consumer notification. Stored endpoint/gateway strings never confer page trust.
import { getOriginPolicy } from './origin-policy.js'
import { getBridge } from './bridge.js'
import { validateEndpoint } from './endpoint.js'
import { getSession, getSessionEndpoint, subscribeSession } from './session.js'
import { getSettings, getToken, subscribe as subscribeSettings } from './settings-store.js'

let sequence = 0
const nextGeneration = () => `connection-${++sequence}`
const credential = value => typeof value === 'string' && value !== '' ? value : undefined

/**
 * No transport or polling is created here. A selected console notification always retires the
 * lifetime, including successful periodic revalidation: names/email cannot prove subject continuity.
 * This conservatively clears consumers' drafts/projections every revalidation (currently five minutes).
 * Desktop supplies no auth-change subscription. Only source refreshes and credentials observed by an
 * actual request can reveal a bridge change; an idle credential replacement cannot be detected here.
 *
 * Snapshot contains only connection/readiness facts. Consumers must never put capture().getToken()
 * results in React state, projections, attributes, URLs or logs. Search deliberately ignores chatEnabled.
 */
export function createConnectionStore (seams = {}) {
  const sources = {
    getBridge,
    getSession,
    getSessionEndpoint,
    getSettings,
    getToken,
    subscribeSettings,
    subscribeSession,
    originPolicy: getOriginPolicy(),
    ...seams
  }
  const listeners = new Set()
  let disposed = false
  let lifetime = new AbortController()
  let active
  let bridgeCredentialKnown = false
  let bridgeCredential
  let snapshot

  const emit = () => listeners.forEach(listener => listener())
  const read = () => {
    const origin = sources.originPolicy.refresh()
    const bridge = sources.getBridge()
    const settings = sources.getSettings()
    const consoleSession = bridge ? undefined : sources.getSession()
    return {
      originAllowed: origin.allowed,
      originKind: origin.kind,
      source: bridge ? 'desktop' : consoleSession ? 'console' : 'settings',
      bridge,
      consoleSession,
      enabled: bridge ? true : settings.enabled,
      endpoint: bridge ? undefined : consoleSession ? sources.getSessionEndpoint() : settings.endpoint,
      token: bridge || consoleSession || !origin.allowed ? undefined : credential(sources.getToken())
    }
  }
  const same = (a, b) => a && a.originAllowed === b.originAllowed && a.originKind === b.originKind && a.source === b.source && a.bridge === b.bridge &&
    a.consoleSession === b.consoleSession && a.enabled === b.enabled &&
    a.endpoint === b.endpoint && a.token === b.token

  const facts = (input, generation, endpoint) => {
    const checked = validateEndpoint(endpoint)
    const status = !input.originAllowed
      ? 'origin-blocked'
      : input.source === 'console' && input.consoleSession.retiring
        ? 'signing-out'
        : input.source === 'console' && input.consoleSession.expired
          ? 'session-expired'
          : !checked.ok
              ? 'no-endpoint'
              : input.source === 'settings' && !input.token ? 'no-token' : 'ready'
    return Object.freeze({
      generation,
      source: input.source,
      status,
      originKind: input.originKind,
      chatEnabled: input.enabled,
      session: input.source === 'console',
      ...(checked.ok && { endpoint: checked.value, root: checked.value.slice(0, -'/agui'.length) })
    })
  }

  function reconcile (force = false) {
    if (disposed) return
    const input = read()
    if (!force && same(active, input)) return
    const previous = lifetime
    lifetime = new AbortController()
    const signal = lifetime.signal
    active = input
    bridgeCredentialKnown = false
    bridgeCredential = undefined
    const generation = nextGeneration()
    snapshot = input.bridge && input.originAllowed
      ? Object.freeze({ generation, source: 'desktop', status: 'resolving', chatEnabled: true, session: false })
      : facts(input, generation, input.endpoint)
    // Publish replacement facts before abort callbacks run; all old work is fenced synchronously.
    previous.abort()
    emit()
    if (!input.originAllowed) return
    if (!input.bridge) return
    Promise.resolve().then(() => {
      if (signal.aborted) return undefined
      return input.bridge.getEndpoint()
    }).then(endpoint => {
      if (signal.aborted || disposed) return
      snapshot = facts(input, generation, endpoint)
      emit()
    }, () => {
      if (signal.aborted || disposed) return
      snapshot = facts(input, generation, undefined)
      emit()
    })
  }

  reconcile()
  const unsubscribeOrigin = sources.originPolicy.subscribe(() => reconcile())
  const unsubscribeSettings = sources.subscribeSettings(() => reconcile())
  const unsubscribeSession = sources.subscribeSession(() => {
    // Every selected console event is a boundary, even an equal-looking successful report.
    reconcile(active.source === 'console' || (!sources.getBridge() && Boolean(sources.getSession())))
  })

  function capture () {
    if (!sources.originPolicy.allowsAgent() || disposed || snapshot.status !== 'ready') return null
    const selected = active
    const { generation, endpoint, root, session } = snapshot
    const signal = lifetime.signal
    const isCurrent = () => sources.originPolicy.allowsAgent() && !disposed && !signal.aborted && snapshot.generation === generation
    return Object.freeze({
      generation,
      endpoint,
      root,
      session,
      signal,
      isCurrent,
      async getToken () {
        if (!isCurrent() || session) return undefined
        if (!selected.bridge) {
          const token = credential(sources.getToken())
          // Normal setters notify synchronously. Also fence an unannounced injected source change.
          if (token !== selected.token) {
            reconcile(true)
            return undefined
          }
          return isCurrent() ? token : undefined
        }
        let token
        try {
          token = credential(await selected.bridge.getToken())
        } catch (_) {
          token = undefined
        }
        if (!isCurrent()) return undefined
        if (bridgeCredentialKnown && token !== bridgeCredential) {
          // This request discovered a rotation; abort it before a credential can escape. A fresh
          // capture retries through the current provider, never through a cached old credential.
          reconcile(true)
          return undefined
        }
        bridgeCredentialKnown = true
        bridgeCredential = token
        return token
      }
    })
  }

  return Object.freeze({
    getSnapshot: () => snapshot,
    subscribe (listener) {
      if (disposed) return () => {}
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    capture,
    // Explicit host refresh is a conservative boundary, not a secret polling loop.
    refresh: () => reconcile(true),
    dispose () {
      if (disposed) return
      disposed = true
      unsubscribeOrigin()
      unsubscribeSettings()
      unsubscribeSession()
      active = undefined
      bridgeCredential = undefined
      bridgeCredentialKnown = false
      snapshot = Object.freeze({
        generation: nextGeneration(),
        source: snapshot.source,
        status: 'disposed',
        chatEnabled: false,
        session: false
      })
      lifetime.abort()
      emit()
      listeners.clear()
    }
  })
}

let sharedStore
/** Lazily created so application boot can finish validated console-session detection first. */
export function getConnectionStore () {
  if (!sharedStore || sharedStore.getSnapshot().status === 'disposed') sharedStore = createConnectionStore()
  return sharedStore
}
