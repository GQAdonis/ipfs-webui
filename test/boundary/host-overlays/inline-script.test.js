// @vitest-environment node
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import { inlineClassicScript } from './inline-script.mjs'

const moduleScript = '<script type="module">/* original fixture module */</script>'
const html = `<!doctype html><html><head><title>Host fixture</title></head><body>${moduleScript}<p id="after">After script</p></body></html>`

describe('actual host HTML script embedding', () => {
  it('executes compiled replacement tokens literally without injecting the original module or terminating HTML', () => {
    const values = ['$&/', '$`', "$'", '$1', '</ScRiPt><aside id="escaped-script">Unexpected</aside>']
    const output = inlineClassicScript(html, moduleScript, `globalThis.fixtureValues = ${JSON.stringify(values)};`)
    const dom = new JSDOM(output, { runScripts: 'dangerously' })
    try {
      expect([...dom.window.fixtureValues]).toEqual(values)
      expect(dom.window.document.scripts).toHaveLength(1)
      expect(dom.window.document.querySelector('#escaped-script')).toBeNull()
      expect(dom.window.document.querySelector('#after').textContent).toBe('After script')
      expect(output).not.toContain('/* original fixture module */')
    } finally { dom.window.close() }
  })
  it('refuses a missing or repeated fixture module instead of silently inserting into a different host', () => {
    expect(() => inlineClassicScript('<p>No fixture</p>', moduleScript, 'void 0')).toThrow('one exact')
    expect(() => inlineClassicScript(html + moduleScript, moduleScript, 'void 0')).toThrow('one exact')
  })
})
