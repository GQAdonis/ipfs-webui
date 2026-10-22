import { afterEach, describe, expect, it, vi } from 'vitest'
import createAppIdle from './app-idle.js'
import pinning from './pinning.js'

afterEach(() => vi.useRealTimers())

describe('store-owned background lifecycle', () => {
  it('unsubscribes idle observation and cancels queued work when its store is destroyed', () => {
    vi.useFakeTimers()
    let onChange
    const unsubscribe = vi.fn()
    const store = { dispatch: vi.fn(), subscribe: vi.fn(callback => { onChange = callback; return unsubscribe }) }
    const cleanup = createAppIdle({ idleTimeout: 5000 }).init(store)
    expect(store.subscribe).toHaveBeenCalledTimes(1)
    onChange()
    cleanup()
    vi.runAllTimers()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('stops both pending-pin and remote-pin intervals when its store is destroyed', () => {
    vi.useFakeTimers()
    const store = {
      selectIpfsReady: vi.fn(() => false),
      selectPendingPins: vi.fn(() => []),
      selectFailedPins: vi.fn(() => []),
      doSetPinning: vi.fn(),
      doFetchRemotePins: vi.fn()
    }
    const cleanup = pinning.init(store)
    vi.advanceTimersByTime(1000)
    expect(store.selectIpfsReady).toHaveBeenCalledTimes(1)
    cleanup()
    vi.advanceTimersByTime(60000)
    expect(store.selectIpfsReady).toHaveBeenCalledTimes(1)
    expect(store.doSetPinning).not.toHaveBeenCalled()
    expect(store.doFetchRemotePins).not.toHaveBeenCalled()
  })
})
