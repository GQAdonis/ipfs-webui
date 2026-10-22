export const LAYOUT_STORAGE_KEY = 'ipfs-webui:workspace-layout:v1'
export const PANE_STATES = Object.freeze(['closed', 'docked', 'expanded', 'full'])
export const WORKSPACE_MODES = Object.freeze(['application', 'conversation'])
export const DEFAULT_LAYOUT = Object.freeze({ version: 1, mode: 'application', pane: 'closed' })

function isPreference (value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).sort().join(',') === 'mode,pane,version' &&
    value.version === 1 && WORKSPACE_MODES.includes(value.mode) && PANE_STATES.includes(value.pane) &&
    !(value.mode === 'conversation' && value.pane === 'closed')
}

export function parseLayoutPreference (raw) {
  try {
    if (typeof raw !== 'string' || raw.length > 160) return { ...DEFAULT_LAYOUT }
    const value = JSON.parse(raw)
    return isPreference(value) ? { version: 1, mode: value.mode, pane: value.pane } : { ...DEFAULT_LAYOUT }
  } catch (_) {
    return { ...DEFAULT_LAYOUT }
  }
}

function browserStorage () {
  try { return globalThis.localStorage } catch (_) { return undefined }
}

export function readLayoutPreference (storage = browserStorage()) {
  try { return parseLayoutPreference(storage?.getItem(LAYOUT_STORAGE_KEY)) } catch (_) { return { ...DEFAULT_LAYOUT } }
}

export function writeLayoutPreference (value, storage = browserStorage()) {
  if (!isPreference(value)) return false
  try {
    if (!storage) return false
    // Serialize an allowlist, never arbitrary controller/content state.
    storage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ version: 1, mode: value.mode, pane: value.pane }))
    return true
  } catch (_) {
    // Denied/quota-limited storage leaves the current in-memory layout usable.
    return false
  }
}

export function stepPane (pane, direction) {
  const index = PANE_STATES.indexOf(pane)
  if (index < 0 || (direction !== -1 && direction !== 1)) throw new RangeError('Invalid pane step')
  return PANE_STATES[Math.max(0, Math.min(PANE_STATES.length - 1, index + direction))]
}

export function changeLayout (current, action) {
  if (action.type === 'pane') {
    if (!PANE_STATES.includes(action.pane)) throw new RangeError('Invalid pane state')
    return { version: 1, mode: action.pane === 'closed' ? 'application' : current.mode, pane: action.pane }
  }
  if (action.type === 'mode') {
    if (!WORKSPACE_MODES.includes(action.mode)) throw new RangeError('Invalid workspace mode')
    return { version: 1, mode: action.mode, pane: action.mode === 'conversation' && current.pane === 'closed' ? 'docked' : current.pane }
  }
  if (action.type === 'step') return changeLayout(current, { type: 'pane', pane: stepPane(current.pane, action.direction) })
  throw new RangeError('Invalid layout action')
}

// Keep the user's preferred width independent of the currently available space.
// Thresholds leave a 24rem IPFS application beside the 30rem/47.5rem pane,
// plus the incumbent 9.25rem navigator at desktop widths.
export const LAYOUT_MEDIA = Object.freeze({
  dockedFits: '(min-width: 64em)',
  expandedFits: '(min-width: 81em)',
  phone: '(max-width: 539px)'
})

export function effectivePane (pane, viewport) {
  if (!PANE_STATES.includes(pane)) throw new RangeError('Invalid pane state')
  if (pane === 'docked' && !viewport.dockedFits) return 'full'
  if (pane === 'expanded' && !viewport.expandedFits) return 'full'
  return pane
}
