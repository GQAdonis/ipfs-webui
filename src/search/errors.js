/**
 * @typedef {'network' | 'protocol' | 'not_configured' | 'unauthenticated' | 'forbidden' | 'egress' | 'invalid' | 'rate_limited' | 'unavailable' | 'internal'} SearchErrorKind
 */

/**
 * What went wrong talking to `/index/*`, as a kind the page can say in words.
 * The message is a fixed English sentence for logs and tests; the page shows
 * locale strings chosen by `kind`, never this text. It carries no credential.
 */
export class SearchError extends Error {
  /**
   * @param {SearchErrorKind} kind
   * @param {string} message
   * @param {{ status?: number, retryAfter?: number, hosts?: string[] }} [extra]
   */
  constructor (kind, message, extra = {}) {
    super(message)
    this.name = 'SearchError'
    this.kind = kind
    this.status = extra.status
    /** Whole seconds from Retry-After, when the browser could read it. */
    this.retryAfter = extra.retryAfter
    /** The hosts an `egress_not_acknowledged` answer names. */
    this.hosts = extra.hosts ?? []
  }
}

/** @param {unknown} e @returns {e is SearchError} */
export const isSearchError = (e) => e instanceof SearchError
