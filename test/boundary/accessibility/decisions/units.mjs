import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../../../scripts/local-artifact.mjs'

export const DECISION_UNIT_FILES = Object.freeze({
  ui: ['tests/approval-presentations.test.tsx', 'tests/decision-model.test.ts', 'tests/decision-card-fields.test.tsx', 'tests/fresh-proposal.test.tsx'],
  app: ['tests/core/decision.test.ts', 'tests/ui/decision-outcomes.test.tsx', 'tests/host/decision-delivery.integration.test.tsx', 'tests/ui/fresh-proposal.test.tsx']
})
export function assertExecutedReport (ctx, report, files) {
  ctx.assert(report.success === true && report.numPassedTests > 0 && report.numPassedTests === report.numTotalTests && report.numFailedTests === 0 && report.numPendingTests === 0 && report.numTodoTests === 0 && report.numPendingTestSuites === 0, 'Focused decision fixtures executed successfully without skipped or todo coverage')
  for (const file of files) {
    const suites = report.testResults.filter(result => result.name.replaceAll('\\', '/').endsWith(`/${file}`))
    ctx.assert(suites.length === 1 && suites[0].status === 'passed' && suites[0].assertionResults.length > 0 && suites[0].assertionResults.every(item => item.status === 'passed'), `Actual assertions ran in the current fixture: ${file}`)
  }
}
/** Supplemental component/model proof; never substitutes for the actual handler/RPC oracle. */
export async function runDecisionUnits (ctx) {
  for (const [name, files] of Object.entries(DECISION_UNIT_FILES)) {
    const root = join(ctx.kubo, 'mcp', name), reporter = join(ctx.directory, `decision-${name}-vitest.json`)
    const inputs = await Promise.all(files.map(async path => ({ path, sha256: sha256(await readFile(join(root, path))) })))
    const command = await ctx.processes.run(process.execPath, [join(root, 'node_modules/vitest/vitest.mjs'), 'run', ...files, '--reporter=json', `--outputFile=${reporter}`], {
      cwd: root, env: { ...ctx.env, COREPACK_ENABLE_AUTO_PIN: '0' }, label: `${ctx.scenario}-${ctx.slot}-${name}-decision-fixtures`, timeout: 180000
    })
    const bytes = await readFile(reporter), report = JSON.parse(bytes)
    assertExecutedReport(ctx, report, files)
    for (const input of inputs) ctx.assert(sha256(await readFile(join(root, input.path))) === input.sha256, `Executed ${name} fixture bytes remain current: ${input.path}`)
    await ctx.record(`decision-${name}-executed-fixtures`, { kind: 'supplemental-component-fixtures', inputs, reporter: { path: reporter, sha256: sha256(bytes) }, command: { argv: command.argv, cwd: command.cwd, pid: command.pid, exitCode: command.exitCode }, results: report })
  }
}
