import { sourceProvenance } from '../host-overlays/provenance.mjs'
import { runHost } from '../host-overlays/browser.mjs'
export default [
  { scenario: 'UI-118', id: 'source-provenance', requires: ['fixture-browser'], async run (ctx) { await sourceProvenance(ctx); await runHost(ctx, 'ordinary', true) } },
  ...Object.entries({ 'browser-overlays': 'ordinary', 'shadow-overlays': 'shadow', 'iframe-overlays': 'iframe' }).map(([id, host]) => ({ scenario: 'UI-118', id, requires: ['fixture-browser'], run: ctx => runHost(ctx, host) }))
]
