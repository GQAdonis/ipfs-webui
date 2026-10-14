import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { ELEMENT_TAG, loadIsland as defaultLoadIsland } from './island-loader.js'
import { validateEndpoint } from './endpoint.js'
import { useAgentChatSettings } from './use-agent-chat-settings.js'
import { getBridge } from './bridge.js'

const OPEN_CHANGE_EVENT = 'ipfs-agent-chat-openchange'

/**
 * A button that opens the agent chat sidebar. It renders nothing, requests nothing
 * and creates no element unless the switch is on and the endpoint is valid. The
 * island is imported on the first press and talks only to the configured /agui URL.
 *
 * @param {{ loadIsland?: () => Promise<void> }} props
 */
const AgentChatLauncher = ({ loadIsland = defaultLoadIsland }) => {
  const { t } = useTranslation('agentChat')
  const { settings, token } = useAgentChatSettings()
  // Under IPFS Desktop the bridge owns the connection: "enabled" follows its presence and
  // the endpoint comes from it, never from Settings. Without it, behaviour is unchanged.
  const [bridge] = useState(getBridge)
  const [bridgeEndpoint, setBridgeEndpoint] = useState(/** @type {string | null} */(null))
  useEffect(() => {
    if (!bridge) return undefined
    let cancelled = false
    Promise.resolve()
      .then(() => bridge.getEndpoint())
      .then((value) => {
        const checked = validateEndpoint(value)
        if (!cancelled) setBridgeEndpoint(checked.ok ? checked.value : null)
      })
      .catch(() => { if (!cancelled) setBridgeEndpoint(null) })
    return () => { cancelled = true }
  }, [bridge])
  const endpoint = bridge ? null : (settings.enabled ? validateEndpoint(settings.endpoint) : null)
  const endpointValue = bridge ? bridgeEndpoint : (endpoint && endpoint.ok ? endpoint.value : null)
  const available = endpointValue !== null

  /** @type {React.MutableRefObject<any>} */
  const elementRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [open, setOpen] = useState(false)

  // Remove the element when the chat is switched off or the endpoint stops being valid.
  useEffect(() => {
    if (available) return undefined
    const el = elementRef.current
    if (el) {
      el.remove()
      elementRef.current = null
    }
    setOpen(false)
    setStatus('idle')
    return undefined
  }, [available])

  // Remove the element when the app unmounts.
  useEffect(() => () => {
    if (elementRef.current) {
      elementRef.current.remove()
      elementRef.current = null
    }
  }, [])

  // The token goes by property only: the bridge's provider under Desktop, else the in-memory token.
  const applyToken = useCallback((el) => {
    if (bridge) el.tokenProvider = bridge.getToken
    else el.token = token
  }, [bridge, token])

  // Keep a live element in step with the settings.
  useEffect(() => {
    const el = elementRef.current
    if (!el || !available) return
    el.setAttribute('endpoint', /** @type {string} */(endpointValue))
    applyToken(el)
  }, [available, endpointValue, applyToken])

  const press = useCallback(async () => {
    const existing = elementRef.current
    if (existing) {
      existing.toggle()
      return
    }
    if (!endpointValue || status === 'loading') return
    setStatus('loading')
    try {
      await loadIsland()
    } catch (_) {
      setStatus('error')
      return
    }
    const el = document.createElement(ELEMENT_TAG)
    el.setAttribute('endpoint', endpointValue)
    applyToken(el)
    el.addEventListener(OPEN_CHANGE_EVENT, (event) => setOpen(Boolean(/** @type {CustomEvent} */(event).detail?.open)))
    document.body.append(el)
    elementRef.current = el
    setStatus('idle')
    el.open = true
  }, [endpointValue, loadIsland, status, applyToken])

  if (!available) return null

  return (
    <div className='fixed right-0 bottom-0 pa3' style={{ zIndex: 900 }}>
      {status === 'error' && (
        <p role='alert' className='ma0 mb2 pa2 br1 f6 lh-copy bg-white maroon ba b--maroon tr'>
          {t('launcher.loadError')}
        </p>
      )}
      <button
        type='button'
        className='Button transition-all sans-serif dib v-mid fw5 nowrap lh-copy bn br1 pv2 ph3 pointer focus-outline white bg-navy'
        aria-expanded={open}
        aria-busy={status === 'loading'}
        onClick={press}>
        {status === 'loading' ? t('launcher.loading') : t('launcher.label')}
      </button>
    </div>
  )
}

AgentChatLauncher.propTypes = {
  loadIsland: PropTypes.func
}

export default AgentChatLauncher
