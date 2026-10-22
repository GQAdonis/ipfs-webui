import { fileURLToPath as testFileURLToPath } from 'node:url'
import { dirname as testDirname } from 'node:path'
// Review M1: the launcher's clearance protects every page, not only the ones that read the
// variable themselves. The rules are plain CSS, so the test reads them as text.
import fs from 'fs'
import path from 'path'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

const css = fs.readFileSync(path.join(__dirname, 'launcher.css'), 'utf8')

describe('launcher clearance rules', () => {
  it('pads scrolling by the clearance so a focused control stays visible (2.4.11)', () => {
    expect(css).toMatch(/html\s*{\s*scroll-padding-bottom:\s*var\(--ac-launcher-clearance,\s*0px\)/)
  })
  it('ends the main column with the clearance at both widths', () => {
    expect(css).toMatch(/main\[data-route\]\s*{\s*padding-bottom:\s*calc\(1rem \+ var\(--ac-launcher-clearance,\s*0px\)\)/)
    expect(css).toMatch(/@media \(min-width: 60em\)\s*{\s*main\[data-route\]\s*{\s*padding-bottom:\s*calc\(2rem \+ var\(--ac-launcher-clearance,\s*0px\)\)/)
  })
  it('lets clicks pass through the launcher padding band but not through its controls', () => {
    expect(css).toMatch(/\.ac-launcher\s*{[^}]*pointer-events:\s*none/)
    expect(css).toMatch(/\.ac-launcher\s*>\s*\*\s*{\s*pointer-events:\s*auto/)
  })
  it('falls back to no clearance when the chat is off (variable unset)', () => {
    expect(css).not.toMatch(/--ac-launcher-clearance:\s*\d/)
  })
})
