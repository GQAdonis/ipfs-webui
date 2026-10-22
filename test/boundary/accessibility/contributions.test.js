// @vitest-environment node
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ACCESSIBILITY_FAMILIES, ACCESSIBILITY_SLOTS, assertContributionInputs, captureContributionInputs, loadContributions, runContribution, validateContribution } from './contributions.mjs'

const contribution = () => ({ schemaVersion: 1, family: 'decisions', fixtures: [{ root: 'webui', path: 'fixture.txt' }], slots: Object.fromEntries(ACCESSIBILITY_SLOTS.map(slot => [slot, async () => {}])) })
describe('named composed accessibility evidence cannot pass on empty or stale contributions', () => {
  it('requires the five exact families and all four executable slot implementations', () => {
    expect(ACCESSIBILITY_FAMILIES).toEqual(['decisions', 'shell', 'a2ui', 'inbox', 'context'])
    expect(() => validateContribution({ ...contribution(), family: 'desktop' }, 'decisions')).toThrow('named')
    expect(() => validateContribution({ ...contribution(), fixtures: [] }, 'decisions')).toThrow('empty')
    expect(() => validateContribution({ ...contribution(), slots: { axe: { status: 'PASS' } } }, 'decisions')).toThrow('implementation')
  })
  it('missing families, changed fixture bytes and generic PASS returns block', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ui112-fixture-'))
    try {
      await mkdir(join(root, 'test/boundary/accessibility/contributions'), { recursive: true })
      await writeFile(join(root, 'fixture.txt'), 'Original current fixture')
      const ctx = { root, kubo: root }
      await expect(loadContributions(ctx)).rejects.toThrow('missing: decisions')
      await expect(captureContributionInputs(ctx, [{ root: 'webui', path: 'missing-fixture.txt' }])).rejects.toThrow('fixture bytes are unavailable')
      const inputs = await captureContributionInputs(ctx, contribution().fixtures)
      await writeFile(join(root, 'fixture.txt'), 'Tampered after snapshot')
      await expect(assertContributionInputs(ctx, inputs)).rejects.toThrow('hash mismatch')
      const current = await captureContributionInputs(ctx, contribution().fixtures)
      await expect(runContribution(ctx, { value: contribution(), inputs: current }, 'axe')).rejects.toThrow('Empty or browser-unexercised')
    } finally { await rm(root, { recursive: true, force: true }) }
  })

  it('rejects traversal, duplicate fixture paths and symlinks before execution', async () => {
    const root = await mkdtemp(join(tmpdir(), 'ui112-source-guards-'))
    try {
      await writeFile(join(root, 'fixture.txt'), 'Orchestration-only source bytes')
      await symlink(join(root, 'fixture.txt'), join(root, 'linked.txt'))
      const ctx = { root, kubo: root }
      for (const path of ['../fixture.txt', './fixture.txt', 'nested\\fixture.txt', '/fixture.txt']) await expect(captureContributionInputs(ctx, [{ root: 'webui', path }])).rejects.toThrow('Invalid accessibility fixture path')
      await expect(captureContributionInputs(ctx, [{ root: 'webui', path: 'linked.txt' }])).rejects.toThrow('escapes')
      await expect(captureContributionInputs(ctx, [contribution().fixtures[0], contribution().fixtures[0]])).rejects.toThrow('Duplicate')
    } finally { await rm(root, { recursive: true, force: true }) }
  })

  it.each(['fixture.txt', 'contributor.mjs'])('rejects changed %s before its callback runs', async path => {
    const root = await mkdtemp(join(tmpdir(), 'ui112-before-mutation-'))
    try {
      await writeFile(join(root, path), 'Original orchestration-only bytes')
      const ctx = { root, kubo: root }
      const inputs = await captureContributionInputs(ctx, [{ root: 'webui', path }])
      let attempted = false
      const value = contribution()
      value.slots.axe = async () => { attempted = true }
      await writeFile(join(root, path), 'Changed before callback')
      await expect(runContribution(ctx, { value, inputs }, 'axe')).rejects.toThrow('hash mismatch')
      expect(attempted).toBe(false)
    } finally { await rm(root, { recursive: true, force: true }) }
  })

  it.each(['fixture.txt', 'contributor.mjs'])('rejects changed %s after an otherwise complete orchestration-only callback', async path => {
    const root = await mkdtemp(join(tmpdir(), 'ui112-after-mutation-'))
    try {
      await writeFile(join(root, path), 'Original orchestration-only bytes')
      const inputs = await captureContributionInputs({ root, kubo: root }, [{ root: 'webui', path }])
      const records = []
      const ctx = {
        root,
        kubo: root,
        assert (condition, description) { if (!condition) throw new Error(description) },
        async record (name, value) { records.push({ name, value }); return join(root, `${name}.json`) },
        async screenshot () {
          const image = join(root, 'orchestration-only.png')
          await writeFile(image, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4xoAAAAASUVORK5CYII=', 'base64'))
          return image
        }
      }
      const value = contribution()
      value.slots.axe = async child => {
        child.assert(true, 'Orchestration-only assertion')
        await child.screenshot(null, 'orchestration-only')
        await writeFile(join(root, path), 'Changed after callback began')
      }
      await expect(runContribution(ctx, { value, inputs }, 'axe')).rejects.toThrow('hash mismatch')
      expect(records.some(record => record.value.kind === 'ui112-contribution')).toBe(false)
    } finally { await rm(root, { recursive: true, force: true }) }
  })

  it.each(['fixture.txt', 'contributor.mjs'])('retains callback FAIL and changed %s after an unsuccessful callback', async path => {
    const root = await mkdtemp(join(tmpdir(), 'ui112-failed-mutation-'))
    try {
      await writeFile(join(root, path), 'Original orchestration-only bytes')
      const inputs = await captureContributionInputs({ root, kubo: root }, [{ root: 'webui', path }])
      const records = []
      const ctx = { root, kubo: root, assert (condition, description) { if (!condition) throw new Error(description) }, async record (name, value) { records.push({ name, value }) } }
      const value = contribution()
      value.slots.axe = async child => {
        await writeFile(join(root, path), 'Changed during failing callback')
        child.assert(false, 'Orchestration-only callback assertion failed')
      }
      let failure
      try { await runContribution(ctx, { value, inputs }, 'axe') } catch (error) { failure = error }
      expect(failure).toBeInstanceOf(Error)
      expect(['Blocked', 'NotExercised']).not.toContain(failure.name)
      const messages = error => [error.message, ...(error.errors || []).flatMap(messages), ...(error.cause ? messages(error.cause) : [])]
      expect(messages(failure).join('\n')).toContain('callback assertion failed')
      expect(messages(failure).join('\n')).toContain('hash mismatch')
      expect(records.some(record => record.value.kind === 'ui112-contribution')).toBe(false)
    } finally { await rm(root, { recursive: true, force: true }) }
  })
})
