// Round 5 correction L4: each control on a Files row has its own accessible
// name. The checkbox selects, the pin button pins or unpins, the options button
// opens the menu; none of them reuses another's label.

import { readFileSync } from 'fs'
import { join } from 'path'
import filesEn from '../../../public/locales/en/files.json'

const read = (f) => readFileSync(join(__dirname, f), 'utf8')

describe('Files row control names', () => {
  it('ships a distinct sentence for select, options, pin, unpin and dismissing a failed pin', () => {
    const names = [filesEn.selectLabel, filesEn.optionsLabel, filesEn.pinLabel, filesEn.unpinLabel, filesEn.dismissFailedPinLabel]
    expect(names.every((n) => typeof n === 'string' && n.includes('{name}'))).toBe(true)
    expect(new Set(names).size).toBe(names.length)
  })

  it('uses them: the list row and the grid card no longer name the checkbox "View more options"', () => {
    const row = read('File.js')
    const grid = read('../files-grid/grid-file.tsx')
    for (const src of [row, grid]) {
      expect(src).toMatch(/t\('selectLabel'/)
      expect(src).toMatch(/t\('optionsLabel'/)
      expect(src).not.toMatch(/t\('checkboxLabel'/)
    }
    expect(row).toMatch(/t\('pinLabel'/)
    expect(row).toMatch(/t\('unpinLabel'/)
    expect(row).toMatch(/t\('dismissFailedPinLabel'/)
  })
})
