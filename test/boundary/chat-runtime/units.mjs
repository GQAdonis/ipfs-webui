import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../../scripts/local-artifact.mjs'

/** Executable supplemental cases; these never stand in for a real backend or browser result. */
export async function focusedUnits (ctx, packageName, files, label) {
  const root = packageName === 'webui' ? ctx.root : join(ctx.kubo, 'mcp', packageName)
  const inputs = await Promise.all(files.map(async path => ({ path, sha256: sha256(await readFile(join(root, path))) })))
  const output = join(ctx.directory, `${label}-vitest.json`)
  const command = await ctx.processes.run(process.execPath, [join(root, 'node_modules/vitest/vitest.mjs'), 'run', ...files, '--reporter=json', `--outputFile=${output}`], { cwd: root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}-${label}`, timeout: 240000 })
  const bytes = await readFile(output), report = JSON.parse(bytes)
  ctx.assert(report.success === true && report.numPassedTests > 0 && report.numPassedTests === report.numTotalTests && report.numFailedTests === 0 && report.numPendingTests === 0 && report.numTodoTests === 0 && report.numPendingTestSuites === 0, 'All named supplemental fixture assertions executed without skipped/todo coverage')
  for (const file of files) {
    const suites = report.testResults.filter(value => value.name.replaceAll('\\', '/').endsWith(`/${file}`))
    ctx.assert(suites.length === 1 && suites[0].status === 'passed' && suites[0].assertionResults.length > 0 && suites[0].assertionResults.every(value => value.status === 'passed'), `Actual assertions executed: ${packageName}/${file}`)
  }
  for (const input of inputs) ctx.assert(sha256(await readFile(join(root, input.path))) === input.sha256, 'Executed source remains current')
  await ctx.attach(output)
  await ctx.record(label, { kind: 'supplemental-component-fixtures', inputs, reporterSha256: sha256(bytes), command: { argv: command.argv, cwd: command.cwd, exitCode: command.exitCode }, counts: { passed: report.numPassedTests, total: report.numTotalTests } })
}
