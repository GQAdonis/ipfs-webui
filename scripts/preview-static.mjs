// Supplemental current-artifact visual preview, never live-agent acceptance.
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertLocalWebuiExport } from './local-artifact.mjs'
import { serveStatic } from '../test/boundary/static-host.mjs'
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--port')) throw new Error('Use preview-static.mjs [--port <nondefault-loopback-port>]')
await assertLocalWebuiExport({ root, kubo: resolve(root, '../kubo') })
const host = await serveStatic({ directory: resolve(root, 'build'), port: args.length ? Number(args[1]) : 0 })
console.log(`Supplemental production-static preview: ${host.baseURL} (use a fresh browser profile; no backend or credential is supplied)`)
let closing = false
const close = async () => { if (closing) return; closing = true; await host.close(); process.exitCode = 0 }
process.once('SIGINT', close); process.once('SIGTERM', close)
