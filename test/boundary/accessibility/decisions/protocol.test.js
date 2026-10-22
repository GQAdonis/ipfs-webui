// @vitest-environment node
import assert from 'node:assert/strict'
import { describe, expect, it } from 'vitest'
import { assertNegativeObservation, loopbackEndpoint } from './lease.mjs'
import { assertExecutedReport } from './units.mjs'

const ctx = { assert: (condition, message) => assert(condition, message) }
describe('decision final-boundary evidence refuses absent or contradictory execution', () => {
  it('rejects remote, default, credential-bearing and query-bearing lease endpoints', () => {
    for (const url of ['https://127.0.0.1:19001/agui', 'http://example.com:19001/agui', 'http://127.0.0.1:5001', 'http://owner:secret@127.0.0.1:19001', 'http://127.0.0.1:19001?token=secret']) expect(() => loopbackEndpoint(url)).toThrow()
    expect(loopbackEndpoint('http://127.0.0.1:19001/agui').pathname).toBe('/agui')
  })
  it('a rejected HTTP answer still fails if actual handler or RPC state changes', () => {
    const value = { kind: 'different_subject', http_status: 403, invocations_before: 0, invocations_after: 0, rpc_mutations_before: 0, rpc_mutations_after: 0, pinned_before: false, pinned_after: false }
    expect(() => assertNegativeObservation(ctx, value, value.kind)).not.toThrow()
    for (const change of [{ invocations_after: 1 }, { rpc_mutations_after: 1 }, { pinned_after: true }, { http_status: 200 }, { kind: 'wrong_session' }]) expect(() => assertNegativeObservation(ctx, { ...value, ...change }, value.kind)).toThrow()
  })
  it('a generic PASS, skipped file or empty assertion list cannot prove focused fixtures ran', () => {
    const file = 'tests/actual.test.ts'
    const result = { success: true, numPassedTests: 1, numTotalTests: 1, numFailedTests: 0, numPendingTests: 0, numTodoTests: 0, numPendingTestSuites: 0, testResults: [{ name: `/checkout/${file}`, status: 'passed', assertionResults: [{ status: 'passed' }] }] }
    expect(() => assertExecutedReport(ctx, result, [file])).not.toThrow()
    for (const change of [{ success: false }, { numPendingTests: 1 }, { numTodoTests: 1 }, { testResults: [] }, { testResults: [{ name: `/checkout/${file}`, status: 'passed', assertionResults: [] }] }]) expect(() => assertExecutedReport(ctx, { ...result, ...change }, [file])).toThrow()
    expect(() => assertExecutedReport(ctx, { status: 'PASS' }, [file])).toThrow()
  })
})
