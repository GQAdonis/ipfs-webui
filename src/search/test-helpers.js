// Shared by the search tests only (not a test file itself).
import i18n from 'i18next'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'
import searchEn from '../../public/locales/en/search.json'

export function initI18n () {
  const missing = []
  i18n.use(ICU).use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['search'],
    defaultNS: 'search',
    resources: { en: { search: searchEn } },
    interpolation: { escapeValue: false },
    saveMissing: true,
    missingKeyHandler: (_l, ns, key) => { missing.push(`${ns}:${key}`) },
    react: { useSuspense: false }
  })
  return missing
}

/** A fetch Response stand-in: status, JSON body and headers. */
export function reply (status, body, headers = {}) {
  const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => lower[name.toLowerCase()] ?? null },
    json: async () => {
      if (body === undefined) throw new Error('no body')
      return body
    }
  }
}

export const CID_A = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
export const CID_B = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'

export const CONFIGURED = Object.freeze({
  enabled: true,
  mode: 'embedded',
  auto: true,
  store_reachable: true,
  model: 'bge-m3',
  dimensions: 1024,
  indexed_cids: 1284,
  chunk_count: 9120
})

export const hit = (over = {}) => ({
  cid: CID_A,
  path: '/docs/roofer-invoice.pdf',
  mime_type: 'application/pdf',
  chunk_index: 2,
  score: 0.8214,
  text: 'Invoice 4411 from the roofer, due in 30 days.',
  kind: 'document',
  source: 'extracted',
  ...over
})

export const RUN = Object.freeze({
  run_id: 'r1',
  state: 'running',
  started_by: 'ui',
  sources: ['pins'],
  caps: { max_files: 1000, max_bytes: 1000000, files_per_minute: 60 },
  files_seen: 40,
  files_indexed: 31,
  files_skipped: 9,
  chunks_indexed: 212,
  bytes_read: 3200000,
  skipped_by_reason: { too_large: 4, mime_not_allowed: 5 }
})
