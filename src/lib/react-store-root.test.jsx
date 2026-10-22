import { useEffect } from 'react'
import { act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { startStoreRoot } from './react-store-root.js'

function deferred () {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

describe('owned application root lifecycle', () => {
  it('waits for session and cached state before creating the store, then unmounts before destroying it', async () => {
    const session = deferred()
    const order = []
    const container = document.createElement('div')
    const loadData = vi.fn(async () => { order.push('cache'); return { route: '#/files' } })
    const store = { destroy: vi.fn(() => order.push('destroy')) }
    const createStore = vi.fn(data => { order.push(data.route); return store })
    function View () {
      useEffect(() => () => { order.push('view cleanup') }, [])
      return <p>Files</p>
    }
    const application = startStoreRoot({
      container, beforeStore: () => session.promise,
      loadData, createStore, renderStore: () => <View />
    })
    expect(loadData).not.toHaveBeenCalled()
    expect(createStore).not.toHaveBeenCalled()
    await act(async () => {
      session.resolve()
      expect(await application.ready).toBe(true)
    })
    expect(createStore).toHaveBeenCalledWith({ route: '#/files' })
    expect(container).toHaveTextContent('Files')
    act(() => application.unmount())
    application.unmount()
    expect(order).toEqual(['cache', '#/files', 'view cleanup', 'destroy'])
    expect(store.destroy).toHaveBeenCalledTimes(1)
    expect(container).toBeEmptyDOMElement()
  })

  it('does not read cached state or create a late root after cancellation during session boot', async () => {
    const session = deferred()
    const container = document.createElement('div')
    const loadData = vi.fn(async () => ({}))
    const createStore = vi.fn()
    const application = startStoreRoot({ container, beforeStore: () => session.promise, loadData, createStore, renderStore: () => null })
    application.unmount()
    session.resolve()
    expect(await application.ready).toBe(false)
    expect(loadData).not.toHaveBeenCalled()
    expect(createStore).not.toHaveBeenCalled()
    expect(container).toBeEmptyDOMElement()
  })

  it('does not start a store if teardown happens while cache loading is pending', async () => {
    const cache = deferred()
    const createStore = vi.fn()
    const application = startStoreRoot({
      container: document.createElement('div'), beforeStore: async () => {},
      loadData: () => cache.promise, createStore, renderStore: () => null
    })
    await Promise.resolve()
    application.unmount()
    cache.resolve({})
    expect(await application.ready).toBe(false)
    expect(createStore).not.toHaveBeenCalled()
  })

  it('destroys an initialized store if preparing its rendered tree fails', async () => {
    const store = { destroy: vi.fn() }
    const application = startStoreRoot({
      container: document.createElement('div'), beforeStore: async () => {},
      loadData: async () => ({}), createStore: () => store,
      renderStore: () => { throw new Error('view preparation failed') }
    })
    await expect(application.ready).rejects.toThrow('view preparation failed')
    application.unmount()
    expect(store.destroy).toHaveBeenCalledTimes(1)
  })
})
