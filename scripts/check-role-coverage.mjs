import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkRoleCoverage } from './role-coverage.mjs'

const args = process.argv.slice(2)
let root = resolve(dirname(fileURLToPath(import.meta.url)), '..'); let output
for (let index = 0; index < args.length; index++) {
  if (args[index] === '--root' && args[index + 1]) root = resolve(args[++index])
  else if (args[index] === '--json' && args[index + 1]) output = resolve(args[++index])
  else throw new Error(`Unknown/incomplete role-coverage argument: ${args[index]}`)
}
const report = await checkRoleCoverage(root)
const bytes = JSON.stringify(report, null, 2) + '\n'
if (output) await writeFile(output, bytes)
process.stdout.write(bytes)
process.exitCode = report.ok ? 0 : 1
