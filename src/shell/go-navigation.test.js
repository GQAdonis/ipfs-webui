import { describe, expect, it, vi } from 'vitest'
import { submitGo } from './go-navigation.js'
const cid = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
const current = { isCurrent: () => true }
const host = ready => ({ ipfsReady: ready, navigate: vi.fn(), browse: vi.fn() })
describe('Home Go uses existing navigation', () => {
  it('keeps normal destinations available without an agent or connected node', () => {
    const callbacks = host(false)
    expect(submitGo('/pins', callbacks, current).accepted).toBe(true)
    expect(callbacks.navigate).toHaveBeenCalledWith('/pins')
    expect(callbacks.browse).not.toHaveBeenCalled()
  })
  it('passes CID/protocol paths to the actual Files browser with subpaths intact', () => {
    const callbacks = host(true)
    expect(submitGo(`ipfs://${cid}/hello.txt`, callbacks, current).accepted).toBe(true)
    expect(callbacks.browse).toHaveBeenCalledWith({ path: `/ipfs/${cid}/hello.txt` })
    expect(callbacks.navigate).not.toHaveBeenCalled()
  })
  it('refuses arbitrary commands, external URLs, missing-node content reads and retired submissions', () => {
    const callbacks = host(false)
    for (const text of ['delete all pins', 'https://example.test', cid]) expect(submitGo(text, callbacks, current).accepted).toBe(false)
    expect(submitGo('/files', callbacks, { isCurrent: () => false }).accepted).toBe(false)
    expect(callbacks.navigate).not.toHaveBeenCalled()
    expect(callbacks.browse).not.toHaveBeenCalled()
  })
})
