import React from 'react'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import webmcpEn from '../../public/locales/en/webmcp.json'
import { contextBridge } from '../helpers/context-bridge'
import { TOOL_DEFINITIONS, EXCLUDED_TOOLS } from './vendor/index.js'
import { WebMcpController } from './WebMcpHost.js'
import { ARM_MS } from './WebMcpConfirmDialog.js'
import { WebMcpHost, WebMcpSettings } from './index.js'
import * as queue from './confirmation-queue.js'
import * as status from './registration-status.js'
import * as store from './settings-store.js'
import { isTrustedEvent } from './trust.js'

// jsdom never produces a trusted event, so the trust check is a seam: by default it says
// "untrusted" (what a script's .click() looks like) and a test says "trusted" to stand in
// for a real press.
jest.mock('./trust.js', () => ({ isTrustedEvent: jest.fn(() => false) }))

// The Web UI loads translations through i18next-icu (src/i18n.js), so the tests do too.
// Plain i18next would accept a message the real app renders as literal braces.
i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['webmcp'],
  defaultNS: 'webmcp',
  resources: { en: { webmcp: webmcpEn } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

const CID = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
const KEY_CID = 'k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8'
const READ_COUNT = TOOL_DEFINITIONS.filter((t) => t.confirmation === 'none').length
const ALL_COUNT = TOOL_DEFINITIONS.length

/** A document.modelContext stand-in that records registrations and their signals. */
function fakeModelContext () {
  const registered = []
  return {
    registered,
    registerTool: jest.fn((tool, options) => { registered.push({ tool, signal: options?.signal }) }),
    names: () => registered.map((r) => r.tool.name),
    tool: (name) => registered.find((r) => r.tool.name === name)?.tool,
    live: () => registered.filter((r) => !r.signal?.aborted).map((r) => r.tool.name)
  }
}

/** An ipfs client whose every method is a recorded call; unknown methods throw. */
function fakeIpfs (handlers = {}) {
  const calls = []
  const make = (path) => new Proxy(function () {}, {
    get (_t, prop) {
      if (typeof prop === 'symbol' || prop === 'then') return undefined
      return make(path ? `${path}.${prop}` : prop)
    },
    apply (_t, _this, args) {
      calls.push(path)
      const handler = handlers[path]
      if (!handler) throw new Error(`unexpected RPC call ${path}`)
      return handler(...args)
    }
  })
  return { client: make(''), calls }
}

const flush = () => act(async () => { await Promise.resolve() })
const deny = () => screen.getByRole('button', { name: /^Deny: / })
const approveButton = () => screen.getByRole('button', { name: /^Approve: / })
const denyAllButton = () => screen.getByRole('button', { name: 'Deny all and turn off agent writes' })
const advance = (ms) => act(async () => { jest.advanceTimersByTime(ms) })

/** A real press on Approve: armed, a fresh trusted pointerdown, then a trusted click with detail 1. */
async function pressApprove () {
  isTrustedEvent.mockReturnValue(true)
  await advance(ARM_MS)
  const button = approveButton()
  await act(async () => { fireEvent.pointerDown(button) })
  await act(async () => { fireEvent.click(button, { detail: 1 }) })
}

beforeEach(() => {
  localStorage.clear()
  store.resetForTests()
  queue.resetForTests()
  status.resetForTests()
  isTrustedEvent.mockReturnValue(false)
})

afterEach(() => {
  cleanup()
  jest.useRealTimers()
  contextBridge.setContext('selectIpfs', undefined)
  document.title = ''
})

describe('the vendored package', () => {
  it('matches its MANIFEST.json, including its provenance', () => {
    const out = execFileSync(process.execPath, [join(__dirname, 'vendor-webmcp.mjs'), '--check'], { encoding: 'utf8' })
    expect(out).toMatch(/^ok: \d+ files match/)
    const manifest = require('./vendor/MANIFEST.json')
    expect(manifest.kuboCommit).toMatch(/^([0-9a-f]{40}|uncommitted)$/)
    expect(manifest.contractVersion).toBe('0.1.0')
    expect(manifest.generatedToolsSha256).toMatch(/^[0-9a-f]{64}$/)
  })

  it('exports no destructive tool and names them as excluded', () => {
    expect(TOOL_DEFINITIONS.some((t) => t.confirmation === 'destructive')).toBe(false)
    expect(EXCLUDED_TOOLS.filter((t) => t.reason === 'destructive').map((t) => t.name)).toEqual(
      expect.arrayContaining(['pin_rm', 'mfs_rm', 'key_rm', 'repo_gc'])
    )
    expect(TOOL_DEFINITIONS.some((t) => t.name === 'car_import')).toBe(false)
  })

  it('has localized copy for every exported write tool', () => {
    const writes = TOOL_DEFINITIONS.filter((t) => t.confirmation === 'write').map((t) => t.name)
    expect(Object.keys(webmcpEn.effects).sort()).toEqual(writes.sort())
  })
})

describe('translations use ICU syntax like the rest of the Web UI', () => {
  it('leaves no unrendered placeholder in the Settings text', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    const { container } = render(<><WebMcpSettings /><WebMcpController ipfs={client} doc={{ modelContext: mc }} /></>)
    await flush()
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent(`Registered ${READ_COUNT} tools. None of them change your node.`)
    expect(container.textContent).not.toMatch(/[{}]|_one|_other|plural/)
  })

  it('renders singular and plural forms', async () => {
    const t = i18n.getFixedT('en', 'webmcp')
    expect(t('status.registered', { count: 1 })).toBe('Registered 1 tool.')
    expect(t('status.registered', { count: 5 })).toBe('Registered 5 tools.')
    expect(t('dialog.expiry', { seconds: 1 })).toBe('Unanswered, this request is denied after 1 second.')
    expect(t('dialog.queued', { count: 2 })).toBe('2 more requests are waiting.')
    expect(t('dialog.title', { title: 'Pin content' })).toBe('Confirm: Pin content')
  })
})

describe('registration', () => {
  it('registers nothing on a fresh profile, even when the browser has WebMCP', async () => {
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    expect(store.getSettings()).toEqual({ enabled: false, dnslink: false, writes: false })
    render(<WebMcpController ipfs={client} doc={{ modelContext: mc }} />)
    await flush()
    expect(mc.registerTool).not.toHaveBeenCalled()
    expect(status.getStatus().state).toBe('off')
  })

  it('registers nothing when the switch is on but the browser has no document.modelContext', async () => {
    store.updateSettings({ enabled: true })
    const { client } = fakeIpfs()
    render(<WebMcpController ipfs={client} doc={{}} />)
    await flush()
    expect(status.getStatus().state).toBe('unavailable')
    render(<WebMcpSettings />)
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent(/Not available/)
  })

  it('does not fall back to navigator.modelContext', async () => {
    const navigatorMc = fakeModelContext()
    Object.defineProperty(globalThis.navigator, 'modelContext', { value: navigatorMc, configurable: true })
    try {
      store.updateSettings({ enabled: true })
      const { client } = fakeIpfs()
      render(<WebMcpController ipfs={client} doc={{}} />)
      await flush()
      expect(navigatorMc.registerTool).not.toHaveBeenCalled()
    } finally {
      delete globalThis.navigator.modelContext
    }
  })

  it('registers the read tools only when the switch is on and the browser has WebMCP', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    render(<WebMcpController ipfs={client} doc={{ modelContext: mc }} />)
    await flush()
    expect(mc.registerTool).toHaveBeenCalledTimes(READ_COUNT)
    expect(mc.names()).toContain('ipfs_cat')
    expect(mc.names()).not.toContain('pin_add')
    expect(mc.registered.every((r) => r.signal && !r.signal.aborted)).toBe(true)
    expect(status.getStatus()).toMatchObject({ state: 'registered', registered: READ_COUNT, failed: 0, writes: 0 })
    expect(Object.keys(mc.tool('ipfs_cat')).sort()).toEqual(['annotations', 'description', 'execute', 'inputSchema', 'name', 'title'])
  })

  it('waits for the node connection instead of registering with no client', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    render(<WebMcpController doc={{ modelContext: mc }} />)
    await flush()
    expect(mc.registerTool).not.toHaveBeenCalled()
    expect(status.getStatus().state).toBe('waiting')
  })

  it('adds write tools only under the second switch, and removes them when it goes off', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    render(<WebMcpController ipfs={client} doc={{ modelContext: mc }} />)
    await flush()
    await act(async () => { store.updateSettings({ writes: true }) })
    await flush()
    expect(mc.live().length).toBe(ALL_COUNT)
    expect(status.getStatus()).toMatchObject({ registered: ALL_COUNT, writes: ALL_COUNT - READ_COUNT })
    await act(async () => { store.updateSettings({ writes: false }) })
    await flush()
    expect(mc.live().length).toBe(READ_COUNT)
    expect(mc.live()).not.toContain('mfs_write')
  })

  it('unregisters everything when the switch goes off, and when the page unmounts', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    const view = render(<WebMcpController ipfs={client} doc={{ modelContext: mc }} />)
    await flush()
    expect(mc.live().length).toBe(READ_COUNT)
    await act(async () => { store.updateSettings({ enabled: false }) })
    expect(mc.live()).toEqual([])
    expect(status.getStatus().state).toBe('off')
    await act(async () => { store.updateSettings({ enabled: true }) })
    await flush()
    expect(mc.live().length).toBe(READ_COUNT)
    view.unmount()
    expect(mc.live()).toEqual([])
  })

  it('the mounted host reads the node client the app already holds', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    Object.defineProperty(globalThis.document, 'modelContext', { value: mc, configurable: true })
    try {
      const { client } = fakeIpfs()
      contextBridge.setContext('selectIpfs', client)
      render(<WebMcpHost />)
      await flush()
      expect(mc.registerTool).toHaveBeenCalledTimes(READ_COUNT)
    } finally {
      delete globalThis.document.modelContext
    }
  })

  it('the mounted host registers nothing while the switch is off', async () => {
    const mc = fakeModelContext()
    Object.defineProperty(globalThis.document, 'modelContext', { value: mc, configurable: true })
    try {
      const { client } = fakeIpfs()
      contextBridge.setContext('selectIpfs', client)
      render(<WebMcpHost />)
      await flush()
      expect(mc.registerTool).not.toHaveBeenCalled()
      expect(screen.queryByTestId('webmcp-outcome')).toBeNull()
    } finally {
      delete globalThis.document.modelContext
    }
  })
})

describe('settings store', () => {
  it('turning the feature off clears the other two switches, so turning it on again is read-only', () => {
    store.updateSettings({ enabled: true })
    store.updateSettings({ writes: true, dnslink: true })
    expect(store.getSettings()).toEqual({ enabled: true, dnslink: true, writes: true })
    store.updateSettings({ enabled: false })
    store.updateSettings({ enabled: true })
    expect(store.getSettings()).toEqual({ enabled: true, dnslink: false, writes: false })
  })

  it('does not persist the write switch: it lasts for this page load only', () => {
    store.updateSettings({ enabled: true, dnslink: true })
    store.updateSettings({ writes: true })
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toEqual({ enabled: true, dnslink: true })
    // Same-origin content writes "writes: true" into storage: a reload ignores it.
    localStorage.setItem(store.STORAGE_KEY, JSON.stringify({ enabled: true, dnslink: false, writes: true }))
    store.resetForTests()
    expect(store.getSettings()).toEqual({ enabled: true, dnslink: false, writes: false })
  })

  it('ignores stored dependent switches when the feature is off, and bad JSON', () => {
    localStorage.setItem(store.STORAGE_KEY, JSON.stringify({ enabled: false, dnslink: true, writes: true }))
    store.resetForTests()
    expect(store.getSettings()).toEqual({ enabled: false, dnslink: false, writes: false })
    localStorage.setItem(store.STORAGE_KEY, '{not json')
    store.resetForTests()
    expect(store.getSettings()).toEqual({ enabled: false, dnslink: false, writes: false })
  })

  it('works when storage is blocked: the settings then last for the page only', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    try {
      store.updateSettings({ enabled: true })
      expect(store.getSettings().enabled).toBe(true)
    } finally {
      spy.mockRestore()
    }
  })
})

describe('live off switch', () => {
  async function setup (handlers = {}, settings = { enabled: true, writes: true }) {
    store.updateSettings(settings)
    const mc = fakeModelContext()
    const ipfs = fakeIpfs(handlers)
    render(<WebMcpController ipfs={ipfs.client} doc={{ modelContext: mc }} />)
    await flush()
    return { mc, ipfs }
  }

  it('a host that ignores unregistration still gets declined results and no RPC request', async () => {
    const { mc, ipfs } = await setup({ 'key.list': async () => [] })
    const read = mc.tool('key_list')
    const write = mc.tool('mfs_mkdir')
    expect(await read.execute({})).toMatchObject({ ok: true })
    ipfs.calls.length = 0
    // Switch WebMCP off. The host keeps the tool objects and keeps calling them.
    await act(async () => { store.updateSettings({ enabled: false }) })
    expect(await read.execute({})).toMatchObject({ ok: false, status: 'declined', code: 'inactive' })
    expect(await write.execute({ path: '/d' })).toMatchObject({ ok: false, status: 'declined', code: 'inactive' })
    expect(ipfs.calls).toEqual([])
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('a registration that was replaced is declined even if the host kept it', async () => {
    const { mc, ipfs } = await setup({ 'key.list': async () => [] })
    const oldRead = mc.tool('key_list')
    await act(async () => { store.updateSettings({ writes: false }) })
    await flush()
    expect(await oldRead.execute({})).toMatchObject({ ok: false, status: 'declined', code: 'inactive' })
    expect(ipfs.calls).toEqual([])
  })

  it('turning writes off declines a write tool the host kept, without a prompt or an RPC request', async () => {
    const { mc, ipfs } = await setup()
    const write = mc.tool('mfs_mkdir')
    await act(async () => { store.updateSettings({ writes: false }) })
    expect(await write.execute({ path: '/d' })).toMatchObject({ ok: false, status: 'declined' })
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(ipfs.calls).toEqual([])
  })

  it('the confirmation hook itself declines when writes are off', async () => {
    store.updateSettings({ enabled: true })
    expect(await queue.requestConfirmation({ tool: 'mfs_mkdir', title: 'x', confirmation: 'write', effect: '', targets: [], details: [] })).toBe('writes_off')
    expect(queue.getPending()).toEqual([])
  })
})

describe('DNSLink toggle', () => {
  it('declines a domain name before any RPC request while the toggle is off, and resolves it when on', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const ipfs = fakeIpfs({
      'files.stat': async () => ({ cid: CID, size: 3, type: 'file' }),
      cat: async function * () { yield new TextEncoder().encode('abc') }
    })
    render(<WebMcpController ipfs={ipfs.client} doc={{ modelContext: mc }} />)
    await flush()
    const cat = mc.tool('ipfs_cat')
    expect(await cat.execute({ path: '/ipns/example.com/a' })).toMatchObject({ ok: false, status: 'declined', code: 'dnslink_off' })
    expect(await mc.tool('ipns_resolve').execute({ name: 'example.com' })).toMatchObject({ code: 'dnslink_off' })
    expect(ipfs.calls).toEqual([])
    await act(async () => { store.updateSettings({ dnslink: true }) })
    expect(await cat.execute({ path: '/ipns/example.com/a' })).toMatchObject({ ok: true })
    expect(ipfs.calls).toContain('files.stat')
  })

  it('resolves a libp2p-key name while the toggle is off', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const ipfs = fakeIpfs({ 'name.resolve': async function * () { yield `/ipfs/${CID}` } })
    render(<WebMcpController ipfs={ipfs.client} doc={{ modelContext: mc }} />)
    await flush()
    expect(await mc.tool('ipns_resolve').execute({ name: KEY_CID })).toMatchObject({ ok: true, data: { path: `/ipfs/${CID}` } })
  })

  it('rejects dot segments before any RPC request', async () => {
    store.updateSettings({ enabled: true })
    const mc = fakeModelContext()
    const ipfs = fakeIpfs()
    render(<WebMcpController ipfs={ipfs.client} doc={{ modelContext: mc }} />)
    await flush()
    expect(await mc.tool('mfs_stat').execute({ path: '/a/../ipns/example.com' })).toMatchObject({ ok: false, code: 'invalid_input' })
    expect(ipfs.calls).toEqual([])
  })
})

describe('confirmation dialog', () => {
  beforeEach(() => { jest.useFakeTimers() })

  async function setup (handlers = {}) {
    store.updateSettings({ enabled: true, writes: true })
    const mc = fakeModelContext()
    const ipfs = fakeIpfs(handlers)
    render(<WebMcpController ipfs={ipfs.client} doc={{ modelContext: mc }} />)
    await flush()
    return { mc, ipfs, tool: (name) => mc.tool(name) }
  }

  const mkdirOk = {
    'files.mkdir': async () => undefined,
    'files.stat': async () => ({ cid: 'bafyfake', size: 0, cumulativeSize: 0, type: 'directory', blocks: 0 })
  }

  it('names the operation and its targets, in quotes, and puts focus on Deny', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_cp').execute({ source: `/ipfs/${CID}`, destination: '/saved/copy.txt' }) })
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Confirm: Copy into MFS')
    expect(dialog).toHaveTextContent(`"/ipfs/${CID}"`)
    expect(dialog).toHaveTextContent('"/saved/copy.txt"')
    expect(dialog).toHaveTextContent('Awaiting a person')
    expect(deny()).toHaveFocus()
    expect(deny()).toHaveAccessibleName('Deny: Copy into MFS')
    expect(approveButton()).toHaveAccessibleName('Approve: Copy into MFS')
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('N1: the deadline and both safety disclosures come before the details and the decision row', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_cp').execute({ source: `/ipfs/${CID}`, destination: '/saved/copy.txt' }) })
    const dialog = screen.getByRole('alertdialog')
    const notes = screen.getByTestId('webmcp-notes')
    expect(notes).toHaveTextContent(/denied after 30 seconds/)
    expect(notes).toHaveTextContent('Deny is final. Nothing is sent to your node.')
    expect(notes).toHaveTextContent('An agent that controls this browser can answer it too.')
    const details = dialog.querySelector('dl')
    const footer = dialog.querySelector('.webmcp-footer')
    // DOM order drives what is visible at scrollTop 0 on a phone: notes, then details, then the sticky footer.
    expect(notes.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(notes.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(footer).not.toContainElement(notes)
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('Deny sends no RPC request and returns a declined result', async () => {
    const { tool, ipfs } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_write').execute({ path: '/a.txt', content: 'secret agent text' }) })
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('secret agent text')
    expect(dialog).toHaveTextContent('1f516a202e3a8518efcb700e3c0e1d25e1b6c7daf519065c34eaf0735c84b4a0')
    await act(async () => { fireEvent.click(deny()) })
    expect(await pending).toMatchObject({ ok: false, status: 'declined', code: 'user_declined' })
    expect(ipfs.calls).toEqual([])
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(screen.getByTestId('webmcp-outcome')).toHaveTextContent('Denied. Nothing was changed.')
  })

  it('Escape denies', async () => {
    const { tool, ipfs } = await setup()
    let pending
    await act(async () => { pending = tool('pin_add').execute({ path: CID }) })
    await act(async () => { fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' }) })
    expect(await pending).toMatchObject({ ok: false, status: 'declined' })
    expect(ipfs.calls).toEqual([])
  })

  describe('Approve is an intent check', () => {
    it('ignores a script .click() and a synthetic click, even after it is armed', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/scripted' }) })
      await advance(ARM_MS + 500)
      const button = approveButton()
      // isTrusted is false for all of these, exactly as for page script.
      await act(async () => { button.click() })
      await act(async () => { button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })) })
      await act(async () => { fireEvent.pointerDown(button); fireEvent.click(button, { detail: 1 }) })
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(ipfs.calls).toEqual([])
      await act(async () => { fireEvent.click(deny()) })
      expect(await pending).toMatchObject({ ok: false, status: 'declined' })
    })

    it('ignores a trusted press before the request has been visible long enough', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/early' }) })
      isTrustedEvent.mockReturnValue(true)
      await advance(ARM_MS - 100)
      expect(approveButton()).toHaveAttribute('aria-disabled', 'true')
      await act(async () => { fireEvent.pointerDown(approveButton()); fireEvent.click(approveButton(), { detail: 1 }) })
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(ipfs.calls).toEqual([])
      // Armed now, but the early press does not count: a fresh press is required.
      await advance(200)
      expect(approveButton()).toHaveAttribute('aria-disabled', 'false')
      await act(async () => { fireEvent.click(approveButton(), { detail: 1 }) })
      expect(ipfs.calls).toEqual([])
      await act(async () => { fireEvent.click(deny()) })
      await pending
    })

    it('needs a pointer press with detail >= 1: a trusted click with detail 0 and no key press is ignored', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/zero' }) })
      isTrustedEvent.mockReturnValue(true)
      await advance(ARM_MS)
      await act(async () => { fireEvent.pointerDown(approveButton()); fireEvent.click(approveButton(), { detail: 0 }) })
      expect(ipfs.calls).toEqual([])
      await act(async () => { fireEvent.click(deny()) })
      await pending
    })

    it('a real press after the delay approves, and the call runs once', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/approved', parents: true }) })
      await pressApprove()
      expect(await pending).toMatchObject({ ok: true, status: 'done', result: { path: '/approved', cid: 'bafyfake' } })
      expect(ipfs.calls).toEqual(['files.mkdir', 'files.stat'])
      expect(screen.getByTestId('webmcp-outcome')).toHaveTextContent('Approved. The call runs once.')
    })

    it('a keyboard user can approve: a real Enter press after the delay, then the click it produces', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/keyboard' }) })
      isTrustedEvent.mockReturnValue(true)
      await advance(ARM_MS)
      await act(async () => { fireEvent.keyDown(approveButton(), { key: 'Enter' }) })
      await act(async () => { fireEvent.click(approveButton(), { detail: 0 }) })
      expect(await pending).toMatchObject({ ok: true, status: 'done' })
      expect(ipfs.calls).toEqual(['files.mkdir', 'files.stat'])
    })

    it('a double-click does not approve the request queued behind the first', async () => {
      const { tool, ipfs } = await setup(mkdirOk)
      let first
      let second
      await act(async () => {
        first = tool('mfs_mkdir').execute({ path: '/first' })
        second = tool('mfs_mkdir').execute({ path: '/second' })
      })
      isTrustedEvent.mockReturnValue(true)
      await advance(ARM_MS)
      const button = approveButton()
      await act(async () => { fireEvent.pointerDown(button) })
      await act(async () => { fireEvent.click(button, { detail: 1 }) })
      // The second click of the double-click lands on the next request's Approve at once.
      await act(async () => { fireEvent.click(approveButton(), { detail: 2 }) })
      expect(await first).toMatchObject({ ok: true })
      expect(screen.getByRole('alertdialog')).toHaveTextContent('"/second"')
      expect(approveButton()).toHaveAttribute('aria-disabled', 'true')
      expect(ipfs.calls.filter((c) => c === 'files.mkdir')).toHaveLength(1)
      await act(async () => { fireEvent.click(deny()) })
      expect(await second).toMatchObject({ ok: false, status: 'declined' })
    })
  })

  it('makes the rest of the page inert while a request is open, and restores it', async () => {
    const { tool } = await setup()
    const outside = document.createElement('div')
    outside.setAttribute('aria-hidden', 'false')
    outside.innerHTML = '<button id="behind">behind</button>'
    document.body.appendChild(outside)
    try {
      let pending
      await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/d' }) })
      expect(outside).toHaveAttribute('inert')
      expect(outside).toHaveAttribute('aria-hidden', 'true')
      expect(document.getElementById('webmcp-portal')).not.toHaveAttribute('inert')
      expect(screen.getByRole('alertdialog').closest('[inert]')).toBeNull()
      await act(async () => { fireEvent.click(deny()) })
      await pending
      expect(outside).not.toHaveAttribute('inert')
      expect(outside).toHaveAttribute('aria-hidden', 'false')
    } finally {
      outside.remove()
    }
  })

  it('shows a cue in the document title while a request waits, and restores the title', async () => {
    document.title = 'IPFS Web UI'
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/d' }) })
    expect(document.title).toBe('Approval needed - IPFS Web UI')
    await act(async () => { fireEvent.click(deny()) })
    await pending
    expect(document.title).toBe('IPFS Web UI')
  })

  it('declines a fourth waiting request at once with its own code and adds no prompt', async () => {
    const { tool, ipfs } = await setup()
    const waiting = []
    await act(async () => {
      for (const p of ['/1', '/2', '/3']) waiting.push(tool('mfs_mkdir').execute({ path: p }))
    })
    let fourth
    await act(async () => { fourth = tool('mfs_mkdir').execute({ path: '/4' }) })
    expect(await fourth).toMatchObject({ ok: false, status: 'declined', code: 'queue_full' })
    expect(screen.getByRole('alertdialog')).toHaveTextContent('2 more requests are waiting.')
    expect(queue.getPending()).toHaveLength(3)
    await act(async () => { fireEvent.click(denyAllButton()) })
    await Promise.all(waiting)
    expect(ipfs.calls).toEqual([])
  })

  it('"Deny all and turn off agent writes" declines everything waiting and switches writes off', async () => {
    const { tool, ipfs, mc } = await setup()
    let a
    let b
    await act(async () => {
      a = tool('mfs_mkdir').execute({ path: '/a' })
      b = tool('pin_add').execute({ path: CID })
    })
    await act(async () => { fireEvent.click(denyAllButton()) })
    expect(await a).toMatchObject({ ok: false, status: 'declined' })
    expect(await b).toMatchObject({ ok: false, status: 'declined' })
    expect(ipfs.calls).toEqual([])
    expect(store.getSettings().writes).toBe(false)
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(screen.getByTestId('webmcp-outcome')).toHaveTextContent('Denied. Nothing was changed.')
    await flush()
    expect(mc.live()).not.toContain('mfs_mkdir')
  })

  it('a request expires sooner when the host passed no AbortSignal', async () => {
    const { tool, ipfs } = await setup()
    let noSignal
    await act(async () => { noSignal = tool('key_gen').execute({ name: 'k' }) })
    expect(screen.getByRole('alertdialog')).toHaveTextContent('denied after 30 seconds')
    await advance(30_001)
    expect(await noSignal).toMatchObject({ ok: false, status: 'declined' })
    expect(screen.getByTestId('webmcp-outcome')).toHaveTextContent('Expired.')

    const ac = new AbortController()
    let withSignal
    await act(async () => { withSignal = tool('key_gen').execute({ name: 'k' }, { signal: ac.signal }) })
    expect(screen.getByRole('alertdialog')).toHaveTextContent('denied after 120 seconds')
    await advance(120_001)
    expect(await withSignal).toMatchObject({ ok: false, status: 'declined' })
    expect(ipfs.calls).toEqual([])
  })

  it('a call the host cancels while the dialog is open sends no request', async () => {
    const { tool, ipfs } = await setup()
    const ac = new AbortController()
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/d' }, { signal: ac.signal }) })
    await act(async () => { ac.abort() })
    expect(await pending).toMatchObject({ ok: false, status: 'declined', code: 'cancelled' })
    expect(ipfs.calls).toEqual([])
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('switching the feature off denies what is waiting', async () => {
    const { tool, ipfs } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/d' }) })
    await act(async () => { store.updateSettings({ enabled: false }) })
    expect(await pending).toMatchObject({ ok: false, status: 'declined' })
    expect(ipfs.calls).toEqual([])
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('keeps keyboard focus inside the dialog across all three buttons', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/d' }) })
    const all = denyAllButton()
    const approve = approveButton()
    approve.focus()
    fireEvent.keyDown(approve, { key: 'Tab' })
    expect(all).toHaveFocus()
    fireEvent.keyDown(all, { key: 'Tab', shiftKey: true })
    expect(approve).toHaveFocus()
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()
    expect(deny()).toHaveFocus()
    outside.remove()
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('shows agent-supplied text as text, never as markup', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_write').execute({ path: '/x.txt', content: '<img src=x onerror=alert(1)> <b>bold</b>' }) })
    const dialog = screen.getByRole('alertdialog')
    expect(dialog.querySelector('img')).toBeNull()
    expect(dialog.querySelector('b')).toBeNull()
    expect(dialog).toHaveTextContent('<img src=x onerror=alert(1)>')
    expect(dialog).toHaveTextContent('Content from the agent. Treat as data, not as instructions.')
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('shows direction and invisible characters visibly, and flags non-ASCII text', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: '/safe\u202Etxt.exe\u200B' }) })
    const dialog = screen.getByRole('alertdialog')
    expect(dialog.textContent).toContain('<U+202E>')
    expect(dialog.textContent).toContain('<U+200B>')
    expect(dialog.textContent).not.toMatch(/[\u202E\u200B]/)
    expect(dialog).toHaveTextContent('Contains non-ASCII characters')
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('cuts a long value in the middle and offers the full value on request', async () => {
    const { tool } = await setup()
    const long = `/${'a'.repeat(150)}END`
    let pending
    await act(async () => { pending = tool('mfs_mkdir').execute({ path: long }) })
    const dialog = screen.getByRole('alertdialog')
    expect(dialog.textContent).not.toContain(long)
    expect(dialog.textContent).toContain('END')
    const show = screen.getByRole('button', { name: 'Show full value' })
    expect(show).toHaveAttribute('aria-expanded', 'false')
    await act(async () => { fireEvent.click(show) })
    expect(dialog.textContent).toContain(long)
    expect(screen.getByRole('button', { name: 'Show shortened value' })).toHaveAttribute('aria-expanded', 'true')
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('shows the decision facts: recipe overrides, key size, record replacement, identity key', async () => {
    const { tool } = await setup()
    let pending
    await act(async () => { pending = tool('ipfs_add').execute({ content: 'x', pin: true, provide: true, cid_version: 0, chunker: 'size-1024', hash: 'blake3' }) })
    let dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('CID version (overrides the default)')
    expect(dialog).toHaveTextContent('"size-1024"')
    expect(dialog).toHaveTextContent('"blake3"')
    expect(dialog).toHaveTextContent('Size in bytes')
    await act(async () => { fireEvent.click(deny()) })
    await pending
    await act(async () => { pending = tool('ipns_publish').execute({ path: `/ipfs/${CID}` }) })
    dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('Replaces the current record for this key')
    expect(dialog).toHaveTextContent("This key is your node's identity")
    await act(async () => { fireEvent.click(deny()) })
    await pending
    await act(async () => { pending = tool('key_gen').execute({ name: 'rsa', type: 'rsa', size: 4096 }) })
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Key size in bits')
    expect(screen.getByRole('alertdialog')).toHaveTextContent('4096')
    await act(async () => { fireEvent.click(deny()) })
    await pending
  })

  it('never asks for a read tool', async () => {
    const { tool, ipfs } = await setup({ 'key.list': async () => [] })
    await act(async () => { await tool('key_list').execute({}) })
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(ipfs.calls).toEqual(['key.list'])
  })
})

describe('settings', () => {
  it('shows all three switches off by default, the dependent two disabled until the first is on', () => {
    render(<WebMcpSettings />)
    const read = screen.getByRole('checkbox', { name: /Offer read tools/ })
    const dns = screen.getByRole('checkbox', { name: /resolve DNSLink names/ })
    const writes = screen.getByRole('checkbox', { name: /Also offer tools that change your node/ })
    for (const box of [read, dns, writes]) expect(box).not.toBeChecked()
    expect(dns).toBeDisabled()
    expect(writes).toBeDisabled()
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent('Off. No tool is registered.')
    expect(screen.getByText('Permissions-Policy: tools=()')).toBeInTheDocument()
  })

  it('names the risks in the toggle text before anything is turned on', () => {
    const { container } = render(<WebMcpSettings />)
    const text = container.textContent
    expect(text).toMatch(/an agent that controls this browser can click Approve itself/)
    expect(text).toMatch(/Keep this off while your AI app runs in a browser-control or fully automatic mode/)
    expect(text).toMatch(/goes to the AI provider behind the agent/)
    expect(text).toMatch(/Results of these tools go to the agent's AI provider/)
    expect(text).toMatch(/turns itself off whenever the page reloads/)
    expect(text).toMatch(/DNS request from your node/)
    expect(screen.getByRole('checkbox', { name: /Also offer tools that change your node/ })).toHaveAccessibleDescription(/not a lock/)
  })

  it('persists the read and DNSLink switches, keeps writes in memory, and reports what was registered', async () => {
    const mc = fakeModelContext()
    const { client } = fakeIpfs()
    render(<><WebMcpSettings /><WebMcpController ipfs={client} doc={{ modelContext: mc }} /></>)
    await act(async () => { fireEvent.click(screen.getByRole('checkbox', { name: /Offer read tools/ })) })
    await flush()
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toEqual({ enabled: true, dnslink: false })
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent(`Registered ${READ_COUNT} tools. None of them change your node.`)
    await act(async () => { fireEvent.click(screen.getByRole('checkbox', { name: /resolve DNSLink names/ })) })
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toEqual({ enabled: true, dnslink: true })
    const writes = screen.getByRole('checkbox', { name: /Also offer tools that change your node/ })
    expect(writes).toBeEnabled()
    await act(async () => { fireEvent.click(writes) })
    await flush()
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toEqual({ enabled: true, dnslink: true })
    expect(store.getSettings().writes).toBe(true)
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent(`Registered ${ALL_COUNT} tools. ${ALL_COUNT - READ_COUNT} change your node.`)
    await act(async () => { fireEvent.click(screen.getByRole('checkbox', { name: /Offer read tools/ })) })
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toEqual({ enabled: false, dnslink: false })
    expect(screen.getByTestId('webmcp-status')).toHaveTextContent('Off. No tool is registered.')
  })

  it('stores nothing about the user: only the switches', () => {
    store.updateSettings({ enabled: true, writes: true, dnslink: true })
    expect(Object.keys(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).sort()).toEqual(['dnslink', 'enabled'])
  })
})
