import { lstat, readFile, realpath } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { aggregate, requirements } from '../requirements.mjs'
import { Blocked } from '../processes.mjs'

export const ACCESSIBILITY_FAMILIES = Object.freeze(['decisions', 'shell', 'a2ui', 'inbox', 'context'])
export const ACCESSIBILITY_SLOTS = Object.freeze([...requirements['UI-112']])
export function validateContribution (value, family) {
  if (!value || value.schemaVersion !== 1 || value.family !== family || !ACCESSIBILITY_FAMILIES.includes(family)) throw new Blocked(`Invalid named accessibility contribution: ${family}`)
  if (!Array.isArray(value.fixtures) || !value.fixtures.length || !value.slots || Object.keys(value.slots).length !== ACCESSIBILITY_SLOTS.length || ACCESSIBILITY_SLOTS.some(slot => typeof value.slots[slot] !== 'function')) throw new Blocked(`Missing/empty accessibility fixture or slot implementation: ${family}`)
  return value
}
async function input (ctx, fixture) {
  if (!fixture || !['webui', 'kubo'].includes(fixture.root) || typeof fixture.path !== 'string' || !fixture.path || fixture.path.includes('\\') || fixture.path.split('/').some(part => !part || part === '.' || part === '..')) throw new Blocked('Invalid accessibility fixture path')
  const root = fixture.root === 'webui' ? ctx.root : ctx.kubo
  const file = resolve(root, fixture.path); const rel = relative(root, file)
  try {
    if (rel.startsWith('..') || (await lstat(file)).isSymbolicLink() || relative(await realpath(root), await realpath(file)).startsWith('..')) throw new Blocked('Accessibility fixture escapes its source checkout')
    return { root: fixture.root, path: fixture.path, sha256: sha256(await readFile(file)) }
  } catch (error) {
    if (error instanceof Blocked) throw error
    throw new Blocked(`Required accessibility fixture bytes are unavailable: ${fixture.root}:${fixture.path}`)
  }
}
export async function captureContributionInputs (ctx, fixtures) {
  if (!fixtures?.length) throw new Blocked('An accessibility contribution has no fixture bytes')
  const values = await Promise.all(fixtures.map(fixture => input(ctx, fixture)))
  if (new Set(values.map(value => `${value.root}:${value.path}`)).size !== values.length) throw new Blocked('Duplicate accessibility fixture input')
  return values
}
export async function assertContributionInputs (ctx, expected) {
  const current = await captureContributionInputs(ctx, expected)
  if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Blocked('Accessibility contributor/fixture source hash mismatch')
}
export function contributionStatus (error) {
  return error ? error.name === 'Blocked' ? 'BLOCKED' : error.name === 'NotExercised' ? 'NOT_EXERCISED' : 'FAIL' : 'PASS'
}
export function strongestContributionError (errors) {
  if (!errors.length) return
  errors = errors.map(error => error instanceof Error ? error : new Error(String(error)))
  if (errors.length === 1) return errors[0]
  const status = aggregate(errors.map(error => ({ status: contributionStatus(error) })))
  const strongest = errors.find(error => contributionStatus(error) === status)
  const result = new AggregateError(errors, errors.map(error => error.message).join('; '), { cause: strongest })
  result.name = strongest.name
  return result
}
export function contributionFailures (error) {
  return error ? [{ status: contributionStatus(error), name: error.name, message: error.message }, ...(error.errors || []).flatMap(contributionFailures)] : []
}
export async function loadContribution (ctx, family) {
  if (!ACCESSIBILITY_FAMILIES.includes(family)) throw new Blocked(`Invalid named accessibility contribution: ${family}`)
  const path = `test/boundary/accessibility/contributions/${family}.mjs`
  let source
  try { source = await input(ctx, { root: 'webui', path }) } catch { throw new Blocked(`Required named UI-112 contributor is missing: ${family}`) }
  const errors = []
  let value, inputs
  try {
    const module = await import(`${pathToFileURL(join(ctx.root, path)).href}?sha256=${source.sha256}`)
    value = validateContribution(module.default, family)
    inputs = await captureContributionInputs(ctx, [{ root: 'webui', path }, ...value.fixtures])
  } catch (error) { errors.push(error) }
  // Import/validation failure must not skip the source check or hide a stronger
  // import Error behind a concurrent source-change blocker.
  try { await assertContributionInputs(ctx, [source]) } catch (error) { errors.push(error) }
  const failure = strongestContributionError(errors)
  if (failure) throw failure
  return { value, inputs }
}
export async function loadContributions (ctx) {
  const loaded = []
  for (const family of ACCESSIBILITY_FAMILIES) loaded.push(await loadContribution(ctx, family))
  return loaded
}
export async function runContribution (ctx, contribution, slot) {
  const { value, inputs } = contribution
  let assertions = 0
  const artifacts = []
  async function saved (path) { artifacts.push({ path, sha256: sha256(await readFile(path)) }); return path }
  const child = {
    ...ctx,
    family: value.family,
    assert (condition, description, details) { ctx.assert(condition, `[${value.family}] ${description}`, details); assertions++ },
    record: async (name, data) => saved(await ctx.record(`${value.family}-${name}`, data)),
    screenshot: async (page, name) => saved(await ctx.screenshot(page, `${value.family}-${name}`))
  }
  await assertContributionInputs(ctx, inputs)
  const errors = []
  try {
    await value.slots[slot](child)
    if (!assertions || !artifacts.length || !artifacts.some(file => file.path.endsWith('.png'))) throw new Blocked(`Empty or browser-unexercised UI-112 contributor: ${value.family}/${slot}`)
  } catch (error) { errors.push(error) }
  try { await assertContributionInputs(ctx, inputs) } catch (error) { errors.push(error) }
  const failure = strongestContributionError(errors)
  if (failure) {
    failure.contributionEvidence = { inputs, assertions, artifacts }
    throw failure
  }
  await ctx.record(`accessibility-${value.family}-${slot}-binding`, { schemaVersion: 1, kind: 'ui112-contribution', family: value.family, slot, inputs, assertions, artifacts })
}
