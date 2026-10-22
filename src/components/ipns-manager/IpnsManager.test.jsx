import React from 'react'
import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { composeBundles } from 'redux-bundler'
import ConnectedIpnsManager, { IpnsManager } from './IpnsManager.js'
import ipnsBundle from '../../bundles/ipns.js'
import { Provider } from '../../lib/react-store.js'
import settings from '../../../public/locales/en/settings.json'
import app from '../../../public/locales/en/app.json'

const t = key => {
  const [namespace, path] = key.includes(':') ? key.split(':') : ['settings', key]
  return path.split('.').reduce((value, part) => value?.[part], namespace === 'app' ? app : settings) || key
}
const props = () => ({ t, ipfsReady: true, ipnsKeysStatus: 'ready', ipnsKeys: [], doFetchIpnsKeys: vi.fn(), doGenerateIpnsKey: vi.fn(), doRenameIpnsKey: vi.fn(), doRemoveIpnsKey: vi.fn() })

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe () {} disconnect () {} })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ width: 900 }))
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

it.each([
  [false, 'idle', app.status.disconnectedShort],
  [true, 'idle', app.terms.unknown],
  [true, 'loading', app.terms.loading],
  [true, 'error', settings.errors.failedToFetch],
  [true, 'ready', '0']
])('announces client=%s request=%s without an empty focusable grid', (ipfsReady, ipnsKeysStatus, expected) => {
  render(<IpnsManager {...props()} ipfsReady={ipfsReady} ipnsKeysStatus={ipnsKeysStatus} />)
  expect(screen.queryByRole('grid')).toBeNull()
  expect(screen.queryByRole('rowgroup')).toBeNull()
  const status = screen.getByRole('status', { name: settings.ipnsPublishingKeys.title })
  expect(status).toHaveTextContent(expected)
  expect(status).toHaveTextContent(settings.ipnsPublishingKeys.title)
  expect(status).not.toHaveAttribute('tabindex')
})

it('does not present cached rows as a current read during refresh, failure or retirement', () => {
  const input = { ...props(), ipnsKeys: [{ name: 'cached', id: 'unpublished' }] }
  const view = render(<IpnsManager {...input} />)
  expect(screen.getByRole('grid')).toBeVisible()
  for (const ipnsKeysStatus of ['loading', 'error', 'idle']) {
    view.rerender(<IpnsManager {...input} ipnsKeysStatus={ipnsKeysStatus} />)
    expect(screen.queryByRole('grid')).toBeNull()
    expect(screen.queryByText('cached')).toBeNull()
    expect(screen.getByRole('status')).not.toHaveTextContent(': 0')
  }
  view.rerender(<IpnsManager {...input} ipfsReady={false} />)
  expect(screen.queryByRole('grid')).toBeNull()
  expect(screen.getByRole('status')).toHaveTextContent(app.status.disconnectedShort)
})

it('fetches only through the existing readiness effect without inventing status from its cache', () => {
  const input = { ...props(), ipfsReady: false, ipnsKeysStatus: 'idle' }
  const view = render(<IpnsManager {...input} />)
  expect(input.doFetchIpnsKeys).not.toHaveBeenCalled()
  view.rerender(<IpnsManager {...input} ipfsReady />)
  expect(input.doFetchIpnsKeys).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('status')).toHaveTextContent(app.terms.unknown)
  view.rerender(<IpnsManager {...input} ipfsReady ipnsKeysStatus='loading' />)
  expect(input.doFetchIpnsKeys).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('status')).toHaveTextContent(app.terms.loading)
})

it('sorts a copied key array and provides distinct row options without changing self restrictions', () => {
  const keys = Object.freeze([{ name: 'zeta', id: 'z' }, { name: 'self', id: 's' }, { name: 'alpha', id: 'a' }].map(Object.freeze))
  render(<IpnsManager {...props()} ipnsKeys={keys} />)
  const grid = screen.getByRole('grid', { name: settings.ipnsPublishingKeys.title })
  const header = within(grid).getByRole('columnheader', { name: app.terms.name })
  expect(header).toHaveAttribute('aria-sort', 'ascending')
  expect(within(grid).getAllByRole('row')[1]).toHaveTextContent('alpha')
  fireEvent.keyDown(header, { key: 'Enter' })
  expect(header).toHaveAttribute('aria-sort', 'descending')
  expect(within(grid).getAllByRole('row')[1]).toHaveTextContent('zeta')
  fireEvent.keyDown(header, { key: ' ' })
  expect(header).toHaveAttribute('aria-sort', 'ascending')
  expect(keys.map(key => key.name)).toEqual(['zeta', 'self', 'alpha'])
  expect(screen.getByRole('button', { name: `${settings.showOptions}: alpha` })).toBeVisible()
  expect(screen.getByRole('button', { name: `${settings.showOptions}: zeta` })).toBeVisible()
  expect(screen.queryByRole('button', { name: `${settings.showOptions}: self` })).toBeNull()
})

it('preserves published configured gateway links and keeps unpublished IDs as text', () => {
  const id = 'k51qzi5uqu5dl2yn0d6xu8q5aqa61jh8zeyixz9tsju80n15ssiyew48912c63'
  render(<IpnsManager {...props()} ipnsKeys={[{ name: 'published', id, published: true }, { name: 'notes', id: 'unpublished' }]} localGatewayUrl='http://127.0.0.1:8080' shareLinkType='path' />)
  const link = screen.getByRole('link', { name: id })
  expect(link).toHaveAttribute('href', `http://127.0.0.1:8080/ipns/${id}`)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  expect(screen.queryByRole('link', { name: 'unpublished' })).toBeNull()
})

it('formats verified zero in the active translation locale and keeps the publishing-key context', async () => {
  const i18n = createInstance()
  await i18n.init({ lng: 'ar', resources: { ar: { settings: { ipnsPublishingKeys: { title: 'مفاتيح النشر' } }, app } } })
  render(<I18nextProvider i18n={i18n}><IpnsManager {...props()} t={i18n.getFixedT('ar', 'settings')} /></I18nextProvider>)
  expect(screen.getByRole('status', { name: 'مفاتيح النشر' })).toHaveTextContent(`مفاتيح النشر: ${new Intl.NumberFormat('ar').format(0)}`)
})

it.each(['rename', 'remove'])('keeps the %s dialog and mutation bound to the selected key', action => {
  const input = { ...props(), ipnsKeys: [{ name: 'zeta', id: 'unpublished-z' }, { name: 'alpha', id: 'unpublished-a' }] }
  render(<IpnsManager {...input} />)
  fireEvent.click(screen.getByRole('button', { name: `${settings.showOptions}: zeta` }))
  fireEvent.click(screen.getByRole('menuitem', { name: app.actions[action] }))
  const dialog = screen.getByRole('dialog')
  if (action === 'rename') {
    fireEvent.change(within(dialog).getByRole('textbox'), { target: { value: 'changed-name' } })
    fireEvent.click(within(dialog).getByRole('button', { name: app.actions.rename, exact: true }))
    expect(input.doRenameIpnsKey).toHaveBeenCalledExactlyOnceWith('zeta', 'changed-name')
    expect(input.doRemoveIpnsKey).not.toHaveBeenCalled()
  } else {
    fireEvent.click(within(dialog).getByRole('button', { name: app.actions.remove, exact: true }))
    expect(input.doRemoveIpnsKey).toHaveBeenCalledExactlyOnceWith('zeta')
    expect(input.doRenameIpnsKey).not.toHaveBeenCalled()
  }
  expect(input.doGenerateIpnsKey).not.toHaveBeenCalled()
})

it('preserves explicit Generate submission and its existing trimmed key argument', () => {
  const input = props()
  render(<IpnsManager {...input} />)
  fireEvent.click(screen.getByRole('button', { name: `+ ${settings.actions.generateKey}` }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByRole('textbox'), { target: { value: ' notes ' } })
  fireEvent.click(within(dialog).getByRole('button', { name: app.actions.generate, exact: true }))
  expect(input.doGenerateIpnsKey).toHaveBeenCalledExactlyOnceWith('notes')
})

it('connects actual request lifecycle to the section and retires pending data on provider replacement', async () => {
  let complete
  let fail = false
  const rpc = { key: { list: vi.fn(() => fail ? Promise.reject(new Error('fixture read failed')) : new Promise(resolve => { complete = resolve })) }, name: { resolve: async function * () {} } }
  const store = composeBundles({
    name: 'ipfs',
    reducer: (state = { ready: true }, action) => action.type === 'IPFS_API_ADDRESS_UPDATED' ? { ready: false } : state,
    getExtraArgs: () => ({ getIpfs: () => rpc }),
    selectIpfsReady: state => state.ipfs.ready,
    selectLocalGatewayUrl: () => '', selectPublicGateway: () => '', selectShareLinkType: () => 'local-path'
  }, ipnsBundle)()
  const view = render(<Provider store={store}><ConnectedIpnsManager t={t} /></Provider>)
  try {
    expect(await screen.findByRole('status')).toHaveTextContent(app.terms.loading)
    await act(async () => { complete([{ name: 'current-key', id: 'unpublished' }]) })
    expect(await screen.findByRole('grid')).toHaveTextContent('current-key')
    const cached = store.selectIpnsKeys()
    fail = true
    await act(async () => { await store.doFetchIpnsKeys() })
    expect(await screen.findByRole('status')).toHaveTextContent(settings.errors.failedToFetch)
    expect(screen.queryByRole('grid')).toBeNull()
    expect(store.selectIpnsKeys()).toBe(cached)
    fail = false
    let pending
    await act(async () => { pending = store.doFetchIpnsKeys() })
    expect(await screen.findByRole('status')).toHaveTextContent(app.terms.loading)
    await act(async () => { store.dispatch({ type: 'IPFS_API_ADDRESS_UPDATED', payload: 'new-fixture-provider' }) })
    expect(await screen.findByRole('status')).toHaveTextContent(app.status.disconnectedShort)
    await act(async () => { complete([]); await pending })
    expect(screen.queryByRole('grid')).toBeNull()
    expect(screen.getByRole('status')).not.toHaveTextContent(': 0')
    expect(store.selectIpnsKeys()).toEqual([])
  } finally {
    view.unmount()
    store.destroy()
  }
})
