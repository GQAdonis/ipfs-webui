// webui-vector-search 1.7: the Search page against a stub `ipfs mcp` that serves fixed
// /index/status and /index/search responses (test/e2e/stub-ipfs-mcp.js). No Kubo node is
// asked anything about search, no embedder runs and nothing leaves the loopback interface.
//
// Held for the phase gate: run with the e2e suite (`npm run test:e2e`), not per edit.

import { test, expect } from './setup/coverage.js'
import { startStub, CID_INVOICE, CID_PHOTO, XSS_SNIPPET } from './stub-ipfs-mcp.js'

const CHAT_KEY = 'ipfs-webui:agent-chat'
const CHAT_TOKEN_KEY = 'ipfs-webui:agent-chat:token'

const searchNav = (page) => page.getByRole('menuitem', { name: 'Search' })
const searchBox = (page) => page.getByRole('searchbox', { name: 'Search your files' })
const indexRequests = (stub) => stub.requests().filter((r) => r.path.startsWith('/index/'))

test.describe('Search page', () => {
  /** @type {Awaited<ReturnType<typeof startStub>>} */
  let stub

  test.beforeAll(async () => {
    stub = await startStub()
  })

  test.afterAll(async () => {
    await stub.close()
  })

  test.beforeEach(async ({ page }) => {
    stub.setScenario({ status: 'idle', search: 'ok' })
    // The Web UI takes the endpoint and token from the same place as the agent chat.
    await page.addInitScript(({ endpoint, token, chatKey, tokenKey }) => {
      window.localStorage.setItem(chatKey, JSON.stringify({ enabled: true, endpoint }))
      window.localStorage.setItem(tokenKey, token)
    }, { endpoint: stub.endpoint, token: stub.token, chatKey: CHAT_KEY, tokenKey: CHAT_TOKEN_KEY })
  })

  test('searches, filters and opens a hit in Files', async ({ page }) => {
    await page.goto('/#/search')
    await expect(searchNav(page)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Search', level: 1 })).toBeVisible()

    await searchBox(page).fill('the roofer')
    await page.getByRole('button', { name: 'Search', exact: true }).click()

    const results = page.getByRole('article')
    await expect(results).toHaveCount(5)
    await expect(page.getByText('From the file').first()).toBeVisible()
    await expect(page.getByText('Text in image')).toBeVisible()
    await expect(page.getByText('Transcript', { exact: true }).last()).toBeVisible()
    await expect(page.getByText('AI description by llava-7b')).toBeVisible()

    // Untrusted text stays text: the snippet is shown as characters and creates no element.
    await expect(page.getByText(XSS_SNIPPET)).toBeVisible()
    await expect(page.locator('.sr-results img')).toHaveCount(0)

    // Filter to images: the request carries the kind and the list narrows.
    await page.getByRole('button', { name: 'Images' }).click()
    await expect(page.getByRole('button', { name: 'Images' })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await expect(results).toHaveCount(2)
    const searches = stub.requests().filter((r) => r.path === '/index/search')
    expect(searches.at(-1).body).toMatchObject({ query: 'the roofer', kinds: ['image'] })
    expect(searches.every((r) => r.authorized)).toBe(true)

    // Open a hit in Files.
    await page.getByRole('link', { name: 'Open in Files' }).first().click()
    await expect(page).toHaveURL(new RegExp(`#/ipfs/${CID_PHOTO}$`))
    await expect(page.getByRole('searchbox', { name: 'Search your files' })).toHaveCount(0)
  })

  test('opens a document hit in Explore', async ({ page }) => {
    await page.goto('/#/search')
    await searchBox(page).fill('invoice')
    await page.getByRole('button', { name: 'Documents' }).click()
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await page.getByRole('link', { name: 'Explore' }).first().click()
    await expect(page).toHaveURL(new RegExp(`#/explore/${CID_INVOICE}$`))
  })

  test('shows the index status, read only', async ({ page }) => {
    stub.setScenario({ status: 'running' })
    await page.goto('/#/search')
    const panel = page.getByRole('region', { name: 'Index' })
    await expect(panel.getByText('Running')).toBeVisible()
    await expect(panel.getByText('Why files were skipped')).toBeVisible()
    await expect(panel.getByText(/Ask the agent to index your pinned files/)).toBeVisible()
    await expect(panel.getByRole('button', { name: /start|resume|pause|cancel/i })).toHaveCount(0)
  })

  test('says what to do when the token lacks egress acknowledgement', async ({ page }) => {
    stub.setScenario({ search: 'egress' })
    await page.goto('/#/search')
    await searchBox(page).fill('anything')
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    const alert = page.getByRole('alert')
    await expect(alert).toContainText('Not allowed to send content')
    await expect(page.getByText('embed.internal.example')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Read the search setup' })).toBeVisible()
  })

  test('hides the entry when the node serves no index', async ({ page }) => {
    stub.setScenario({ status: 'notconfigured' })
    await page.goto('/#/blank')
    await expect(page.getByRole('menuitem', { name: 'Status' })).toBeVisible()
    await expect(searchNav(page)).toHaveCount(0)
  })

  test('disabled state: the switch on Agent settings removes the entry, the page redirects and no /index request follows', async ({ page }) => {
    // Turned off the way a person does it: the switch in Settings, Agent, Features.
    await page.goto('/#/settings/agent')
    const toggle = page.getByRole('switch', { name: 'Search your files' })
    await expect(toggle).toBeVisible()
    await expect(searchNav(page)).toHaveCount(1)
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await expect(searchNav(page)).toHaveCount(0)
    const before = indexRequests(stub).length
    await page.goto('/#/search')
    await expect(page).not.toHaveURL(/#\/search/)
    await expect(page.getByRole('menuitem', { name: 'Status' })).toBeVisible()
    await expect(searchNav(page)).toHaveCount(0)
    await expect(searchBox(page)).toHaveCount(0)
    expect(indexRequests(stub).length).toBe(before)
  })
})
