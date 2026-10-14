// Settings theme section (D16, H4): the System / Dark / Light choice is the
// first Settings section, switches the document theme and persists it.

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ThemeSettings from './ThemeSettings.js'
import { getTheme, setTheme, THEME_STORAGE_KEY } from '../promethity/theme.js'

const strings = {
  'theme.title': 'Theme',
  'theme.description': 'Choose how the Web UI looks.',
  'theme.system': 'System',
  'theme.dark': 'Dark',
  'theme.light': 'Light'
}
const t = (key) => strings[key] ?? key

beforeEach(() => {
  window.localStorage.clear()
  setTheme('system')
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  setTheme('system')
  document.documentElement.removeAttribute('data-theme')
})

it('renders a sentence-case Theme heading with the three-way choice', () => {
  const { getByRole } = render(<ThemeSettings t={t} />)
  expect(getByRole('heading', { name: 'Theme' })).toBeTruthy()
  expect(getByRole('radiogroup', { name: 'Theme' })).toBeTruthy()
  expect(getByRole('radio', { name: 'System' }).checked).toBe(true)
})

it('choosing Light switches the document theme and persists the choice', () => {
  const { getByRole } = render(<ThemeSettings t={t} />)
  fireEvent.click(getByRole('radio', { name: 'Light' }))
  expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  expect(getTheme()).toBe('light')
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
})

it('a remounted section (a new page visit) shows the stored choice', () => {
  const first = render(<ThemeSettings t={t} />)
  fireEvent.click(first.getByRole('radio', { name: 'Dark' }))
  first.unmount()
  const second = render(<ThemeSettings t={t} />)
  expect(second.getByRole('radio', { name: 'Dark' }).checked).toBe(true)
})
