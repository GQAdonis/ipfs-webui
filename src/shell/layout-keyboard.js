export function deepActiveElement (document) {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

export function composedAncestors (node) {
  const nodes = []
  while (node) {
    nodes.push(node)
    node = node.parentNode || node.getRootNode?.().host
  }
  return nodes
}

export function isEditingPath (nodes) {
  let editableBoundary = false
  for (const node of nodes) {
    if (node?.nodeType !== 1) continue
    if (node.matches('ipfs-agent-chat, input, textarea, select, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], dialog[open], [role="dialog"], [role="alertdialog"], [data-workspace-shortcuts="off"]')) return true
    // The nearest explicit false boundary stops inheritance from an outer editor.
    if (!editableBoundary && node.hasAttribute('contenteditable')) {
      editableBoundary = true
      if (node.getAttribute('contenteditable').toLowerCase() !== 'false') return true
    }
    if (!editableBoundary && node.isContentEditable) return true
  }
  return false
}

export function paneStepFromKeyboard (event, document) {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.repeat ||
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.key !== '[' && event.key !== ']')) return null

  const path = typeof event.composedPath === 'function' ? event.composedPath() : composedAncestors(event.target)
  if (isEditingPath(path) || isEditingPath(composedAncestors(deepActiveElement(document)))) return null
  return event.key === ']' ? 1 : -1
}

export function composerShortcut (event, document) {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.repeat || event.altKey || event.shiftKey ||
    !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return false
  const path = typeof event.composedPath === 'function' ? event.composedPath() : composedAncestors(event.target)
  return !isEditingPath(path) && !isEditingPath(composedAncestors(deepActiveElement(document)))
}
