// Imported by the F1.10 browser boundary fixture. Keep this definition outside
// Vitest's source globs and the historical browser test directory until then.
export function registerExplorerNavigationFixture (test, expect) {
  test('maintained Explorer traverses a DAG and honors back/forward and invalid input', async ({ page, ipfs }) => {
    const child = await ipfs.dag.put({ label: 'React 19 Explorer parity' }, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256' })
    const root = await ipfs.dag.put({ child }, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256' })
    await page.addInitScript(() => { localStorage.setItem('explore.ipld.gatewayEnabled', 'false') })
    await page.goto(`/#/explore/${root}`)
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveText(root.toString())
    const childLink = page.getByRole('button', { name: `child ${child}` })
    await childLink.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`${root}/child$`))
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveText(child.toString())
    await page.goBack()
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveText(root.toString())
    await page.goForward()
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveText(child.toString())
    await page.goto('/#/explore/%broken')
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveCount(0)
    await expect(page.locator('.e2e-explorePage')).toContainText(/Error|CID|decode/i)
    await page.goto('/#/explore/bafkqac3imvwgy3zao5xxe3de')
    await expect(page.locator('[data-id="ObjectInfo-cid"]')).toHaveText('bafkqac3imvwgy3zao5xxe3de')
    await expect(page.getByText('Raw Block', { exact: true })).toBeVisible()
  })
}
