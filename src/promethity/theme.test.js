import { vi } from 'vitest'
// Theme store tests (D16). The store is a module singleton, so each test
// imports it on a fresh module registry with a clean localStorage and no
// data-theme attribute left over from the previous case.

import { BRAND } from './brand.js'

/** @returns {typeof import('./theme.js')} */
async function freshStore () {
  vi.resetModules()
  return import('./theme.js')
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  delete window.matchMedia
})

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

it('defaults to system and resolves dark when the system states no preference', async () => {
  const store = await freshStore()
  expect(store.getTheme()).toBe('system')
  // jsdom has no matchMedia: the unspecified case, which D16 resolves to dark
  expect(store.getResolvedTheme()).toBe('dark')
})

it('resolves light when the system prefers light', async () => {
  window.matchMedia = (query) => ({
    matches: query === '(prefers-color-scheme: light)',
    addEventListener: () => {},
    addListener: () => {}
  })
  const store = await freshStore()
  expect(store.getTheme()).toBe('system')
  expect(store.getResolvedTheme()).toBe('light')
})

it('persists an explicit choice under the versioned key and writes data-theme', async () => {
  const store = await freshStore()
  const seen = []
  store.subscribe(() => seen.push(store.getTheme()))
  store.setTheme('light')
  expect(store.getTheme()).toBe('light')
  expect(store.getResolvedTheme()).toBe('light')
  expect(window.localStorage.getItem(store.THEME_STORAGE_KEY)).toBe('light')
  expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  expect(seen).toEqual(['light'])
})

it('restores the persisted choice on the next load', async () => {
  window.localStorage.setItem('ipfs-webui:theme:v1', 'dark')
  const store = await freshStore()
  expect(store.getTheme()).toBe('dark')
})

it('ignores invalid stored values and falls back to system', async () => {
  window.localStorage.setItem('ipfs-webui:theme:v1', '{"evil":true}')
  const store = await freshStore()
  expect(store.getTheme()).toBe('system')
})

it('rejects unknown themes and keeps the current one', async () => {
  const store = await freshStore()
  store.setTheme('light')
  store.setTheme('neon')
  expect(store.getTheme()).toBe('light')
  expect(window.localStorage.getItem(store.THEME_STORAGE_KEY)).toBe('light')
})

it('keeps working for this page when storage is blocked', async () => {
  const setItem = vi.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementation(() => {
    throw new Error('denied')
  })
  const store = await freshStore()
  store.setTheme('dark')
  expect(store.getTheme()).toBe('dark')
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  setItem.mockRestore()
})

it('initTheme applies the attribute before render and notifies on a system change in system mode', async () => {
  /** @type {Array<() => void>} */
  const changeHandlers = []
  let prefersLight = false
  window.matchMedia = () => ({
    get matches () { return prefersLight },
    addEventListener: (event, fn) => { if (event === 'change') changeHandlers.push(fn) },
    addListener: (fn) => changeHandlers.push(fn)
  })
  const store = await freshStore()
  store.initTheme()
  expect(document.documentElement.getAttribute('data-theme')).toBe('system')
  expect(changeHandlers.length).toBeGreaterThan(0)

  const resolved = []
  store.subscribe(() => resolved.push(store.getResolvedTheme()))
  prefersLight = true
  changeHandlers.forEach((fn) => fn())
  expect(resolved).toEqual(['light'])

  // An explicit choice is unaffected by system changes
  store.setTheme('dark')
  prefersLight = false
  changeHandlers.forEach((fn) => fn())
  expect(store.getResolvedTheme()).toBe('dark')
})

it('holds the product name in one constant', async () => {
  expect(BRAND.name).toBe('Promethity')
})
