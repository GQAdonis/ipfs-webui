import assert from 'node:assert/strict'
import test from 'node:test'
import { assessMeasurement, composite, contrastRatio, inspectElement, parseColor } from './inspect.mjs'
import { chromium } from '@playwright/test'

const style = { color: 'rgb(20, 18, 16)', backgroundColor: 'rgb(245, 242, 238)', backgroundImage: 'none', opacity: '1', filter: 'none', backdropFilter: 'none', mixBlendMode: 'normal', backgroundBlendMode: 'normal', clipPath: 'none', maskImage: 'none', visibility: 'visible', display: 'block', transform: 'none', textShadow: 'none', fontSize: '14px', fontWeight: '400' }
const fixture = () => ({ foregroundStyle: { ...style }, fontsStatus: 'loaded', ancestors: [{ style: { ...style }, pseudos: [] }], textSamples: [{ fullyVisible: true, rect: { left: 20, top: 10, right: 60, bottom: 30 }, hits: [{ targetOrDescendant: true }] }] })

test('actual colors use alpha composition and unrounded WCAG luminance', () => {
  assert.deepEqual(parseColor('rgba(20, 18, 16, 0.5)'), [20, 18, 16, .5])
  assert.deepEqual(composite([0, 0, 0, .5], [255, 255, 255, 1]), [127.5, 127.5, 127.5, 1])
  assert.equal(contrastRatio([0, 0, 0, 1], [255, 255, 255, 1]), 21)
  assert.equal(assessMeasurement(fixture()).status, 'PASS')
})
test('a visible low-contrast pair fails; clipping and overlapping pseudo layers stay unknown', () => {
  const low = fixture(); low.foregroundStyle.color = 'rgb(245, 242, 238)'
  assert.equal(assessMeasurement(low).status, 'FAIL')
  const clipped = fixture(); clipped.textSamples[0].fullyVisible = false
  assert.equal(assessMeasurement(clipped).status, 'UNKNOWN')
  const pseudo = fixture(); pseudo.ancestors[0].pseudos = [{ pseudo: '::before', content: '""', style: { backgroundColor: 'rgb(34, 33, 32)', backgroundImage: 'none' }, geometry: { left: 0, right: 8, top: 0, bottom: 100 } }]
  assert.equal(assessMeasurement(pseudo).status, 'PASS')
  pseudo.ancestors[0].pseudos[0].geometry.right = 30
  assert.equal(assessMeasurement(pseudo).status, 'UNKNOWN')
})
test('unsupported effects, missing opaque backgrounds and obscuring hits cannot pass', () => {
  for (const [property, value] of [['opacity', '.45'], ['filter', 'brightness(1.08)'], ['backgroundImage', 'linear-gradient(red, blue)'], ['mixBlendMode', 'multiply']]) {
    const probe = fixture(); probe.ancestors[0].style[property] = value
    assert.equal(assessMeasurement(probe).status, 'UNKNOWN')
  }
  const transparent = fixture(); transparent.ancestors[0].style.backgroundColor = 'rgba(0, 0, 0, 0)'
  assert.equal(assessMeasurement(transparent).status, 'UNKNOWN')
  const obscured = fixture(); obscured.textSamples[0].hits[0].targetOrDescendant = false
  assert.equal(assessMeasurement(obscured).status, 'UNKNOWN')
})

test('viewport overflow propagation preserves real container clipping and obscuring hit tests', async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 375, height: 1000 } })
    const base = '<!doctype html><style>html{overflow:visible;background:white;color:black}body{margin:0;overflow:auto}h1{margin:21px 0;font:700 32px/1 Arial}</style><h1>Current frontend host fixture</h1>'
    await page.setContent(base)
    const propagated = await page.locator('h1').evaluate(inspectElement)
    assert.equal(propagated.overflowPropagation.source.tag, 'BODY')
    assert(propagated.textSamples[0].rect.top < propagated.ancestors.find(a => a.tag === 'BODY').rect.top)
    assert(propagated.textSamples.every(s => s.fullyVisible && s.hits.length === 3 && s.hits.every(h => h.targetOrDescendant)))
    assert.equal(assessMeasurement(propagated).status, 'PASS')

    await page.setContent(base.replace('body{margin:0;overflow:auto}', 'body{margin:0;overflow:hidden;contain:paint;height:20px}'))
    const contained = await page.locator('h1').evaluate(inspectElement)
    assert.equal(contained.overflowPropagation.source.tag, 'HTML')
    assert(assessMeasurement(contained).reasons.includes('text-clipped-or-outside-viewport'))

    await page.setContent('<!doctype html><style>html{background:white;color:black}section{height:10px;overflow:hidden}h1{margin:0}</style><section><h1>Clipped text</h1></section>')
    assert(assessMeasurement(await page.locator('h1').evaluate(inspectElement)).reasons.includes('text-clipped-or-outside-viewport'))

    await page.setContent(base + '<div style="position:fixed;inset:0;background:white"></div>')
    assert(assessMeasurement(await page.locator('h1').evaluate(inspectElement)).reasons.includes('text-hit-test-obscured'))
  } finally { await browser.close() }
})
