import { defineConfig } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { availablePort } from '../helpers/owned-kubo.mjs'

const webuiPort = process.env.E2E_WEBUI_PORT || String(await availablePort())
if (!/^\d+$/.test(webuiPort) || Number(webuiPort) < 1024 || Number(webuiPort) > 65535 || ['4001', '5001', '8080', '3001'].includes(webuiPort)) throw new Error('E2E requires an owned non-default loopback webserver port')
process.env.E2E_WEBUI_PORT = webuiPort
const state = process.env.E2E_STORAGE_STATE || `.cache/e2e-state-${randomUUID()}.json`
if (!/^\.cache\/e2e-state-[a-f0-9-]{36}\.json$/.test(state)) throw new Error('E2E storage must use its task-owned cache file')
process.env.E2E_STORAGE_STATE = state

/** @type {import('@playwright/test').Config} */
const config = {
  testDir: './',
  timeout: 30 * 1000,
  globalTimeout: 5 * 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.DEBUG ? 1 : undefined,
  reporter: 'list',
  use: {
    headless: !process.env.DEBUG,
    viewport: { width: 1920, height: 1080 },
    baseURL: `http://127.0.0.1:${webuiPort}/`,
    storageState: state,
    trace: 'retain-on-failure'
  },
  globalSetup: './setup/global-setup.js',
  webServer: [
    {
      command: `node node_modules/http-server/bin/http-server ./build/ -c-1 -a 127.0.0.1 -p ${webuiPort}`,
      timeout: 30 * 1000,
      url: `http://127.0.0.1:${webuiPort}/`,
      cwd: '../../',
      reuseExistingServer: false
    }
  ],
  collectCoverage: true,
  coverageConfig: {
    include: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.stories.{js,jsx,ts,tsx}'
    ]
  }
}

export default defineConfig(config)
