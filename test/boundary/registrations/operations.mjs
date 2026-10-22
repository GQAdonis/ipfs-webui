import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { expect } from '@playwright/test'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { files, peers } from '../../e2e/setup/locators.js'

const registration = (scenario, id, run) => ({ scenario, id, requires: ['daemon', 'browser'], run })
const rows = page => page.getByTestId('file-row')
const row = (page, name) => rows(page).filter({ hasText: name })
const route = (session, hash) => session.page.goto(`${session.baseURL}#${hash}`)
async function seed (ctx, name, content = 'Explicit local boundary fixture\n') {
  const node = await ctx.getNode()
  const path = `/boundary-${name}.txt`
  const bytes = Buffer.from(content)
  await node.api.files.write(path, bytes, { create: true, truncate: true })
  const stat = await node.api.files.stat(path)
  await ctx.record('seed', { path, cid: stat.cid.toString(), sha256: sha256(bytes), size: bytes.length, recipe: 'existing MFS write defaults; no changed CID recipe' })
  return { node, path, name: path.slice(1), cid: stat.cid.toString(), bytes }
}
async function contextAction (page, name, action) {
  await files.contextMenuButton(page, name).click()
  await page.getByRole('menuitem', { name: action, exact: true }).click()
}
async function readBytes (api, path) {
  const chunks = []
  for await (const chunk of api.files.read(path)) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default [
  registration('UI-101', 'production-relative-routes', async ctx => {
    for (const theme of ['light', 'dark']) {
      for (const width of [375, 1440]) {
        const session = await ctx.browserSession({ theme, width })
        try {
          for (const hash of ['/files', '/pins', '/explore', '/peers', '/diagnostics/provider', '/settings']) {
            const response = await route(session, hash)
            expect(response?.ok()).toBe(true)
            await expect(session.page.locator('main')).toBeVisible()
            await session.page.reload()
            await expect(session.page).toHaveURL(new RegExp(`#${hash.replaceAll('/', '\\/')}`))
            const assets = await session.page.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"][href]')].map(element => element.getAttribute('src') || element.getAttribute('href')))
            ctx.assert(assets.length > 0 && assets.every(value => !value.startsWith('/') && !/^https?:/.test(value)), `${hash} loads relative production assets at ${theme}/${width}`)
            ctx.assert(new URL(session.page.url()).pathname.startsWith('/ipfs/'), 'Actual isolated gateway non-root CID path remains active')
            await ctx.screenshot(session.page, `${theme}-${width}-${hash}`)
          }
          ctx.assert(session.errors.length === 0, 'No uncaught production route errors', session.errors)
          const missingAssets = session.failed.filter(item => /\.(?:js|css|woff2)(?:\?|$)/.test(item.url))
          ctx.assert(missingAssets.length === 0, 'No missing bundled production assets or fonts', missingAssets)
        } finally { await session.close() }
      }
    }
  }),
  registration('UI-114', 'files-upload-hierarchy', async ctx => {
    const node = await ctx.getNode()
    const directory = join(ctx.scratch, 'boundary-upload')
    await mkdir(join(directory, 'nested'), { recursive: true })
    const bytes = Buffer.alloc(8 * 1024 * 1024, 37)
    await writeFile(join(directory, 'nested', 'payload.bin'), bytes)
    await writeFile(join(directory, 'readme.txt'), 'Nested upload fixture\n')
    await ctx.record('upload-input', { hierarchy: ['boundary-upload/nested/payload.bin', 'boundary-upload/readme.txt'], payloadSha256: sha256(bytes), size: bytes.length })
    await ctx.rpcSnapshot('before-upload')
    const session = await ctx.browserSession({})
    try {
      await route(session, '/files')
      await expect(files.importButton(session.page)).toBeVisible()
      await session.page.evaluate(() => {
        window.__boundaryProgress = []
        const observer = new MutationObserver(() => {
          const text = document.querySelector('.fileImportStatus')?.textContent
          if (text) window.__boundaryProgress.push(text)
        })
        observer.observe(document.body, { subtree: true, childList: true, characterData: true })
        window.__boundaryProgressObserver = observer
      })
      await files.importButton(session.page).click()
      const chooser = session.page.waitForEvent('filechooser')
      await files.addFolderOption(session.page).click()
      await (await chooser).setFiles(directory)
      await expect(row(session.page, 'boundary-upload')).toBeVisible({ timeout: 60000 })
      await row(session.page, 'boundary-upload').getByRole('button').first().click()
      await expect(row(session.page, 'nested')).toBeVisible()
      await row(session.page, 'nested').getByRole('button').first().click()
      await expect(row(session.page, 'payload.bin')).toBeVisible()
      const actual = await readBytes(node.api, '/boundary-upload/nested/payload.bin')
      ctx.assert(sha256(actual) === sha256(bytes), 'Nested upload preserves hierarchy and actual RPC file bytes')
      const progress = await session.page.evaluate(() => { window.__boundaryProgressObserver.disconnect(); return window.__boundaryProgress })
      ctx.assert(progress.some(text => /\d+%/.test(text)), 'Actual transfer progress was rendered before completion')
      await ctx.record('rendered-progress', progress)
      await ctx.screenshot(session.page, 'nested-upload-complete')
      await ctx.rpcSnapshot('after-upload')
    } finally { await session.close(); await node.api.files.rm('/boundary-upload', { recursive: true }).catch(() => {}) }
  }),
  registration('UI-114', 'files-rename-download-remove', async ctx => {
    const fixture = await seed(ctx, 'rename-download-remove')
    const session = await ctx.browserSession({})
    const renamed = 'boundary-renamed.txt'
    try {
      await ctx.rpcSnapshot('before-controls')
      await route(session, '/files')
      await expect(row(session.page, fixture.name)).toBeVisible()
      await contextAction(session.page, fixture.name, 'Rename')
      const dialog = session.page.getByRole('dialog')
      await dialog.locator('input.modal-input').fill(renamed)
      await dialog.getByRole('button', { name: 'Save', exact: true }).click()
      await expect(row(session.page, renamed)).toBeVisible()
      ctx.assert((await fixture.node.api.files.stat(`/${renamed}`)).cid.toString() === fixture.cid, 'Rename control preserves the file CID in real MFS')
      const download = session.page.waitForEvent('download')
      await contextAction(session.page, renamed, 'Download')
      const downloaded = await download
      const target = join(ctx.scratch, 'downloaded-fixture')
      await downloaded.saveAs(target)
      ctx.assert(sha256(await readFile(target)) === sha256(fixture.bytes), 'Real control download matches fixture bytes')
      await contextAction(session.page, renamed, 'Remove')
      await dialog.getByRole('button', { name: 'Remove', exact: true }).click()
      await expect(row(session.page, renamed)).toHaveCount(0)
      let absent = false
      try { await fixture.node.api.files.stat(`/${renamed}`) } catch { absent = true }
      ctx.assert(absent, 'Remove control deleted the expected MFS entry')
      await ctx.rpcSnapshot('after-controls')
      await ctx.screenshot(session.page, 'removed-file')
    } finally {
      await session.close()
      for (const path of [fixture.path, `/${renamed}`]) await fixture.node.api.files.rm(path).catch(() => {})
    }
  }),
  registration('UI-114', 'files-move-copy', async ctx => {
    const fixture = await seed(ctx, 'move-copy')
    const session = await ctx.browserSession({})
    const destination = '/boundary-move-target'
    const copied = 'boundary-copy.txt'
    await fixture.node.api.files.mkdir(destination)
    try {
      await ctx.rpcSnapshot('before-move-copy')
      await route(session, '/files')
      await expect(row(session.page, fixture.name)).toBeVisible()
      await row(session.page, fixture.name).dragTo(row(session.page, destination.slice(1)))
      await expect(row(session.page, fixture.name)).toHaveCount(0)
      const moved = await fixture.node.api.files.stat(`${destination}/${fixture.name}`)
      ctx.assert(moved.cid.toString() === fixture.cid, 'Actual Files drag/drop moves the intended source into the selected directory')
      await files.importButton(session.page).click()
      await files.addByPathOption(session.page).click()
      const dialog = session.page.getByRole('dialog')
      await dialog.locator('input[name="path"]').fill(`/ipfs/${fixture.cid}`)
      await dialog.locator('input[name="name"]').fill(copied)
      await dialog.getByRole('button', { name: 'Import', exact: true }).click()
      await expect(row(session.page, copied)).toBeVisible()
      ctx.assert(sha256(await readBytes(fixture.node.api, `/${copied}`)) === sha256(fixture.bytes), 'Existing From IPFS control copies the addressed fixture bytes')
      ctx.assert((await fixture.node.api.files.stat(`${destination}/${fixture.name}`)).cid.toString() === fixture.cid, 'Copy retains its source')
      await ctx.rpcSnapshot('after-move-copy')
      await ctx.screenshot(session.page, 'copied-fixture')
    } finally {
      await session.close()
      for (const path of [fixture.path, destination, `/${copied}`]) await fixture.node.api.files.rm(path, { recursive: true }).catch(() => {})
    }
  }),
  registration('UI-114', 'pins-real-controls', async ctx => {
    const fixture = await seed(ctx, 'pin-toggle')
    const session = await ctx.browserSession({})
    try {
      await ctx.rpcSnapshot('before-pin')
      await route(session, '/files')
      for (const pinned of [true, false]) {
        await contextAction(session.page, fixture.name, 'Set pinning')
        const dialog = session.page.getByRole('dialog')
        const local = dialog.getByRole('button', { name: 'Local node', exact: true })
        const checkbox = local.locator('input[type="checkbox"]')
        if (await checkbox.isChecked() !== pinned) await local.click()
        await dialog.getByRole('button', { name: 'Apply', exact: true }).click()
        await expect(dialog).toHaveCount(0)
        await expect.poll(async () => {
          for await (const pin of fixture.node.api.pin.ls({ type: 'recursive' })) if (pin.cid.toString() === fixture.cid) return true
          return false
        }).toBe(pinned)
        ctx.assert(true, `Real local pin state is ${pinned ? 'pinned' : 'unpinned'} after the existing control`)
        await ctx.rpcSnapshot(pinned ? 'after-pin' : 'after-unpin')
      }
      await route(session, '/pins')
      await expect(session.page.locator('[data-id="PinsPage"]')).toBeVisible()
      await ctx.screenshot(session.page, 'pins-controls')
    } finally { await session.close(); await fixture.node.api.files.rm(fixture.path).catch(() => {}) }
  }),
  registration('UI-114', 'upload-cancellation', async ctx => {
    const node = await ctx.getNode()
    const session = await ctx.browserSession({})
    const name = 'boundary-cancel-upload.bin'
    const path = join(ctx.scratch, name)
    const payload = Buffer.alloc(16 * 1024 * 1024, 65)
    const requests = new Map()
    const copies = []
    let cdp, primaryError, cleanupError
    let writes = 0
    try {
      const before = await node.api.files.stat('/')
      session.page.on('request', request => { if (/\/api\/v0\/(?:add|files\/write)/.test(request.url())) writes++ })
      await route(session, '/files')
      await files.importButton(session.page).click()
      const chooser = session.page.waitForEvent('filechooser')
      await files.addFileOption(session.page).click()
      await (await chooser).setFiles([])
      const after = await node.api.files.stat('/')
      ctx.assert(before.cid.toString() === after.cid.toString() && writes === 0, 'Cancelled chooser issues no upload and leaves actual MFS unchanged')
      await ctx.record('chooser-cancellation', { before: before.cid.toString(), after: after.cid.toString(), writes })
      await ctx.screenshot(session.page, 'cancelled-chooser')
      await writeFile(path, payload)
      await ctx.record('inflight-upload-input', { name, bytes: payload.length, sha256: sha256(payload), transport: 'actual owned RPC; Chromium upload throughput only', uploadBytesPerSecond: 65536 })
      cdp = await session.context.newCDPSession(session.page)
      await cdp.send('Network.enable')
      cdp.on('Network.requestWillBeSent', event => {
        if (event.request.method === 'POST' && new URL(event.request.url).pathname === '/api/v0/add') requests.set(event.requestId, { id: event.requestId, method: event.request.method, hasPostData: event.request.hasPostData, started: event.timestamp })
        if (event.request.method === 'POST' && new URL(event.request.url).pathname === '/api/v0/files/cp') copies.push({ id: event.requestId, started: event.timestamp })
      })
      cdp.on('Network.loadingFinished', event => { const request = requests.get(event.requestId); if (request) request.terminal = { kind: 'finished', timestamp: event.timestamp } })
      cdp.on('Network.loadingFailed', event => { const request = requests.get(event.requestId); if (request) request.terminal = { kind: 'failed', timestamp: event.timestamp, canceled: event.canceled, errorText: event.errorText } })
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: 65536 })
      const starting = await node.api.files.stat('/')
      await files.importButton(session.page).click()
      const uploadChooser = session.page.waitForEvent('filechooser')
      await files.addFileOption(session.page).click()
      await (await uploadChooser).setFiles(path)
      const status = session.page.locator('.fileImportStatus')
      const cancel = status.getByRole('button', { name: `Cancel upload: ${name}`, exact: true })
      await expect(cancel).toBeEnabled()
      await expect.poll(async () => /\b[1-9]\d*%/.test(await status.innerText()) && [...requests.values()].some(request => !request.terminal)).toBe(true)
      const active = [...requests.values()].find(request => !request.terminal)
      ctx.assert(active?.method === 'POST' && active.hasPostData && copies.length === 0, 'An actual multipart add with rendered byte progress remains pending before Cancel; no copy has started', active)
      await ctx.screenshot(session.page, 'actual-pending-upload')
      ctx.assert(!active.terminal, 'Actual add is still pending immediately before activating Cancel')
      await cancel.click()
      await expect.poll(() => active.terminal?.kind).toBe('failed')
      ctx.assert(active.terminal.canceled === true || /abort|cancel/i.test(active.terminal.errorText), 'Actual pending network request terminates by cancellation', active)
      await expect(status.locator('.fileImportStatusTitle')).toContainText('Cancelled')
      await expect(status).toContainText('does not undo work already completed')
      const reconciled = await node.api.files.stat('/')
      const contents = []
      for await (const entry of node.api.files.ls('/')) contents.push(entry.name)
      ctx.assert(!contents.includes(name) && starting.cid.toString() === reconciled.cid.toString() && copies.length === 0, 'Cancelling during add starts no MFS copy; actual MFS is reconciled without claiming blockstore rollback')
      await ctx.record('actual-upload-cancellation', { requests: [...requests.values()], copies, before: starting.cid.toString(), after: reconciled.cid.toString(), targetPresent: contents.includes(name), blockstoreEffects: 'not measured; imported blocks may remain', clock: 'CDP monotonic seconds' })
      await ctx.screenshot(session.page, 'actual-upload-cancelled')
    } catch (error) {
      primaryError = error
      throw error
    } finally {
      const cleanup = []
      if (cdp) {
        try { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }) } catch (error) { cleanup.push(`restore throughput: ${error.message}`) }
        try { await cdp.detach() } catch (error) { cleanup.push(`detach owned CDP: ${error.message}`) }
      }
      try { await session.close() } catch (error) { cleanup.push(`close owned browser session: ${error.message}`) }
      try { await rm(path, { force: true }) } catch (error) { cleanup.push(`remove owned scratch payload: ${error.message}`) }
      await ctx.record('upload-fixture-cleanup', { cleanup, productionCompensation: 'none; no remove/unpin/GC rollback', actualAddRequestObserved: requests.size > 0 })
      if (cleanup.length && !primaryError) cleanupError = new Error(`Upload fixture cleanup incomplete: ${cleanup.join('; ')}`)
    }
    if (cleanupError) throw cleanupError
  }),
  registration('UI-114', 'virtual-keyboard-selection', async ctx => {
    const node = await ctx.getNode()
    const directory = '/boundary-virtual-selection'
    await node.api.files.mkdir(directory)
    for (let index = 0; index < 80; index++) await node.api.files.write(`${directory}/row-${String(index).padStart(3, '0')}.txt`, Buffer.from(String(index)), { create: true })
    const session = await ctx.browserSession({ width: 1100, height: 700 })
    try {
      await route(session, `/files${directory}`)
      const list = session.page.getByTestId('files-list')
      await expect(rows(session.page).first()).toBeVisible()
      await expect.poll(() => rows(session.page).count()).toBeLessThan(80)
      await session.page.locator('body').click({ position: { x: 1080, y: 680 } })
      for (let index = 0; index < 50; index++) await session.page.keyboard.press('ArrowDown')
      const focused = list.locator('[data-testid="file-row"]:has(input:focus)')
      await expect(focused).toContainText('row-')
      await expect.poll(() => session.page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
      await session.page.keyboard.press('Space')
      const selectedName = await focused.locator('.f6.truncate').innerText()
      await expect(focused.locator('input[type="checkbox"]')).toBeChecked()
      await session.page.setViewportSize({ width: 760, height: 650 })
      await expect(focused).toContainText(selectedName)
      await expect(focused.locator('input[type="checkbox"]')).toBeChecked()
      ctx.assert((await node.api.files.stat(`${directory}/${selectedName}`)).type === 'file', 'Virtual selection names an existing intended RPC row after resize')
      await ctx.record('selected-row', { directory, selectedName, renderedRows: await rows(session.page).count() })
      await ctx.screenshot(session.page, 'virtual-selection')
    } finally { await session.close(); await node.api.files.rm(directory, { recursive: true }) }
  }),
  registration('UI-114', 'native-modal', async ctx => {
    const session = await ctx.browserSession({})
    try {
      await route(session, '/peers')
      const opener = peers.addConnectionButton(session.page)
      await opener.focus()
      const overflow = await session.page.evaluate(() => document.body.style.overflow)
      await opener.click()
      const dialog = session.page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      ctx.assert(await dialog.evaluate(element => element.matches(':modal')), 'Actual native dialog entered the browser modal top layer')
      for (let index = 0; index < 12; index++) {
        await session.page.keyboard.press(index % 3 ? 'Tab' : 'Shift+Tab')
        ctx.assert(await dialog.evaluate(element => element.contains(document.activeElement)), 'Native keyboard navigation remains inside the modal')
      }
      await opener.evaluate(element => element.focus())
      ctx.assert(await dialog.evaluate(element => element.contains(document.activeElement)), 'Background opener is inert while native dialog is modal')
      await ctx.screenshot(session.page, 'native-modal-focus')
      await session.page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
      await expect(opener).toBeFocused()
      ctx.assert(await session.page.evaluate(() => document.body.style.overflow) === overflow, 'Escape restores opener and prior scroll lock state')
      await opener.click()
      await dialog.click({ position: { x: 2, y: 2 } })
      await expect(dialog).toHaveCount(0)
      await ctx.record('native-modal-behavior', { nativeModal: true, keyboardSteps: 12, backgroundFocusRejected: true, escapeRestored: true, backdropDismissed: true })
    } finally { await session.close() }
  })
]
