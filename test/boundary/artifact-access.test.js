// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createArtifactAccess } from './artifact-access.mjs'
import { Blocked } from './processes.mjs'

// These injected stage fixtures test orchestration, not export validity or a
// substitute daemon. The runner supplies the full source-aware validator and
// actual owned-node publisher; production/negative-control acceptance is separate.
function fixture () {
  const manifest = Object.freeze({ artifactSha256: 'a'.repeat(64), base: './', routing: 'hash' })
  const baseURL = 'http://127.0.0.1:18080/ipfs/fixture-cid/webui/'
  const stages = {
    produce: vi.fn(async () => {}),
    verify: vi.fn(async () => manifest),
    bind: vi.fn(),
    publish: vi.fn(async () => baseURL)
  }
  return { ...stages, ...createArtifactAccess(stages), manifest, baseURL }
}

describe('verified artifact access and gateway dependency', () => {
  it('returns verified metadata without requiring the missing owned node; gateway access still rejects', async () => {
    const f = fixture()
    const missingNode = new Blocked('Fixture owned make-built node is unavailable')
    f.publish.mockRejectedValue(missingNode)

    await expect(f.getMetadata()).resolves.toEqual({ manifest: f.manifest })
    expect(f.publish).not.toHaveBeenCalled()
    await expect(f.getArtifact()).rejects.toBe(missingNode)
    expect(f.produce).toHaveBeenCalledTimes(1)
    expect(f.verify).toHaveBeenCalledTimes(1)
    expect(f.bind).toHaveBeenCalledWith(f.manifest)
  })

  it('keeps verified metadata available after an earlier gateway publication failure', async () => {
    const f = fixture()
    const failure = new Error('Fixture gateway import failed')
    f.publish.mockRejectedValue(failure)

    await expect(f.getArtifact()).rejects.toBe(failure)
    await expect(f.getMetadata()).resolves.toEqual({ manifest: f.manifest })
    expect(f.verify).toHaveBeenCalledTimes(1)
    expect(f.bind).toHaveBeenCalledTimes(1)
    expect(f.publish).toHaveBeenCalledTimes(1)
  })

  for (const cause of ['source/lock inputs changed', 'production asset was tampered']) {
    it(`preserves the validator's rejection for both consumers when ${cause}`, async () => {
      const f = fixture()
      const failure = new Error(`Source-aware verifier fixture: ${cause}`)
      f.verify.mockRejectedValue(failure)

      await expect(f.getMetadata()).rejects.toBe(failure)
      await expect(f.getArtifact()).rejects.toBe(failure)
      expect(f.produce).toHaveBeenCalledTimes(1)
      expect(f.verify).toHaveBeenCalledTimes(1)
      expect(f.bind).not.toHaveBeenCalled()
      expect(f.publish).not.toHaveBeenCalled()
    })
  }

  it('preserves producer failure before verification, binding or publication', async () => {
    const f = fixture()
    const failure = new Error('Fixture producer failed')
    f.produce.mockRejectedValue(failure)

    await expect(f.getMetadata()).rejects.toBe(failure)
    await expect(f.getArtifact()).rejects.toBe(failure)
    expect(f.produce).toHaveBeenCalledTimes(1)
    expect(f.verify).not.toHaveBeenCalled()
    expect(f.bind).not.toHaveBeenCalled()
    expect(f.publish).not.toHaveBeenCalled()
  })

  it('shares one ordered production/verification and gateway import across concurrent consumers', async () => {
    const f = fixture()
    let release
    const barrier = new Promise(resolve => { release = resolve })
    f.verify.mockImplementation(async () => { await barrier; return f.manifest })
    const pending = Promise.all([f.getMetadata(), f.getArtifact(), f.getMetadata(), f.getArtifact()])
    pending.catch(() => {})
    try {
      await vi.waitFor(() => expect(f.verify).toHaveBeenCalledTimes(1))
      release()
      const results = await pending
      expect(results[0]).toEqual({ manifest: f.manifest })
      expect(results[2]).toEqual({ manifest: f.manifest })
      expect(results[1]).toBe(results[3])
      expect(f.produce).toHaveBeenCalledTimes(1)
      expect(f.verify).toHaveBeenCalledTimes(1)
      expect(f.bind).toHaveBeenCalledTimes(1)
      expect(f.publish).toHaveBeenCalledTimes(1)
      expect(f.produce.mock.invocationCallOrder[0]).toBeLessThan(f.verify.mock.invocationCallOrder[0])
      expect(f.verify.mock.invocationCallOrder[0]).toBeLessThan(f.bind.mock.invocationCallOrder[0])
      expect(f.bind.mock.invocationCallOrder[0]).toBeLessThan(f.publish.mock.invocationCallOrder[0])
    } finally { release(); await pending.catch(() => {}) }
  })

  it('preserves the original complete gateway return while metadata exposes only its manifest', async () => {
    const f = fixture()
    await expect(f.getArtifact()).resolves.toEqual({ manifest: f.manifest, baseURL: f.baseURL })
    await expect(f.getMetadata()).resolves.toEqual({ manifest: f.manifest })
    expect(f.publish).toHaveBeenCalledWith(f.manifest)
    expect(f.publish).toHaveBeenCalledTimes(1)
  })

  it('caches a failed gateway attempt rather than silently retrying publication', async () => {
    const f = fixture()
    const failure = new Error('Fixture publication failed')
    f.publish.mockRejectedValue(failure)
    await expect(f.getArtifact()).rejects.toBe(failure)
    await expect(f.getArtifact()).rejects.toBe(failure)
    expect(f.produce).toHaveBeenCalledTimes(1)
    expect(f.verify).toHaveBeenCalledTimes(1)
    expect(f.bind).toHaveBeenCalledTimes(1)
    expect(f.publish).toHaveBeenCalledTimes(1)
  })
})
