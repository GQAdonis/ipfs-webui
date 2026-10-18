/* global describe, it, expect */
// M4 of the group 3 UI review (WCAG 2.2 SC 2.4.7): the keyboard ring has to show on accent-filled buttons.
// reset.css's `button:not(.default):focus-visible` (0,2,1) outranks `.Button:focus-visible` (0,2,0), and its
// -1px offset pulled the accent ring flush against the accent fill. jsdom does not compute the cascade
// across files, so this pins the sources: one offset, the two-tone halo, and no inside offset on buttons.
import fs from 'node:fs'
import path from 'node:path'

const read = (rel) => fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')
const rule = (css, selector) => {
  const start = css.indexOf(selector + ' {')
  expect(start).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('focus ring on filled controls', () => {
  it('defines the halo from the offset and the ground colour', () => {
    expect(read('promethity/tokens.css')).toMatch(/--focus-halo:\s*0 0 0 var\(--focus-ring-offset\) var\(--ground\);/)
  })

  it('applies the same ring, offset and halo in reset.css and button.css, with no inside offset', () => {
    for (const body of [rule(read('reset.css'), 'button:not(.default):focus-visible'), rule(read('components/button/button.css'), '.Button:focus-visible')]) {
      expect(body).toContain('outline: var(--focus-ring)')
      expect(body).toContain('outline-offset: var(--focus-ring-offset)')
      expect(body).toContain('box-shadow: var(--focus-halo)')
      expect(body).not.toMatch(/outline-offset:\s*-/)
    }
  })

  // 3.7: N1 and the reviewer's nits. Selectors carry an extra class or attribute so they outrank (0,2,1).
  it('draws the modal close ring inside the clipped modal, above the reset specificity', () => {
    const body = rule(read('promethity/components.css'), '.prom-modal button.prom-modal-close:focus-visible')
    expect(body).toContain('outline: var(--focus-ring)')
    expect(body).toMatch(/outline-offset:\s*-2px/)
    expect(body).toContain('box-shadow: none')
    expect(read('promethity/components.css')).toMatch(/\.prom-modal \{[^}]*overflow: hidden/)
  })

  it('keeps the resting inset edge of the switch and chips through the halo', () => {
    expect(rule(read('promethity/components/primitives.css'), 'button.pm-switch-track[aria-checked]:focus-visible'))
      .toContain('box-shadow: inset 0 0 0 1px var(--text-muted), var(--focus-halo)')
    const search = read('search/search.css')
    expect(rule(search, '.sr-chips button.sr-chip:focus-visible')).toContain('box-shadow: inset 0 0 0 1px var(--text-muted), var(--focus-halo)')
    expect(rule(search, '.sr-chips button.sr-chip.sr-chip-on:focus-visible')).toContain('box-shadow: inset 0 0 0 1px var(--accent-text), var(--focus-halo)')
  })

  it('removes the halo where the reset removes the outline', () => {
    const reset = read('reset.css')
    for (const sel of ['button.button-inside-focus:focus', 'button.hoverable-button:focus']) {
      const body = rule(reset, sel)
      expect(body).toContain('outline: none')
      expect(body).toContain('box-shadow: none')
    }
  })
})
