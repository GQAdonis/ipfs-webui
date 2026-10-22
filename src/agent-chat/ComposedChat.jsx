import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CHAT_STYLE_TEXT, registerBundledFonts } from '@gqadonis/ipfs-agent-chat/react'

// One host root owns all portals. This is a style/DOM boundary, never another React root.
export function ComposedChat ({ children, className = '' }) {
  const [root, setRoot] = useState(null)
  useLayoutEffect(() => {
    if (root) void registerBundledFonts(root.ownerDocument)
  }, [root])
  return <div className={`praxis-chat-host ${className}`} ref={node => {
    if (node && !node.shadowRoot) setRoot(node.attachShadow({ mode: 'open' }))
  }}>{root && createPortal(<><style>{CHAT_STYLE_TEXT + '\n:host{display:flex;flex-direction:column;min-width:0;height:100%}.ac-sidebar{position:relative;inset:auto;inline-size:100%;max-inline-size:none;block-size:100%;min-block-size:0;padding-inline-start:0;transform:none;box-shadow:none;transition:none}.ac-root{min-height:0;flex:1;display:flex;flex-direction:column}.praxis-composer{padding:1rem;background:var(--raised)}'}</style>{children}</>, root)}</div>
}
