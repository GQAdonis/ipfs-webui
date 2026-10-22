// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { groupDecisionActivity, projectDecisionRows, selectInboxRows } from './decision-display.js'

const fixture = name => JSON.parse(readFileSync(resolve(import.meta.dirname, '../../../kubo/mcp/contract/confirmation/examples/DecisionObservation', name), 'utf8'))
const clone = value => JSON.parse(JSON.stringify(value))
const pendingFixture = fixture('activity-pending.json')
const nativeFixture = fixture('native-deny-only.json')
const successFixture = fixture('node-success.json')
const nowIso = '2026-10-20T12:00:01Z'
const surface = { kind: 'inbox', instance: 'inbox_fixture_1' }
const pending = (suffix, extra = {}) => ({ ...clone(pendingFixture), id: `cf_pending_fixture_${suffix}`, ...extra })
const project = observations => projectDecisionRows(observations, { nowIso, surface })

describe('strict readonly decision display projection', () => {
  it('retains input order and only canonical observations, without trusting a supplied model', () => {
    const first = pending('one'); const second = pending('two')
    const rows = project([first, { ...pending('bad'), model: { phase: 'committed' } }, second])
    expect(rows.map(row => row.observation.id)).toEqual([first.id, second.id])
    expect(rows.map(row => row.model.phase)).toEqual(['pending', 'pending'])
    expect(rows[0].observation).not.toBe(first)
    expect(rows[0].observation).not.toHaveProperty('model')
    expect(first).toEqual(pending('one'))
  })

  it('drops malformed execution rather than using the compatibility model with execution removed', () => {
    expect(project([{ ...pending('invalid'), execution: { state: 'succeeded' } }])).toEqual([])
  })

  it('never turns advertised actions or caller authorization into executable capability', () => {
    const observation = pending('authorized', {
      expires_at: '2026-10-20T13:00:00Z',
      effect_digest: `sha256:${'a'.repeat(64)}`,
      actions: { approve: true, deny: true, authorized_surface: 'owned_chat', continuation: { method: 'POST', route: '/agui', thread_id: 'thread_fixture_1', interrupt_id: 'interrupt_fixture_1' } }
    })
    const rows = projectDecisionRows([observation], {
      nowIso,
      surface,
      authorization: { confirmationId: observation.id, tool: observation.summary.tool, source: observation.source, authority: observation.authority.kind, resolver: 'agui-interrupt', effectDigest: observation.effect_digest, threadId: 'thread_fixture_1', interruptId: 'interrupt_fixture_1', open: true, canApprove: true, canDeny: true },
      model: { phase: 'committed' },
      toolResultMeta: { forged: true },
      reviewedEffectDigest: 'changed'
    })
    expect(rows).toHaveLength(1)
    expect(rows[0].model.phase).toBe('pending')
    expect(rows[0].model.capabilities).toEqual({ approve: false, deny: false })
  })

  it('uses only current time/surface for truthful expiration and resolved-elsewhere display', () => {
    const expired = pending('expired', { expires_at: '2026-10-20T12:00:00Z' })
    const approved = { ...clone(successFixture), approval_state: 'approved', resolved_at: '2026-10-20T12:00:00Z' }
    delete approved.execution
    expect(project([expired])[0].model.phase).toBe('expired')
    expect(project([approved])[0].model.phase).toBe('resolved_elsewhere')
  })

  it('distinguishes valid receipt-backed completion from approval with no execution evidence', () => {
    const approved = { ...clone(successFixture), approval_state: 'approved' }
    delete approved.execution
    delete approved.resolved_surface
    const rows = project([successFixture, approved])
    expect(rows.map(row => row.model.phase)).toEqual(['committed', 'approved'])
    expect(rows[1].model.execution).toBeUndefined()
  })

  it('accepts an empty or absent observed list without fabricating rows', () => {
    expect(projectDecisionRows()).toEqual([])
    expect(project([])).toEqual([])
  })
})

describe('activity grouping reports only actual activity IDs', () => {
  it('groups interleaved reported activity in first-seen order while preserving per-group row order', () => {
    const rows = project([pending('one'), pending('two', { activity_id: 'act_fixture_other' }), pending('three')])
    const groups = groupDecisionActivity(rows)
    expect(groups.map(group => group.activityId)).toEqual(['act_fixture_01', 'act_fixture_other'])
    expect(groups[0].rows).toEqual([rows[0], rows[2]])
    expect(groups[1].rows).toEqual([rows[1]])
    expect(rows.map(row => row.observation.id)).toEqual(['cf_pending_fixture_one', 'cf_pending_fixture_two', 'cf_pending_fixture_three'])
  })

  it('keeps unreported decisions separate even with matching summary, source and thread-like fields', () => {
    const first = pending('one'); const second = pending('two')
    delete first.activity_id; delete second.activity_id
    const rows = project([first, second])
    const groups = groupDecisionActivity(rows)
    expect(groups).toHaveLength(2)
    expect(groups.every(group => !Object.hasOwn(group, 'activityId'))).toBe(true)
    expect(groups.map(group => group.rows)).toEqual([[rows[0]], [rows[1]]])
    expect(new Set(groups.map(group => group.key)).size).toBe(2)
    expect(groupDecisionActivity(rows).map(group => group.key)).toEqual(groups.map(group => group.key))
  })

  it('uses collision-free local keys for repeated unreported rows without inventing activity', () => {
    const observation = pending('one'); delete observation.activity_id
    const rows = project([observation, observation])
    const groups = groupDecisionActivity(rows)
    expect(groups).toHaveLength(2)
    expect(groups[0].key).not.toBe(groups[1].key)
    expect(groups.every(group => !Object.hasOwn(group, 'activityId'))).toBe(true)
    expect(groupDecisionActivity([])).toEqual([])
  })
})

describe('Inbox limits loaded pending observations only', () => {
  it('includes both approval and system-prompt pending phases in input order, excluding terminal/approved states', () => {
    const native = clone(nativeFixture)
    // This canonical fixture is pending; its native prompt can never be approved by a display helper.
    const rows = project([successFixture, pending('one'), native, pending('expired', { expires_at: '2026-10-20T12:00:00Z' })])
    const selected = selectInboxRows(rows)
    expect(selected.rows.map(row => row.model.phase)).toEqual(['pending', 'waiting_system_prompt'])
    expect(selected).toMatchObject({ pendingObserved: 2, hiddenPending: 0 })
    expect(selected.rows[1].model.capabilities.approve).toBe(false)
  })

  it('limits to six rows by default and discloses additional loaded pending rows only', () => {
    const rows = project(Array.from({ length: 9 }, (_, index) => pending(String(index))))
    const selected = selectInboxRows(rows)
    expect(selected.rows).toEqual(rows.slice(0, 6))
    expect(selected).toMatchObject({ pendingObserved: 9, hiddenPending: 3 })
    expect(selected).not.toHaveProperty('total')
    expect(rows).toHaveLength(9)
  })

  it('supports zero/custom limits and empty projections without inferring remote counts', () => {
    const rows = project([pending('one'), pending('two')])
    expect(selectInboxRows(rows, 0)).toEqual({ rows: [], pendingObserved: 2, hiddenPending: 2 })
    expect(selectInboxRows(rows, 1)).toEqual({ rows: [rows[0]], pendingObserved: 2, hiddenPending: 1 })
    expect(selectInboxRows([], 1)).toEqual({ rows: [], pendingObserved: 0, hiddenPending: 0 })
  })

  it.each([-1, NaN, Infinity, 1.5])('falls back to the bounded default for invalid limit %s', limit => {
    const rows = project(Array.from({ length: 8 }, (_, index) => pending(String(index))))
    expect(selectInboxRows(rows, limit)).toEqual({ rows: rows.slice(0, 6), pendingObserved: 8, hiddenPending: 2 })
  })
})
