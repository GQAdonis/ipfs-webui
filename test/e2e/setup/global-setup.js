import { chromium } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'
import { run, stop } from './ipfs-backend.js'

// make sure that ipfs-backend is fully running
const ensureKuboDaemon = async (apiOpts) => {
  const backendEndpoint = `${apiOpts.protocol}://${apiOpts.host}:${apiOpts.port}`

  const body = new FormData()
  body.append('file', new Blob(new Uint8Array([1, 2, 3])), 'test.txt')

  const fakeFileResult = await fetch(`${backendEndpoint}/api/v0/block/put`, { body, method: 'POST' })
  if (!fakeFileResult.ok) {
    throw new Error(`IPFS backend not running at ${backendEndpoint}`)
  }

  const { Key: cidString } = await fakeFileResult.json()

  const getContentResult = await fetch(`${backendEndpoint}/api/v0/block/get?arg=${cidString}`, { method: 'POST' })
  if (!getContentResult.ok) {
    throw new Error(`IPFS backend not running at ${backendEndpoint}`)
  }
}

const globalSetup = async config => {
  const { baseURL, storageState } = config.projects[0].use
  const backendConfig = await run([new URL(baseURL).origin])
  const { rpcAddr, id, agentVersion, apiOpts, kuboGateway } = backendConfig

  process.env.IPFS_RPC_ADDR = rpcAddr
  process.env.IPFS_RPC_ID = id
  process.env.IPFS_RPC_VERSION = agentVersion
  process.env.IPFS_GATEWAY_PORT = String(kuboGateway.port)

  let browser
  try {
    await ensureKuboDaemon(apiOpts)
    browser = await chromium.launch()
    const context = await browser.newContext()
    const rpcEndpoint = `${apiOpts.protocol}://${apiOpts.host}:${apiOpts.port}`
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (['http:', 'https:'].includes(url.protocol) && ![new URL(baseURL).origin, rpcEndpoint, `http://${kuboGateway.host}:${kuboGateway.port}`].includes(url.origin)) return route.abort('blockedbyclient')
      return route.continue()
    })
    await context.addInitScript(({ kuboGateway, rpcEndpoint }) => {
      localStorage.setItem('kuboGateway', JSON.stringify({ ...kuboGateway, trustlessBlockBrokerConfig: { init: { allowInsecure: true, allowLocal: true } } }))
      localStorage.setItem('ipfsApi', JSON.stringify(rpcEndpoint))
      localStorage.setItem('explore.ipld.gatewayEnabled', 'false')
    }, { rpcEndpoint, kuboGateway })
    const page = await context.newPage()
    await page.goto(baseURL)
    fs.mkdirSync(path.dirname(storageState), { recursive: true })
    await context.storageState({ path: storageState })
    return async () => { await stop(); fs.rmSync(storageState, { force: true }) }
  } catch (error) {
    await stop()
    throw error
  } finally { await browser?.close() }
}

export default globalSetup
