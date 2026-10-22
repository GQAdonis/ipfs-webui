import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expect } from '@playwright/test'
import { explore, peers, settings } from '../../e2e/setup/locators.js'

const registration = (id, run) => ({ scenario: 'UI-115', id, requires: ['daemon', 'browser'], run })
const route = (session, hash) => session.page.goto(`${session.baseURL}#${hash}`)

export default [
  registration('explore-dag-codecs', async ctx => {
    const node = await ctx.getNode()
    const blocks = [
      { cid: 'QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm', options: { format: 'v0' } },
      { cid: 'QmbQDovX7wRe9ek7u6QXe9zgCXkTzoUSsTFJEkrYV1HrVR', options: { format: 'v0' } },
      { cid: 'QmawceGscqN4o8Y8Fv26UUmB454kn2bnkXV5tEQYc4jBd6', options: { format: 'v0' } },
      { cid: 'bafyreicds4picvqi46ljgw2eombkoifaftyjgd4abvfvledghftn2xnena', options: { storeCodec: 'dag-cbor', format: 'dag-cbor', version: 1, hashAlg: 'sha2-256' } }
    ]
    for (const block of blocks) {
      const bytes = await readFile(join(ctx.root, 'test/e2e/fixtures/explore/blocks', block.cid))
      const actual = await node.api.block.put(bytes, block.options)
      ctx.assert(actual.toString() === block.cid, 'Immutable fixture bytes retain expected codec/CID', { cid: block.cid, recipe: block.options })
    }
    const session = await ctx.browserSession({})
    try {
      await route(session, `/explore/${blocks[0].cid}`)
      await expect(session.page.locator(`.joyride-explorer-cid [title="${blocks[0].cid}"]`)).toBeVisible()
      await expect(session.page.getByText('UnixFS', { exact: true })).toBeVisible()
      await session.page.getByText(blocks[1].cid, { exact: true }).click()
      await expect(session.page).toHaveURL(new RegExp(blocks[1].cid))
      await session.page.goBack()
      await expect(session.page).toHaveURL(new RegExp(blocks[0].cid))
      await session.page.goForward()
      await expect(session.page).toHaveURL(new RegExp(blocks[1].cid))
      await route(session, `/explore/${blocks[3].cid}`)
      await expect(session.page.locator('[title="dag-cbor"]')).toBeVisible()
      await ctx.screenshot(session.page, 'dag-cbor')
      await route(session, '/explore/bafkqac3imvwgy3zao5xxe3de')
      await expect(session.page.getByText('Raw Block', { exact: true })).toBeVisible()
      await ctx.screenshot(session.page, 'raw-preview')
      await route(session, '/explore')
      await explore.cidInput(session.page).fill('not-a-cid')
      await expect(explore.inspectButton(session.page)).toBeDisabled()
      ctx.assert(true, 'Maintained Explorer traverses real DAG, preserves back/forward, renders codecs/raw preview and rejects invalid CID input')
      await ctx.record('explore-fixtures', blocks)
    } finally { await session.close() }
  }),
  registration('peer-local-connection', async ctx => {
    const [node, peer] = await Promise.all([ctx.getNode(), ctx.getPeer()])
    const session = await ctx.browserSession({})
    try {
      await ctx.rpcSnapshot('before-peer-connect')
      await route(session, '/peers')
      await peers.addConnectionButton(session.page).click()
      await peers.multiAddrInput(session.page).fill(peer.peerAddr)
      await session.page.getByRole('dialog').getByRole('checkbox').uncheck()
      await peers.multiAddrInput(session.page).press('Enter')
      await expect(session.page.getByText('Successfully connected to the provided peer')).toBeVisible()
      await expect.poll(async () => (await node.api.swarm.peers()).some(item => item.peer.toString() === peer.id.id)).toBe(true)
      await peers.filterInput(session.page).fill(peer.id.id)
      await expect(session.page.getByText(peer.id.id, { exact: false }).first()).toBeVisible()
      ctx.assert(true, 'Actual Peers control connected and displayed only the owned loopback peer')
      await ctx.record('peer-connection', { peerId: peer.id.id, multiaddr: peer.peerAddr, peers: (await node.api.swarm.peers()).map(item => ({ peer: item.peer.toString(), addr: item.addr.toString() })) })
      await ctx.screenshot(session.page, 'local-peer')
      await peers.filterInput(session.page).press('Escape')
      await expect(peers.filterInput(session.page)).toHaveValue('')
    } finally { await session.close(); await node.api.swarm.disconnect(peer.peerAddr).catch(() => {}) }
  }),
  registration('diagnostics-real-status', async ctx => {
    const node = await ctx.getNode()
    const session = await ctx.browserSession({})
    try {
      const requests = []
      session.page.on('response', response => { if (/\/api\/v0\/.*(?:provide|stats)/.test(response.url())) requests.push({ url: response.url(), status: response.status() }) })
      await route(session, '/diagnostics/provider')
      const grid = session.page.locator('.dht-provide__grid')
      await expect(grid).toBeVisible()
      for (const name of ['Connectivity', 'Queues', 'Schedule', 'Operations', 'Network', 'Workers']) await expect(grid.getByText(name, { exact: true })).toBeVisible()
      await expect(session.page.getByText(/Last updated at/)).toBeVisible()
      ctx.assert(requests.some(item => item.status === 200), 'Diagnostics fetched actual owned daemon stats')
      await ctx.record('diagnostics-state', { nodeId: node.id.id, requests, rendered: await grid.innerText() })
      await ctx.screenshot(session.page, 'diagnostics')
    } finally { await session.close() }
  }),
  registration('settings-edit-restore', async ctx => {
    const node = await ctx.getNode()
    const original = await node.api.config.getAll()
    const modified = structuredClone(original)
    modified.Datastore.StorageMax = original.Datastore.StorageMax === '11GB' ? '12GB' : '11GB'
    const session = await ctx.browserSession({})
    async function saveThroughEditor (value) {
      const input = session.page.locator('.ace_editor .ace_text-input')
      await input.focus()
      await session.page.keyboard.press('ControlOrMeta+A')
      await session.page.keyboard.insertText(JSON.stringify(value, null, 2))
      await session.page.getByRole('button', { name: 'Save', exact: true }).click()
      await expect.poll(async () => (await node.api.config.getAll()).Datastore.StorageMax).toBe(value.Datastore.StorageMax)
    }
    try {
      await route(session, '/settings')
      await expect(session.page.locator('.ace_editor')).toContainText(node.id.id)
      await saveThroughEditor(modified)
      ctx.assert((await node.api.config.getAll()).Datastore.StorageMax === modified.Datastore.StorageMax, 'Settings editor saved the supported field to the owned fixture node')
      await session.page.reload()
      await expect(session.page.locator('.ace_editor')).toContainText(modified.Datastore.StorageMax)
      await saveThroughEditor(original)
      ctx.assert((await node.api.config.getAll()).Datastore.StorageMax === original.Datastore.StorageMax, 'Settings control restored the original isolated configuration')
      await ctx.record('settings-field', { nodeId: node.id.id, field: 'Datastore.StorageMax', before: original.Datastore.StorageMax, changed: modified.Datastore.StorageMax, restored: (await node.api.config.getAll()).Datastore.StorageMax })
      await ctx.screenshot(session.page, 'settings-restored')
    } finally {
      // Restore only this owned node even if UI assertions fail; no operator API.
      await node.api.config.replace(original)
      await session.close()
    }
  }),
  registration('locale-theme-reload', async ctx => {
    const session = await ctx.browserSession({})
    try {
      await route(session, '/settings')
      await settings.languageChangeButton(session.page).click()
      await settings.languageOption(session.page, 'fr').click()
      await session.page.reload()
      ctx.assert(await session.page.evaluate(() => localStorage.getItem('i18nextLng')) === 'fr', 'Selected locale survives production hash-route reload')
      await ctx.screenshot(session.page, 'french-settings')
      for (const theme of ['light', 'dark']) {
        await session.page.evaluate(value => { localStorage.setItem('ipfs-webui:theme:v1', value) }, theme)
        await session.page.reload()
        await expect(session.page.locator('html')).toHaveAttribute('data-theme', theme)
        ctx.assert(new URL(session.page.url()).hash === '#/settings', `Hash route and ${theme} preference survive reload`)
        await ctx.screenshot(session.page, `settings-${theme}`)
      }
      await ctx.record('locale-theme', { locale: 'fr', themes: ['light', 'dark'], route: '#/settings' })
    } finally { await session.close() }
  })
]
