import React, { useContext, useEffect, useMemo, useSyncExternalStore, createContext, type ReactNode } from 'react'

/**
 * Global store for context values that redux bundles can access
 *
 * See {@link ./REDUX-BUNDLER-MIGRATION-GUIDE.md} for more information
 */
export class ContextBridge {
  private contexts: Map<string, any> = new Map()
  private subscribers: Map<string, Set<(value: any) => void>> = new Map()

  /**
   * Set a context value and notify subscribers
   */
  setContext<T> (name: string, value: T): void {
    if (this.contexts.has(name) && Object.is(this.contexts.get(name), value)) return
    this.contexts.set(name, value)
    const subs = this.subscribers.get(name)
    if (subs) {
      subs.forEach(callback => callback(value))
    }
  }

  /**
   * Get the current value of a context
   */
  getContext<T> (name: string): T | undefined {
    return this.contexts.get(name)
  }

  /**
   * Subscribe to changes in a context value
   */
  subscribe<T> (name: string, callback: (value: T) => void): () => void {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, new Set())
    }
    this.subscribers.get(name)!.add(callback)

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(name)
      if (subs) {
        subs.delete(callback)
        if (!subs.size) this.subscribers.delete(name)
      }
    }
  }

  /**
   * Check if a context is available
   */
  hasContext (name: string): boolean {
    return this.contexts.has(name)
  }

  clear (): void {
    this.contexts.clear()
    this.subscribers.forEach(subs => subs.forEach(callback => callback(undefined)))
  }
}

/**
 * Global instance of the context bridge
 */
export const contextBridge = new ContextBridge()

/**
 * Props for the ContextBridgeProvider
 */
interface ContextBridgeProviderProps {
  children: ReactNode
  bridge?: ContextBridge
}

/**
 * Context for the bridge itself (to trigger re-renders when needed)
 */
const BridgeContext = createContext<ContextBridge>(contextBridge)

/**
 * Provider that makes the context bridge available
 */
export const ContextBridgeProvider: React.FC<ContextBridgeProviderProps> = ({ children, bridge = contextBridge }) => {
  return (
    <BridgeContext.Provider value={bridge}>
      {children}
    </BridgeContext.Provider>
  )
}

/**
 * Hook that registers a context value with the bridge
 */
export function useBridgeContext<T> (name: string, contextValue: T): void {
  const bridge = useContext(BridgeContext)

  useEffect(() => {
    bridge.setContext(name, contextValue)
  }, [bridge, name, contextValue])
}

/**
 * Higher-order component that automatically bridges a context to redux bundles
 */
export function withContextBridge<T> (
  contextName: string,
  ContextToUse: React.Context<T | undefined>
) {
  return function BridgeWrapper ({ children }: { children: ReactNode }) {
    const contextValue = useContext(ContextToUse)
    const bridge = useContext(BridgeContext)

    useEffect(() => {
      if (contextValue !== undefined) {
        bridge.setContext(contextName, contextValue)
      }
    }, [bridge, contextValue])

    return <>{children}</>
  }
}

/**
 * Create a selector that reads from a context bridge (non-reactive)
 */
export function createContextSelector<T> (contextName: string) {
  return () => contextBridge.getContext<T>(contextName)
}

/**
 * Hook that reactively subscribes to a context bridge value
 */
export function useBridgeSelector<T> (contextName: string): T | undefined {
  const bridge = useContext(BridgeContext)
  const subscription = useMemo(() => ({
    subscribe: (notify: () => void) => bridge.subscribe<T>(contextName, () => notify()),
    getSnapshot: () => bridge.getContext<T>(contextName)
  }), [bridge, contextName])
  return useSyncExternalStore(subscription.subscribe, subscription.getSnapshot, subscription.getSnapshot)
}

/**
 * Create a subscription to context changes for use in bundle reactors
 */
export function createContextSubscription<T> (
  contextName: string,
  callback: (value: T) => void
): () => void {
  return contextBridge.subscribe(contextName, callback)
}
