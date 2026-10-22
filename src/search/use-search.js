import { useCallback, useEffect, useReducer, useRef, useSyncExternalStore } from 'react'
import { createSearchClient } from './client.js'
import { isSearchError, SearchError } from './errors.js'
import { resolveConnection } from './connection.js'
import { getConnectionStore } from '../agent-chat/connection-store.js'
import { getSettings as getSearchSettings, subscribe as subscribeSearch } from './settings-store.js'

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
 * @param {{ type: 'reset' } | { type: 'start', query: string } | { type: 'done', model: string, results: import('./client.js').Hit[] } | { type: 'fail', error: SearchError }} action
 * @returns {SearchState}
 */
export function reducer (state, action) {
  switch (action.type) {
    case 'reset': return INITIAL
    case 'start': return { ...state, phase: 'loading', query: action.query, error: undefined }
    case 'done': return { phase: 'done', results: action.results, model: action.model, query: state.query, error: undefined }
    case 'fail': return { ...state, phase: 'error', results: [], error: action.error }
    default: return state
  }
}

/**
 * Runs searches against the node. Each search aborts the one before it, so only
 * the newest answer is ever shown. The shared connection lifetime aborts and clears
 * old work/results on auth changes. Search has its own independent off switch.
 *
 * @param {Object} [seams] test seams
 * @param {typeof resolveConnection} [seams.resolve]
 * @param {typeof createSearchClient} [seams.makeClient]
 * @param {ReturnType<typeof getConnectionStore>} [seams.connectionStore]
 */
export function useSearch ({ resolve = resolveConnection, makeClient = createSearchClient, connectionStore } = {}) {
  const [entry, dispatch] = useReducer((previous, action) => ({
    state: reducer(previous.state, action),
    generation: action.type === 'reset' ? undefined : action.generation ?? previous.generation
  }), { state: INITIAL, generation: undefined })
  /** @type {React.MutableRefObject<AbortController | undefined>} */
  const controller = useRef()
  const cleanupLifetime = useRef(() => {})
  const mounted = useRef(true)
  const source = connectionStore ?? (resolve === resolveConnection ? getConnectionStore() : undefined)
  const cancel = useCallback(() => {
    cleanupLifetime.current()
    cleanupLifetime.current = () => {}
    controller.current?.abort()
    controller.current = undefined
  }, [])
  const subscribeConnection = useCallback(listener => {
    if (!source) return () => {}
    let generation = source.getSnapshot().generation
    return source.subscribe(() => {
      const next = source.getSnapshot().generation
      if (next !== generation) {
        generation = next
        cancel()
        dispatch({ type: 'reset' })
      }
      listener()
    })
  }, [source, cancel])
  const subscribeEnabled = useCallback(listener => subscribeSearch(() => {
    if (!getSearchSettings().enabled) {
      cancel()
      dispatch({ type: 'reset' })
    }
    listener()
  }), [cancel])
  const connection = useSyncExternalStore(subscribeConnection, source?.getSnapshot ?? emptyConnection, source?.getSnapshot ?? emptyConnection)
  const settings = useSyncExternalStore(subscribeEnabled, getSearchSettings, getSearchSettings)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; cancel() }
  }, [cancel, source])

  const run = useCallback(
    /** @param {import('./client.js').SearchRequest} req */
    async (req) => {
      const query = req.query.trim()
      if (query === '' || !mounted.current || !getSearchSettings().enabled) return
      cancel()
      const mine = new AbortController()
      controller.current = mine
      const generation = source?.getSnapshot().generation
      const current = () => mounted.current && controller.current === mine && !mine.signal.aborted && getSearchSettings().enabled && (!source || source.getSnapshot().generation === generation)
      dispatch({ type: 'start', query, generation })
      try {
        const selected = await (resolve === resolveConnection ? resolve({ store: source }) : resolve())
        if (!current()) return
        if (!selected.ok) {
          throw new SearchError('unauthenticated', 'No connection to the node is set up.')
        }
        const retire = () => {
          if (controller.current !== mine) return
          cancel()
          if (mounted.current) dispatch({ type: 'reset' })
        }
        selected.signal?.addEventListener('abort', retire, { once: true })
        cleanupLifetime.current = () => selected.signal?.removeEventListener('abort', retire)
        if (selected.signal?.aborted || selected.isCurrent?.() === false) { retire(); return }
        const answer = await makeClient({ root: selected.root, getToken: selected.getToken, session: selected.session === true }).search({ ...req, query }, { signal: mine.signal })
        if (current() && selected.isCurrent?.() !== false) dispatch({ type: 'done', model: answer.model, results: answer.results, generation })
      } catch (e) {
        if (!current() || /** @type {any} */ (e)?.name === 'AbortError') return
        dispatch({ type: 'fail', error: isSearchError(e) ? e : new SearchError('internal', 'The search failed.'), generation })
      }
    },
    [resolve, makeClient, source, cancel]
  )

  // Do not project a previous generation even during the render before cleanup effects run.
  const state = !settings.enabled || (source && entry.generation !== connection.generation) ? INITIAL : entry.state
  return { state, run }
}

const NO_CONNECTION = Object.freeze({ generation: undefined })
const emptyConnection = () => NO_CONNECTION
