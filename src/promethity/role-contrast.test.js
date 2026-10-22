// @vitest-environment node
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadRoleSources, evaluatePairs, resolveColor, ROLE_MAP, MODES, PAIRINGS } from '../../../kubo/mcp/ui/tests/helpers/role-contrast.mjs'

const webui = join(dirname(fileURLToPath(import.meta.url)), '../..')
let sources
beforeAll(async () => { sources = await loadRoleSources({ webui, kubo: join(webui, '../kubo') }) })

describe('WebUI role contrast uses the shared immutable-source matrix', () => {
  test.each(MODES)('$id checks every intended foreground/background pair', mode => {
    const values = sources.hosts.webui.modes[mode.id]
    expect(evaluatePairs(values)).toHaveLength(PAIRINGS.length)
    for (const role of Object.keys(ROLE_MAP)) expect(resolveColor(values, role)).toBe(resolveColor(sources.hosts.shared.modes[mode.id], role))
  })
  test('negative controls fail for actual low contrast and unresolved tokens', () => {
    const values = sources.hosts.webui.modes.dark
    expect(() => evaluatePairs({ ...values, '--text-muted': values['--ground'] })).toThrow('below 4.5')
    expect(() => resolveColor({ ...values, '--role-text': 'var(--unknown)' }, '--role-text')).toThrow('Unresolved token')
  })
})
