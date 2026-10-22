// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createOriginPolicy } from './origin-policy.js'

function harness () {
  let href = 'http://localhost:5001/webui/'; let session; let bridge
  const events = new EventTarget(); const sessions = new Set()
  const add = vi.spyOn(events, 'addEventListener'); const remove = vi.spyOn(events, 'removeEventListener')
  const policy = createOriginPolicy({
    getLocation: () => ({ href }),
    getConsoleSession: () => session,
    getDesktopBridge: () => bridge,
    events,
    subscribeConsole: fn => { sessions.add(fn); return () => sessions.delete(fn) }
  })
  return { policy, events, sessions, add, remove, location: value => { href = value }, session: value => { session = value; sessions.forEach(fn => fn()) }, bridge: value => { bridge = value } }
}
describe('live origin policy lifetime', () => {
  it('constructs without listeners and retains a stable read snapshot', () => {
    const h = harness()
    expect(h.add).not.toHaveBeenCalled(); expect(h.sessions.size).toBe(0)
    expect(h.policy.getSnapshot()).toBe(h.policy.getSnapshot())
    expect(h.policy.allowsAgent()).toBe(true)
    expect(h.add).not.toHaveBeenCalled()
  })
  it('shares one event/session subscription and removes every owned listener after final cleanup', () => {
    const h = harness(); const first = vi.fn(); const second = vi.fn()
    const offFirst = h.policy.subscribe(first); const offSecond = h.policy.subscribe(second)
    expect(h.add).toHaveBeenCalledTimes(6); expect(h.sessions.size).toBe(1)
    offFirst(); expect(h.remove).not.toHaveBeenCalled()
    offSecond(); expect(h.remove).toHaveBeenCalledTimes(6); expect(h.sessions.size).toBe(0)
    h.location('https://gateway.example/ipfs/bafyfixture/')
    h.events.dispatchEvent(new Event('popstate'))
    expect(first).not.toHaveBeenCalled(); expect(second).not.toHaveBeenCalled()
    const off = h.policy.subscribe(first)
    expect(h.policy.getSnapshot().kind).toBe('shared-gateway')
    off(); expect(h.sessions.size).toBe(0)
  })
  it('rechecks the actual location at call time even when history changed without an event', () => {
    const h = harness(); const changed = vi.fn()
    const off = h.policy.subscribe(changed)
    h.location('http://localhost:5001/ipfs/bafyfixture/')
    expect(h.policy.allowsAgent()).toBe(false)
    expect(changed).toHaveBeenCalledTimes(1)
    expect(h.policy.getSnapshot().kind).toBe('shared-gateway')
    expect(h.policy.allowsAgent()).toBe(false)
    expect(changed).toHaveBeenCalledTimes(1)
    off()
  })
  it.each(['popstate', 'hashchange', 'pageshow', 'pointerdown', 'click', 'keydown'])('retires cached authority before %s consumers act', event => {
    const h = harness(); const changed = vi.fn(); const off = h.policy.subscribe(changed)
    h.location('https://arbitrary.example/proxy/ipns/name/')
    h.events.dispatchEvent(new Event(event))
    expect(h.policy.getSnapshot()).toEqual({ allowed: false, kind: 'shared-gateway' })
    expect(changed).toHaveBeenCalledTimes(1)
    off()
  })
  it('uses actual console ingress and never lets it override a shared content path', () => {
    const h = harness(); const off = h.policy.subscribe(() => {})
    h.location('https://console.operator.example/'); h.policy.refresh()
    expect(h.policy.getSnapshot().allowed).toBe(false)
    h.session({ report: { principals: [] }, expired: false })
    expect(h.policy.getSnapshot().kind).toBe('configured-console')
    h.location('https://console.operator.example/ipns/name/'); h.session({ report: { principals: [] }, expired: false })
    expect(h.policy.getSnapshot().kind).toBe('shared-gateway')
    off()
  })
})
