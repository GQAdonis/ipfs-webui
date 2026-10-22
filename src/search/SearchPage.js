import React, { useCallback, useEffect, useSyncExternalStore } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { StatusLine } from '../promethity/components/index.js'
import { getBridge } from '../agent-chat/bridge.js'
import { titleWithBrand } from '../promethity/page-title.js'
import { useSearchAvailability } from './use-availability.js'
import { useSearchSettings } from './use-search-settings.js'
import { useSearch } from './use-search.js'
import SearchForm from './SearchForm.js'
import ResultItem from './ResultItem.js'
import ErrorNotice from './ErrorNotice.js'
import IndexStatusPanel from './IndexStatusPanel.js'
import { AGENT_SETTINGS_HASH, SEARCH_DOCS_URL } from './docs-link.js'
import { getConnectionStore } from '../agent-chat/connection-store.js'
import { searchHandoff } from '../shell/search-handoff.js'
import './search.css'

const RUN_POLL_MS = 5000

/**
 * The words for the live region, which is the only place result counts are
 * announced. Empty while nothing has happened, so the first announcement is
 * the first real change.
 *
 * @param {import('./use-search.js').SearchState} state
 * @param {import('i18next').TFunction} t
 */
function announcement (state, t) {
  if (state.phase === 'loading') return t('results.searching')
  if (state.phase === 'done') return state.results.length === 0 ? t('results.none') : t('results.count', { count: state.results.length })
  return ''
}

/** @param {{ state: import('./use-search.js').SearchState, onRetry: () => void }} props */
const Results = ({ state, onRetry }) => {
  const { t } = useTranslation('search')
  if (state.phase === 'idle') {
    return (
      <div className='sr-empty'>
        <h2 className='sr-h2'>{t('idle.heading')}</h2>
        <p>{t('idle.body')}</p>
      </div>
    )
  }
  if (state.phase === 'error' && state.error) return <ErrorNotice error={state.error} onRetry={onRetry} />
  if (state.phase === 'loading' && state.results.length === 0) {
    // The live region in SearchPage is the one announcement of these two states.
    return <StatusLine tone='info' word={t('results.searching')} announce={false}>{null}</StatusLine>
  }
  if (state.phase === 'done' && state.results.length === 0) {
    return <StatusLine tone='info' word={t('results.none')} announce={false}>{null}</StatusLine>
  }
  return (
    <section aria-labelledby='sr-results-heading' aria-busy={state.phase === 'loading'}>
      <div className='sr-results-head'>
        <h2 id='sr-results-heading' className='sr-h2'>{t('results.heading')}</h2>
        <p className='sr-note'>
          {t('results.count', { count: state.results.length })}
          {state.model ? ` ${t('results.model', { model: state.model })}` : ''}
        </p>
      </div>
      <p className='sr-untrusted'>{t('results.untrusted')}</p>
      <ol className='sr-results'>
        {state.results.map((hit) => <ResultItem key={`${hit.cid}:${hit.chunkIndex}`} hit={hit} />)}
      </ol>
    </section>
  )
}
Results.propTypes = { state: PropTypes.object.isRequired, onRetry: PropTypes.func.isRequired }

/**
 * `#/search`. Searches the whole node by meaning through the `/index/*` routes
 * of `ipfs mcp`. While the Web UI setting `search.enabled` is off the page
 * sends nothing and sends the person back to the start page.
 *
 * @param {{ useSearchSeams?: Parameters<typeof useSearch>[0] }} props
 */
export const SearchPage = ({ useSearchSeams }) => {
  const { t } = useTranslation('search')
  const pending = useSyncExternalStore(searchHandoff.subscribe, searchHandoff.getSnapshot)
  const [connectionStore] = React.useState(getConnectionStore)
  const scope = useSyncExternalStore(connectionStore.subscribe, connectionStore.getSnapshot)
  const [submittedQuery, setSubmittedQuery] = React.useState('')
  const [handoffCount, setHandoffCount] = React.useState(0)
  const { enabled } = useSearchSettings()
  const availability = useSearchAvailability()
  const { refresh } = availability
  const { state, run } = useSearch(useSearchSeams)
  const [lastRequest, setLastRequest] = React.useState(/** @type {{ query: string, kinds: string[], sources: string[], generation: string } | undefined} */ (undefined))

  // Off switch: no page, no request, back to the start page.
  useEffect(() => {
    if (!enabled) { searchHandoff.clear(); globalThis.location.replace('#/') }
  }, [enabled])

  // A fresh status each time the page opens.
  useEffect(() => {
    if (enabled) void refresh()
  }, [enabled, refresh])

  // While a bulk run is going, keep its numbers current.
  const running = availability.status?.bulkRun?.state === 'running'
  useEffect(() => {
    if (!enabled || !running) return undefined
    const timer = setInterval(() => {
      if (globalThis.document?.visibilityState !== 'hidden') void refresh()
    }, RUN_POLL_MS)
    return () => clearInterval(timer)
  }, [enabled, running, refresh])

  const onSearch = useCallback((/** @type {{ query: string, kinds: string[], sources: string[] }} */ req) => {
    const current = connectionStore.getSnapshot()
    if (!enabled || availability.phase !== 'available' || current.status !== 'ready' || current.generation !== scope.generation || (availability.generation && availability.generation !== current.generation)) return
    setLastRequest({ ...req, generation: current.generation })
    void run({ query: req.query, kinds: req.kinds, sources: req.sources })
  }, [run, enabled, availability.phase, availability.generation, connectionStore, scope.generation])
  useEffect(() => {
    setLastRequest(undefined)
    setSubmittedQuery('')
    searchHandoff.retire(scope.generation)
  }, [scope.generation])

  useEffect(() => {
    if (!pending || !enabled || availability.phase !== 'available' || (availability.generation && availability.generation !== scope.generation)) return
    const request = searchHandoff.take(scope.generation)
    if (!request || scope.status !== 'ready' || connectionStore.getSnapshot().generation !== scope.generation) return
    setSubmittedQuery(request.query)
    setHandoffCount(count => count + 1)
    onSearch({ query: request.query, kinds: [], sources: [] })
  }, [pending, enabled, availability.phase, availability.generation, scope.generation, scope.status, connectionStore, onSearch])

  const onRetry = useCallback(() => { if (lastRequest?.generation === connectionStore.getSnapshot().generation) onSearch(lastRequest) }, [lastRequest, onSearch, connectionStore])

  if (!enabled) return null

  const { phase, connection } = availability
  const canSearch = phase === 'available'
  const gate = phase === 'unconnected'
    ? (
      <div className='sr-gate'>
        <StatusLine tone='warn' word={t('gate.unconnected.word')}>
          {connection === 'origin-blocked' ? 'Search is unavailable on this page origin. Ordinary IPFS navigation remains available; use an isolated or dedicated configured agent origin.' : connection === 'no-token' ? t('gate.unconnected.noToken') : connection === 'signing-out' ? 'Signing out. This local connection has been retired.' : connection === 'session-expired' ? 'Sign in again before searching.' : connection === 'resolving' ? 'Checking the connection.' : t('gate.unconnected.noEndpoint')}
        </StatusLine>
        <a className='sr-link' href={AGENT_SETTINGS_HASH}>{t('gate.unconnected.link')}</a>
      </div>
      )
    : phase === 'unconfigured'
      ? (availability.error && availability.error.kind !== 'not_configured'
          // The node could not be asked, or answered something unusable: that is a
          // problem to retry, not proof that no index is set up.
          ? (
            <div className='sr-gate'>
              <ErrorNotice error={availability.error} onRetry={refresh} />
            </div>
            )
          : (
            <div className='sr-gate'>
              <StatusLine tone='warn' word={t('gate.unconfigured.word')}>
                {getBridge() ? t('gate.unconfigured.bodyDesktop') : t('gate.unconfigured.body')}
              </StatusLine>
              <a className='sr-link' href={SEARCH_DOCS_URL} target='_blank' rel='noopener noreferrer'>{t('gate.unconfigured.link')}</a>
            </div>
            ))
      : null

  return (
    <div data-id='SearchPage' className='mw8 center sr-page'>
      <>
        <title>{titleWithBrand(t('title'))}</title>
      </>
      <header className='sr-header'>
        <h1 className='sr-h1'>{t('title')}</h1>
        <p className='sr-lede'>{t('lede')}</p>
      </header>
      <div className='sr-layout'>
        <div className='sr-main'>
          {gate}
          {phase === 'checking' ? <StatusLine tone='info' word='Checking indexed search' /> : null}
          {phase === 'denied' && availability.error ? <ErrorNotice error={availability.error} onRetry={refresh} /> : null}
          {canSearch
            ? (
              <>
                <SearchForm key={`${scope.generation}:${handoffCount}`} submittedQuery={submittedQuery} busy={state.phase === 'loading'} onSearch={onSearch} />
                {phase === 'denied' && availability.error ? <ErrorNotice error={availability.error} /> : null}
                <div className='sr-visually-hidden' role='status' aria-live='polite' aria-atomic='true'>
                  {announcement(state, t)}
                </div>
                <Results state={state} onRetry={onRetry} />
              </>
              )
            : null}
        </div>
        <aside className='sr-aside'>
          <IndexStatusPanel availability={availability} onRefresh={refresh} />
        </aside>
      </div>
    </div>
  )
}

SearchPage.propTypes = { useSearchSeams: PropTypes.object }

export default SearchPage
