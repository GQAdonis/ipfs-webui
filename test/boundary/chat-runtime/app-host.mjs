// Local adaptation of mcp/app/tests/visual/host.ts: same protocol driver, actual produced HTML.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { chatBrowser, expectFor } from './browser.mjs'

const CSP = "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' data:; connect-src 'none'"
async function open (page, html, tool, output) {
  await page.setContent('<!doctype html><html lang="en"><head><title>External MCP protocol host</title></head><body><main aria-label="External MCP host"><h1>MCP host</h1><iframe title="IPFS tool view" id="view" sandbox="allow-scripts" style="border:0;width:100%;height:900px"></iframe></main></body></html>')
  await page.evaluate(({ html, tool, output, csp }) => {
    const frame = document.querySelector('#view'); window.__appLog = { initialized: 0, calls: [], messages: [], contexts: [] }
    const send = message => frame.contentWindow.postMessage({ jsonrpc: '2.0', ...message }, '*')
    window.__appSend = send
    window.addEventListener('message', event => {
      if (event.source !== frame.contentWindow) return
      const message = event.data ?? {}
      if (message.method === 'ui/initialize') send({ id: message.id, result: { protocolVersion: message.params?.protocolVersion ?? '2026-01-26', hostInfo: { name: 'boundary-external-host', version: '1.0.0' }, hostCapabilities: { serverTools: {}, message: { text: {} }, updateModelContext: { text: {} } }, hostContext: { theme: 'dark', displayMode: 'inline', toolInfo: { id: 1, tool: { name: tool, inputSchema: { type: 'object' } } } } } })
      else if (message.method === 'ui/notifications/initialized') { window.__appLog.initialized++; send({ method: 'ui/notifications/tool-input', params: { arguments: {} } }); send({ method: 'ui/notifications/tool-result', params: { content: [{ type: 'text', text: JSON.stringify(output) }], structuredContent: output, _meta: { 'ai.ipfs/tool': tool } } }) }
      else if (message.method === 'tools/call') { window.__appLog.calls.push(message.params); send({ id: message.id, result: { content: [], isError: true } }) }
      else if (message.method === 'ui/message') { window.__appLog.messages.push(message.params); send({ id: message.id, result: {} }) }
      else if (message.method === 'ui/update-model-context') { window.__appLog.contexts.push(message.params); send({ id: message.id, result: {} }) }
      else if (message.method === 'ping') send({ id: message.id, result: {} })
    })
    frame.setAttribute('csp', csp); frame.srcdoc = html
  }, { html, tool, output, csp: CSP })
  const frame = await (await page.waitForSelector('#view')).contentFrame()
  await frame.waitForSelector('main.app'); await frame.waitForFunction(() => document.fonts.status === 'loaded')
  return frame
}
export async function appHostCase (ctx, kind) {
  const session = await chatBrowser(ctx), expect = expectFor(ctx)
  const views = { pins: 'pin_ls', content: 'ipfs_ls', mfs: 'mfs_ls', dag: 'dag_get', 'node-status': 'ipfs_node_status' }, results = []
  const outputs = await session.page.evaluate(tools => Object.fromEntries(tools.map(tool => [tool, window.__chatRuntime.output(tool)])), Object.values(views))
  // A fresh document avoids inheriting the chat fixture's deliberately frame-free meta CSP.
  const producerPage = session.page
  session.page = await session.context.newPage()
  await producerPage.close()
  try {
    for (const [view, tool] of Object.entries(views)) {
      const htmlFile = join(ctx.kubo, `mcp/app/dist/${view}.html`), html = await readFile(htmlFile, 'utf8')
      const catalog = JSON.parse(await readFile(join(ctx.kubo, 'mcp/contract/derivations/a2ui-components.json'), 'utf8'))
      // Canonical authored tool output, never an operator or invented backend response.
      const fixtureFile = join(ctx.kubo, 'mcp/ui/tests/fixtures/outputs.ts'), output = outputs[tool]
      const frame = await open(session.page, html, tool, output)
      await expect(frame.locator('main.app')).toBeVisible()
      await expect.poll(() => session.page.evaluate(() => window.__appLog.initialized)).toBe(1)
      const binding = catalog.viewBindings.find(value => value.view === view)
      ctx.assert((await frame.locator('body').innerText()).trim().length > 0 && binding?.file === `${view}.html` && binding.allowedComponents.includes(binding.component), `Produced ${view} renders through external SDK initialization and contract-derived binding`)
      if (kind === 'origin-correlation-negative') {
        const before = await frame.locator('body').innerText()
        await frame.evaluate(() => {
          const data = { jsonrpc: '2.0', method: 'ui/notifications/tool-result', params: { content: [{ type: 'text', text: 'WRONG_SOURCE_MUTATION' }], structuredContent: { html: '<a href="https://boundary.invalid">execute</a>' } } }
          window.dispatchEvent(new MessageEvent('message', { source: window, origin: document.referrer ? new URL(document.referrer).origin : 'null', data }))
          window.dispatchEvent(new MessageEvent('message', { source: window.parent, origin: 'https://wrong-origin.invalid', data }))
        })
        await session.page.evaluate(() => window.__appSend({ id: 'unknown-correlation', result: { structuredContent: { html: 'WRONG_CORRELATION_MUTATION' } } }))
        ctx.assert(await frame.locator('body').innerText() === before && await frame.locator('a[href="https://boundary.invalid"]').count() === 0, `${view}: wrong source/origin and unmatched response correlation cannot mutate the view`)
      }
      await ctx.screenshot(session.page, `${kind}-${view}`)
      results.push({ view, tool, htmlSha256: sha256(html), fixture: { path: fixtureFile, sha256: sha256(await readFile(fixtureFile)) } })
      ctx.assert(sha256(await readFile(htmlFile)) === sha256(html), 'Executed single-file resource remains unchanged')
    }
    ctx.assert(results.length === 5, 'All five produced MCP App view resources were actually embedded')
    await ctx.record(kind, { kind: 'supplemental-external-protocol-browser', results, csp: CSP, hostSource: { path: 'mcp/app/tests/visual/host.ts', sha256: sha256(await readFile(join(ctx.kubo, 'mcp/app/tests/visual/host.ts'))) } })
  } finally { await session.close() }
}
