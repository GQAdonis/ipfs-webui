import { fileURLToPath as testFileURLToPath } from 'node:url'
import path, { dirname as testDirname } from 'node:path'
// webui-titles-and-copy 1.1: document titles compose from brand.js, and no
// page hard-codes a product suffix.

import fs from 'node:fs'
import { titleWithBrand } from './page-title.js'
import { BRAND } from './brand.js'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

it('appends the brand name as the product suffix', () => {
  expect(titleWithBrand('Status')).toBe(`Status | ${BRAND.name}`)
})

it('joins sections most specific first and skips empty parts', () => {
  expect(titleWithBrand('/', 'Files', null, undefined, false)).toBe(`/ | Files | ${BRAND.name}`)
})

it('drops a legacy "| IPFS" suffix carried by a translated title', () => {
  expect(titleWithBrand('Bienvenue | IPFS')).toBe(`Bienvenue | ${BRAND.name}`)
})

it('names the brand alone when there is no page part', () => {
  expect(titleWithBrand()).toBe(BRAND.name)
})

describe('page sources carry no hard-coded product suffix', () => {
  const root = path.join(__dirname, '..')
  const pages = [
    'settings/SettingsPage.js',
    'settings/AnalyticsPage.js',
    'status/StatusPage.js',
    'diagnostics/diagnostics-page.tsx',
    'peers/PeersPage.js',
    'files/FilesPage.js',
    'welcome/WelcomePage.js'
  ]
  it.each(pages)('%s composes its title with titleWithBrand', (file) => {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    expect(source).toContain('titleWithBrand(')
    expect(source).not.toMatch(/\|\s*IPFS\s*</)
    expect(source).not.toMatch(/push\('IPFS'\)/)
  })
})
