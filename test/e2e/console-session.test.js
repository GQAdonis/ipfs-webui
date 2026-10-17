// console-session-auth, group 3 (kubo openspec/changes/console-session-auth/specs/webui-console-session).
//
// The page is served by the e2e static server, so every call to `/auth/session`, `/agui`,
// `/agent/settings` and `/index/*` is answered here by a route handler that plays the console's
// `ipfs mcp` (the server side, group 2, is built separately). `/api/v0` goes to the real Kubo node
// of the suite, so the shell is a real one. Nothing leaves the loopback interface.
//
// Evidence: set CONSOLE_SESSION_SHOTS to a directory and the states are also captured at 320 and
// 1440 px in both themes. Held for the phase gate: run with the e2e suite, not per edit.

import fs from 'node:fs'
import path from 'node:path'
import { test, expect } from './setup/coverage.js'
import { CHAT_KEY, CHAT_TOKEN_KEY, ORIGIN, REPORT, SEEDED_PASSWORD, SEEDED_TOKEN, installConsole } from './setup/console-session-mock.js'

const signedIn = (page) => page.getByRole('status').filter({ hasText: 'Signed in as ada@know-me.tools.' })

const everyStored = (page) => page.evaluate(() => JSON.stringify({ ...window.localStorage }) + JSON.stringify({ ...window.sessionStorage }))

const withAuthorization = (calls) => calls.filter((c) => c.headers.authorization !== undefined)

/** Open the chat and send a message by keyboard: the island's closed shadow root cannot be queried. */
async function chatSend (page, text) {
  await page.getByRole('button', { name: 'Agent chat' }).click()
  await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('IPFS-AGENT-CHAT')
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
}

const SHOTS = process.env.CONSOLE_SESSION_SHOTS
const VIEWPORTS = [{ width: 320, height: 900 }, { width: 1440, height: 900 }]
const THEMES = ['light', 'dark']

/** Capture the current state at 320 and 1440 px in both themes when evidence is requested. */
async function shoot (page, name) {
  if (!SHOTS) return
  fs.mkdirSync(SHOTS, { recursive: true })
  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      await page.setViewportSize(viewport)
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)
      await page.waitForTimeout(150)
      await page.screenshot({ path: path.join(SHOTS, `${name}-${viewport.width}-${theme}.png`) })
    }
  }
  await page.setViewportSize({ width: 1920, height: 1080 })
}

/** The profile an interim-credentials browser would hold: the chat token and a credentialed API address. */
async function seedInterimProfile (page) {
  await page.addInitScript(({ chatKey, tokenKey, token, password, origin }) => {
    if (window.sessionStorage.getItem('__seeded')) return
    window.sessionStorage.setItem('__seeded', '1')
    window.localStorage.setItem(chatKey, JSON.stringify({ enabled: true, endpoint: `${origin}/agui` }))
    window.localStorage.setItem(tokenKey, token)
    window.localStorage.setItem('ipfsApi', JSON.stringify(`http://e2e-user:${password}@${origin.replace('http://', '')}`))
  }, { chatKey: CHAT_KEY, tokenKey: CHAT_TOKEN_KEY, token: SEEDED_TOKEN, password: SEEDED_PASSWORD, origin: ORIGIN })
}

test.describe('console session mode', () => {
  test('the route answering 404 leaves the token path untouched (the disabled state)', async ({ page }) => {
    const calls = await installConsole(page, { session: 404 })
    await page.addInitScript(({ chatKey, tokenKey, token, origin }) => {
      window.localStorage.setItem(chatKey, JSON.stringify({ enabled: true, endpoint: `${origin}/agui` }))
      window.localStorage.setItem(tokenKey, token)
    }, { chatKey: CHAT_KEY, tokenKey: CHAT_TOKEN_KEY, token: SEEDED_TOKEN, origin: ORIGIN })
    await page.goto('/#/search')
    await expect(page.getByRole('heading', { name: 'Search', level: 1 })).toBeVisible()

    // Token mode: the saved token is kept and still sent as a bearer.
    expect(await page.evaluate((k) => window.localStorage.getItem(k), CHAT_TOKEN_KEY)).toBe(SEEDED_TOKEN)
    await expect.poll(() => calls.some((c) => c.family === 'index' && c.headers.authorization === `Bearer ${SEEDED_TOKEN}`)).toBe(true)
    expect(calls.filter((c) => c.family === 'session')).toHaveLength(1)
    await expect(page.locator('[data-id="AgentSessionExpired"]')).toHaveCount(0)
  })

  test('3.2: deletes the saved token and the credentialed API address, and holds no credential afterwards', async ({ page }) => {
    await installConsole(page)
    await seedInterimProfile(page)
    await page.goto('/#/settings/agent')
    await expect(signedIn(page)).toBeVisible()

    expect(await page.evaluate((k) => window.localStorage.getItem(k), CHAT_TOKEN_KEY)).toBeNull()
    expect(await page.evaluate(() => window.localStorage.getItem('ipfsApi'))).toBeNull()
    const stored = await everyStored(page)
    expect(stored).not.toContain(SEEDED_TOKEN)
    expect(stored).not.toContain(SEEDED_PASSWORD)
    expect(stored).not.toContain(Buffer.from(`e2e-user:${SEEDED_PASSWORD}`).toString('base64'))

    // Nothing the person does here puts a credential back: there is no field to type one into.
    await expect(page.getByLabel('Access token')).toHaveCount(0)
    await expect(page.getByLabel('Admin token')).toHaveCount(0)
    await page.reload()
    await expect(signedIn(page)).toBeVisible()
    const after = await everyStored(page)
    expect(after).not.toContain(SEEDED_TOKEN)
    expect(after).not.toContain(SEEDED_PASSWORD)
  })

  test('3.3: no request to /api/v0, /agui, settings or /index carries an Authorization header, and the cookie goes along', async ({ page, context }) => {
    const calls = await installConsole(page)
    await context.addCookies([{ name: 'ipfs-console-at', value: 'opaque-session-cookie', url: ORIGIN }])
    await seedInterimProfile(page)
    await page.goto('/#/search')
    await expect(page.getByRole('heading', { name: 'Search', level: 1 })).toBeVisible()
    await page.goto('/#/settings/agent')
    await expect(signedIn(page)).toBeVisible()
    await expect(page.getByText('Qwen3:8b').or(page.getByText(/qwen3:8b/)).first()).toBeVisible()

    // The chat: open it and send a message. The island's shadow root is closed in the shipped bundle, so
    // the page is driven by keyboard (opening the panel focuses its message box) and judged by its requests.
    await chatSend(page, 'Which recursive pins do I have?')
    await expect.poll(() => calls.some((c) => c.family === 'agui')).toBe(true)

    for (const f of ['api', 'agui', 'settings', 'index']) {
      expect(calls.filter((c) => c.family === f).length, `no ${f} request was made`).toBeGreaterThan(0)
    }
    expect(withAuthorization(calls).map((c) => c.path)).toEqual([])
    // credentials: 'same-origin' means the browser's own cookie for this origin is sent.
    for (const f of ['agui', 'settings', 'index']) {
      const own = calls.filter((c) => c.family === f)
      expect(own.every((c) => (c.headers.cookie ?? '').includes('ipfs-console-at=opaque-session-cookie')), `${f} requests carry the session cookie`).toBe(true)
    }
    await shoot(page, 'chat-signed-in')
  })

  test('3.4: signed in as, sign out to /oauth2/logout, and the separate know-me.tools note', async ({ page }) => {
    await installConsole(page)
    await page.goto('/#/settings/agent')
    await expect(signedIn(page)).toBeVisible()
    await expect(page.getByText(/does not sign you out of know-me\.tools/)).toBeVisible()
    await shoot(page, 'signed-in')

    const logout = page.waitForRequest((r) => new URL(r.url()).pathname === '/oauth2/logout' && r.isNavigationRequest())
    await page.getByRole('button', { name: 'Sign out' }).click()
    await logout
    await expect(page.getByText('signed out')).toBeVisible()
  })

  test('3.4: a 401 shows "Sign in again", which navigates the page to itself and sends no stored credential', async ({ page }) => {
    const calls = await installConsole(page, { settings: '401' })
    await seedInterimProfile(page)
    await page.goto('/#/settings/agent')
    await expect(page.getByRole('alert').filter({ hasText: 'Your sign-in has ended' }).first()).toBeVisible()
    await expect(page.locator('[data-id="AgentSessionExpired"]')).toBeVisible()
    await shoot(page, 'sign-in-again')

    const before = calls.length
    const navigated = page.waitForRequest((r) => r.isNavigationRequest() && new URL(r.url()).pathname === '/')
    await page.locator('[data-id="AgentSessionExpired"]').getByRole('button', { name: 'Sign in again' }).click()
    await navigated
    await expect(signedIn(page).or(page.locator('[data-id="AgentSessionExpired"]')).first()).toBeVisible()
    expect(withAuthorization(calls.slice(before))).toEqual([])
    expect(await everyStored(page)).not.toContain(SEEDED_TOKEN)
  })

  test('3.4: a 401 from the chat shows the Sign in again banner', async ({ page }) => {
    await installConsole(page, { agui: '401' })
    await page.goto('/#/files')
    await chatSend(page, 'hello')
    await expect(page.locator('[data-id="AgentSessionExpired"]')).toBeVisible()
    await shoot(page, 'chat-expired')
  })

  test('3.4: a 403 step_up_required explains the second factor and offers sign in and sign out', async ({ page }) => {
    await installConsole(page, { settings: 'stepup', report: { ...REPORT, admin: 'step_up_required' } })
    await page.goto('/#/settings/agent')
    await expect(page.getByText(/recent sign-in with a second factor/).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in again' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await shoot(page, 'step-up')
  })
})
