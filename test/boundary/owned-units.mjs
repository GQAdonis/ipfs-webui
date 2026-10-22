import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { assertExecutedReport } from './accessibility/decisions/units.mjs'
/** Supplemental regression evidence; never promoted to a live backend/host result. */
export async function runOwnedUnits (ctx, files) {
  const reportPath = join(ctx.directory, `${ctx.scenario}-${ctx.slot}-owned-units.json`)
  const inputs = await Promise.all(files.map(async path => ({ path, sha256: sha256(await readFile(join(ctx.root, path))) })))
  const command = await ctx.processes.run(process.execPath, [join(ctx.root, 'node_modules/vitest/vitest.mjs'), 'run', ...files, '--reporter=json', `--outputFile=${reportPath}`], { cwd: ctx.root, env: ctx.env, label: `${ctx.scenario}-${ctx.slot}-frontend-regressions`, timeout: 240000 })
  const bytes = await readFile(reportPath), report = JSON.parse(bytes)
  assertExecutedReport(ctx, report, files)
  await ctx.attach(reportPath)
  await ctx.record('owned-regression-binding', { kind: 'supplemental-component-unit', inputs, command: { argv: command.argv, cwd: command.cwd, pid: command.pid, exitCode: command.exitCode }, reportSha256: sha256(bytes) })
}
