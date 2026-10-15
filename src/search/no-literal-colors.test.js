// webui-vector-search 1.5: no hard-coded colours outside the token layer. Every colour in
// src/search is a var() of src/promethity/tokens.css.
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const FILES = readdirSync(__dirname).filter((f) => /\.(css|js)$/.test(f) && !/\.test\.js$/.test(f) && f !== 'test-helpers.js')
const LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(|\bcolor\(|\b(white|black|red|green|blue|gray|grey)\b\s*[;}]/

describe('colours', () => {
  it.each(FILES)('%s uses tokens only', (file) => {
    const source = readFileSync(join(__dirname, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(source.match(LITERAL)).toBeNull()
  })
})
