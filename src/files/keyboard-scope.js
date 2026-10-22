// Preserve the incumbent blank-page shortcuts while leaving other panes,
// shadow-root hosts, forms and browser modifier shortcuts in control of keys.
/** @param {KeyboardEvent | import('react').KeyboardEvent} event
 * @param {HTMLElement | null} container */
export function ownsFileKeyboard (event, container) {
  const target = event.target
  if (event.defaultPrevented || ('isComposing' in event ? event.isComposing : event.nativeEvent.isComposing) || !(target instanceof HTMLElement)) return false
  if (event.altKey || event.ctrlKey || (event.metaKey && event.key !== 'ArrowRight')) return false
  if (target !== document.body && target !== document.documentElement && !container?.contains(target)) return false
  if (target.closest('[contenteditable]:not([contenteditable="false"]), [role="menu"], [role="dialog"], button, a, textarea, select')) return false
  if (target instanceof HTMLInputElement) {
    if (!['checkbox', 'radio'].includes(target.type)) return false
    // Select-all and other header controls keep their native Space/Enter action.
    if ([' ', 'Enter'].includes(event.key) && !target.closest('[data-testid="file-row"], [data-testid="grid-file"]')) return false
  }
  return true
}
