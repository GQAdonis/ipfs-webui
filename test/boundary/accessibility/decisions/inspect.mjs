/** Serialized into the actual browser. Include open shadow roots used by the chat island. */
export function inspectLayout () {
  const elements = []
  const visit = root => { for (const element of root.querySelectorAll('*')) { elements.push(element); if (element.shadowRoot) visit(element.shadowRoot) } }
  visit(document)
  const width = document.documentElement.clientWidth
  const overflow = elements.flatMap(element => {
    const box = element.getBoundingClientRect(), css = getComputedStyle(element)
    return box.width > 0 && box.height > 0 && css.visibility !== 'hidden' && (box.right > width + 1 || box.left < -1)
      ? [{ tag: element.tagName, id: element.id, left: box.left, right: box.right }] : []
  })
  return { width, documentWidth: document.documentElement.scrollWidth, overflow }
}
export function inspectFocus () {
  let element = document.activeElement
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement
  if (!element) return { visible: false }
  const css = getComputedStyle(element), box = element.getBoundingClientRect()
  const ring = css.outlineStyle !== 'none' && Number.parseFloat(css.outlineWidth) >= 1 && css.outlineColor !== 'transparent' && css.outlineColor !== 'rgba(0, 0, 0, 0)' || css.boxShadow !== 'none'
  return { tag: element.tagName, focusId: element.getAttribute('data-boundary-focus-id'), text: element.getAttribute('aria-label') || element.textContent?.trim(), visible: box.width > 0 && box.height > 0 && ring, outline: css.outline, boxShadow: css.boxShadow }
}
export function inspectMotion () {
  const elements = []
  const visit = root => { for (const element of root.querySelectorAll('*')) { elements.push(element); if (element.shadowRoot) visit(element.shadowRoot) } }
  visit(document)
  const milliseconds = value => value.split(',').map(part => Number.parseFloat(part) * (part.trim().endsWith('ms') ? 1 : 1000))
  return elements.flatMap(element => {
    const css = getComputedStyle(element), box = element.getBoundingClientRect()
    if (!box.width || !box.height) return []
    const animation = css.animationName !== 'none' && milliseconds(css.animationDuration).some(value => value > 1)
    const transition = css.transitionProperty !== 'none' && milliseconds(css.transitionDuration).some(value => value > 1)
    return animation || transition ? [{ tag: element.tagName, id: element.id, animation: css.animationName, animationDuration: css.animationDuration, transition: css.transitionProperty, transitionDuration: css.transitionDuration }] : []
  })
}
