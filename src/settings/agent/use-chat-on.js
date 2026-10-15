import { getBridge } from '../../agent-chat/bridge.js'
import { useAgentChatSettings } from '../../agent-chat/use-agent-chat-settings.js'

/** Whether agent chat is on: always under Desktop (the bridge owns it), else the browser switch. */
export function useChatOn () {
  const { settings } = useAgentChatSettings()
  return getBridge() !== undefined || settings.enabled
}

/** Move focus to the Agent chat switch on this page, where the person turns the chat on. */
export function focusChatSwitch () {
  const el = globalThis.document?.querySelector('[data-id="AgentChatSettings"] [role="switch"]')
  if (el instanceof HTMLElement) {
    el.scrollIntoView?.({ block: 'center' })
    el.focus()
  }
}
