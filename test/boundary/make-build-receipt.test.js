// @vitest-environment node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { makeBinaryIdentity } from '../helpers/owned-kubo.mjs'

// This opt-in regression consumes the actual owner-built binary and retained
// public command output. Only command transport is stubbed; receipt validation,
// source inventories, embed snapshots and binary bytes remain real filesystem IO.
const kubo = process.env.KUBO_MAKE_BUILD_REGRESSION
const directory = kubo && join(kubo, 'evidence/agentic-ui-frontend/issue11-clearance/node-delivery-v2')
describe.skipIf(!kubo)('actual same-checkout trimpath make build regression', () => {
  it('accepts the canonical binary only with its complete explicit owner build receipt', async () => {
    const recorded = JSON.parse(await readFile(join(directory, 'commands.json'), 'utf8'))
    recorded.push(JSON.parse(await readFile(join(directory, 'identity-diagnostic.json'), 'utf8')).command)
    const processes = {
      run: async (command, args) => {
        const row = recorded.find(row => JSON.stringify(row.argv) === JSON.stringify([command, ...args]))
        if (!row) throw new Error(`No actual recorded command transport for ${command} ${args.join(' ')}`)
        return { ...row, stdout: await readFile(join(directory, row.stdoutFile), 'utf8'), stderr: await readFile(join(directory, row.stderrFile), 'utf8') }
      }
    }
    const identity = await makeBinaryIdentity({ kubo, processes, env: {}, makeBuildReceipt: join(directory, 'artifact-binding-receipt.json') })
    expect(identity.sha256).toBe('792cb3b214b54daafd8ae432113a8a22c5cf6e0df7c4a15c38de60b28f52eccf')
    expect(identity.version).toContain('0.44.0-dev-a3bd2fbbe-dirty')
    expect(identity.provenance.method).toBe('same-checkout-make-build-receipt')
    await expect(makeBinaryIdentity({ kubo, processes, env: {}, makeBuildReceipt: join(kubo, 'evidence/agentic-ui-frontend/issue11-clearance/node-delivery/artifact-binding-receipt.json') })).rejects.toThrow('current source and embeds differs or is stale')
  })
})
