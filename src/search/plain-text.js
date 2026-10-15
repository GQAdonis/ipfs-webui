// Search results are untrusted content: whatever was stored, extracted or written
// by a model. They are rendered as React text children only (never as HTML or
// Markdown), and run through this function first so text cannot reorder the
// surrounding interface (bidirectional controls) or hide itself (C0/C1 controls).

// Bidi embeddings, overrides, isolates and marks.
const BIDI = /[؜‎‏‪-‮⁦-⁩]/g
// Zero-width characters (U+200B to U+200D, U+FEFF) and Unicode tag characters
// (U+E0000 to U+E007F): invisible in the page, so they could hide text from a reader.
const INVISIBLE = /[\u{200B}-\u{200D}\u{FEFF}\u{E0000}-\u{E007F}]/gu
// C0 and C1 controls except tab and line feed; carriage returns fold into line feeds first.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g

/**
 * @param {unknown} value
 * @param {number} [max] keep at most this many UTF-16 units
 * @returns {string}
 */
export function plainText (value, max = 100000) {
  if (typeof value !== 'string') return ''
  const cleaned = value.replace(/\r\n?/g, '\n').replace(BIDI, '').replace(INVISIBLE, '').replace(CONTROL, '')
  return cleaned.length > max ? cleaned.slice(0, max) : cleaned
}

/**
 * The last path segment, for a result title. Empty when there is no path.
 *
 * @param {unknown} path
 */
export function baseName (path) {
  const text = plainText(path, 4096).replace(/\/+$/, '')
  const i = text.lastIndexOf('/')
  return i === -1 ? text : text.slice(i + 1)
}
