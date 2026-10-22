// The error a SettingsClient rejects with. The four server codes are the closed
// set of mcp/contract/settings/settings-error.schema.json; the rest are
// transport states the page must tell apart (HTTP 401 means "Sign in again",
// 404 means the route is absent). The message is fixed copy chosen by the kind,
// never text a server or a user supplied. `detail` carries the server's own
// sentence for the cases where it helps (a 400 that names the missing settings
// directory); the contract says no server message includes credentials, and the
// page shows it as quoted data.

export const SERVER_ERROR_CODES = Object.freeze([
  'backend_not_configured',
  'revision_conflict',
  'egress_confirmation_required',
  'secrets_not_accepted',
  // 403 in session mode: the admin principal needs a recent second-factor sign-in (ADR-0013 section 5).
  'step_up_required'
])

/** @typedef {'backend_not_configured' | 'revision_conflict' | 'egress_confirmation_required' | 'secrets_not_accepted'} ServerErrorCode */
/** @typedef {ServerErrorCode | 'unauthorized' | 'forbidden' | 'route_absent' | 'not_configured' | 'network' | 'http' | 'protocol' | 'unavailable'} SettingsErrorKind */

const MAX_DETAIL = 300

/** @param {unknown} code @returns {code is ServerErrorCode} */
export const isServerErrorCode = (code) => typeof code === 'string' && SERVER_ERROR_CODES.includes(code)

export class SettingsError extends Error {
  /**
   * @param {SettingsErrorKind} kind
   * @param {string} message
   * @param {{ status?: number, detail?: string, details?: Record<string, unknown> }} [extra]
   */
  constructor (kind, message, extra = {}) {
    super(message)
    this.name = 'SettingsError'
    this.kind = kind
    this.status = extra.status
    this.detail = typeof extra.detail === 'string' && extra.detail !== '' ? extra.detail.slice(0, MAX_DETAIL) : undefined
    this.details = extra.details
  }
}

/** @param {unknown} e @returns {e is SettingsError} */
export const isSettingsError = (e) => e instanceof SettingsError

/**
 * Whatever a transport rejected with, as a SettingsError. An IPC rejection loses
 * its prototype, so a plain object or an Error whose message is the JSON error
 * shape is read too. Anything unrecognised becomes a generic failure with no
 * detail: nothing of an unknown value is echoed.
 *
 * @param {unknown} e
 * @returns {SettingsError}
 */
export function toSettingsError (e) {
  if (isSettingsError(e)) return e
  const shaped = fromShape(e) ?? (e instanceof Error ? fromShape(parseJson(e.message)) : undefined)
  return shaped ?? new SettingsError('unavailable', 'The settings service did not answer as expected.')
}

/** @param {string} text */
function parseJson (text) {
  try {
    return JSON.parse(text)
  } catch (_) {
    return undefined
  }
}

/** @param {any} value @returns {SettingsError | undefined} */
function fromShape (value) {
  if (!value || typeof value !== 'object') return undefined
  const body = value.error && typeof value.error === 'object' ? value.error : value
  if (!isServerErrorCode(body.code)) return undefined
  return new SettingsError(body.code, typeof body.message === 'string' ? body.message : body.code, {
    details: body.details && typeof body.details === 'object' ? body.details : undefined
  })
}
