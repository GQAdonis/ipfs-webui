import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { ELEMENT_TAG, loadIsland as defaultLoadIsland } from './island-loader.js'
import { validateEndpoint } from './endpoint.js'
import { useAgentChatSettings } from './use-agent-chat-settings.js'
import { getBridge } from './bridge.js'
import { isSessionMode } from './session.js'
import { StatusLine } from '../promethity/components/index.js'
import { useTheme } from '../promethity/use-theme.js'
import './launcher.css'

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
  // The island follows the shell: dark or light, as the theme store resolved it (system, dark or light).
  const { resolvedTheme } = useTheme()
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
  // In console session mode the cookie session is the credential: the element sends the page's own
  // cookies and no Authorization header, and is given no token.
  const applyToken = useCallback((el) => {
    if (bridge) el.tokenProvider = bridge.getToken
    else if (isSessionMode()) el.session = true
    else el.token = token
  }, [bridge, token])

  // Keep a live element in step with the settings.
  useEffect(() => {
    const el = elementRef.current
    if (!el || !available) return
    el.setAttribute('endpoint', /** @type {string} */(endpointValue))
    applyToken(el)
  }, [available, endpointValue, applyToken])

  // A theme change reaches a live element at once.
  useEffect(() => {
    elementRef.current?.setAttribute('theme', resolvedTheme)
  }, [resolvedTheme])

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
    el.setAttribute('theme', resolvedTheme)
    applyToken(el)
    el.addEventListener(OPEN_CHANGE_EVENT, (event) => setOpen(Boolean(/** @type {CustomEvent} */(event).detail?.open)))
    document.body.append(el)
    elementRef.current = el
    setStatus('idle')
    el.open = true
  }, [endpointValue, loadIsland, status, applyToken, resolvedTheme])

  // The launcher is fixed at the bottom right. A sticky Apply bar (or any bottom action area)
  // must sit above it, so its height is published as --ac-launcher-clearance while it shows.
  const launcherRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  useEffect(() => {
    const el = launcherRef.current
    const root = globalThis.document?.documentElement
    if (!available || !el || !root) return undefined
    const publish = () => root.style.setProperty('--ac-launcher-clearance', `${Math.ceil(el.getBoundingClientRect().height)}px`)
    publish()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(publish)
    observer?.observe(el)
    return () => {
      observer?.disconnect()
      root.style.removeProperty('--ac-launcher-clearance')
    }
  }, [available, status])

  if (!available) return null

  return (
    <div className='ac-launcher' ref={launcherRef}>
      {status === 'error' && <StatusLine tone='err' word={t('launcher.errorWord')}>{t('launcher.loadError')}</StatusLine>}
      <button
        type='button'
        className='ac-launcher-button'
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
