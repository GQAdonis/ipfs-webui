import { plainText, baseName } from './plain-text.js'

describe('plainText', () => {
  it('removes bidi embeddings, overrides, isolates and marks', () => {
    expect(plainText('a‮b‪c⁦d⁩e‏f؜g')).toBe('abcdefg')
  })
  it('removes zero-width characters and Unicode tag characters', () => {
    expect(plainText('a\u200Bb\u200Cc\u200Dd\uFEFFe')).toBe('abcde')
    // "ignore" spelled in tag characters (U+E0069 ...) is invisible; it must not survive.
    const tagged = String.fromCodePoint(0xE0069, 0xE0067, 0xE006E, 0xE007F)
    expect(plainText(`visible${tagged}text`)).toBe('visibletext')
    expect(plainText('naïve café')).toBe('naïve café')
  })
  it('removes control characters but keeps line feeds and tabs', () => {
    expect(plainText('a\u0000b\u0007c\td\ne\u009Ff')).toBe('abc\td\nef')
  })
  it('folds carriage returns and caps the length', () => {
    expect(plainText('a\r\nb\rc')).toBe('a\nb\nc')
    expect(plainText('x'.repeat(10), 4)).toBe('xxxx')
  })
  it('returns an empty string for non-strings', () => {
    expect(plainText(undefined)).toBe('')
    expect(plainText(5)).toBe('')
  })
  it('keeps markup as characters', () => {
    expect(plainText('<img src=x onerror=alert(1)>')).toBe('<img src=x onerror=alert(1)>')
  })
})

describe('baseName', () => {
  it('takes the last path segment', () => {
    expect(baseName('/a/b/c.txt')).toBe('c.txt')
    expect(baseName('/a/b/')).toBe('b')
    expect(baseName('name')).toBe('name')
    expect(baseName(undefined)).toBe('')
  })
})
