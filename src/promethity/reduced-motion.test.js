// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'
import postcss from 'postcss'
import { expect, it } from 'vitest'

const root = join(import.meta.dirname, '../..')
const read = path => readFileSync(join(root, path), 'utf8')
const utilityRules = (source, includes) => {
  const rules = []
  postcss.parse(source).walkRules(rule => { if (includes(rule.selector)) rules.push(rule.toString()) })
  return rules.join('\n')
}

it('keeps legacy Settings and body-portalled tour motion normally and suppresses it only under the reduced preference', () => {
  const utilities = utilityRules(read('node_modules/ipfs-css/ipfs.css'), selector => selector === '.transition-all') +
    utilityRules(read('node_modules/tachyons/css/tachyons.css'), selector => selector.split(',').some(part => part.trim().startsWith('.link')))
  const preference = postcss.parse(read('src/promethity/theme-overrides.css')).nodes.filter(node => node.type === 'atrule' && node.name === 'media' && node.params === '(prefers-reduced-motion: reduce)')
  expect(preference).toHaveLength(1)
  const reducedRules = preference[0].nodes.map(node => node.toString()).join('\n')
  const loader = read('node_modules/react-joyride/dist/index.mjs').match(/animation: "(joyride-loader-spin [^"]+)"/)[1]
  const tourRule = `.react-joyride__loader > div { animation: ${loader}; }`
  const controls = '<div id="root"><button class="Button transition-all" id="local-gateway-submit-button">Save</button><a class="link blue" href="#/files">Files</a></div><dialog class="webui-overlay"><button class="Button transition-all">Close</button></dialog><div id="react-joyride-portal"><div class="react-joyride__loader"><div data-spinner></div></div></div>'
  // jsdom has no media preference evaluator or reliable cross-stylesheet cache
  // invalidation. Each fresh document receives the real applicable rules. The
  // unchanged Electron host assertion verifies live preference matching itself.
  for (const reduced of [false, true, false]) {
    const dom = new JSDOM(`<style>${utilities}\n${tourRule}\n${reduced ? reducedRules : ''}</style>${controls}`)
    try {
      const { document } = dom.window
      if (reduced) {
        for (const control of document.querySelectorAll('button,a,[data-spinner]')) {
          expect(dom.window.getComputedStyle(control).transition).toBe('none')
          expect(dom.window.getComputedStyle(control).animation).toBe('none')
        }
      } else {
        expect(dom.window.getComputedStyle(document.querySelector('#local-gateway-submit-button')).transition).toMatch(/\.2s/)
        expect(dom.window.getComputedStyle(document.querySelector('a')).transition).toMatch(/\.15s/)
        expect(dom.window.getComputedStyle(document.querySelector('[data-spinner]')).animation).toBe(loader)
      }
    } finally { dom.window.close() }
  }
})
