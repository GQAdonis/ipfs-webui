import { useCallback, useEffect, useReducer, useRef } from 'react'
import { createSearchClient } from './client.js'
import { isSearchError, SearchError } from './errors.js'
import { resolveConnection } from './connection.js'

/**
 * @typedef {Object} SearchState
 * @property {'idle' | 'loading' | 'done' | 'error'} phase
 * @property {import('./client.js').Hit[]} results
 * @property {string} model the embedding model the node answered with
 * @property {string} query the query the results belong to
 * @property {SearchError | undefined} error
 */

/** @type {SearchState} */
export const INITIAL = Object.freeze({ phase: 'idle', results: [], model: '', query: '', error: undefined })

/**
 * @param {SearchState} state
 * @param {{ type: 'start', query: string } | { type: 'done', model: string, results: import('./client.js').Hit[] } | { type: 'fail', error: SearchError }} action
 * @returns {SearchState}
 */
export function reducer (state, action) {
  switch (action.type) {
    case 'start': return { ...state, phase: 'loading', query: action.query, error: undefined }
    case 'done': return { phase: 'done', results: action.results, model: action.model, query: state.query, error: undefined }
    case 'fail': return { ...state, phase: 'error', results: [], error: action.error }
    default: return state
  }
}

/**
 * Runs searches against the node. Each search aborts the one before it, so only
 * the newest answer is ever shown. The connection is resolved per search, so a
 * token replaced in Settings is used by the next press.
 *
 * @param {Object} [seams] test seams
 * @param {typeof resolveConnection} [seams.resolve]
 * @param {typeof createSearchClient} [seams.makeClient]
 */
export function useSearch ({ resolve = resolveConnection, makeClient = createSearchClient } = {}) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  /** @type {React.MutableRefObject<AbortController | undefined>} */
  const controller = useRef()

  useEffect(() => () => controller.current?.abort(), [])

  const run = useCallback(
    /** @param {import('./client.js').SearchRequest} req */
    async (req) => {
      const query = req.query.trim()
      if (query === '') return
      controller.current?.abort()
      const mine = new AbortController()
      controller.current = mine
      dispatch({ type: 'start', query })
      try {
        const connection = await resolve()
        if (!connection.ok) {
          throw new SearchError('unauthenticated', 'No connection to the node is set up.')
        }
        const answer = await makeClient({ root: connection.root, getToken: connection.getToken, session: connection.session === true }).search({ ...req, query }, { signal: mine.signal })
        if (!mine.signal.aborted) dispatch({ type: 'done', model: answer.model, results: answer.results })
      } catch (e) {
        if (mine.signal.aborted || /** @type {any} */ (e)?.name === 'AbortError') return
        dispatch({ type: 'fail', error: isSearchError(e) ? e : new SearchError('internal', 'The search failed.') })
      }
    },
    [resolve, makeClient]
  )

  return { state, run }
}
