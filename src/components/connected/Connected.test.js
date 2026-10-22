// Round 5 correction L5: the top bar and the Welcome page say the same word
// when the first connection attempt failed.

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import appEn from '../../../public/locales/en/app.json'
import { Connected } from './Connected.js'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['app', 'notify'],
  defaultNS: 'notify',
  resources: { en: { app: appEn, notify: { ipfsApiRequestFailed: 'Could not reach the API' } } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false }
})

afterEach(cleanup)
const t = (k) => i18n.t(k)

describe('Connected (top bar)', () => {
  it('says Connecting while the first attempt is pending', () => {
    render(<Connected t={t} ipfsReady={false} ipfsConnected={false} ipfsInitFailed={false} doSetIsNodeInfoOpen={() => {}} />)
    expect(screen.getByText('Connecting')).toBeInTheDocument()
  })

  it('says Disconnected, as the Welcome page does, once the first attempt failed', () => {
    render(<Connected t={t} ipfsReady={false} ipfsConnected={false} ipfsInitFailed doSetIsNodeInfoOpen={() => {}} />)
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
    expect(screen.queryByText('Connecting')).toBeNull()
  })
})
