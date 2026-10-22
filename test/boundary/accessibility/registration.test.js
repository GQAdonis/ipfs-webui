// @vitest-environment node
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import registrations from '../registrations/accessibility.mjs'
import { Blocked } from '../processes.mjs'

const families = ['decisions', 'shell', 'a2ui', 'inbox', 'context']
const slots = ['viewport-theme-matrix', 'keyboard-and-focus', 'axe', 'reduced-motion']
// These callbacks, metadata and tiny PNG are orchestration-only fixtures. They
// never launch a browser or supply UI-112 accessibility/acceptance evidence.
const orchestrationPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4xoAAAAASUVORK5CYII=', 'base64')
const notExercised = message => Object.assign(new Error(message), { name: 'NotExercised' })
const outcomeRecords = fixture => fixture.records.filter(record => record.value.kind === 'ui112-family-outcome').map(record => record.value)
const bindingRecords = fixture => fixture.records.filter(record => record.value.kind === 'ui112-contribution').map(record => record.value)
const status = error => error ? error.name === 'Blocked' ? 'BLOCKED' : error.name === 'NotExercised' ? 'NOT_EXERCISED' : 'FAIL' : 'PASS'

async function fixture (callback, { missing, invalid, importError, metadataError } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'ui112-orchestration-only-'))
  const records = []
  const attempts = []
  const metadataCalls = []
  try {
    await mkdir(join(root, 'test/boundary/accessibility/contributions'), { recursive: true })
    await mkdir(join(root, 'evidence'))
    for (const family of families) {
      await writeFile(join(root, `${family}.txt`), `Orchestration-only ${family} input`)
      if (family === missing) continue
      const source = family === importError
        ? 'throw new Error("Orchestration-only contributor import failed")\n'
        : `export default ${family === invalid ? '{ schemaVersion: 1, family: "invalid" }' : `{ schemaVersion: 1, family: ${JSON.stringify(family)}, fixtures: [{ root: 'webui', path: ${JSON.stringify(`${family}.txt`)} }], slots: { ${slots.map(slot => `${JSON.stringify(slot)}: ctx => ctx.orchestrationFixture(${JSON.stringify(family)}, ${JSON.stringify(slot)}, ctx)`).join(', ')} } }`}\n`
      await writeFile(join(root, `test/boundary/accessibility/contributions/${family}.mjs`), source)
    }
    const ctx = {
      root,
      kubo: root,
      async getMetadata () {
        metadataCalls.push('full-export-verification')
        if (metadataError) throw metadataError
        return { orchestrationOnly: true }
      },
      assert (condition, description) { if (!condition) throw new Error(description) },
      async record (name, value) {
        records.push({ name, value })
        const path = join(root, 'evidence', `${records.length}-${name}.json`)
        await writeFile(path, JSON.stringify(value))
        return path
      },
      async screenshot (page, name) {
        const path = join(root, 'evidence', `${name}.png`)
        await writeFile(path, orchestrationPNG)
        return path
      },
      async orchestrationFixture (family, slot, child) {
        attempts.push({ family, slot, metadataVerified: metadataCalls.length === 1 })
        if (callback) return callback(family, slot, child)
        child.assert(true, 'Orchestration-only callback assertion')
        await child.screenshot(null, 'orchestration-only')
      }
    }
    return { root, ctx, attempts, records, metadataCalls, async close () { await rm(root, { recursive: true, force: true }) } }
  } catch (error) {
    await rm(root, { recursive: true, force: true })
    throw error
  }
}

async function execute (value, slot = 'axe') {
  try { await registrations.find(entry => entry.id === slot).run(value.ctx) } catch (error) { return error }
}

async function successfulCallback (family, slot, ctx) {
  ctx.assert(true, 'Orchestration-only callback assertion')
  await ctx.screenshot(null, 'orchestration-only')
}

describe('actual UI-112 registration orchestration, without browser acceptance', () => {
  it('retains the four adopted registrations and moves only their common dependency to fixture-browser', () => {
    expect(registrations.map(entry => [entry.scenario, entry.id, entry.requires])).toEqual(slots.map(slot => ['UI-112', slot, ['fixture-browser']]))
  })

  describe.each(slots)('%s', slot => {
    it('attempts every family after early Blocked and retains a later assertion FAIL', async () => {
      const value = await fixture(async (family, slot, ctx) => {
        if (family === 'decisions') throw new Blocked('Orchestration-only decisions unavailable')
        if (family === 'shell') ctx.assert(false, 'Orchestration-only shell assertion failed')
        await successfulCallback(family, slot, ctx)
      })
      try {
        const error = await execute(value, slot)
        expect(value.attempts.map(item => item.family)).toEqual(families)
        expect(value.attempts.every(item => item.slot === slot && item.metadataVerified)).toBe(true)
        expect(status(error)).toBe('FAIL')
        expect(outcomeRecords(value).map(item => [item.family, item.slot, item.status])).toEqual(families.map((family, index) => [family, slot, index === 0 ? 'BLOCKED' : index === 1 ? 'FAIL' : 'PASS']))
        expect(bindingRecords(value).map(item => item.family)).toEqual(['a2ui', 'inbox', 'context'])
      } finally { await value.close() }
    })

    it('passes only with five successful source-bound assertions and PNG artifacts', async () => {
      const value = await fixture()
      try {
        expect(await execute(value, slot)).toBeUndefined()
        expect(value.metadataCalls).toEqual(['full-export-verification'])
        expect(value.attempts.map(item => item.family)).toEqual(families)
        expect(outcomeRecords(value).map(item => [item.family, item.slot, item.status])).toEqual(families.map(family => [family, slot, 'PASS']))
        const bindings = bindingRecords(value)
        expect(bindings.map(item => item.family)).toEqual(families)
        for (const binding of bindings) {
          expect(binding.slot).toBe(slot)
          expect(binding.inputs).toHaveLength(2)
          expect(binding.inputs.every(input => /^[a-f0-9]{64}$/.test(input.sha256))).toBe(true)
          expect(binding.assertions).toBeGreaterThan(0)
          expect(binding.artifacts.some(artifact => artifact.path.endsWith('.png') && /^[a-f0-9]{64}$/.test(artifact.sha256))).toBe(true)
        }
      } finally { await value.close() }
    })
  })

  it.each([
    ['late FAIL beats earlier BLOCKED and NOT_EXERCISED', ['BLOCKED', 'NOT_EXERCISED', 'PASS', 'PASS', 'FAIL'], 'FAIL'],
    ['early FAIL survives later BLOCKED', ['FAIL', 'PASS', 'PASS', 'BLOCKED', 'PASS'], 'FAIL'],
    ['BLOCKED beats earlier NOT_EXERCISED', ['NOT_EXERCISED', 'PASS', 'PASS', 'BLOCKED', 'PASS'], 'BLOCKED'],
    ['NOT_EXERCISED cannot become PASS', ['PASS', 'NOT_EXERCISED', 'PASS', 'PASS', 'PASS'], 'NOT_EXERCISED']
  ])('%s', async (label, statuses, expected) => {
    const value = await fixture(async (family, slot, ctx) => {
      const outcome = statuses[families.indexOf(family)]
      if (outcome === 'BLOCKED') throw new Blocked(`Orchestration-only ${family} blocked`)
      if (outcome === 'NOT_EXERCISED') throw notExercised(`Orchestration-only ${family} not exercised`)
      if (outcome === 'FAIL') ctx.assert(false, `Orchestration-only ${family} assertion failed`)
      await successfulCallback(family, slot, ctx)
    })
    try {
      expect(status(await execute(value))).toBe(expected)
      expect(value.attempts.map(item => item.family)).toEqual(families)
      expect(outcomeRecords(value).map(item => item.status)).toEqual(statuses)
    } finally { await value.close() }
  })

  it.each([
    ['missing', 'BLOCKED'],
    ['invalid', 'BLOCKED'],
    ['importError', 'FAIL']
  ])('retains a %s contributor outcome and attempts the other families', async (problem, expected) => {
    const value = await fixture(undefined, { [problem]: 'shell' })
    try {
      expect(status(await execute(value))).toBe(expected)
      expect(value.attempts.map(item => item.family)).toEqual(['decisions', 'a2ui', 'inbox', 'context'])
      expect(outcomeRecords(value).map(item => [item.family, item.status])).toEqual(families.map(family => [family, family === 'shell' ? expected : 'PASS']))
      expect(bindingRecords(value).map(item => item.family)).toEqual(['decisions', 'a2ui', 'inbox', 'context'])
    } finally { await value.close() }
  })

  it('blocks every family before dispatch when complete metadata validation rejects', async () => {
    const value = await fixture(undefined, { metadataError: new Blocked('Orchestration-only full export rejected') })
    try {
      const error = await execute(value)
      expect(status(error)).toBe('BLOCKED')
      expect(error.message).toContain('full export rejected')
      expect(value.metadataCalls).toEqual(['full-export-verification'])
      expect(value.attempts).toEqual([])
      expect(bindingRecords(value)).toEqual([])
    } finally { await value.close() }
  })

  it.each(['generic PASS', 'assertion without PNG', 'PNG without assertion'])('cannot pass an incomplete family: %s', async mode => {
    const value = await fixture(async (family, slot, ctx) => {
      if (family !== 'decisions') return successfulCallback(family, slot, ctx)
      if (mode === 'generic PASS') return { status: 'PASS' }
      if (mode === 'assertion without PNG') { ctx.assert(true, 'Orchestration-only assertion'); await ctx.record('no-png', { orchestrationOnly: true }) } else await ctx.screenshot(null, 'orchestration-only')
    })
    try {
      expect(status(await execute(value))).toBe('BLOCKED')
      expect(value.attempts.map(item => item.family)).toEqual(families)
      expect(outcomeRecords(value).map(item => item.status)).toEqual(['BLOCKED', 'PASS', 'PASS', 'PASS', 'PASS'])
      expect(bindingRecords(value).map(item => item.family)).toEqual(['shell', 'a2ui', 'inbox', 'context'])
    } finally { await value.close() }
  })
})
