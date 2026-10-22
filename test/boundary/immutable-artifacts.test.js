// @vitest-environment node
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { createImmutableArtifactWriter } from './immutable-artifacts.mjs'

let directory
let artifacts
let retain
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'immutable-boundary-evidence-'))
  artifacts = []
  retain = createImmutableArtifactWriter({ directory, artifacts })
})
afterEach(async () => { await rm(directory, { recursive: true, force: true }) })

async function verifyEveryClaim () {
  expect(new Set(artifacts.map(file => file.path)).size).toBe(artifacts.length)
  for (const claim of artifacts) expect(sha256(await readFile(claim.path))).toBe(claim.sha256)
}

it('retains both differing UI106 runtime/App provenance records under their original semantic basename', async () => {
  const runtime = JSON.stringify({ report: { inputs: ['chat-runtime'], htmlSha256: 'runtime' } })
  const app = JSON.stringify({ report: { inputs: ['app-host'], htmlSha256: 'app' } })
  const first = await retain('produced-chat-binding', 'json', runtime)
  const second = await retain('produced-chat-binding', 'json', app)
  expect(first).not.toBe(second)
  expect(basename(first)).toBe('produced-chat-binding.json')
  expect(basename(second)).toBe('produced-chat-binding.json')
  expect(await readFile(first, 'utf8')).toBe(runtime)
  expect(await readFile(second, 'utf8')).toBe(app)
  expect(artifacts.map(file => file.name)).toEqual(['produced-chat-binding', 'produced-chat-binding'])
  expect(artifacts.map(file => file.sequence)).toEqual([1, 2])
  await verifyEveryClaim()
})

it('never deduplicates identical network observations or concurrent screenshot/trace bytes', async () => {
  const bytes = Buffer.from('identical bytes still represent separate observations')
  for (const [name, extension] of [['chat-fixture-network-policy', 'json'], ['focus-state', 'png'], ['trace-dark-1440', 'zip']]) {
    const paths = await Promise.all(Array.from({ length: 4 }, () => retain(name, extension, bytes)))
    expect(new Set(paths).size).toBe(4)
    expect(paths.every(path => basename(path) === `${name}.${extension}`)).toBe(true)
  }
  expect(artifacts).toHaveLength(12)
  await verifyEveryClaim()
})

it('preserves pre-existing evidence and safely reserves around independent writers and sanitized-name collisions', async () => {
  const existing = join(directory, 'records', '000001')
  await mkdir(existing, { recursive: true })
  await writeFile(join(existing, 'network.json'), 'earlier immutable observation', { flag: 'wx' })
  const other = createImmutableArtifactWriter({ directory, artifacts })
  const paths = await Promise.all([
    retain('network', 'json', 'new observation'),
    other('network', 'json', 'another observation'),
    retain('same/name', 'json', 'first normalized label'),
    retain('same_name', 'json', 'second normalized label')
  ])
  expect(new Set(paths.map(dirname)).size).toBe(4)
  expect(await readFile(join(existing, 'network.json'), 'utf8')).toBe('earlier immutable observation')
  expect(await readdir(join(directory, 'records'))).toHaveLength(5)
  await verifyEveryClaim()
})

it('snapshots mutable capture buffers before awaiting file allocation', async () => {
  const capture = Buffer.from('original capture')
  const pending = retain('network-capture', 'zip', capture)
  capture.fill(0)
  const path = await pending
  expect(await readFile(path, 'utf8')).toBe('original capture')
  await verifyEveryClaim()
})

it('rejects unsafe identities and refuses a non-directory record root without modifying earlier bytes or claiming output', async () => {
  await expect(retain('..', 'json', '{}')).rejects.toThrow('Unsafe artifact path')
  await expect(retain('receipt', '../json', '{}')).rejects.toThrow('Invalid evidence artifact identity')
  await writeFile(join(directory, 'records'), 'owned existing file', { flag: 'wx' })
  await expect(retain('network', 'json', '{}')).rejects.toThrow()
  expect(await readFile(join(directory, 'records'), 'utf8')).toBe('owned existing file')
  expect(artifacts).toHaveLength(0)
})
