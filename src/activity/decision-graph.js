import { createGraphStore } from '@prometheus-ags/entity-graph-core'
export const DECISION_ENTITY = 'ipfsDecisionObservation'
export const DECISION_LIST = 'ipfs:current-decisions'

export function createDecisionGraph () { return createGraphStore() }
export function clearDecisionGraph (store) {
  // Partial replacement retains only the library action methods; no persistence/destroy adapter.
  store.setState({ entities: {}, patches: {}, entityStates: {}, syncMetadata: {}, lists: {} })
}
export function replaceDecisionGraph (store, observations, { hasMore, nextCursor }) {
  clearDecisionGraph(store)
  store.getState().ingestFetchedList(DECISION_ENTITY, observations.map(observation => ({ id: observation.id, data: { observation } })), {
    lists: [{ key: DECISION_LIST, mode: 'replace', meta: { entityType: DECISION_ENTITY, total: null, hasNextPage: hasMore, nextCursor: nextCursor ?? null } }]
  })
}
export function replaceDecisionDetail (store, observation) {
  store.getState().replaceEntity(DECISION_ENTITY, observation.id, { observation })
}
export function removeDecisionDetail (store, id) {
  const actions = store.getState()
  actions.removeEntity(DECISION_ENTITY, id)
  actions.removeIdFromAllLists(DECISION_ENTITY, id)
}
