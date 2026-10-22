import { fileURLToPath as testFileURLToPath } from 'node:url'
import { dirname as testDirname, join } from 'node:path'
// agent-chat-island-integration 1.4: the vendored island in public/agent-chat/ is exactly what
// MANIFEST.json records, and the manifest names every file in the folder.

import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

const dir = join(__dirname, '../../public/agent-chat')
const manifest = JSON.parse(readFileSync(join(dir, 'MANIFEST.json'), 'utf8'))
const sha256 = (file) => createHash('sha256').update(readFileSync(join(dir, file))).digest('hex')

describe('vendored island', () => {
  it('matches the hashes in MANIFEST.json', () => {
    for (const [file, hash] of Object.entries(manifest.files)) expect([file, sha256(file)]).toEqual([file, hash])
  })

  it('holds no file the manifest does not name', () => {
    const present = [...readdirSync(dir).filter((n) => n.endsWith('.js')), ...readdirSync(join(dir, 'chunks')).map((n) => `chunks/${n}`)].sort()
    expect(present).toEqual(Object.keys(manifest.files).sort())
  })

  it('carries the pick-a-model state and the settings link', () => {
    const mount = Object.keys(manifest.files).find((f) => f.startsWith('chunks/mount-'))
    const code = readFileSync(join(dir, mount), 'utf8')
    expect(code).toContain('Choose a backend to start')
    expect(code).toContain('#/settings/agent')
  })
})
