import React from 'react'
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App.js'
import { DecisionFeedProvider } from './activity/DecisionFeedProvider.jsx'
const FeedOwner = ({ children }) => <DecisionFeedProvider enabled={false}>{children}</DecisionFeedProvider>
const renderApp = view => render(view, { wrapper: FeedOwner })
const { captureTour } = vi.hoisted(() => ({ captureTour: vi.fn() }))

vi.mock('./navigation/NavBar.js', () => ({ default: () => <nav aria-label='Navigation' /> }))
vi.mock('./components/notify/Notify.js', () => ({ default: () => null }))
vi.mock('./components/connected/Connected.js', () => ({ default: () => null }))
vi.mock('./components/tour/Tour.js', () => ({ default: props => { captureTour(props); return null } }))
vi.mock('./components/tour/TourHelper.js', () => ({ default: () => <button type='button' aria-label='Start tour' /> }))
vi.mock('./files/explore-form/files-explore-form.tsx', () => ({ default: () => <input aria-label='IPFS path' /> }))
vi.mock('./agent-chat/index.js', () => ({ AgentChatLauncher: () => null, SessionBanner: () => null }))
vi.mock('./webmcp/index.js', () => ({ WebMcpHost: () => null }))

const props = () => ({
  t: key => key,
  route: () => <h1>Current page</h1>,
  routeInfo: { url: '/files' },
  doSetupLocalStorage: vi.fn(),
  doTryInitIpfs: vi.fn(),
  doUpdateUrl: vi.fn(),
  doUpdateHash: vi.fn(),
  doFilesWrite: vi.fn(),
  doFilesNavigateTo: vi.fn(),
  doDisableTooltip: vi.fn(),
  isOver: false,
  canDrop: false,
  showTooltip: false,
  ipfsReady: true
})

it('starts the existing store actions once and mounts the chosen route', () => {
  const initial = props()
  const view = renderApp(<App {...initial} />)
  expect(screen.getByRole('heading', { name: 'Current page' })).toBeVisible()
  expect(screen.getByRole('navigation', { name: 'Navigation' })).toBeInTheDocument()
  view.rerender(<App {...initial} />)
  expect(initial.doSetupLocalStorage).toHaveBeenCalledTimes(1)
  expect(initial.doTryInitIpfs).toHaveBeenCalledTimes(1)
})

it('keeps welcome/settings usable while disconnected and waits for IPFS on other routes', () => {
  const initial = { ...props(), ipfsReady: false }
  const view = renderApp(<App {...initial} />)
  expect(screen.queryByRole('heading')).toBeNull()
  view.rerender(<App {...initial} routeInfo={{ url: '/welcome' }} />)
  expect(screen.getByRole('heading')).toBeVisible()
  view.rerender(<App {...initial} routeInfo={{ url: '/settings' }} />)
  expect(screen.getByRole('heading')).toBeVisible()
})

it.each(['/files', '/pins', '/explore/bafy-example', '/peers', '/diagnostics', '/settings/agent'])('keeps the selected %s route inside the application layout', url => {
  const { container } = renderApp(<App {...props()} routeInfo={{ url }} />)
  expect(container.querySelector('[data-workspace-mode="application"]')).toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveAttribute('data-route', url.split('/')[1])
  expect(screen.getByRole('heading', { name: 'Current page' })).toBeVisible()
  // The single conversation owner stays mounted while its closed pane is unreachable.
  const pane = container.querySelector('[data-workspace-slot="conversation"]')
  expect(pane).toHaveAttribute('hidden')
  expect(pane).toHaveAttribute('inert')
  expect(pane).not.toBeVisible()
  expect(screen.queryByRole('textbox', { name: /message|draft/i })).toBeNull()
  expect(screen.getAllByRole('textbox')).toHaveLength(1)
  expect(container.querySelector('[data-workspace-slot="navigator"]').compareDocumentPosition(screen.getByRole('main')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  if (url.startsWith('/explore')) {
    expect(container.querySelector('[data-workspace-slot="application"]')).toHaveClass('prom-explore')
  }
})

it('does not remount an active IPFS operation during shell status updates', () => {
  const mounted = vi.fn()
  const disposed = vi.fn()
  function Operation () {
    React.useEffect(() => { mounted(); return disposed }, [])
    return <input aria-label='File operation selection' defaultValue='Selected file' />
  }
  const initial = { ...props(), route: Operation }
  const view = renderApp(<App {...initial} />)
  const operation = screen.getByRole('textbox', { name: 'File operation selection' })
  view.rerender(<App {...initial} canDrop isOver showTooltip />)
  expect(screen.getByRole('textbox', { name: 'File operation selection' })).toBe(operation)
  expect(mounted).toHaveBeenCalledTimes(1)
  expect(disposed).not.toHaveBeenCalled()
  expect(initial.doTryInitIpfs).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(disposed).toHaveBeenCalledTimes(1)
})

it.each(['/diagnostics', '/diagnostics/retrieval'])('defers the first-visit hint on %s without consuming it, then offers it where the helper exists', url => {
  const initial = { ...props(), showTooltip: true, routeInfo: { url } }
  const view = renderApp(<App {...initial} />)
  expect(screen.queryByRole('button', { name: 'Start tour' })).toBeNull()
  expect(captureTour.mock.lastCall[0].run).toBe(false)
  expect(initial.doDisableTooltip).not.toHaveBeenCalled()
  view.rerender(<App {...initial} routeInfo={{ url: '/settings' }} />)
  expect(screen.getByRole('button', { name: 'Start tour' })).toBeVisible()
  expect(captureTour.mock.lastCall[0].run).toBe(true)
  expect(initial.doDisableTooltip).not.toHaveBeenCalled()
})

it('keeps a dismissed hint off on supported routes while retaining the manual tour helper', () => {
  const initial = { ...props(), showTooltip: false, routeInfo: { url: '/settings' } }
  const view = renderApp(<App {...initial} />)
  expect(screen.getByRole('button', { name: 'Start tour' })).toBeVisible()
  expect(captureTour.mock.lastCall[0].run).toBe(false)
  view.rerender(<App {...initial} routeInfo={{ url: '/welcome' }} />)
  expect(captureTour.mock.lastCall[0].run).toBe(false)
  expect(initial.doDisableTooltip).not.toHaveBeenCalled()
})

it.each(['button_close', 'keyboard'])('keeps explicit %s dismissal and does not persist an unseen missing-target termination', origin => {
  const initial = { ...props(), showTooltip: true }
  renderApp(<App {...initial} />)
  const { callback: onJoyrideEvent } = captureTour.mock.lastCall[0]
  onJoyrideEvent({ action: 'update', type: 'error:target_not_found', status: 'running' })
  onJoyrideEvent({ action: 'update', type: 'tour:end', status: 'finished' })
  expect(initial.doDisableTooltip).not.toHaveBeenCalled()
  onJoyrideEvent({ action: 'close', type: 'step:after', status: 'running', origin })
  expect(initial.doDisableTooltip).toHaveBeenCalledTimes(1)
})
