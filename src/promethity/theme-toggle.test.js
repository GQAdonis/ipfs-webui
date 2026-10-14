// ThemeToggle component tests (D16): the System / Dark / Light radio group.
// The theme store is a module singleton, so state is arranged through the
// store's own API; cold-start restore from localStorage is covered by
// theme.test.js.

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { getTheme, setTheme, THEME_STORAGE_KEY } from './theme.js'
import ThemeToggle from './theme-toggle.js'

beforeEach(() => {
  window.localStorage.clear()
  setTheme('system')
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  setTheme('system')
  document.documentElement.removeAttribute('data-theme')
})

it('renders a System / Dark / Light radio group with System checked by default', () => {
  const { getByRole } = render(<ThemeToggle />)
  expect(getByRole('radiogroup', { name: 'Theme' })).toBeTruthy()
  expect(getByRole('radio', { name: 'System' }).checked).toBe(true)
  expect(getByRole('radio', { name: 'Dark' }).checked).toBe(false)
  expect(getByRole('radio', { name: 'Light' }).checked).toBe(false)
})

it('choosing Dark persists under the versioned key and themes the document', () => {
  const { getByRole } = render(<ThemeToggle />)
  fireEvent.click(getByRole('radio', { name: 'Dark' }))
  expect(getTheme()).toBe('dark')
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  expect(getByRole('radio', { name: 'Dark' }).checked).toBe(true)
})

it('reflects the stored choice on render', () => {
  setTheme('light')
  const { getByRole } = render(<ThemeToggle />)
  expect(getByRole('radio', { name: 'Light' }).checked).toBe(true)
})

it('accepts translated labels', () => {
  const labels = { group: 'Thème', system: 'Système', dark: 'Sombre', light: 'Clair' }
  const { getByRole } = render(<ThemeToggle labels={labels} />)
  expect(getByRole('radiogroup', { name: 'Thème' })).toBeTruthy()
  expect(getByRole('radio', { name: 'Sombre' })).toBeTruthy()
})
