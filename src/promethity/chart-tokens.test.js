// webui-dataviz-reskin 1.1 / 1.2: the chart palette resolves from the live CSS
// tokens (and follows a theme switch), and the data-viz files carry no colour
// literals, gradients or shadows.

import fs from 'node:fs'
import path from 'node:path'
import React from 'react'
import { render, act } from '@testing-library/react'
import { chartPalette, readToken, useChartPalette } from './tokens.js'
import { setTheme } from './theme.js'

const setTokens = (values) => {
  for (const [name, value] of Object.entries(values)) {
    document.documentElement.style.setProperty(`--${name}`, value)
  }
}

const clearTokens = (names) => {
  for (const name of names) document.documentElement.style.removeProperty(`--${name}`)
}

const NAMES = ['info', 'warn', 'ok', 'text', 'text-muted', 'raised', 'surface', 'font-body']

afterEach(() => {
  clearTokens(NAMES)
  setTheme('system')
})

it('readToken returns the trimmed custom property, or an empty string when undefined', () => {
  setTokens({ info: ' rgb(1, 2, 3) ' })
  expect(readToken('info')).toBe('rgb(1, 2, 3)')
  expect(readToken('missing-token')).toBe('')
})

it('chartPalette maps series, tracks and labels onto tokens', () => {
  setTokens({ info: 'rgb(1, 1, 1)', warn: 'rgb(2, 2, 2)', ok: 'rgb(3, 3, 3)', 'text-muted': 'rgb(4, 4, 4)', raised: 'rgb(5, 5, 5)', surface: 'rgb(6, 6, 6)', text: 'rgb(7, 7, 7)' })
  const palette = chartPalette()
  expect(palette.down).toBe('rgb(1, 1, 1)')
  // Outgoing traffic is the neutral text colour, not warn (warn means waiting).
  expect(palette.up).toBe('rgb(7, 7, 7)')
  expect(palette.categorical).toEqual(['rgb(1, 1, 1)', 'rgb(2, 2, 2)', 'rgb(3, 3, 3)'])
  expect(palette.other).toBe('rgb(4, 4, 4)')
  expect(palette.track).toBe('rgb(5, 5, 5)')
  expect(palette.surface).toBe('rgb(6, 6, 6)')
  expect(palette.text).toBe('rgb(7, 7, 7)')
})

it('useChartPalette recomputes when the theme changes', () => {
  setTokens({ info: 'rgb(10, 10, 10)' })
  setTheme('dark')
  let seen = ''
  const Probe = () => {
    seen = useChartPalette().down
    return null
  }
  render(<Probe />)
  expect(seen).toBe('rgb(10, 10, 10)')

  // The stylesheet swaps the token values with the data-theme attribute; the
  // store then notifies subscribers, and the chart must read the new value.
  setTokens({ info: 'rgb(20, 20, 20)' })
  act(() => setTheme('light'))
  expect(seen).toBe('rgb(20, 20, 20)')
})

describe('data-viz files carry no colour literals', () => {
  const root = path.join(__dirname, '..')
  const files = [
    'status/CountryChart.js',
    'status/NetworkTraffic.js',
    'status/NodeBandwidthChart.js',
    'status/Speedometer.js',
    'peers/WorldMap/WorldMap.js'
  ]

  it.each(files)('%s has no hex, rgb(a), gradient or shadow', (file) => {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(source).not.toMatch(/rgba?\(/)
    expect(source).not.toMatch(/[Gg]radient/)
    expect(source).not.toMatch(/drop-shadow|box-shadow/)
  })
})
