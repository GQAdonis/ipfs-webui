/**
 * The Desktop bridge (`window.ipfsDesktop.agentChat`), present only when IPFS Desktop's
 * chat is on. It is frozen and async: `getEndpoint()` and `getToken()`. When it exists,
 * Desktop owns the connection: the endpoint and token never come from Settings.
 *
 * @typedef {{ getEndpoint: () => Promise<string>, getToken: () => Promise<string> }} AgentChatBridge
 * @returns {AgentChatBridge | undefined}
 */
export function getBridge () {
  const bridge = /** @type {any} */(globalThis).ipfsDesktop?.agentChat
  if (!bridge || typeof bridge.getEndpoint !== 'function' || typeof bridge.getToken !== 'function') return undefined
  return bridge
}
