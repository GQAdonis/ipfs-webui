import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { IpnsManager } from '../components/ipns-manager/IpnsManager.js'
import { PinningManager } from '../components/pinning-manager/PinningManager.js'
import settings from '../../public/locales/en/settings.json'
import app from '../../public/locales/en/app.json'

const t = key => {
  const [namespace, path] = key.includes(':') ? key.split(':') : ['settings', key]
  return path.split('.').reduce((value, part) => value?.[part], namespace === 'app' ? app : settings) || key
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe () {} disconnect () {} })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ width: 900 }))
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

function assertTableRows (grid, expected) {
  const rows = within(grid).getAllByRole('row')
  expect(rows).toHaveLength(expected + 1)
  for (const row of rows.slice(1)) {
    // Keep the real row/cell controls: a neutral size/scroll wrapper must not
    // become an extra ARIA row containing other rows.
    expect(row.parentElement).toHaveAttribute('role', 'presentation')
    expect(row.parentElement.parentElement).toHaveAttribute('role', 'rowgroup')
    expect(within(row).getAllByRole('gridcell')).toHaveLength(3)
    expect(row.querySelector('[role=row]')).toBeNull()
  }
  return rows.slice(1)
}

it('exposes named IPNS headers and valid rows while preserving keyboard sorting and key actions', () => {
  render(<IpnsManager t={t} ipfsReady ipnsKeysStatus='ready' doFetchIpnsKeys={vi.fn()} ipnsKeys={[
    { name: 'zeta', id: 'unpublished-z' }, { name: 'alpha', id: 'unpublished-a' }
  ]} />)
  const grid = screen.getByRole('grid', { name: settings.ipnsPublishingKeys.title })
  const rows = assertTableRows(grid, 2)
  expect(rows[0]).toHaveTextContent('alpha')
  const options = within(grid).getByRole('columnheader', { name: settings.showOptions })
  expect(options).toHaveTextContent(settings.showOptions)
  expect(options).not.toHaveAttribute('tabindex')
  fireEvent.keyDown(within(grid).getByRole('columnheader', { name: app.terms.name }), { key: 'Enter' })
  expect(assertTableRows(grid, 2)[0]).toHaveTextContent('zeta')
  fireEvent.click(within(grid).getByRole('button', { name: `${settings.showOptions}: zeta` }))
  expect(screen.getByText(app.actions.rename)).toBeVisible()
  expect(screen.getByText(app.actions.remove)).toBeVisible()
})

it('retains the local pin row and service counts under valid grid row ownership', () => {
  render(<PinningManager t={t} ipfsReady={false} localNumberOfPins={4} pinningServices={[]} />)
  const grid = screen.getByRole('grid', { name: settings.pinningServices.title })
  const [local] = assertTableRows(grid, 1)
  expect(local).toHaveTextContent(settings.localPinning)
  expect(within(local).getAllByRole('gridcell')[1]).toHaveTextContent('4')
  expect(within(grid).getAllByRole('columnheader').every(node => node.textContent.trim().length > 0)).toBe(true)
})
