import { createContext, useContext, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { GraphStoreProvider, useGraphStore } from '@prometheus-ags/prometheus-entity-management'
import { EMPTY_IDS } from '@prometheus-ags/entity-graph-core'
import { getPresentationPolicy } from '../agent-chat/presentation-policy.js'
import { getConnectionStore } from '../agent-chat/connection-store.js'
import { createDecisionFeed } from './decision-feed.js'
import { DECISION_ENTITY, DECISION_LIST } from './decision-graph.js'

const FeedContext = createContext(null)
const ProjectionContext = createContext(null)
const EMPTY_ENTITIES = Object.freeze({})

/** Exactly one host read controller. Unmount/disable stops subscriptions and clears scoped maps. */
export function DecisionFeedProvider ({ connectionStore, enabled = true, presentationPolicy, children }) {
  const [policy] = useState(() => presentationPolicy ?? getPresentationPolicy())
  const [feed] = useState(() => createDecisionFeed({ connectionStore: connectionStore ?? getConnectionStore(), enabled: enabled && policy.getSnapshot().decisions }))
  useLayoutEffect(() => {
    const sync = () => {
      const on = enabled && policy.getSnapshot().decisions
      feed.setEnabled(on)
      if (on) feed.start()
      else feed.stop()
    }
    sync()
    const unsubscribe = policy.subscribe(sync)
    return () => { unsubscribe(); feed.stop() }
  }, [feed, enabled, policy])
  return <FeedContext value={feed}>{children}</FeedContext>
}
export function useDecisionFeedApi () {
  const feed = useContext(FeedContext)
  if (!feed) throw new Error('Decision reads require the application-owned DecisionFeedProvider.')
  return feed
}
export function useDecisionFeed () {
  const feed = useDecisionFeedApi()
  const snapshot = useSyncExternalStore(feed.subscribe, feed.getSnapshot)
  return useMemo(() => ({ ...snapshot, refresh: feed.refresh, readDecision: feed.readDecision, readDecisionResult: feed.readDecisionResult, getValidated: feed.getValidated }), [snapshot, feed])
}

/** Only domain projection views remount on auth/epoch changes; shell/routes/chat do not. */
export function DecisionProjectionScope ({ children }) {
  const { graph, scopeKey } = useDecisionFeed()
  return <ProjectionContext value={graph}><GraphStoreProvider key={scopeKey} store={graph}>{children}</GraphStoreProvider></ProjectionContext>
}
function useRequiredProjection () {
  if (!useContext(ProjectionContext)) throw new Error('Decision selectors require DecisionProjectionScope; the global graph is never used.')
}
// These selectors must be descendants of DecisionProjectionScope, never a library singleton.
export function useDecisionIds () {
  useDecisionFeed()
  useRequiredProjection()
  return useGraphStore(state => state.lists[DECISION_LIST]?.ids ?? EMPTY_IDS)
}
export function useDecisionObservation (id) {
  useDecisionFeed()
  useRequiredProjection()
  return useGraphStore(state => state.entities[DECISION_ENTITY]?.[id]?.observation)
}
export function useDecisionRows () {
  const ids = useDecisionIds()
  const entities = useGraphStore(state => state.entities[DECISION_ENTITY] ?? EMPTY_ENTITIES)
  return useMemo(() => ids.map(id => entities[id]?.observation).filter(Boolean), [ids, entities])
}
