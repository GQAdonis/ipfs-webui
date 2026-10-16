import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { INITIAL_STATE, keySavesAlone, applyBlockers, buildSetRequest, confirmation, isDirty, keyServerManaged, keyStored, reducer, testForDraft, urlCheck } from './core/form.js'
import { toSettingsError } from './core/errors.js'

// The state, actions and meta of the Agent settings page as one context
// (composition: state-context-interface). The provider is the only place that
// knows the transport: it receives a SettingsClient and never learns whether it
// speaks HTTP or the Desktop bridge. Children read `useAgentSettings()`.

const AgentSettingsContext = createContext(/** @type {AgentSettingsValue | null} */ (null))

/**
 * @typedef {Object} AgentSettingsValue
 * @property {import('./core/form.js').FormState} state
 * @property {ReturnType<typeof createActions>} actions
 * @property {Meta} meta
 */
/**
 * @typedef {Object} Meta
 * @property {boolean} managedByDesktop
 * @property {import('./core/types.js').StatusResponse | undefined} status
 * @property {boolean} dirty
 * @property {ReturnType<typeof urlCheck>} urlCheck
 * @property {ReturnType<typeof testForDraft>} test
 * @property {ReturnType<typeof confirmation>} confirmation
 * @property {boolean} keyStored
 * @property {boolean} keyServerManaged
 * @property {ReturnType<typeof applyBlockers>} blockers
 */

export const useAgentSettings = () => {
  const value = useContext(AgentSettingsContext)
  if (!value) throw new Error('useAgentSettings must be used inside <AgentSettingsProvider>')
  return value
}

/** @param {unknown} e @returns {import('./core/form.js').Failure} */
const failureOf = (e) => {
  const err = toSettingsError(e)
  return { kind: err.kind, message: err.message, detail: err.detail }
}

/** Which page phase a failed load puts the page in. @param {string} kind */
const phaseFor = (kind) => {
  switch (kind) {
    case 'not_configured': return 'needs-connection'
    case 'unauthorized': return 'unauthorized'
    case 'route_absent': return 'unavailable'
    default: return 'error'
  }
}

/**
 * @param {import('react').Dispatch<any>} dispatch
 * @param {{ current: import('./core/form.js').FormState }} stateRef
 * @param {{ current: import('./core/types.js').SettingsClient | undefined }} clientRef
 * @param {{ current: () => number }} nowRef
 * @param {(status: import('./core/types.js').StatusResponse) => void} setStatus
 */
function createActions (dispatch, stateRef, clientRef, nowRef, setStatus) {
  const refreshStatus = async () => {
    try {
      const status = await clientRef.current?.status()
      if (status) setStatus(status)
    } catch (_) {
      // The status line is informational; the page works without it.
    }
  }

  /** @param {{ keepEdits?: boolean }} [opts] */
  const load = async ({ keepEdits = false } = {}) => {
    const client = clientRef.current
    if (!client) {
      dispatch({ type: 'phase', phase: 'needs-connection' })
      return
    }
    try {
      const server = await client.get()
      dispatch({ type: 'loaded', server, keepEdits })
    } catch (e) {
      const failure = failureOf(e)
      dispatch({ type: 'load-failed', phase: phaseFor(failure.kind), failure })
    }
  }

  return {
    load,
    refreshStatus,
    /** @param {'openai' | 'uar' | ''} kind */
    setKind: (kind) => dispatch({ type: 'kind', kind }),
    /** @param {string} value */
    setBaseUrl: (value) => dispatch({ type: 'base-url', value }),
    /** @param {string} value */
    setModel: (value) => dispatch({ type: 'model', value }),
    /** @param {string} value */
    setKeyDraft: (value) => dispatch({ type: 'key-draft', value }),
    /** @param {string} value */
    setConfirmText: (value) => dispatch({ type: 'confirm-text', value }),
    revert: () => dispatch({ type: 'revert' }),

    async testConnection () {
      const client = clientRef.current
      const s = stateRef.current
      const check = urlCheck(s)
      if (!client || !check.ok || s.test.state === 'testing') return
      const url = check.value
      dispatch({ type: 'test-started', url })
      try {
        const result = await client.testConnection({ base_url: url, kind: s.draft.kind === 'uar' ? 'uar' : 'openai' })
        dispatch({ type: 'test-finished', url, result })
      } catch (e) {
        const failure = failureOf(e)
        if (failure.kind === 'unauthorized') dispatch({ type: 'phase', phase: 'unauthorized', failure })
        dispatch({ type: 'test-failed', url, failure })
      }
    },

    async saveKey () {
      const client = clientRef.current
      const s = stateRef.current
      if (!client || !s.server || s.keyDraft === '' || s.key.state === 'saving') return
      // A key for a backend the node does not run goes with Apply, never on its own.
      if (!keySavesAlone(s, true)) return
      dispatch({ type: 'key-started' })
      try {
        const res = await client.setApiKey({ revision: s.server.revision, api_key: s.keyDraft })
        dispatch({ type: 'key-saved', revision: res.revision, apiKey: res.api_key })
        void refreshStatus()
      } catch (e) {
        const failure = failureOf(e)
        if (failure.kind === 'unauthorized') dispatch({ type: 'phase', phase: 'unauthorized', failure })
        dispatch({ type: 'key-failed', failure })
        if (failure.kind === 'revision_conflict') void load({ keepEdits: true })
      }
    },

    async clearKey () {
      const client = clientRef.current
      const s = stateRef.current
      if (!client || !s.server || s.key.state === 'saving') return
      if (!keySavesAlone(s, true)) return
      dispatch({ type: 'key-started' })
      try {
        const res = await client.clearApiKey({ revision: s.server.revision })
        dispatch({ type: 'key-cleared', revision: res.revision })
        void refreshStatus()
      } catch (e) {
        const failure = failureOf(e)
        if (failure.kind === 'unauthorized') dispatch({ type: 'phase', phase: 'unauthorized', failure })
        dispatch({ type: 'key-failed', failure })
        if (failure.kind === 'revision_conflict') void load({ keepEdits: true })
      }
    },

    async apply () {
      const client = clientRef.current
      const s = stateRef.current
      const request = buildSetRequest(s)
      if (!client || !request || s.apply.state === 'applying') return
      const submitted = s.draft
      dispatch({ type: 'apply-started' })
      try {
        const server = await client.set(request)
        dispatch({ type: 'apply-succeeded', server, submitted, at: new Date(nowRef.current()).toISOString() })
        void refreshStatus()
      } catch (e) {
        const failure = failureOf(e)
        if (failure.kind === 'unauthorized') dispatch({ type: 'phase', phase: 'unauthorized', failure })
        dispatch({ type: 'apply-failed', failure, at: new Date(nowRef.current()).toISOString() })
        void refreshStatus()
        // A stale revision: take the node's current revision (and state) and keep the edits, so
        // Retry sends against the revision that is now current.
        if (failure.kind === 'revision_conflict') await load({ keepEdits: true })
      }
    }
  }
}

/**
 * @param {Object} props
 * @param {import('./core/types.js').SettingsClient | undefined} props.client undefined means no connection is configured yet
 * @param {string} [props.connectionKey] which node the client talks to; a new token for the same node keeps the draft
 * @param {boolean} [props.managed] the Desktop bridge is the transport, known before the first status answer
 * @param {() => number} [props.now] test seam
 * @param {React.ReactNode} props.children
 */
export const AgentSettingsProvider = ({ client, connectionKey, managed = false, now = Date.now, children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [status, setStatus] = useState(/** @type {import('./core/types.js').StatusResponse | undefined} */ (undefined))
  const stateRef = useRef(state)
  stateRef.current = state
  const clientRef = useRef(client)
  clientRef.current = client
  const nowRef = useRef(now)
  nowRef.current = now

  const actions = useMemo(() => createActions(dispatch, stateRef, clientRef, nowRef, setStatus), [])

  // One load per connection. A new client (the person entered a token or changed the
  // endpoint) is a different node or credential, so the form starts over.
  const lastKeyRef = useRef(connectionKey)
  useEffect(() => {
    // After a refused token, a new token for the same node must not cost the person their draft.
    const sameNodeAfterRefusal = lastKeyRef.current === connectionKey && stateRef.current.phase === 'unauthorized'
    lastKeyRef.current = connectionKey
    dispatch({ type: 'phase', phase: 'loading' })
    void actions.refreshStatus()
    void actions.load({ keepEdits: sameNodeAfterRefusal })
    if (!client) return undefined
    return client.onChange((event) => {
      const s = stateRef.current
      if (event.revision === s.server?.revision) return
      if (isDirty(s)) dispatch({ type: 'elsewhere' })
      else void actions.load({ keepEdits: true })
    })
  }, [client, connectionKey, actions])

  const meta = useMemo(() => {
    return /** @type {Meta} */ ({
      managedByDesktop: status ? status.managed_by_desktop === true : managed,
      status,
      dirty: isDirty(state),
      urlCheck: urlCheck(state),
      test: testForDraft(state),
      confirmation: confirmation(state),
      keyStored: keyStored(state),
      keyServerManaged: keyServerManaged(state),
      blockers: applyBlockers(state)
    })
  }, [state, status, managed])

  const value = useMemo(() => ({ state, actions, meta }), [state, actions, meta])
  return <AgentSettingsContext.Provider value={value}>{children}</AgentSettingsContext.Provider>
}
