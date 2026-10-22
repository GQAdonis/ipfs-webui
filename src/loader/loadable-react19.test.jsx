import { render, screen, act } from '@testing-library/react'
import loadable from '@loadable/component'

it('keeps the lazy fallback until the route module is ready and passes current props', async () => {
  /** @type {(module: {default: import('react').ComponentType<{title: string}>}) => void} */
  let resolve = () => {}
  /** @type {() => Promise<{default: import('react').ComponentType<{title: string}>}>} */
  const load = () => new Promise(ready => { resolve = ready })
  const Route = loadable(load, { fallback: <p>Loading route</p> })
  const view = render(<Route title='Files' />)
  expect(screen.getByText('Loading route')).toBeVisible()
  await act(async () => { resolve({ default: ({ title }) => <h1>{title}</h1> }) })
  expect(screen.getByRole('heading', { name: 'Files' })).toBeVisible()
  view.rerender(<Route title='Peers' />)
  expect(screen.getByRole('heading', { name: 'Peers' })).toBeVisible()
})
