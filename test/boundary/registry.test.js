// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { adoptedIdentity, adoptedContractSha256, contractRelativePath, aggregate, requirements, validateRegistrations } from './requirements.mjs'
import { isolatedEnvironment } from './processes.mjs'
import { laneSlots, slotKey } from './evidence-schema.mjs'

describe('final boundary fail-closed registration', () => {
  it('binds all eighteen adopted scenarios to the exact current contract bytes and retained run identity', () => {
    expect(Object.keys(requirements)).toEqual(Array.from({ length: 18 }, (_, index) => `UI-${101 + index}`))
    expect(adoptedIdentity.phaseId).toBe('agentic-ui-frontend')
    expect(adoptedIdentity.runId).toBe('agentic-ui-implementation-20261020T225138Z')
    expect(adoptedContractSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(contractRelativePath).toBe('.kbd-orchestrator/phases/agentic-ui-frontend/adopted-contract.json')
  })
  it('cannot treat absent, skipped or partially blocked coverage as PASS', () => {
    expect(aggregate([])).toBe('BLOCKED')
    expect(aggregate([{ status: 'PASS' }, { status: 'BLOCKED' }])).toBe('BLOCKED')
    expect(aggregate([{ status: 'PASS' }, { status: 'NOT_EXERCISED' }])).toBe('NOT_EXERCISED')
    expect(aggregate([{ status: 'PASS' }, { status: 'skipped' }])).toBe('BLOCKED')
    expect(aggregate([{ status: 'FAIL' }, { status: 'BLOCKED' }])).toBe('FAIL')
  })
  it('rejects duplicate and unknown oracle slots rather than silently replacing an assertion', () => {
    const scenarios = Object.keys(requirements).map(id => ({ id }))
    const entry = { scenario: 'UI-111', id: 'builtin-read-approve-deny', requires: ['builtin'], run () {} }
    expect(() => validateRegistrations([{ ...entry, requires: ['backend-maintenance'] }], scenarios)).toThrow('Unknown boundary collaborator')
    expect(() => validateRegistrations([entry, entry], scenarios)).toThrow('Duplicate')
    expect(() => validateRegistrations([{ ...entry, id: 'mock-provider-pass' }], scenarios)).toThrow('Unknown')
    expect(() => validateRegistrations([entry], [...scenarios, { id: 'UI-999' }])).toThrow('no assertion')
  })
  it('uses explicit owned IPFS_PATH, binary precedence and telemetry opt-outs without copying service credentials', () => {
    const env = isolatedEnvironment('/owned/scratch/repo', '/owned/kubo')
    expect(env.IPFS_PATH).toBe('/owned/scratch/repo')
    expect(env.PATH.startsWith('/owned/kubo/cmd/ipfs:')).toBe(true)
    expect(env.IPFS_TELEMETRY).toBe('off')
    expect(env.DO_NOT_TRACK).toBe('1')
    expect(env).not.toHaveProperty('OPENAI_API_KEY')
    expect(env).not.toHaveProperty('IPFS_API_URL')
  })
  it('requires separate Desktop runtime/accessibility observations rather than substituting WebUI results', () => {
    const webui = laneSlots('WU')
    const desktop = laneSlots('SU')
    expect(webui.some(slot => slot.scenario === 'UI-110')).toBe(false)
    expect(desktop.filter(slot => slot.scenario === 'UI-112')).toHaveLength(4)
    expect(webui.some(slot => slot.id === 'desktop-shell-overlays')).toBe(false)
    expect(desktop).toContainEqual({ scenario: 'UI-118', id: 'desktop-shell-overlays', host: 'desktop' })
    expect(desktop).toHaveLength(10)
    expect(desktop).toContainEqual({ scenario: 'UI-101', id: 'react-runtime', host: 'desktop' })
    const keys = [...webui, ...desktop].map(slotKey)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
