import { type Helia } from '@helia/interface'
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import packageJson from '../../package.json'
import initHelia from '../lib/init-helia.js'
import type { KuboGatewayOptions } from '../types.js'

interface HeliaContextProps {
  kuboGatewayOptions: KuboGatewayOptions
  error: Error | null
  helia: Helia | null
  selectHeliaReady(): boolean
  selectHeliaIdentity(): string
  doInitHelia(): Promise<void>
  setKuboGatewayOptions(kuboGatewayOptions: Partial<KuboGatewayOptions>): void
}

const defaultKuboGatewayOptions: KuboGatewayOptions = {
  host: '127.0.0.1',
  port: '8080',
  protocol: 'http',
  trustlessBlockBrokerConfig: {
    init: {
      allowLocal: true
    }
  }
}

const getDefaultKuboGatewayOptions = (): KuboGatewayOptions => {
  const localStorageKuboGatewayOptions = localStorage.getItem('kuboGateway')
  if (localStorageKuboGatewayOptions != null) {
    try {
      const kuboGatewaySettings = JSON.parse(localStorageKuboGatewayOptions) as KuboGatewayOptions
      return { ...defaultKuboGatewayOptions, ...kuboGatewaySettings }
    } catch (e) {
      console.error('getDefaultKuboGatewayOptions error', e)
    }
  }
  return defaultKuboGatewayOptions
}

const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)

export const HeliaProvider = ({ children }: React.ComponentProps<any>): any => {
  const [helia, setHelia] = useState<Helia | null>(null)
  const [kuboGatewayOptions, setKuboGatewayOptions] = useState<KuboGatewayOptions>(getDefaultKuboGatewayOptions)
  const [error, setError] = useState<Error | null>(null)
  const request = useRef<{ promise: Promise<Helia>, completion: Promise<void> } | null>(null)

  useEffect(() => () => {
    const current = request.current
    request.current = null
    // Initialization may finish after the provider has left the root. It still
    // owns that node and must stop it; stale work must never publish new state.
    void current?.promise.then(node => node.stop().catch(failure => {
      console.warn('Unable to stop Explorer node', failure)
    }), () => { /* Initialization failures are handled by doInitHelia. */ })
  }, [])

  const selectHeliaReady = useCallback((): boolean => helia !== null, [helia])

  const selectHeliaIdentity = useCallback((): string => {
    const heliaHttpVersion = packageJson.devDependencies['@helia/http']
    return `@helia/http@${heliaHttpVersion}`
  }, [])

  const setKuboGatewayOptionsPublic = useCallback((kuboGatewayOptions: Partial<KuboGatewayOptions>): void => {
    setKuboGatewayOptions((current) => ({ ...current, ...kuboGatewayOptions }))
  }, [])

  const doInitHelia = useCallback((): Promise<void> => {
    if (request.current != null) return request.current.completion
    const current = { promise: initHelia(kuboGatewayOptions), completion: Promise.resolve() }
    request.current = current
    current.completion = current.promise.then(node => {
      if (request.current !== current) return
      setError(null)
      setHelia(node)
    }).catch((failure: Error) => {
      if (request.current !== current) return
      request.current = null
      console.error('doInitHelia error', failure)
      setError(failure)
      setHelia(null)
    })
    return current.completion
  }, [kuboGatewayOptions])

  const value = useMemo(() => ({ helia, error, kuboGatewayOptions, selectHeliaReady, selectHeliaIdentity, doInitHelia, setKuboGatewayOptions: setKuboGatewayOptionsPublic }), [helia, error, kuboGatewayOptions, selectHeliaReady, selectHeliaIdentity, doInitHelia, setKuboGatewayOptionsPublic])

  return (
    <HeliaContext.Provider value={value}>
      {children}
    </HeliaContext.Provider>
  )
}

export const useHelia = (): HeliaContextProps => {
  const context = useContext(HeliaContext)
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider')
  }
  return context
}
