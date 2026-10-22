import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const executable = process.platform === 'win32' ? 'lol.cmd' : 'lol'
const result = spawnSync(executable, ['public/locales'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' })
if (result.error) throw result.error
if (result.status !== 0) throw new Error(`Locale generation failed (${result.status}): ${result.stderr}`)
JSON.parse(result.stdout)
writeFileSync(new URL('../src/lib/languages.json', import.meta.url), result.stdout)
