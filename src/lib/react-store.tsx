import { createContext, createElement, useContext, useMemo, useSyncExternalStore, type ComponentType, type ReactNode } from 'react'

type Snapshot = Record<string, unknown>
type Listener = () => void

export interface BundlerStore {
  getState: () => unknown
  select: (names: string[]) => Snapshot
  subscribeToSelectors: (names: string[], listener: (changes: Snapshot) => void) => () => void
  action?: (name: string, args: unknown[]) => unknown
  [name: string]: unknown
}

const StoreContext = createContext<BundlerStore | null>(null)

// The application owns the store lifecycle. Providers may also borrow a store in
// stories or a nested view, so they must never destroy it on their own.
export function Provider ({ store, children }: { store: BundlerStore, children: ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore () {
  const store = useContext(StoreContext)
  if (!store) throw new Error('A connected component requires a store Provider')
  return store
}

function sameSnapshot (left: Snapshot, right: Snapshot) {
  const keys = Object.keys(left)
  return keys.length === Object.keys(right).length && keys.every(key => Object.hasOwn(right, key) && Object.is(left[key], right[key]))
}

// Creating this adapter is side-effect free. React subscribes only after commit,
// rechecks the snapshot to close render/subscribe races, and owns unsubscription.
export function createSelectorSubscription (store: BundlerStore, names: string[]) {
  const selectors = [...names]
  let cached: Snapshot | undefined
  let lastState: unknown
  let dirty = true
  return {
    subscribe: (listener: Listener) => selectors.length
      ? store.subscribeToSelectors(selectors, () => {
        // Bundler may observe externally derived changes even if Redux returns
        // the same state object. Its notification invalidates the cache too.
        dirty = true
        listener()
      })
      : () => {},
    getSnapshot: () => {
      const state = store.getState()
      // Some incumbent selectors allocate new objects. Reading them repeatedly
      // for the same state must not produce React's infinite snapshot loop.
      if (!dirty && cached !== undefined && Object.is(lastState, state)) return cached
      const next = store.select(selectors)
      if (cached === undefined || !sameSnapshot(cached, next)) cached = next
      lastState = state
      dirty = false
      return cached
    }
  }
}

function actionProps (store: BundlerStore, names: string[]) {
  return Object.fromEntries(names.map(name => [name, (...args: unknown[]) => {
    // Keep the original binding's late action lookup, including integrated
    // bundles, argument order, return values and the direct-method fallback.
    if (typeof store.action === 'function') return store.action(name, args)
    const action = store[name]
    if (typeof action !== 'function') throw new Error(`ActionNotFound ${name}`)
    return action.apply(store, args)
  }]))
}

type ConnectedKey<Name extends string> = Name extends `select${infer Value}` ? Uncapitalize<Value> : Name

export function connect<Names extends string[], Props extends object> (
  ...args: [...Names, ComponentType<Props>]
): ComponentType<Omit<Props, ConnectedKey<Names[number]>>> {
  const Component = args[args.length - 1] as ComponentType<Props>
  const names = args.slice(0, -1) as string[]
  const selectors: string[] = []
  const actions: string[] = []
  for (const name of names) {
    if (name.startsWith('select')) selectors.push(name)
    else if (name.startsWith('do')) actions.push(name)
    else throw new Error(`CanNotConnect ${name}`)
  }

  function Connected (props: Omit<Props, ConnectedKey<Names[number]>>) {
    const store = useStore()
    const subscription = useMemo(() => createSelectorSubscription(store, selectors), [store])
    const boundActions = useMemo(() => actionProps(store, actions), [store])
    const selected = useSyncExternalStore(subscription.subscribe, subscription.getSnapshot, subscription.getSnapshot)
    // Preserve precedence: own props, selected values, then bound actions. React
    // 19 ref props pass through this same path to the actual view.
    return createElement(Component, { ...props, ...selected, ...boundActions } as Props)
  }

  Connected.displayName = `connect(${Component.displayName || Component.name || 'Component'})`
  return Connected
}
