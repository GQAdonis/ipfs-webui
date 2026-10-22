import { decisionProjectionFromObservation } from '@gqadonis/ipfs-mcp-ui'

/** Read presentation only. Caller options cannot provide resolver authorization or execution facts. */
export function projectDecisionRows (observations, { nowIso, surface } = {}) {
  if (!Array.isArray(observations)) return []
  const rows = []
  for (const observation of observations) {
    const projection = decisionProjectionFromObservation(observation, { nowIso, currentSurface: surface })
    if (projection.ok) rows.push({ observation: projection.observation, model: projection.model })
  }
  return rows
}

/** Groups are ordered by first appearance; rows retain their server order within each group.
 * A decision without reported activity remains separate. Its React key is only a local key. */
export function groupDecisionActivity (projectedRows) {
  const groups = []; const activities = new Map(); const occurrences = new Map()
  for (const row of projectedRows) {
    const activityId = row.observation.activity_id
    if (activityId !== undefined) {
      let group = activities.get(activityId)
      if (!group) {
        group = { key: `activity:${activityId}`, activityId, rows: [] }
        activities.set(activityId, group)
        groups.push(group)
      }
      group.rows.push(row)
    } else {
      const id = row.observation.id
      const occurrence = occurrences.get(id) ?? 0
      occurrences.set(id, occurrence + 1)
      groups.push({ key: `decision:${id}:${occurrence}`, rows: [row] })
    }
  }
  return groups
}

/** Counts describe only these loaded observations, never the server's complete pending history. */
export function selectInboxRows (projectedRows, limit = 6) {
  const maximum = Number.isSafeInteger(limit) && limit >= 0 ? limit : 6
  const pending = projectedRows.filter(row => row.model.phase === 'pending' || row.model.phase === 'waiting_system_prompt')
  const rows = pending.slice(0, maximum)
  return { rows, pendingObserved: pending.length, hiddenPending: pending.length - rows.length }
}
