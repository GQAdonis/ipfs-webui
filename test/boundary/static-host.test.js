// @vitest-environment node
import { afterEach, expect, it } from 'vitest'
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { serveStatic } from './static-host.mjs'
const owned = []; const hosts = []
afterEach(async () => { for (const host of hosts.splice(0)) await host.close(); for (const root of owned.splice(0)) await rm(root, { recursive: true, force: true }) })
it('serves exact produced relative bytes on owned loopback without a proxy or write route', async () => {
  const root = await mkdtemp(join(tmpdir(), 'static-fixture-')); owned.push(root)
  await writeFile(join(root, 'index.html'), '<main>Exact production fixture</main>')
  await mkdir(join(root, 'static')); await writeFile(join(root, 'static/local.js'), 'export const local = true')
  const host = await serveStatic({ directory: root }); hosts.push(host)
  expect(new URL(host.baseURL).hostname).toBe('127.0.0.1')
  expect(await (await fetch(host.baseURL)).text()).toBe('<main>Exact production fixture</main>')
  expect(await (await fetch(new URL('static/local.js', host.baseURL))).text()).toBe('export const local = true')
  expect((await fetch(host.baseURL, { method: 'POST', body: 'no writes' })).status).toBe(405)
  expect((await fetch(new URL('agui', host.baseURL))).status).toBe(404)
})
it('refuses default/operator ports and a symlink escaping the produced directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'static-negative-')); owned.push(root)
  await mkdir(join(root, 'build')); await writeFile(join(root, 'private.txt'), 'Outside fixture')
  await symlink(join(root, 'private.txt'), join(root, 'build/leak.txt'))
  const host = await serveStatic({ directory: join(root, 'build') }); hosts.push(host)
  expect((await fetch(new URL('leak.txt', host.baseURL))).status).toBe(404)
  await expect(serveStatic({ directory: root, port: 8080 })).rejects.toThrow('non-default')
})
