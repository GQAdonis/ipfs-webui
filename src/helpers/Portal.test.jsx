import { useLayoutEffect, useRef } from 'react'
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Portal from './Portal.js'

it('attaches before child focus effects and removes its owned container', () => {
  const attached = vi.fn()
  function Focused () {
    /** @type {import('react').RefObject<HTMLButtonElement | null>} */
    const ref = useRef(null)
    useLayoutEffect(() => { attached(ref.current?.isConnected); ref.current?.focus() }, [])
    return <button ref={ref}>Portal action</button>
  }
  const view = render(<Portal id='owned-control-portal'><Focused /></Portal>)
  expect(attached).toHaveBeenCalledWith(true)
  expect(document.activeElement).toBe(screen.getByRole('button'))
  view.unmount()
  expect(document.getElementById('owned-control-portal')).toBeNull()
})
