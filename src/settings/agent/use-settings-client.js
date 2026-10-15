import { useEffect, useMemo } from 'react'
import { useAgentChatSettings } from '../../agent-chat/use-agent-chat-settings.js'
import { createDesktopSettingsClient } from './core/desktop-client.js'
import { createHttpSettingsClient } from './core/http-client.js'
import { forgetAdminTokenUnless, getAdminToken } from './core/admin-token.js'
import { settingsRootFromEndpoint } from './core/url.js'
import { useAdminTokenState } from './use-admin-token.js'

/**
 * Picks the one SettingsClient for this page: the Desktop bridge when the main
 * process exposed it, else HTTP to the settings route of the node the chat is
 * pointed at. HTTP needs both the chat endpoint (its origin and path prefix
 * locate the settings route) and an admin token bound to that same root;
 * without either there is no client and the page asks for them. A token entered
 * for another root is forgotten, never sent. This is the one place that knows
 * the transport.
 */
export function useSettingsClient () {
  const { settings } = useAgentChatSettings()
  const { root: tokenRoot, version } = useAdminTokenState()
  const desktop = useMemo(() => createDesktopSettingsClient(), [])
  const root = settingsRootFromEndpoint(settings.endpoint)
  const bound = root !== undefined && tokenRoot === root

  // The endpoint changed: the bearer belongs to the node it was typed for.
  useEffect(() => {
    if (!desktop) forgetAdminTokenUnless(root)
  }, [desktop, root])

  const client = useMemo(() => {
    if (desktop) return desktop
    return root && bound ? createHttpSettingsClient({ root, getToken: () => getAdminToken(root) }) : undefined
    // `version` makes a replaced token a new client, so the page reloads with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, root, bound, version])
  return { client, managed: desktop !== undefined, root }
}
