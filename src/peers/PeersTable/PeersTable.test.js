import { vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { initReactI18next, withTranslation } from 'react-i18next'
import i18n from 'i18next'
import ICU from 'i18next-icu'
import peersEn from '../../../public/locales/en/peers.json'
import { FilterInput } from './PeersTable.js'

// The filter fixture does not render peer row cells.
vi.mock('../../components/cid/Cid.js', () => ({ default: () => null }))

i18n.use(ICU).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['peers'],
  defaultNS: 'peers',
  resources: { en: { peers: peersEn } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

const Filter = withTranslation('peers')(FilterInput)

describe('Peers filter row (N3)', () => {
  it('labels the field, translates its placeholder and states the count in words', () => {
    render(<Filter filter='' setFilter={() => {}} filteredCount={3} />)
    const input = screen.getByLabelText('Filter peers')
    expect(input).toHaveAttribute('placeholder', 'ID, location or protocol')
    expect(screen.getByTestId('peers-count')).toHaveTextContent('3 peers')
  })

  it('describes the field by the count and does not announce it as a live region (L3)', () => {
    render(<Filter filter='' setFilter={() => {}} filteredCount={3} />)
    const count = screen.getByTestId('peers-count')
    expect(count).not.toHaveAttribute('role')
    expect(screen.getByLabelText('Filter peers')).toHaveAttribute('aria-describedby', count.id)
  })

  it('uses the singular for one peer and keeps the count in normal flow (no absolute positioning)', () => {
    render(<Filter filter='' setFilter={() => {}} filteredCount={1} />)
    const count = screen.getByTestId('peers-count')
    expect(count).toHaveTextContent('1 peer')
    expect(count.className).not.toMatch(/\babsolute\b/)
  })

  it('clears the filter on Escape', () => {
    const setFilter = vi.fn()
    render(<Filter filter='abc' setFilter={setFilter} filteredCount={0} />)
    fireEvent.keyDown(screen.getByLabelText('Filter peers'), { key: 'Escape' })
    expect(setFilter).toHaveBeenCalledWith('')
  })

  it('ships the empty-table sentences in the en locale', () => {
    expect(peersEn.noPeers).toMatch(/^No peers yet/)
    expect(peersEn.noPeersMatch).toBe('No peers match this filter.')
  })
})
