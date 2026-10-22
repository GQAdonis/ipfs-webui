import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PhoneNavigation } from './PhoneNavigation.jsx'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (_key, options) => options.defaultValue }) }))

let media
beforeEach(() => {
  const listeners = new Set()
  media = {
    matches: true, media: '(max-width: 539px)',
    addEventListener: (_name, listener) => listeners.add(listener),
    removeEventListener: (_name, listener) => listeners.delete(listener),
    change(matches) { this.matches = matches; for (const listener of listeners) listener({ matches }) },
    listeners
  }
  vi.stubGlobal('matchMedia', vi.fn(() => media))
})
afterEach(() => vi.unstubAllGlobals())

describe('phone destinations', () => {
  it.each(['light', 'dark'])('has four real primary hash destinations and a named More trigger in %s', theme => {
    const { container } = render(<PhoneNavigation route='/' theme={theme} />)
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(within(navigation).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '#/'], ['Files', '#/files'], ['Pins', '#/pins'], ['Activity', '#/activity']
    ])
    expect(within(navigation).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(within(navigation).getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('[data-ipfs-ui]')).toHaveAttribute('data-theme', theme)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Explore' })).toBeNull()
  })

  it.each([
    ['/files/nested', 'Files'], ['#/ipfs/bafyfixture', 'Files'], ['/ipns/example.test', 'Files'],
    ['/pins?filter=recursive', 'Pins'], ['/activity', 'Activity']
  ])('marks only the actual primary destination for %s', (route, label) => {
    render(<PhoneNavigation route={route} theme='dark' />)
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link').filter(link => link.hasAttribute('aria-current'))).toHaveLength(1)
  })

  it('does not select Files for an unrelated path sharing a textual prefix', () => {
    render(<PhoneNavigation route='/files-other' theme='dark' />)
    expect(screen.getAllByRole('link').every(link => !link.hasAttribute('aria-current'))).toBe(true)
  })

  it('uses the shared native More sheet for existing destinations only, with focus restoration after cancel', () => {
    render(<PhoneNavigation route='/settings/agent' theme='light' />)
    const more = screen.getByRole('button', { name: 'More' })
    more.focus(); fireEvent.click(more)
    const dialog = screen.getByRole('dialog', { name: 'More destinations' })
    expect(dialog.tagName).toBe('DIALOG')
    expect(dialog).toHaveAttribute('open')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Explore and manage your IPFS node.')
    expect(within(dialog).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Explore', '#/explore'], ['Peers', '#/peers'], ['Status', '#/status'], ['Diagnostics', '#/diagnostics'], ['Settings', '#/settings']
    ])
    expect(within(dialog).getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: /designboard/i })).toBeNull()
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Explore' })).toBeNull()
    expect(more).toHaveFocus()
  })

  it('closes the sheet after selecting a native hash link without an execution callback', () => {
    render(<PhoneNavigation route='/' theme='dark' />)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    const destination = screen.getByRole('link', { name: 'Explore' })
    destination.addEventListener('click', event => event.preventDefault(), { once: true })
    fireEvent.click(destination)
    expect(destination).toHaveAttribute('href', '#/explore')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes an open sheet when the host route changes', () => {
    const view = render(<PhoneNavigation route='/' theme='dark' />)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    view.rerender(<PhoneNavigation route='/activity' theme='dark' />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('link', { name: 'Activity' })).toHaveAttribute('aria-current', 'page')
  })

  it('retires the modal above the phone breakpoint and detaches its viewport listener on unmount', () => {
    const view = render(<PhoneNavigation route='/' theme='dark' />)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    act(() => media.change(false))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'More' })).toBeDisabled()
    act(() => media.change(true))
    expect(screen.getByRole('button', { name: 'More' })).toBeEnabled()
    expect(screen.queryByRole('dialog')).toBeNull()
    view.unmount()
    expect(media.listeners.size).toBe(0)
  })
})
