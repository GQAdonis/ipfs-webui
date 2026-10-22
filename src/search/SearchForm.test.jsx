import { useLayoutEffect, useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import SearchForm from './SearchForm.js'
import { initI18n } from './test-helpers.js'

initI18n()

it('retains an edit at first commit and submits it instead of a late seed reset', () => {
  const onSearch = vi.fn()
  function ImmediateEdit () {
    const host = useRef(null)
    useLayoutEffect(() => {
      fireEvent.change(host.current.querySelector('input[type=search]'), { target: { value: 'immediate edited query' } })
    }, [])
    return <div ref={host}><SearchForm busy={false} onSearch={onSearch} submittedQuery='handoff seed' /></div>
  }
  render(<ImmediateEdit />)
  expect(screen.getByRole('searchbox')).toHaveValue('immediate edited query')
  fireEvent.click(screen.getByRole('button', { name: 'Search', exact: true }))
  expect(onSearch).toHaveBeenCalledExactlyOnceWith({ query: 'immediate edited query', kinds: [], sources: [] })
})

it('keeps local query and filters across busy updates and initializes only a new host-owned form lifetime', () => {
  const onSearch = vi.fn()
  const view = render(<SearchForm key='generation-a:0' busy={false} onSearch={onSearch} />)
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'local draft' } })
  fireEvent.click(screen.getByRole('button', { name: 'Images' }))
  view.rerender(<SearchForm key='generation-a:0' busy onSearch={onSearch} />)
  expect(screen.getByRole('searchbox')).toHaveValue('local draft')
  expect(screen.getByRole('button', { name: 'Images' })).toHaveAttribute('aria-pressed', 'true')
  expect(onSearch).not.toHaveBeenCalled()
  view.rerender(<SearchForm key='generation-a:1' busy={false} submittedQuery='explicit new handoff' onSearch={onSearch} />)
  expect(screen.getByRole('searchbox')).toHaveValue('explicit new handoff')
  expect(screen.getByRole('button', { name: 'Images' })).toHaveAttribute('aria-pressed', 'false')
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'private edited handoff' } })
  view.rerender(<SearchForm key='generation-b:1' busy={false} submittedQuery='' onSearch={onSearch} />)
  expect(screen.getByRole('searchbox')).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Search', exact: true })).toBeDisabled()
  expect(onSearch).not.toHaveBeenCalled()
})
