import { fileURLToPath as testFileURLToPath } from 'node:url'
import path, { dirname as testDirname } from 'node:path'
// Contrast guard for tokens.css. Recomputes every WCAG 2.2 pairing from kubo
// DESIGN.md (Color) out of the shipped stylesheet, in both themes, so a token
// edit that breaks a documented floor fails here. The `documented` values are
// the DESIGN.md contrast table as printed there (one decimal).

import fs from 'node:fs'
const __dirname = testDirname(testFileURLToPath(import.meta.url))

const css = fs.readFileSync(path.join(__dirname, 'tokens.css'), 'utf8')

const extractDecls = body => {
  const decls = {}
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    decls[m[1]] = m[2].toLowerCase()
  }
  return decls
}

const collectBlocks = source => {
  const blocks = []
  for (const m of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    blocks.push({ selectors: m[1].split(',').map(s => s.trim()), decls: extractDecls(m[2]) })
  }
  return blocks
}

const mergeFor = (blocks, selector) => {
  const out = {}
  for (const b of blocks) {
    if (b.selectors.includes(selector)) Object.assign(out, b.decls)
  }
  return out
}

const parseThemes = source => {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  let top = text
  let mediaBody = ''
  const mediaStart = text.indexOf('@media')
  if (mediaStart !== -1) {
    const open = text.indexOf('{', mediaStart)
    const close = text.lastIndexOf('}')
    mediaBody = text.slice(open + 1, close)
    top = text.slice(0, mediaStart) + text.slice(close + 1)
  }
  const topBlocks = collectBlocks(top)
  return {
    dark: { ...mergeFor(topBlocks, ':root'), ...mergeFor(topBlocks, ":root[data-theme='dark']") },
    light: mergeFor(topBlocks, ":root[data-theme='light']"),
    system: mergeFor(collectBlocks(mediaBody), ":root[data-theme='system']")
  }
}

const channel = v => {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

const luminance = hex => {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * channel((n >> 16) & 0xff) + 0.7152 * channel((n >> 8) & 0xff) + 0.0722 * channel(n & 0xff)
}

const contrast = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

// Floors from DESIGN.md: every text pairing at least 4.5:1, the focus ring at
// the 3.7:1 brand floor, the D7 form-control edge at the WCAG 2.2 1.4.11
// non-text floor of 3:1.
const TEXT = 4.5
const FOCUS = 3.7
const EDGE = 3

const textPairings = [
  { fg: 'text', bg: 'ground', floor: TEXT, dark: 17.6, light: 16.7 },
  { fg: 'text', bg: 'surface', floor: TEXT, dark: 16.2, light: 17.8 },
  { fg: 'text', bg: 'raised', floor: TEXT, dark: 14.4, light: 15.2 },
  { fg: 'text', bg: 'control', floor: TEXT, dark: 12.5, light: 13.6 },
  { fg: 'text-muted', bg: 'ground', floor: TEXT, dark: 6.9, light: 6.4 },
  { fg: 'text-muted', bg: 'surface', floor: TEXT, dark: 6.4, light: 6.8 },
  { fg: 'text-muted', bg: 'raised', floor: TEXT, dark: 5.7, light: 5.8 },
  { fg: 'text-muted', bg: 'control', floor: TEXT, dark: 4.9, light: 5.2 },
  { fg: 'on-accent', bg: 'accent', floor: TEXT, dark: 6.1, light: 5.2 },
  { fg: 'accent-text', bg: 'surface', floor: TEXT, dark: 5.6, light: 6.3 },
  { fg: 'accent-text', bg: 'raised', floor: TEXT, dark: 5.0, light: 5.4 },
  { fg: 'accent-text', bg: 'accent-tint', floor: TEXT, dark: 4.7, light: 5.4 },
  { fg: 'ok', bg: 'ok-tint', floor: TEXT, dark: 6.2, light: 5.4 },
  { fg: 'warn', bg: 'warn-tint', floor: TEXT, dark: 7.4, light: 4.9 },
  { fg: 'err', bg: 'err-tint', floor: TEXT, dark: 5.1, light: 5.3 },
  { fg: 'info', bg: 'info-tint', floor: TEXT, dark: 6.2, light: 5.7 }
]

const focusPairings = [
  { fg: 'accent', bg: 'ground', floor: FOCUS, dark: 6.1, light: 4.6 },
  { fg: 'accent', bg: 'surface', floor: FOCUS, dark: 5.6, light: 4.9 },
  { fg: 'accent', bg: 'raised', floor: FOCUS, dark: 5.0, light: 4.2 },
  { fg: 'accent', bg: 'control', floor: FOCUS, dark: 4.3, light: 3.8 }
]

// D7: the only outline in the system, a 1px text-muted edge on form controls.
const edgePairings = [
  { fg: 'text-muted', bg: 'ground', floor: EDGE, dark: 6.9, light: 6.4 },
  { fg: 'text-muted', bg: 'surface', floor: EDGE, dark: 6.4, light: 6.8 },
  { fg: 'text-muted', bg: 'raised', floor: EDGE, dark: 5.7, light: 5.8 },
  { fg: 'text-muted', bg: 'control', floor: EDGE, dark: 4.9, light: 5.2 }
]

const themes = parseThemes(css)

describe('tokens.css theme blocks', () => {
  test('dark and light define the same token set', () => {
    expect(Object.keys(themes.dark).sort()).toEqual(Object.keys(themes.light).sort())
    expect(Object.keys(themes.dark).length).toBeGreaterThan(0)
  })

  test('the system (prefers-color-scheme: light) block matches the light theme', () => {
    expect(themes.system).toEqual(themes.light)
  })
})

describe.each([
  ['dark', themes.dark],
  ['light', themes.light]
])('%s theme', (theme, tokens) => {
  describe('text pairings (AA 4.5:1)', () => {
    test.each(textPairings)('$fg on $bg', ({ fg, bg, floor, ...documented }) => {
      expect(tokens[fg]).toBeDefined()
      expect(tokens[bg]).toBeDefined()
      const ratio = contrast(tokens[fg], tokens[bg])
      expect(ratio).toBeGreaterThanOrEqual(floor)
      expect(Math.abs(ratio - documented[theme])).toBeLessThanOrEqual(0.15)
    })
  })

  describe('focus ring (brand floor 3.7:1)', () => {
    test.each(focusPairings)('$fg on $bg', ({ fg, bg, floor, ...documented }) => {
      const ratio = contrast(tokens[fg], tokens[bg])
      expect(ratio).toBeGreaterThanOrEqual(floor)
      expect(Math.abs(ratio - documented[theme])).toBeLessThanOrEqual(0.15)
    })
  })

  describe('D7 form-control edge (WCAG 1.4.11, 3:1)', () => {
    test.each(edgePairings)('$fg on $bg', ({ fg, bg, floor, ...documented }) => {
      const ratio = contrast(tokens[fg], tokens[bg])
      expect(ratio).toBeGreaterThanOrEqual(floor)
      expect(Math.abs(ratio - documented[theme])).toBeLessThanOrEqual(0.15)
    })
  })
})
