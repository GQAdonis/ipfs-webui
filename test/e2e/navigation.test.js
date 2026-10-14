import { test, expect } from './setup/coverage.js'
import { nav } from './setup/locators.js'
import { BRAND } from '../../src/promethity/brand.js'

test.describe('Navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/blank')
  })

  test('should work for Status page', async ({ page }) => {
    const link = nav.status(page)
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveTitle(`Status | ${BRAND.name}`)
  })

  test('should work for Files page', async ({ page }) => {
    const link = nav.files(page)
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveTitle(`/ | Files | ${BRAND.name}`)
  })

  test('should work for Explore page', async ({ page }) => {
    const link = nav.explore(page)
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveTitle('Explore | IPLD')
  })

  test('should work for Peers page', async ({ page }) => {
    const link = nav.peers(page)
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveTitle(`Peers | ${BRAND.name}`)
  })

  test('should work for Settings page', async ({ page }) => {
    const link = nav.settings(page)
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveTitle(`Settings | ${BRAND.name}`)
  })
})
