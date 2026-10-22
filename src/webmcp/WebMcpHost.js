import React, { useEffect } from 'react'
import { useOriginPolicy } from '../agent-chat/use-origin-policy.js'
import PropTypes from 'prop-types'
import { useBridgeSelector } from '../helpers/context-bridge'
import { createWebMcpTools, getModelContext, registerWebMcpTools } from './vendor/index.js'
import { denyAll, requestConfirmation } from './confirmation-queue.js'
import { setStatus } from './registration-status.js'
import { getSettings, subscribe as subscribeSettings } from './settings-store.js'
import { useStore } from './use-store.js'
import WebMcpConfirmDialog from './WebMcpConfirmDialog.js'

/**
 * Registers the mcp/webmcp tools with `document.modelContext` while, and only while,
 * the Settings switch is on and the browser has WebMCP. Write registration additionally needs
 * current page-origin eligibility; read-only offerings remain independent. It reads the
 * node connection from the Web UI's existing API address setting through the ipfs client
 * the app already holds; it opens no connection of its own.
 *
 * Unregistering is a request to the host, which may ignore it. So each registration has its
 * own live flag, and every tool call checks that flag and the current Settings before it
 * does anything: a call that arrives after the switch went off, or after this registration
 * was replaced, is declined with no RPC request.
 *
 * Renders the confirmation dialog for write calls. With the switch off it renders
 * nothing, registers nothing and sends nothing.
 *
 * @param {{ ipfs?: any, doc?: any }} props `doc` is a test seam; production reads `document`.
 */
export function WebMcpController ({ ipfs, doc = globalThis.document }) {
  const settings = useStore(getSettings, subscribeSettings)
  const { enabled, writes } = settings
  const { policy, origin } = useOriginPolicy()
  const offerWrites = writes && origin.allowed

  useEffect(() => {
    if (!enabled) {
      denyAll()
      setStatus({ state: 'off' })
      return undefined
    }
    const modelContext = getModelContext(doc)
    if (!modelContext) {
      setStatus({ state: 'unavailable' })
      return undefined
    }
    if (!ipfs) {
      setStatus({ state: 'waiting' })
      return undefined
    }
    let cancelled = false
    /** @type {{ unregister: () => void } | undefined} */
    let registration
    const tools = createWebMcpTools({
      client: ipfs,
      confirm: (request, options) => policy.allowsAgent() ? requestConfirmation(request, options) : Promise.resolve('writes_off'),
      includeWrites: offerWrites,
      // Read at call time, not captured: these are the live switches.
      isActive: () => !cancelled && getSettings().enabled,
      writesAllowed: () => !cancelled && getSettings().writes && policy.allowsAgent(),
      dnsLinkAllowed: () => getSettings().dnslink
    })
    const unsubscribeOrigin = policy.subscribe(() => {
      if (policy.allowsAgent()) return
      denyAll()
      if (offerWrites) { cancelled = true; registration?.unregister(); setStatus({ state: 'origin-restricted' }) }
    })
    registerWebMcpTools(modelContext, tools).then((result) => {
      if (cancelled) {
        result.unregister()
        return
      }
      registration = result
      const writeNames = new Set(tools.filter((tool) => tool.annotations.consequentialHint).map((tool) => tool.name))
      setStatus({
        state: 'registered',
        registered: result.registered.length,
        failed: result.failed.length,
        writes: result.registered.filter((name) => writeNames.has(name)).length
      })
    })
    return () => {
      cancelled = true
      unsubscribeOrigin()
      registration?.unregister()
      // Anything still waiting for a person belongs to a tool that is no longer offered.
      denyAll()
    }
  }, [enabled, offerWrites, ipfs, doc, policy])

  return origin.allowed ? <WebMcpConfirmDialog /> : null
}

WebMcpController.propTypes = {
  ipfs: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  doc: PropTypes.object
}

/** Mounted once in App.js. Reads the ipfs client the app already holds. */
const WebMcpHost = () => {
  const ipfs = useBridgeSelector('selectIpfs')
  return <WebMcpController ipfs={ipfs || undefined} />
}

export default WebMcpHost
