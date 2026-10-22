// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { buildEnvironment, environmentDefines } from './build-environment.js'
import { stripIpfsCssFonts } from './strip-ipfs-css-fonts.js'
import { stripTachyonsIeClearfix } from './strip-tachyons-ie-clearfix.js'
import { legacyJsx } from './vite-legacy-jsx.js'
import { extensionAlias } from './vite-extension-alias.js'

describe('static Web UI tooling contract', () => {
  it('removes only the pinned Tachyons IE clearfix hack', async () => {
    const input = '.cf:before,.cf:after{content:" ";display:table}.cf:after{clear:both}.cf{*zoom:1;zoom:1;color:inherit}.other{*zoom:1}.cf{*zoom:2}'
    const result = await postcss([stripTachyonsIeClearfix()]).process(input, { from: '/fixture/node_modules/tachyons/css/tachyons.css' })
    expect(result.css).toContain('.cf:before,.cf:after{content:" ";display:table}')
    expect(result.css).toContain('.cf:after{clear:both}')
    expect(result.css).toContain('.cf{zoom:1;color:inherit}')
    expect(result.css).toContain('.other{*zoom:1}')
    expect(result.css).toContain('.cf{*zoom:2}')
    for (const from of ['/fixture/src/app.css', '/fixture/node_modules/other/css/tachyons.css']) {
      const unrelated = await postcss([stripTachyonsIeClearfix()]).process(input, { from })
      expect(unrelated.css).toBe(input)
    }
  })

  it('exposes only the allowlisted public build metadata', () => {
    const values = buildEnvironment({ REACT_APP_GIT_REV: 'fixture', PRIVATE_TOKEN: 'never-emit', REACT_APP_UNEXPECTED_SECRET: 'never-emit' }, 'production')
    expect(values.REACT_APP_GIT_REV).toBe('fixture')
    expect(values.PUBLIC_URL).toBe('.')
    expect(JSON.stringify(environmentDefines(values))).not.toContain('never-emit')
    expect(values.NODE_ENV).toBe('production')
  })

  it('removes unused ipfs-css faces and preserves local brand faces', async () => {
    const input = '@font-face { font-family: Inter; src: url(unused.woff2) } .flex { display: flex }'
    const upstream = await postcss([stripIpfsCssFonts()]).process(input, { from: '/fixture/node_modules/ipfs-css/ipfs.css' })
    expect(upstream.css).not.toContain('unused.woff2')
    expect(upstream.css).toContain('.flex')
    const local = await postcss([stripIpfsCssFonts()]).process(input, { from: '/fixture/src/promethity/fonts.css' })
    expect(local.css).toContain('@font-face')
    const plain = await postcss([stripIpfsCssFonts()]).process('.plain { color: inherit }', { from: '/fixture/plain.css' })
    expect(plain.css).toContain('.plain')
  })

  it('handles legacy .js JSX before import analysis', async () => {
    const result = await legacyJsx().transform('export default () => <button>Open files</button>', '/fixture/src/Fixture.js')
    expect(result.code).toContain('react/jsx-runtime')
    expect(result.code).not.toContain('<button>')
    expect(await legacyJsx().transform('export default 1', '/fixture/node_modules/dependency/index.js')).toBeNull()
  })

  it('resolves migrated extensions without shadowing existing JavaScript', () => {
    const directory = mkdtempSync(join(tmpdir(), 'webui-extension-'))
    try {
      writeFileSync(join(directory, 'Component.tsx'), 'export default null')
      const plugin = extensionAlias()
      expect(plugin.resolveId('./Component.js', join(directory, 'importer.js'))).toBe(join(directory, 'Component.tsx'))
      writeFileSync(join(directory, 'Component.js'), 'export default null')
      expect(plugin.resolveId('./Component.js', join(directory, 'importer.js'))).toBeNull()
      expect(plugin.resolveId('package.js', join(directory, 'importer.js'))).toBeNull()
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
