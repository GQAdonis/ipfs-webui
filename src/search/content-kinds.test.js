import { fileURLToPath as testFileURLToPath } from 'node:url'
import { dirname as testDirname } from 'node:path'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { KINDS, SOURCES, PROVENANCE_KEY } from './content-kinds.js'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

// The kubo checkout normally sits beside this repository. When it does, the lists here must
// match the contract; when it does not (CI of this fork alone), the comparison is skipped.
const CONTRACT = join(__dirname, '../../../kubo/mcp/contract')
const maybe = existsSync(join(CONTRACT, 'derivations/content-kinds.json')) ? it : it.skip

describe('content kinds', () => {
  maybe('lists the kinds of derivations/content-kinds.json', () => {
    const kinds = JSON.parse(readFileSync(join(CONTRACT, 'derivations/content-kinds.json'), 'utf8')).kinds
    expect([...KINDS].sort()).toEqual(Object.keys(kinds).sort())
  })

  maybe('lists the sources the stages stamp and the search input accepts', () => {
    const kinds = JSON.parse(readFileSync(join(CONTRACT, 'derivations/content-kinds.json'), 'utf8')).kinds
    const stamped = new Set(Object.values(kinds).flatMap((k) => k.stages.map((s) => s.source)))
    expect([...SOURCES].sort()).toEqual([...stamped].sort())
    const input = JSON.parse(readFileSync(join(CONTRACT, 'schemas/tools/ipfs_index_search.input.json'), 'utf8'))
    expect([...KINDS]).toEqual(input.properties.kinds.items.enum)
    expect([...SOURCES]).toEqual(input.properties.sources.items.enum)
  })

  it('has a provenance label for every source', () => {
    for (const source of SOURCES) expect(PROVENANCE_KEY[source]).toBeDefined()
  })
})
