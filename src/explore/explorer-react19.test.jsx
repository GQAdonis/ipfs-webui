import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeliaProvider, ExploreProvider, useHelia, useExplore } from '../../vendor/ipld-explorer-components/src/providers/index.ts'
import { ObjectInfo } from '../../vendor/ipld-explorer-components/src/index.ts'
import { StartExploringPage } from '../../vendor/ipld-explorer-components/src/pages.ts'
import IpldGraph from '../../vendor/ipld-explorer-components/src/components/graph/IpldGraphCytoscape.js'

const { init, resolvePath, tour, graph, destroy } = vi.hoisted(() => ({ init: vi.fn(), resolvePath: vi.fn(), tour: vi.fn(), graph: vi.fn(), destroy: vi.fn() }))
vi.mock('../../vendor/ipld-explorer-components/src/lib/init-helia.js', () => ({ default: init }))
vi.mock('../../vendor/ipld-explorer-components/src/lib/resolve-ipld-path.js', () => ({ resolveIpldPath: resolvePath }))
vi.mock('react-joyride', () => ({ Joyride: props => { tour(props); return null } }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key, ready: true }), Trans: ({ children }) => children }))
vi.mock('../../vendor/ipld-explorer-components/node_modules/cytoscape/dist/cytoscape.esm.mjs', () => ({ default: Object.assign(graph, { use: vi.fn() }) }))
vi.mock('../../vendor/ipld-explorer-components/node_modules/cytoscape-dagre', () => ({ default: {} }))

const firstCid = 'bafkqac3imvwgy3zao5xxe3de'
const secondCid = 'bafkqaaik'
const nodeResult = cid => ({ targetNode: { cid, data: new Uint8Array([1]), links: [], format: 'unknown', type: 0x55 }, canonicalPath: cid, localPath: '', nodes: [{ cid }], pathBoundaries: [] })
const pending = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
afterEach(() => { vi.clearAllMocks(); window.location.hash = '' })

describe('maintained Explorer React 19 lifecycle', () => {
  it('shares pending initialization and stops a node that completes after unmount', async () => {
    const ready = pending()
    const stop = vi.fn().mockResolvedValue(undefined)
    init.mockReturnValueOnce(ready.promise)
    let api
    function Probe () { api = useHelia(); return null }
    const view = render(<HeliaProvider><Probe /></HeliaProvider>)
    const first = api.doInitHelia()
    expect(api.doInitHelia()).toBe(first)
    expect(init).toHaveBeenCalledTimes(1)
    view.unmount()
    await act(async () => { ready.resolve({ stop }); await first })
    expect(stop).toHaveBeenCalledTimes(1)
  })

  it('ignores older DAG reads after navigation and recovers after invalid CID input', async () => {
    const oldRead = pending()
    const newRead = pending()
    init.mockResolvedValueOnce({ stop: vi.fn().mockResolvedValue(undefined) })
    resolvePath.mockImplementation((_, cid) => cid.toString() === firstCid ? oldRead.promise : newRead.promise)
    window.location.hash = `#/explore/${firstCid}`
    let heliaApi, exploreApi
    function Probe () {
      heliaApi = useHelia(); exploreApi = useExplore()
      return <output>{exploreApi.exploreState.error ? 'invalid' : exploreApi.exploreState.targetNode?.cid}</output>
    }
    const view = render(<HeliaProvider><ExploreProvider><Probe /></ExploreProvider></HeliaProvider>)
    await act(() => heliaApi.doInitHelia())
    await waitFor(() => expect(resolvePath).toHaveBeenCalledTimes(1))
    const setPath = exploreApi.setExplorePath
    act(() => { window.location.hash = `#/explore/${secondCid}`; setPath(window.location.hash) })
    await waitFor(() => expect(resolvePath).toHaveBeenCalledTimes(2))
    await act(async () => { newRead.resolve(nodeResult(secondCid)); await newRead.promise })
    await act(async () => { oldRead.resolve(nodeResult(firstCid)); await oldRead.promise })
    expect(screen.getByRole('status')).toHaveTextContent(secondCid)
    expect(exploreApi.setExplorePath).toBe(setPath)
    act(() => { window.location.hash = '#/explore/%broken'; setPath(window.location.hash) })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('invalid'))
    const callsAfterInvalid = resolvePath.mock.calls.length
    act(() => { window.location.hash = `#/explore/${secondCid}`; setPath(window.location.hash) })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(secondCid))
    expect(resolvePath).toHaveBeenCalledTimes(callsAfterInvalid + 1)
    view.unmount()
  })

  it('destroys each graph instance on update and root teardown', () => {
    graph.mockImplementation(() => ({ on: vi.fn(), destroy }))
    const view = render(<IpldGraph path={firstCid} links={[]} />)
    view.rerender(<IpldGraph path={secondCid} links={[]} />)
    expect(destroy).toHaveBeenCalledTimes(1)
    view.unmount()
    expect(destroy).toHaveBeenCalledTimes(2)
  })

  it('clears previous DAG details when returning to the Explore start route', async () => {
    init.mockResolvedValueOnce({ stop: vi.fn().mockResolvedValue(undefined) })
    resolvePath.mockResolvedValueOnce(nodeResult(firstCid))
    window.location.hash = `#/explore/${firstCid}`
    let heliaApi, exploreApi
    function Probe () {
      heliaApi = useHelia(); exploreApi = useExplore()
      return <output>{exploreApi.exploreState.targetNode?.cid || 'No node'}</output>
    }
    const view = render(<HeliaProvider><ExploreProvider><Probe /></ExploreProvider></HeliaProvider>)
    await act(() => heliaApi.doInitHelia())
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(firstCid))
    act(() => {
      window.location.hash = '#/explore'
      exploreApi.setExplorePath(window.location.hash)
    })
    expect(screen.getByRole('status')).toHaveTextContent('No node')
    expect(exploreApi.exploreState).toMatchObject({ path: null, nodes: [], pathBoundaries: [], canonicalPath: '', localPath: '', error: null })
    expect(() => exploreApi.doExploreLink({ path: 'stale-link' })).not.toThrow()
    expect(window.location.hash).toBe('#/explore')
    view.unmount()
  })
})

describe('retained Explorer presentation operations', () => {
  it('preserves object expansion, raw bytes, and nullable public-gateway controls', () => {
    const props = { className: '', cid: firstCid, type: 'raw', format: 'unknown', links: [], localPath: '', gatewayUrl: 'http://127.0.0.1:8080', publicGatewayUrl: null }
    const view = render(<ObjectInfo {...props} data={{ child: { label: 'nested-value' } }} />)
    const tree = screen.getByRole('tree')
    const root = tree.querySelector('[role="treeitem"]')
    fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(root).toHaveAttribute('aria-expanded', 'true')
    expect(tree).toHaveTextContent('child')
    const collapsed = tree.querySelector('[role="treeitem"][aria-expanded="false"]')
    expect(collapsed).not.toBeNull()
    fireEvent.keyDown(collapsed, { key: 'ArrowRight' })
    expect(collapsed).toHaveAttribute('aria-expanded', 'true')
    expect(tree).toHaveTextContent('nested-value')
    view.rerender(<ObjectInfo {...props} data={new Uint8Array([104, 105])} />)
    expect(screen.getByRole('tree')).toHaveTextContent('Uint8Array')
    expect(screen.queryByText('ObjectInfo.publicGateway')).toBeNull()
    view.unmount()
  })

  it('keeps the tour disabled by default and forwards the modern completion event', () => {
    let heliaApi
    function InitProbe () { heliaApi = useHelia(); return null }
    const callback = vi.fn()
    const renderPage = runTour => <HeliaProvider><ExploreProvider state={{ path: null }}><InitProbe /><StartExploringPage runTour={runTour} joyrideCallback={callback} /></ExploreProvider></HeliaProvider>
    const view = render(renderPage(false))
    expect(heliaApi.selectHeliaReady()).toBe(false)
    expect(tour.mock.lastCall[0].run).toBe(false)
    view.rerender(renderPage(true))
    const props = tour.mock.lastCall[0]
    expect(props.run).toBe(true)
    expect(props.steps).toHaveLength(1)
    props.onEvent({ status: 'finished', action: 'next' })
    expect(callback).toHaveBeenCalledWith({ status: 'finished', action: 'next' })
    expect(document.head.querySelector('title')).toHaveTextContent('StartExploringPage.title')
    view.unmount()
  })
})
