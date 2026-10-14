// Theme preference store (D16): the theme follows the system
// (prefers-color-scheme), defaults to dark when the system states no
// preference, and the user can override it with the toggle
// (theme-toggle.js). The choice persists under a versioned, non-secret
// localStorage key; bump the suffix if the stored value ever changes shape.
// tokens.css keys every theme rule off the data-theme attribute this store
// writes on <html>: 'dark' and 'light' force a theme, 'system' lets the CSS
// media query decide, falling back to the dark block.

export const THEME_STORAGE_KEY = 'ipfs-webui:theme:v1'

export const THEMES = Object.freeze(['system', 'dark', 'light'])

const DEFAULT_THEME = 'system'

/** @typedef {'system' | 'dark' | 'light'} Theme */
/** @typedef {'dark' | 'light'} ResolvedTheme */

/** @type {Set<() => void>} */
const listeners = new Set()

/** @returns {Theme} */
function read () {
  try {
    const raw = globalThis.localStorage?.getItem(THEME_STORAGE_KEY)
    if (raw === 'system' || raw === 'dark' || raw === 'light') return raw
    return DEFAULT_THEME
  } catch (_) {
    return DEFAULT_THEME
  }
}

/** @type {Theme} */
let current = read()

function emit () {
  listeners.forEach((fn) => fn())
}

/** The theme the user picked: 'system' until they choose otherwise. */
export function getTheme () {
  return current
}

/** The theme actually applied: the system preference, dark when unknown (D16). */
export function getResolvedTheme () {
  if (current === 'dark' || current === 'light') return current
  try {
    if (globalThis.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  } catch (_) {
    // matchMedia unavailable or throwing: fall through to the dark default.
  }
  return 'dark'
}

function apply () {
  globalThis.document?.documentElement?.setAttribute('data-theme', current)
}

/** @param {Theme} theme */
export function setTheme (theme) {
  if (!THEMES.includes(theme) || theme === current) return
  current = theme
  try {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, theme)
  } catch (_) {
    // Storage may be blocked; the choice then lasts for this page only.
  }
  apply()
  emit()
}

/**
 * @param {() => void} fn called when the stored or resolved theme may have changed
 * @returns {() => void} unsubscribe
 */
export function subscribe (fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Apply the persisted theme and follow later system changes. Call once at app
 * start, before first render (src/index.js). With the 'system' choice the
 * visual switch itself is pure CSS (tokens.css); the listener only notifies
 * React consumers whose resolvedTheme changed.
 */
export function initTheme () {
  apply()
  try {
    const mql = globalThis.matchMedia?.('(prefers-color-scheme: light)')
    const onChange = () => {
      if (current === 'system') emit()
    }
    if (mql?.addEventListener) mql.addEventListener('change', onChange)
    else mql?.addListener?.(onChange)
  } catch (_) {
    // No media query support: the dark default already applies.
  }
}
