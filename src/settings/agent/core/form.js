// The page's state, as a pure reducer plus pure derivations, so every state of
// the form (first run, dirty, testing, applying, applied, failed, signed out)
// is testable without a DOM. The provider (../AgentSettings.js) owns the async
// work and dispatches into this.

import { validateBackendUrl, hostOf } from './url.js'

/** @typedef {{ kind: '' | 'openai' | 'uar', baseUrl: string, model: string }} Draft */
/** @typedef {{ kind: string, message: string, detail?: string }} Failure */
/**
 * @typedef {Object} FormState
 * @property {'loading' | 'ready' | 'needs-connection' | 'unauthorized' | 'unavailable' | 'error'} phase
 * @property {Failure | undefined} failure
 * @property {import('./types.js').GetResponse | null} server
 * @property {Draft} draft
 * @property {string} keyDraft
 * @property {{ state: 'idle' | 'saving' | 'saved' | 'cleared' | 'failed', failure?: Failure, stagedThisSession: boolean }} key
 * @property {{ state: 'idle' | 'testing' | 'ok' | 'failed', url: string, detail?: string, latencyMs?: number, models?: string[], keySent?: boolean }} test
 * @property {string} confirmText
 * @property {{ state: 'idle' | 'applying' | 'applied' | 'failed', at?: string, failure?: Failure, applied?: { kind: string, model: string, host: string, first: boolean } }} apply
 * @property {boolean} elsewhere a change from another tab or the node arrived while this form has edits
 */

/** @type {Draft} */
export const EMPTY_DRAFT = Object.freeze({ kind: '', baseUrl: '', model: '' })

/** @type {FormState} */
export const INITIAL_STATE = Object.freeze({
  phase: 'loading',
  failure: undefined,
  server: null,
  draft: EMPTY_DRAFT,
  keyDraft: '',
  key: Object.freeze({ state: 'idle', stagedThisSession: false }),
  test: Object.freeze({ state: 'idle', url: '' }),
  confirmText: '',
  apply: Object.freeze({ state: 'idle' }),
  elsewhere: false
})

/**
 * The draft the server's backend implies. No backend leaves nothing chosen.
 *
 * @param {import('./types.js').GetResponse | null} server
 * @returns {Draft}
 */
export function draftFromServer (server) {
  const b = server?.backend
  if (!b) return EMPTY_DRAFT
  return { kind: b.kind, baseUrl: b.base_url ?? '', model: b.model ?? '' }
}

/**
 * What a typed host confirmation was about: the backend's kind and host.
 *
 * @param {import('./types.js').GetResponse | null} server
 */
const backendIdentity = (server) => `${server?.backend?.kind ?? ''}|${hostOf(server?.backend?.base_url ?? '')}`

/** @param {Draft} a @param {Draft} b */
const sameDraft = (a, b) => a.kind === b.kind && a.baseUrl.trim() === b.baseUrl.trim() && a.model.trim() === b.model.trim()

/**
 * @param {FormState} state
 * @param {any} action
 * @returns {FormState}
 */
export function reducer (state, action) {
  switch (action.type) {
    case 'loaded': {
      // Keep edits the person is making when the server state changes under them.
      const incoming = draftFromServer(action.server)
      const editing = state.server !== null && !sameDraft(state.draft, draftFromServer(state.server))
      const keep = editing && action.keepEdits
      // The host typed back was a decision about the backend as it was. When the node's
      // backend moved to another host or kind under the edits, the person types it again.
      const moved = keep && backendIdentity(state.server) !== backendIdentity(action.server)
      return {
        ...state,
        phase: 'ready',
        failure: undefined,
        server: action.server,
        draft: keep ? state.draft : incoming,
        confirmText: keep && !moved ? state.confirmText : '',
        elsewhere: keep && state.server?.revision !== action.server.revision
      }
    }
    case 'load-failed':
      return { ...state, phase: action.phase, failure: action.failure }
    case 'phase':
      return { ...state, phase: action.phase, failure: action.failure }
    case 'kind':
      return { ...state, draft: { ...state.draft, kind: action.kind }, confirmText: '', apply: settle(state.apply) }
    case 'base-url':
      return { ...state, draft: { ...state.draft, baseUrl: action.value }, confirmText: '', apply: settle(state.apply) }
    case 'model':
      return { ...state, draft: { ...state.draft, model: action.value }, apply: settle(state.apply) }
    case 'key-draft':
      return { ...state, keyDraft: action.value }
    case 'confirm-text':
      return { ...state, confirmText: action.value }
    case 'test-started':
      return { ...state, test: { state: 'testing', url: action.url } }
    case 'test-finished':
      return {
        ...state,
        // A saved key has been used once the test passes; "test it to use it" is then stale.
        key: action.result.ok && state.key.state === 'saved' ? { ...state.key, state: 'idle' } : state.key,
        test: { state: action.result.ok ? 'ok' : 'failed', url: action.url, detail: action.result.detail, latencyMs: action.result.latency_ms, models: action.result.models, keySent: action.result.key_sent === true }
      }
    case 'test-failed':
      return { ...state, test: { state: 'failed', url: action.url, detail: action.failure.detail ?? action.failure.message } }
    case 'key-started':
      return { ...state, key: { ...state.key, state: 'saving', failure: undefined } }
    case 'key-saved':
      return { ...state, keyDraft: '', key: { state: 'saved', stagedThisSession: true }, server: bumpRevision(state.server, action.revision, action.apiKey) }
    case 'key-cleared':
      return { ...state, key: { state: 'cleared', stagedThisSession: false }, server: bumpRevision(state.server, action.revision, { set: false }) }
    case 'key-failed':
      return { ...state, key: { ...state.key, state: 'failed', failure: action.failure } }
    case 'apply-started':
      return { ...state, apply: { state: 'applying' }, elsewhere: false }
    case 'apply-succeeded': {
      const submitted = action.submitted
      const stillSame = sameDraft(state.draft, submitted)
      return {
        ...state,
        server: action.server,
        draft: stillSame ? draftFromServer(action.server) : state.draft,
        confirmText: '',
        elsewhere: false,
        key: state.key.state === 'saved' || state.key.state === 'cleared' ? { ...state.key, state: 'idle' } : state.key,
        apply: { state: 'applied', at: action.at, applied: { kind: submitted.kind, model: submitted.model.trim(), host: hostOf(submitted.baseUrl.trim()), first: state.server?.backend == null } }
      }
    }
    case 'apply-failed':
      // A stale revision means the node's settings moved: the page reloads them next and says so.
      return { ...state, elsewhere: action.failure.kind === 'revision_conflict' ? true : state.elsewhere, apply: { state: 'failed', at: action.at, failure: action.failure } }
    case 'revert':
      return { ...state, draft: draftFromServer(state.server), keyDraft: '', confirmText: '', apply: { state: 'idle' }, elsewhere: false }
    case 'elsewhere':
      return { ...state, elsewhere: true }
    default:
      return state
  }
}

/**
 * A finished apply message is history once the person edits again.
 *
 * @param {FormState['apply']} apply
 */
function settle (apply) {
  return apply.state === 'applied' || apply.state === 'failed' ? { state: /** @type {const} */ ('idle') } : apply
}

/**
 * @param {import('./types.js').GetResponse | null} server
 * @param {string} revision
 * @param {import('./types.js').ApiKeyStatus} apiKey
 * @returns {import('./types.js').GetResponse | null}
 */
function bumpRevision (server, revision, apiKey) {
  if (!server) return server
  return {
    ...server,
    revision,
    backend: server.backend ? { ...server.backend, api_key: apiKey } : server.backend
  }
}

// ---- derivations ----

/** @param {FormState} state */
export const isDirty = (state) => !sameDraft(state.draft, draftFromServer(state.server))

/**
 * The URL check the field shows.
 *
 * @param {FormState} state
 */
export const urlCheck = (state) => validateBackendUrl(state.draft.baseUrl)

/**
 * The test result counts only for the URL it was run against.
 *
 * @param {FormState} state
 */
export const testForDraft = (state) => (state.test.url === state.draft.baseUrl.trim() ? state.test : { state: /** @type {const} */ ('idle'), url: '' })

/** @param {FormState} state */
export const hostChanged = (state) => {
  const next = urlCheck(state).ok ? hostOf(state.draft.baseUrl.trim()) : ''
  return next !== '' && next !== hostOf(state.server?.backend?.base_url ?? '')
}

/** @param {FormState} state */
export const kindChanged = (state) => state.draft.kind !== '' && state.draft.kind !== (state.server?.backend?.kind ?? '')

/**
 * Typed re-confirmation: required when the backend kind or the model host
 * changes, because node content can then reach a different place. The person
 * types the host. A change of model alone needs none.
 *
 * @param {FormState} state
 */
export function confirmation (state) {
  const required = state.draft.kind === 'openai' && isDirty(state) && (hostChanged(state) || kindChanged(state))
  const host = urlCheck(state).ok ? hostOf(state.draft.baseUrl.trim()) : ''
  const matches = required && host !== '' && state.confirmText.trim().toLowerCase() === host
  // Test connection can send the stored key to the candidate host. It is held back for
  // any host other than the current backend's until the host has been typed back.
  const gatesTest = required && hostChanged(state)
  return {
    required,
    host,
    matches,
    sendsEgressConfirmation: gatesTest,
    gatesTest,
    testAllowed: !gatesTest || matches
  }
}

/**
 * Every reason Apply is off, so the form can say which. Only an OpenAI-compatible
 * backend can be applied by this build; UAR is shown as unavailable.
 *
 * @param {FormState} state
 * @param {{ uarAvailable: boolean }} caps
 * @returns {('nothing-chosen' | 'unavailable' | 'url' | 'model' | 'confirm' | 'clean' | 'busy')[]}
 */
export function applyBlockers (state, caps) {
  /** @type {('nothing-chosen' | 'unavailable' | 'url' | 'model' | 'confirm' | 'clean' | 'busy')[]} */
  const out = []
  if (state.apply.state === 'applying') out.push('busy')
  if (state.draft.kind === '') out.push('nothing-chosen')
  else if (state.draft.kind === 'uar' && !caps.uarAvailable) out.push('unavailable')
  else if (state.draft.kind === 'openai') {
    if (!urlCheck(state).ok) out.push('url')
    if (state.draft.model.trim() === '') out.push('model')
  }
  if (!isDirty(state) && state.draft.kind !== '') out.push('clean')
  const c = confirmation(state)
  if (c.required && !c.matches && !out.includes('url')) out.push('confirm')
  return out
}

/**
 * The SetRequest for the current draft, or undefined when there is nothing to send.
 * Only fields that differ from the server go out.
 *
 * @param {FormState} state
 * @returns {import('./types.js').SetRequest | undefined}
 */
export function buildSetRequest (state) {
  if (!state.server || state.draft.kind !== 'openai') return undefined
  const was = draftFromServer(state.server)
  /** @type {import('./types.js').BackendSet} */
  const backend = {}
  if (state.draft.kind !== was.kind) backend.kind = state.draft.kind
  if (state.draft.baseUrl.trim() !== was.baseUrl) backend.base_url = state.draft.baseUrl.trim()
  if (state.draft.model.trim() !== was.model) backend.model = state.draft.model.trim()
  if (Object.keys(backend).length === 0) return undefined
  const c = confirmation(state)
  return {
    revision: state.server.revision,
    backend,
    ...(c.sendsEgressConfirmation && { egress_confirmation: { host: c.host } })
  }
}
