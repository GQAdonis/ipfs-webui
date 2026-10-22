import { describe, expect, it, vi } from 'vitest'
import { createOriginPolicy } from './origin-policy.js'
import { createConnectionStore } from './connection-store.js'
import { enterSession, getSession, isSessionMode, resetSessionForTests, signOut } from './session.js'

const ENDPOINT = 'http://127.0.0.1:43111/agui'
const CONSOLE = 'https://console.example/agui'
const deferred = () => {
  let resolve
  const promise = new Promise(_resolve => { resolve = _resolve })
  return { promise, resolve }
}
const settle = async () => { for (let i = 0; i < 5; i++) await Promise.resolve() }

function fixture (initial = {}) {
  let settings = { endpoint: ENDPOINT, enabled: true, ...initial.settings }
  let token = 'fixture-bearer'
  let session = initial.session
  let bridge = initial.bridge
  const settingsListeners = new Set()
  const sessionListeners = new Set()
  const subscribe = listeners => listener => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  const getToken = vi.fn(() => token)
  const store = createConnectionStore({
    ...(initial.originPolicy && { originPolicy: initial.originPolicy }),
    getBridge: () => bridge,
    getSession: () => session,
    getSessionEndpoint: () => CONSOLE,
    getSettings: () => settings,
    getToken,
    subscribeSettings: subscribe(settingsListeners),
    subscribeSession: subscribe(sessionListeners)
  })
  return {
    store,
    getToken,
    settingsListeners,
    sessionListeners,
    settings (patch) {
      settings = { ...settings, ...patch }
      // Existing settings-store owns this shared bearer-forgetting behavior.
      if (!settings.enabled) token = undefined
      settingsListeners.forEach(listener => listener())
    },
    token (next, notify = true) {
      token = next
      if (notify) settingsListeners.forEach(listener => listener())
    },
    session (next) {
      session = next
      sessionListeners.forEach(listener => listener())
    },
    bridge (next) { bridge = next }
  }
}

const signedIn = () => ({
  expired: false,
  report: { principals: [{ name: 'fixture-person', kind: 'ui' }], email: 'fixture@example.test', exp: 123, admin: 'ok' }
})

describe('unified connection lifetime', () => {
  it('keeps a stable frozen snapshot and credentials out of all snapshot projections', async () => {
    const f = fixture()
    const snapshot = f.store.getSnapshot()
    expect(f.store.getSnapshot()).toBe(snapshot)
    expect(Object.isFrozen(snapshot)).toBe(true)
    expect(snapshot).toMatchObject({ status: 'ready', source: 'settings', session: false, endpoint: ENDPOINT })
    expect(await f.store.capture().getToken()).toBe('fixture-bearer')
    expect(JSON.stringify(snapshot)).not.toMatch(/fixture-bearer|fixture-person|fixture@example|token|credential/)
    f.settings({ endpoint: ENDPOINT })
    expect(f.store.getSnapshot()).toBe(snapshot)
    f.store.dispose()
  })

  it('selects Desktop before validated console and Settings without probing its token', async () => {
    const bridge = { getEndpoint: vi.fn(async () => ENDPOINT), getToken: vi.fn(async () => 'bridge-fixture') }
    const f = fixture({ bridge, session: signedIn() })
    expect(f.store.getSnapshot().status).toBe('resolving')
    expect(f.store.capture()).toBeNull()
    await settle()
    expect(f.store.getSnapshot()).toMatchObject({ source: 'desktop', status: 'ready', session: false })
    expect(bridge.getToken).not.toHaveBeenCalled()
    expect(f.getToken).not.toHaveBeenCalled()
    expect(await f.store.capture().getToken()).toBe('bridge-fixture')
    f.store.dispose()
  })

  it('does not fall through an invalid Desktop endpoint to another credential source', async () => {
    const f = fixture({ bridge: { getEndpoint: async () => 'https://user:password@example.test/agui', getToken: vi.fn() }, session: signedIn() })
    await settle()
    expect(f.store.getSnapshot()).toMatchObject({ source: 'desktop', status: 'no-endpoint' })
    expect(f.store.getSnapshot().endpoint).toBeUndefined()
    expect(f.store.capture()).toBeNull()
    f.store.dispose()
  })

  it('selects validated console with no bearer access and blocks an expired session', async () => {
    const f = fixture({ session: signedIn() })
    const capture = f.store.capture()
    expect(capture).toMatchObject({ endpoint: CONSOLE, root: 'https://console.example', session: true })
    expect(await capture.getToken()).toBeUndefined()
    expect(f.getToken).not.toHaveBeenCalled()
    expect(JSON.stringify(f.store.getSnapshot())).not.toContain('fixture-person')
    f.session({ ...signedIn(), expired: true })
    expect(capture.signal.aborted).toBe(true)
    expect(f.store.getSnapshot()).toMatchObject({ status: 'session-expired', source: 'console' })
    expect(f.store.capture()).toBeNull()
    f.store.dispose()
  })

  it('retires every successful selected console revalidation without using display identity', () => {
    const f = fixture({ session: signedIn() })
    const first = f.store.capture()
    const abort = vi.fn(() => {
      expect(f.store.getSnapshot().generation).not.toBe(first.generation)
      expect(first.isCurrent()).toBe(false)
    })
    first.signal.addEventListener('abort', abort)
    f.session(signedIn()) // Equal-looking report does not prove the same subject.
    expect(abort).toHaveBeenCalledOnce()
    expect(f.store.capture().generation).not.toBe(first.generation)
    f.store.dispose()
  })

  it('aborts old consumers synchronously before notifying replacement subscribers', async () => {
    const f = fixture()
    const capture = f.store.capture()
    const order = []
    capture.signal.addEventListener('abort', () => order.push('abort'))
    f.store.subscribe(() => {
      expect(capture.signal.aborted).toBe(true)
      order.push('notify')
    })
    f.token('replacement-fixture')
    expect(order).toEqual(['abort', 'notify'])
    expect(await capture.getToken()).toBeUndefined()
    expect(await f.store.capture().getToken()).toBe('replacement-fixture')
    f.store.dispose()
  })

  it('ignores stale asynchronous Desktop endpoint completion after source replacement', async () => {
    const pending = deferred()
    const f = fixture({ bridge: { getEndpoint: () => pending.promise, getToken: vi.fn() } })
    await settle()
    f.bridge(undefined)
    f.store.refresh()
    const replacement = f.store.getSnapshot()
    pending.resolve('http://127.0.0.1:49999/agui')
    await settle()
    expect(f.store.getSnapshot()).toBe(replacement)
    expect(replacement).toMatchObject({ source: 'settings', endpoint: ENDPOINT })
    f.store.dispose()
  })

  it('does not release an awaited credential after its lifetime is retired', async () => {
    const pending = deferred()
    const f = fixture({ bridge: { getEndpoint: async () => ENDPOINT, getToken: () => pending.promise } })
    await settle()
    const capture = f.store.capture()
    const token = capture.getToken()
    f.store.refresh()
    pending.resolve('retired-fixture')
    expect(await token).toBeUndefined()
    expect(capture.isCurrent()).toBe(false)
    f.store.dispose()
  })

  it('fences a bridge credential change observed on a request without polling for secrets', async () => {
    let token = 'first-fixture'
    const bridge = { getEndpoint: vi.fn(async () => ENDPOINT), getToken: vi.fn(async () => token) }
    const f = fixture({ bridge })
    await settle()
    const first = f.store.capture()
    expect(await first.getToken()).toBe('first-fixture')
    token = 'second-fixture'
    expect(first.isCurrent()).toBe(true) // No host subscription exists to reveal an idle change.
    expect(bridge.getToken).toHaveBeenCalledTimes(1)
    expect(await first.getToken()).toBeUndefined()
    expect(first.signal.aborted).toBe(true)
    await settle()
    expect(await f.store.capture().getToken()).toBe('second-fixture')
    f.store.dispose()
  })

  it('keeps Search connection readiness independent of chat enablement in cookie mode', () => {
    const f = fixture({ session: signedIn() })
    const before = f.store.capture()
    f.settings({ enabled: false })
    expect(before.signal.aborted).toBe(true)
    expect(f.store.getSnapshot()).toMatchObject({ chatEnabled: false, status: 'ready', session: true })
    expect(f.store.capture()).not.toBeNull()
    f.store.dispose()
  })

  it('truthfully loses standalone shared bearer readiness when chat disable forgets it', () => {
    const f = fixture()
    const before = f.store.capture()
    f.settings({ enabled: false })
    expect(before.signal.aborted).toBe(true)
    expect(f.store.getSnapshot()).toMatchObject({ chatEnabled: false, status: 'no-token' })
    expect(f.store.capture()).toBeNull()
    f.store.dispose()
  })

  it('fences a credential source change even if a source failed to emit', async () => {
    const f = fixture()
    const before = f.store.capture()
    f.token('unannounced-fixture', false)
    expect(await before.getToken()).toBeUndefined()
    expect(before.signal.aborted).toBe(true)
    expect(await f.store.capture().getToken()).toBe('unannounced-fixture')
    f.store.dispose()
  })

  it('disposes subscriptions and pending endpoint work without reviving the store', async () => {
    const pending = deferred()
    const f = fixture({ bridge: { getEndpoint: () => pending.promise, getToken: vi.fn() } })
    await settle()
    const listener = vi.fn()
    f.store.subscribe(listener)
    f.store.dispose()
    const snapshot = f.store.getSnapshot()
    expect(snapshot.status).toBe('disposed')
    expect(f.settingsListeners.size).toBe(0)
    expect(f.sessionListeners.size).toBe(0)
    expect(listener).toHaveBeenCalledOnce()
    pending.resolve(ENDPOINT)
    await settle()
    f.store.refresh()
    expect(f.store.getSnapshot()).toBe(snapshot)
    expect(f.store.capture()).toBeNull()
  })

  it('retires the real console lifetime before logout navigation and fences late consumer callbacks', async () => {
    resetSessionForTests()
    enterSession(signedIn().report)
    const getToken = vi.fn(() => 'must-not-be-used')
    const store = createConnectionStore({
      getBridge: () => undefined,
      getSessionEndpoint: () => CONSOLE,
      getSettings: () => ({ endpoint: ENDPOINT, enabled: true }),
      getToken,
      subscribeSettings: () => () => {}
    })
    try {
      const capture = store.capture()
      const commit = vi.fn()
      const pendingConsumer = Promise.resolve().then(() => { if (capture.isCurrent()) commit() })
      const abort = vi.fn()
      capture.signal.addEventListener('abort', abort)
      const assign = vi.fn(() => {
        expect(abort).toHaveBeenCalledOnce()
        expect(store.getSnapshot()).toMatchObject({ source: 'console', status: 'signing-out', session: true })
        expect(store.capture()).toBeNull()
        expect(getSession().expired).toBe(false)
      })
      signOut({ assign })
      await pendingConsumer
      expect(commit).not.toHaveBeenCalled()
      expect(await capture.getToken()).toBeUndefined()
      expect(getToken).not.toHaveBeenCalled()
      expect(assign).toHaveBeenCalledWith('/oauth2/logout')
      expect(isSessionMode()).toBe(true)
      store.refresh() // Delayed navigation cannot select Settings or reopen this lifetime.
      expect(store.getSnapshot()).toMatchObject({ status: 'signing-out', source: 'console' })
      expect(store.capture()).toBeNull()
    } finally {
      store.dispose()
      resetSessionForTests()
    }
  })

  it('remains unavailable after logout navigation fails without falling back to a saved bearer', () => {
    resetSessionForTests()
    enterSession(signedIn().report)
    const getToken = vi.fn(() => 'must-not-be-used')
    const store = createConnectionStore({
      getBridge: () => undefined,
      getSessionEndpoint: () => CONSOLE,
      getSettings: () => ({ endpoint: ENDPOINT, enabled: true }),
      getToken,
      subscribeSettings: () => () => {}
    })
    try {
      const capture = store.capture()
      expect(() => signOut({ assign: () => { throw new Error('navigation refused') } })).toThrow('navigation refused')
      expect(capture.signal.aborted).toBe(true)
      expect(store.getSnapshot()).toMatchObject({ status: 'signing-out', source: 'console', session: true })
      expect(store.capture()).toBeNull()
      expect(getToken).not.toHaveBeenCalled()
      expect(getSession()).toMatchObject({ retiring: true, expired: false })
    } finally {
      store.dispose()
      resetSessionForTests()
    }
  })
})

describe('page origin fences the shared authenticated capture', () => {
  function origin (href) {
    let current = href
    const policy = createOriginPolicy({ getLocation: () => ({ href: current }), getConsoleSession: () => undefined, getDesktopBridge: () => undefined, subscribeConsole: () => () => {}, events: new EventTarget() })
    return { policy, move: href => { current = href } }
  }
  it('reads no credential or bridge endpoint on a shared path, whatever was stored', async () => {
    const page = origin('https://arbitrary-gateway.example/ipfs/bafyfixture/')
    const bridge = { getEndpoint: vi.fn(async () => ENDPOINT), getToken: vi.fn(async () => 'fixture') }
    const f = fixture({ originPolicy: page.policy, bridge })
    await settle()
    expect(f.store.getSnapshot()).toMatchObject({ status: 'origin-blocked', originKind: 'shared-gateway' })
    expect(f.store.capture()).toBeNull()
    expect(bridge.getEndpoint).not.toHaveBeenCalled(); expect(bridge.getToken).not.toHaveBeenCalled(); expect(f.getToken).not.toHaveBeenCalled()
    f.store.dispose()
  })
  it('retires the previous signal before notifying consumers, including a location change with no browser event', async () => {
    const page = origin('http://localhost:5001/webui/')
    const f = fixture({ originPolicy: page.policy }); const capture = f.store.capture()
    const notices = []
    f.store.subscribe(() => notices.push({ aborted: capture.signal.aborted, status: f.store.getSnapshot().status }))
    page.move('http://localhost:5001/ipfs/bafyfixture/')
    expect(capture.isCurrent()).toBe(false)
    expect(capture.signal.aborted).toBe(true)
    expect(notices).toEqual([{ aborted: true, status: 'origin-blocked' }])
    expect(await capture.getToken()).toBeUndefined()
    expect(f.store.capture()).toBeNull()
    page.move('http://localhost:5001/webui/'); page.policy.refresh()
    expect(f.store.getSnapshot().status).toBe('ready')
    expect(f.store.capture().generation).not.toBe(capture.generation)
    f.store.dispose()
  })
  it('fences a credential wait when origin becomes shared and never releases the late credential', async () => {
    const page = origin('http://localhost:5001/webui/'); const held = deferred()
    const bridge = { getEndpoint: async () => ENDPOINT, getToken: vi.fn(() => held.promise) }
    const f = fixture({ originPolicy: page.policy, bridge })
    await settle()
    const capture = f.store.capture(); const waiting = capture.getToken()
    page.move('http://localhost:5001/ipns/shared/'); held.resolve('late-private-fixture')
    expect(await waiting).toBeUndefined()
    expect(capture.signal.aborted).toBe(true)
    expect(f.store.getSnapshot().status).toBe('origin-blocked')
    f.store.dispose()
  })
})
