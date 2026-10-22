import { createRoot, type Root } from 'react-dom/client'
import type { ReactNode } from 'react'

interface OwnedStore { destroy: () => void }
interface Startup<Store extends OwnedStore, Data> {
  container: Element
  beforeStore: () => Promise<unknown>
  loadData: () => Promise<Data>
  createStore: (data: Data) => Store
  renderStore: (store: Store) => ReactNode
}

// Session discovery precedes cached state and store initialization. Teardown can
// cancel either await without mounting a late root or starting another store.
export function startStoreRoot<Store extends OwnedStore, Data> ({ container, beforeStore, loadData, createStore, renderStore }: Startup<Store, Data>) {
  let disposed = false
  let root: Root | undefined
  let store: Store | undefined

  function unmount () {
    if (disposed) return
    disposed = true
    const ownedRoot = root
    const ownedStore = store
    root = undefined
    store = undefined
    try {
      ownedRoot?.unmount()
    } finally {
      ownedStore?.destroy()
    }
  }

  const ready = (async () => {
    await beforeStore()
    if (disposed) return false
    const data = await loadData()
    if (disposed) return false
    store = createStore(data)
    if (disposed) {
      store.destroy()
      store = undefined
      return false
    }
    root = createRoot(container)
    root.render(renderStore(store))
    return true
  })().catch(error => {
    unmount()
    throw error
  })

  return { ready, unmount }
}
