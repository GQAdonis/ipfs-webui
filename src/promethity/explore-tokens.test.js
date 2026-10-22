import { fileURLToPath as testFileURLToPath } from 'node:url'
import path, { dirname as testDirname } from 'node:path'
import fs from 'node:fs'
import { EXPLORE_TOKEN_VARS } from './explore-tokens.js'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

const root = path.resolve(__dirname, '..', '..')
const overrides = fs.readFileSync(path.join(root, 'src/promethity/theme-overrides.css'), 'utf8')

describe('Explore token-level theming (webui-route-polish 1.3)', () => {
  it('sets only token references, never a colour literal', () => {
    for (const [name, value] of Object.entries(EXPLORE_TOKEN_VARS)) {
      expect(name).toMatch(/^--explore-/)
      expect(value).toMatch(/^var\(--[a-z-]+\)$/)
    }
  })

  it('is read by the seam rules, each with a token fallback', () => {
    for (const name of Object.keys(EXPLORE_TOKEN_VARS)) {
      expect(overrides).toContain(`var(${name}, var(--`)
    }
  })

  it('leaves the explorer package at its pinned range and unpatched', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
    expect(pkg.dependencies['ipld-explorer-components']).toBeDefined()
    expect(fs.existsSync(path.join(root, 'patches'))
      ? fs.readdirSync(path.join(root, 'patches')).filter((f) => f.startsWith('ipld-explorer-components'))
      : []).toEqual([])
  })
})
