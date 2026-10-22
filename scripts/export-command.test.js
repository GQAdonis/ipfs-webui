// @vitest-environment node
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'
import { localExportArgs } from './export-command.mjs'

const execute = promisify(execFile)
it('forwards the standalone boundary export path through actual pnpm without a literal separator', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webui-export-argv-'))
  try {
    const kubo = join(root, 'source with spaces')
    await mkdir(kubo)
    await writeFile(join(root, 'package.json'), JSON.stringify({ private: true, scripts: { 'export:local': 'node capture.cjs' } }))
    await writeFile(join(root, 'capture.cjs'), "require('node:fs').writeFileSync('argv.json', JSON.stringify(process.argv.slice(2)))")
    await execute(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', localExportArgs(kubo), { cwd: root, env: { ...process.env, COREPACK_ENABLE_AUTO_PIN: '0' }, timeout: 30000 })
    expect(JSON.parse(await readFile(join(root, 'argv.json'), 'utf8'))).toEqual(['--kubo', kubo])
  } finally { await rm(root, { recursive: true, force: true }) }
})
