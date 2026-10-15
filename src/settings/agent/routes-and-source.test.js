// Structural acceptance checks that read the source: the route is lazy, and the
// admin token never reaches localStorage.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const here = __dirname
const routes = readFileSync(join(here, '../../bundles/routes.js'), 'utf8')

function sources (dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sources(full)
    return /\.js$/.test(name) && !/\.test\.js$/.test(name) ? [full] : []
  })
}
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

describe('route', () => {
  it('registers /settings/agent before /settings* and imports only the lazy wrapper', () => {
    expect(routes.indexOf("'/settings/agent'")).toBeGreaterThan(-1)
    expect(routes.indexOf("'/settings/agent'")).toBeLessThan(routes.indexOf("'/settings*'"))
    const imports = routes.split('\n').filter((l) => l.startsWith('import') && /agent/i.test(l))
    expect(imports).toEqual(["import AgentSettingsPage from '../settings/agent/LoadableAgentSettingsPage.js'"])
    expect(routes).not.toMatch(/\/AgentSettingsPage\.js'/)
  })

  it('loads the page with a dynamic import in the wrapper', () => {
    const wrapper = readFileSync(join(here, 'LoadableAgentSettingsPage.js'), 'utf8')
    expect(wrapper).toMatch(/import\('\.\/AgentSettingsPage\.js'\)/)
  })
})

describe('admin token storage', () => {
  it('never mentions localStorage in the settings page code', () => {
    const offenders = sources(here).filter((f) => /localStorage/.test(stripComments(readFileSync(f, 'utf8'))))
    expect(offenders).toEqual([])
  })

  it('touches sessionStorage in exactly one module', () => {
    const users = sources(here).filter((f) => /sessionStorage/.test(stripComments(readFileSync(f, 'utf8'))))
    expect(users.map((f) => f.replace(here, ''))).toEqual(['/core/admin-token.js'])
  })
})

describe('the Settings page', () => {
  it('no longer renders the old chat and WebMCP boxes', () => {
    const page = readFileSync(join(here, '../SettingsPage.js'), 'utf8')
    expect(page).not.toMatch(/AgentChatSettings|WebMcpSettings/)
    expect(page).toMatch(/AgentSettingsSummary/)
  })
})
