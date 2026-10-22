import { assertExplorerFreshness } from './freshness.mjs'

try {
  console.log(JSON.stringify(await assertExplorerFreshness()))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
