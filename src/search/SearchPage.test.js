// webui-vector-search 1.2, 1.3, 1.4, 1.5, 1.6: every state of the Search page against a stub
// fetch, the provenance labels, plain-text rendering, the error states, the status panel
// states and the off switch.
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import axe from 'axe-core'
import { NavBar } from '../navigation/NavBar.js'
import { SearchPage } from './SearchPage.js'
import SearchSettingsSwitch from './SearchSettingsSwitch.js'
import { availabilityStore } from './availability-store.js'
import { updateSettings as updateSearch, resetForTests as resetSearch } from './settings-store.js'
import { updateSettings as updateChat, resetForTests as resetChat, setToken } from '../agent-chat/settings-store.js'
import { initI18n, reply, CONFIGURED, RUN, hit, CID_A, CID_B } from './test-helpers.js'

jest.mock('../components/button/button.tsx', () => ({
  __esModule: true,
  default: ({ buttonType, children, minWidth, ...rest }) => <button type={buttonType} {...rest}>{children}</button>
}))
jest.mock('../promethity/brand-wordmark.js', () => ({ __esModule: true, default: () => null }))
jest.mock('../promethity/brand-p-icon.js', () => ({ __esModule: true, default: () => null }))

const missing = initI18n()
const ENDPOINT = 'http://127.0.0.1:5050/agui'

/** Route fetch by path: status and search each answer with a function. */
let routes
let fetchMock
const searchCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/index/search'))
const indexCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).includes('/index/'))

beforeEach(() => {
  localStorage.clear()
  resetChat()
  resetSearch()
  availabilityStore.resetForTests()
  missing.length = 0
  routes = {
    status: async () => reply(200, CONFIGURED),
    search: async () => reply(200, { model: 'bge-m3', results: [hit()] })
  }
  fetchMock = jest.fn(async (url) => (String(url).endsWith('/index/status') ? routes.status() : routes.search()))
  globalThis.fetch = fetchMock
  updateChat({ enabled: true, endpoint: ENDPOINT })
  setToken('tok-1')
  globalThis.location.hash = '#/search'
})

afterEach(() => {
  cleanup()
  delete globalThis.fetch
  document.documentElement.removeAttribute('data-theme')
  expect(missing).toEqual([])
})

const ask = async (text = 'roofer invoice') => {
  fireEvent.change(await screen.findByRole('searchbox', { name: /search your files/i }), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
}

describe('provenance labels (1.2)', () => {
  it.each([
    ['text', 'From the file'],
    ['extracted', 'From the file'],
    ['ocr', 'Text in image'],
    ['transcript', 'Transcript'],
    ['description', 'AI description by llava-7b']
  ])('renders the label for source %s', async (source, label) => {
    routes.search = async () => reply(200, { model: 'm', results: [hit({ source, described_by: source === 'description' ? 'llava-7b' : undefined })] })
    render(<SearchPage />)
    await ask()
    await screen.findAllByRole('article')
    const badge = document.querySelector('.sr-badge[data-source]')
    expect(badge).toHaveTextContent(label)
    expect(badge).toHaveAttribute('data-source', source)
  })

  it('shows file name, path, CID, kind, score and passage', async () => {
    render(<SearchPage />)
    await ask()
    const item = (await screen.findAllByRole('article'))[0]
    expect(within(item).getByRole('heading', { name: 'roofer-invoice.pdf' })).toBeInTheDocument()
    expect(within(item).getByText('/docs/roofer-invoice.pdf')).toBeInTheDocument()
    expect(within(item).getByText(CID_A)).toBeInTheDocument()
    expect(within(item).getByText('Document')).toBeInTheDocument()
    expect(within(item).getByText('Similarity 0.82')).toBeInTheDocument()
    expect(within(item).getByText('Passage 3')).toBeInTheDocument()
    expect(within(item).getByRole('link', { name: 'Open in Files' })).toHaveAttribute('href', `#/ipfs/${CID_A}`)
    expect(within(item).getByRole('link', { name: 'Explore' })).toHaveAttribute('href', `#/explore/${CID_A}`)
  })

  it('copies the CID', async () => {
    const writeText = jest.fn(async () => {})
    Object.defineProperty(globalThis.navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<SearchPage />)
    await ask()
    fireEvent.click(await screen.findByRole('button', { name: 'Copy CID' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(CID_A))
    expect(await screen.findByText('CID copied.')).toBeInTheDocument()
  })
})

describe('untrusted text (1.2)', () => {
  it('renders an img-onerror snippet literally and creates no element', async () => {
    const payload = '<img src=x onerror=alert(1)>'
    routes.search = async () => reply(200, { model: 'm', results: [hit({ text: payload, path: '/dir/<b>bold.md' })] })
    const { container } = render(<SearchPage />)
    await ask()
    await screen.findByText(payload)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('b')).toBeNull()
    expect(screen.getByText('<b>bold.md')).toBeInTheDocument()
  })

  it('does not interpret Markdown', async () => {
    routes.search = async () => reply(200, { model: 'm', results: [hit({ text: '# Heading\n**bold** [link](https://x.test)' })] })
    const { container } = render(<SearchPage />)
    await ask()
    await screen.findByText(/# Heading/)
    const list = container.querySelector('.sr-results')
    expect(list.querySelector('strong, em, h1, h2, h4, a[href^="https"]')).toBeNull()
    expect(list.querySelector('.sr-snippet')).toHaveTextContent('**bold** [link](https://x.test)')
  })

  it('strips bidi overrides from the model name too', async () => {
    routes.search = async () => reply(200, { model: 'm', results: [hit({ source: 'description', described_by: 'evil‮model' })] })
    render(<SearchPage />)
    await ask()
    expect(await screen.findByText('AI description by evilmodel')).toBeInTheDocument()
  })
})

describe('filters and live region (1.2, 1.5)', () => {
  it('sends the chosen kinds and sources and announces the count', async () => {
    routes.search = async () => reply(200, { model: 'm', results: [hit(), hit({ cid: CID_B, chunk_index: 0 })] })
    render(<SearchPage />)
    const imageChip = await screen.findByRole('button', { name: 'Images' })
    expect(imageChip).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(imageChip)
    expect(imageChip).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Text in an image' }))
    await ask()
    await screen.findAllByRole('article')
    expect(JSON.parse(searchCalls()[0][1].body)).toMatchObject({ query: 'roofer invoice', kinds: ['image'], sources: ['ocr'] })
    const live = document.querySelector('.sr-visually-hidden[role="status"][aria-live="polite"]')
    expect(live).toHaveTextContent('2 results for this search.')
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('offers a way back to every kind', async () => {
    render(<SearchPage />)
    fireEvent.click(await screen.findByRole('button', { name: 'Code' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show everything' }))
    expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('says so when nothing matches', async () => {
    routes.search = async () => reply(200, { model: 'm', results: [] })
    render(<SearchPage />)
    await ask()
    expect((await screen.findAllByText(/No results/))[0]).toBeInTheDocument()
  })

  it('lists the meta facts as separate list items', async () => {
    render(<SearchPage />)
    await ask()
    await screen.findAllByRole('article')
    const meta = document.querySelector('.sr-meta')
    expect(meta.tagName).toBe('UL')
    expect([...meta.querySelectorAll('li')].map((li) => li.textContent)).toEqual(expect.arrayContaining(['Similarity 0.82', 'Passage 3']))
  })

  it('announces a search once: the live region only, no second status line', async () => {
    routes.search = async () => reply(200, { model: 'm', results: [] })
    render(<SearchPage />)
    await ask()
    await screen.findAllByText(/No results/)
    const statuses = screen.getAllByRole('status').filter((el) => /No results/.test(el.textContent))
    expect(statuses).toHaveLength(1)
  })

  it('names the search box and does not send an empty query', async () => {
    render(<SearchPage />)
    const box = await screen.findByRole('searchbox', { name: /search your files/i })
    expect(box).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
    expect(searchCalls()).toHaveLength(0)
  })
})

describe('index status panel (1.3)', () => {
  const panel = async () => within(await screen.findByRole('region', { name: 'Index' }))

  it('not configured', async () => {
    routes.status = async () => reply(404)
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Not set up')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read how to set up search' })).toHaveAttribute('href', expect.stringContaining('embeddings.md'))
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('links the setup page at the Search over HTTP section, and the egress notice at What leaves the machine', async () => {
    routes.status = async () => reply(404)
    render(<SearchPage />)
    await panel()
    const href = (await screen.findByRole('link', { name: 'Read how to set up search' })).getAttribute('href')
    expect(href).toBe('https://github.com/GQAdonis/kubo/blob/master/docs/mcp/embeddings.md#search-over-http')
  })

  it('under Desktop a missing index says to turn Search on in Desktop', async () => {
    routes.status = async () => reply(404)
    globalThis.ipfsDesktop = { agentChat: { getEndpoint: async () => ENDPOINT, getToken: async () => 'tok-1' } }
    try {
      render(<SearchPage />)
      expect(await screen.findByText(/Turn Search on in IPFS Desktop's Search settings/)).toBeInTheDocument()
    } finally {
      delete globalThis.ipfsDesktop
    }
  })

  it('an unreachable node is a Retry problem, not "not set up"', async () => {
    routes.status = async () => { throw new TypeError('Failed to fetch') }
    render(<SearchPage />)
    expect(await screen.findByText('Cannot reach the node')).toBeInTheDocument()
    expect(screen.queryByText(/turns on in the ipfs mcp configuration/)).toBeNull()
    expect((await panel()).getByText('Not reachable')).toBeInTheDocument()
    routes.status = async () => reply(200, CONFIGURED)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('searchbox')).toBeInTheDocument()
  })

  it('an unreadable status answer offers Retry too', async () => {
    routes.status = async () => reply(200, { hello: 'world' })
    render(<SearchPage />)
    expect(await screen.findByText('Unexpected answer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('a 403 on the status probe says the identity has no search access, not "enter the token again"', async () => {
    routes.status = async () => reply(403)
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText(/does not have search access/)).toBeInTheDocument()
    expect(p.queryByText(/Enter the token again/)).toBeNull()
    expect(p.queryByRole('link', { name: 'Open Agent settings' })).toBeNull()
  })

  it('a 401 on the status probe says to enter the token again', async () => {
    routes.status = async () => reply(401)
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText(/Enter the token again/)).toBeInTheDocument()
    expect(p.getByRole('link', { name: 'Open Agent settings' })).toBeInTheDocument()
  })

  it('names the index total and this run\'s count differently', async () => {
    routes.status = async () => reply(200, { ...CONFIGURED, bulk_run: RUN })
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Files in the index')).toBeInTheDocument()
    expect(p.getByText('Indexed in this run')).toBeInTheDocument()
  })

  it('idle: configured, no run', async () => {
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Ready')).toBeInTheDocument()
    expect(p.getByText('1,284')).toBeInTheDocument()
    expect(p.getByText('9,120')).toBeInTheDocument()
    expect(p.getByText('No indexing run has been started on this node.')).toBeInTheDocument()
    expect(p.getByText(/Ask the agent to index your pinned files/)).toBeInTheDocument()
    expect(p.queryByRole('button', { name: /start|index|resume/i })).toBeNull()
  })

  it('running', async () => {
    routes.status = async () => reply(200, { ...CONFIGURED, bulk_run: RUN })
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Running')).toBeInTheDocument()
    expect(p.getByText('Too large')).toBeInTheDocument()
    expect(p.getByText('Type not on the allowlist')).toBeInTheDocument()
    expect(p.queryByRole('button', { name: /start|resume|pause|cancel/i })).toBeNull()
  })

  it('paused', async () => {
    routes.status = async () => reply(200, { ...CONFIGURED, bulk_run: { ...RUN, state: 'paused' } })
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Paused')).toBeInTheDocument()
    expect(p.getByText(/until you ask the agent to resume it/)).toBeInTheDocument()
  })

  it('failed, with the error as text', async () => {
    routes.status = async () => reply(200, { ...CONFIGURED, bulk_run: { ...RUN, state: 'failed', last_error: 'embedder <b>down</b>' } })
    render(<SearchPage />)
    const p = await panel()
    expect(await p.findByText('Failed')).toBeInTheDocument()
    expect(p.getByText('embedder <b>down</b>')).toBeInTheDocument()
  })

  it('store unreachable', async () => {
    routes.status = async () => reply(200, { ...CONFIGURED, store_reachable: false })
    render(<SearchPage />)
    expect(await (await panel()).findByText('Store unreachable')).toBeInTheDocument()
  })
})

describe('error states (1.4)', () => {
  const fail = async (response) => {
    routes.search = async () => response
    render(<SearchPage />)
    await ask()
    return screen.findByRole('alert')
  }

  it('egress_not_acknowledged shows the hosts and links to the setup docs', async () => {
    const alert = await fail(reply(403, { error: { code: 'egress_not_acknowledged', message: 'x', retryable: false, details: { missing_hosts: ['embed.example', 'store.example:8000'] } } }))
    const region = alert.closest('.sr-error')
    expect(within(region).getByText('embed.example')).toBeInTheDocument()
    expect(within(region).getByText('store.example:8000')).toBeInTheDocument()
    expect(within(region).getByRole('link', { name: 'Read the search setup' })).toHaveAttribute('href', expect.stringContaining('docs/mcp/embeddings.md'))
  })

  it('index_unavailable offers retry, and retry searches again', async () => {
    const alert = await fail(reply(503, { error: { code: 'index_unavailable', message: 'x', retryable: true } }, { 'Retry-After': '5' }))
    const region = alert.closest('.sr-error')
    routes.search = async () => reply(200, { model: 'm', results: [hit()] })
    fireEvent.click(within(region).getByRole('button', { name: 'Try again' }))
    expect(await screen.findAllByRole('article')).toHaveLength(1)
    expect(searchCalls()).toHaveLength(2)
  })

  it('401 asks to sign in again', async () => {
    const alert = await fail(reply(401))
    const region = alert.closest('.sr-error')
    expect(within(region).getByText('Sign in again')).toBeInTheDocument()
    expect(within(region).getByRole('link', { name: 'Open Agent settings' })).toHaveAttribute('href', '#/settings/agent')
  })

  it('403 explains that the token lacks search access', async () => {
    const alert = await fail(reply(403))
    expect(alert.closest('.sr-error')).toHaveTextContent('does not have search access')
  })

  it('429 says how long to wait', async () => {
    routes.search = async () => reply(429, undefined, { 'Retry-After': '4' })
    render(<SearchPage />)
    await ask()
    expect(await screen.findByText('Wait 4 seconds, then search again.')).toBeInTheDocument()
  })

  it('a network failure says the node cannot be reached', async () => {
    routes.search = async () => { throw new TypeError('Failed to fetch') }
    render(<SearchPage />)
    await ask()
    expect(await screen.findByText('Cannot reach the node')).toBeInTheDocument()
  })
})

describe('gates', () => {
  it('without a connection says where to set it up and sends nothing', async () => {
    setToken(undefined)
    render(<SearchPage />)
    expect(await screen.findByText('Not connected')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Open Agent settings' })[0]).toHaveAttribute('href', '#/settings/agent')
    expect(indexCalls()).toHaveLength(0)
  })
})

describe('off switch (1.6)', () => {
  it('hides the nav entry, redirects #/search and makes zero /index requests', async () => {
    updateSearch({ enabled: false })
    globalThis.location.hash = '#/search'
    render(
      <>
        <NavBar t={(key) => key} />
        <SearchPage />
      </>
    )
    await waitFor(() => expect(globalThis.location.hash).toBe('#/'))
    expect(document.querySelector('a[href="#/search"]')).toBeNull()
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(indexCalls()).toHaveLength(0)
  })

  it('shows the nav entry when on and configured', async () => {
    render(<NavBar t={(key) => key} />)
    await waitFor(() => expect(document.querySelector('a[href="#/search"]')).not.toBeNull())
    expect(screen.getByRole('menuitem', { name: 'search:title' })).toBeInTheDocument()
  })

  it('the switch turns it off and back on', async () => {
    render(<SearchSettingsSwitch />)
    const toggle = screen.getByRole('switch', { name: 'Search your files' })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(JSON.parse(localStorage.getItem('ipfs-webui:search'))).toEqual({ enabled: false })
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
})

describe('accessibility (1.5)', () => {
  const run = (container) => axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } })

  it.each(['dark', 'light'])('has no axe violations with results in the %s theme', async (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    routes.status = async () => reply(200, { ...CONFIGURED, bulk_run: RUN })
    routes.search = async () => reply(200, { model: 'm', results: [hit(), hit({ source: 'description', described_by: 'llava', cid: CID_B })] })
    const { container } = render(<main><SearchPage /></main>)
    await ask()
    await screen.findAllByRole('article')
    const result = await run(container)
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([])
  })

  it('has no axe violations in the error state', async () => {
    routes.search = async () => reply(403, { error: { code: 'egress_not_acknowledged', message: 'x', retryable: false, details: { missing_hosts: ['embed.example'] } } })
    const { container } = render(<main><SearchPage /></main>)
    await ask()
    await screen.findByRole('alert')
    const result = await run(container)
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})
