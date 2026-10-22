import { test, expect } from './setup/coverage.js'

// Authored for the phase integration gate: real window layout and the actual
// virtualized list are necessary to catch focus moving into unmounted rows.
test('keeps keyboard focus and selection across a window-scrolled Files list', async ({ page, ipfs }) => {
  const directory = `/react19-scroll-${Date.now()}`
  await ipfs.files.mkdir(directory)
  try {
    for (let offset = 0; offset < 80; offset += 8) {
      await Promise.all(Array.from({ length: 8 }, (_, index) => {
        const name = `row-${String(offset + index).padStart(3, '0')}.txt`
        return ipfs.files.write(`${directory}/${name}`, new TextEncoder().encode(name), { create: true })
      }))
    }
    await page.setViewportSize({ width: 1100, height: 700 })
    await page.addInitScript(() => {
      localStorage.setItem('files.viewMode', JSON.stringify('list'))
      localStorage.setItem('files.sorting', JSON.stringify({ by: 'name', asc: true }))
    })
    await page.goto(`/#/files${directory}`)
    const list = page.getByTestId('files-list')
    const rows = list.getByTestId('file-row')
    await expect(rows.first()).toBeVisible()
    await expect.poll(() => rows.count()).toBeLessThan(80)
    // Let the document keyboard handler establish its own focused row.
    await page.locator('body').click({ position: { x: 1080, y: 680 } })
    for (let index = 0; index < 50; index++) await page.keyboard.press('ArrowDown')
    const focused = list.locator('[data-testid="file-row"]:has(input:focus)')
    await expect(focused).toContainText('row-')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await page.keyboard.press('Space')
    await expect(focused.locator('input[type="checkbox"]')).toBeChecked()
    const selectedName = await focused.locator('.f6.truncate').innerText()
    await page.setViewportSize({ width: 760, height: 650 })
    await expect(focused).toContainText(selectedName)
    await expect(focused.locator('input[type="checkbox"]')).toBeChecked()
    await page.keyboard.press('ArrowDown')
    await expect(focused).not.toContainText(selectedName)
    await page.keyboard.press('ArrowUp')
    await expect(focused).toContainText(selectedName)
    await expect(focused.locator('input[type="checkbox"]')).toBeChecked()
    await page.goto('/#/status')
    await expect(list).toHaveCount(0)
  } finally {
    await ipfs.files.rm(directory, { recursive: true })
  }
})
