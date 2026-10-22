// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { assertLocalFontRequests, declaredSharedFaces, declaredWebuiFaces } from './local-fonts.mjs'

describe('local font proof fails closed', () => {
  it('requires relative WOFF2 faces with the existing fallback range', () => {
    const css = "@font-face { font-family:'Hanken Grotesk';font-weight:400;font-style:normal;src:url('./fonts/body.woff2') format('woff2');unicode-range:U+0000-00FF; }"
    expect(declaredWebuiFaces(css)).toHaveLength(1)
    expect(() => declaredWebuiFaces(css.replace('./fonts/body.woff2', 'https://fonts.invalid/body.woff2'))).toThrow('bundled relative')
    expect(() => declaredWebuiFaces('/* no faces */')).toThrow('No font')
    expect(() => declaredWebuiFaces(css.replace('unicode-range:U+0000-00FF;', ''))).toThrow('fallback range')
  })
  it('rejects external, missing, query-bearing and other-CID font request evidence', () => {
    const base = 'http://127.0.0.1:19090/ipfs/fixture/webui/'
    expect(() => assertLocalFontRequests([{ url: `${base}assets/body.woff2` }], base)).not.toThrow()
    for (const requests of [[], [{ url: 'https://fonts.invalid/body.woff2' }], [{ url: `${base}assets/body.woff2?token=omitted` }], [{ url: 'http://127.0.0.1:19090/ipfs/other/body.woff2' }]]) expect(() => assertLocalFontRequests(requests, base)).toThrow()
  })
  it('requires every shared descriptor to name an actual bundled import', () => {
    const source = "import body from '../../fonts/body.woff2?inline';\n{ family: 'IPFS UI Hanken Grotesk', weight: '400', dataUri: body }"
    expect(declaredSharedFaces(source)).toHaveLength(1)
    expect(() => declaredSharedFaces(source.replace('dataUri: body', 'dataUri: absent'))).toThrow('actual bundled')
    expect(() => declaredSharedFaces('')).toThrow('Every shared')
  })
})
