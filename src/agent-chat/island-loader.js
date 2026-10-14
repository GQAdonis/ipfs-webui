// The only place the island is requested. It is a vendored static asset
// (public/agent-chat/, see README.md here), loaded with a native dynamic import so
// webpack leaves it alone: the island carries its own React 19 and must not be
// bundled with the Web UI's React 16. Nothing imports this module until the person
// turns the chat on and opens it.

export const ISLAND_ENTRY = 'agent-chat/ipfs-agent-chat.js'
export const ELEMENT_TAG = 'ipfs-agent-chat'

export async function loadIsland () {
  const url = new URL(ISLAND_ENTRY, globalThis.document.baseURI).href
  await import(/* webpackIgnore: true */ url)
}
