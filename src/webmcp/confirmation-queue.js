// The page's side of the package's confirmation hook. An agent's write call arrives as a
// request; the person answers in the dialog; the promise resolves true only for an
// explicit approval. Everything else resolves false: deny, Escape, an unanswered request
// that expires, a call the host cancelled, "deny all", and switching WebMCP off. Requests
// are shown one at a time, oldest first.
//
// At most MAX_PENDING requests wait. A further one is refused at once, so an agent cannot
// bury the person in prompts. A request from a host that gave no AbortSignal (Kimi) expires
// sooner, because the host cannot cancel it.

import { getOriginPolicy } from '../agent-chat/origin-policy.js'
import { getSettings } from './settings-store.js'

export const MAX_PENDING = 3
export const EXPIRY_WITH_SIGNAL_MS = 120_000
export const EXPIRY_WITHOUT_SIGNAL_MS = 30_000

/**
 * @typedef {import('./vendor/index.js').ConfirmationRequest} ConfirmationRequest
 * @typedef {'approved' | 'denied' | 'expired' | 'cancelled'} Outcome
 * @typedef {{ id: number, request: ConfirmationRequest, expiresInMs: number, hasSignal: boolean }} Pending
 * @typedef {{ id: number, tool: string, outcome: Outcome }} Decision
 * @typedef {Pending & { resolve: (approved: boolean) => void, cleanup: () => void }} Entry
 */

/** @type {Entry[]} */
let queue = []
/** @type {Decision | null} */
let lastDecision = null
let nextId = 1
let expiryWith = EXPIRY_WITH_SIGNAL_MS
let expiryWithout = EXPIRY_WITHOUT_SIGNAL_MS
/** @type {Set<() => void>} */
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn())

/** @param {number} id @param {Outcome} outcome */
function settle (id, outcome) {
  const entry = queue.find((q) => q.id === id)
  if (!entry) return
  entry.cleanup()
  queue = queue.filter((q) => q.id !== id)
  lastDecision = { id, tool: entry.request.tool, outcome }
  entry.resolve(outcome === 'approved')
  emit()
}

/**
 * The confirmation hook handed to createWebMcpTools.
 *
 * @param {ConfirmationRequest} request
 * @param {{ signal?: AbortSignal }} [context]
 * @returns {Promise<boolean | 'queue_full' | 'writes_off'>}
 */
export function requestConfirmation (request, context = {}) {
  const { signal } = context
  if (signal?.aborted) return Promise.resolve(false)
  // Writes switched off: nothing may ask, whatever the host still believes is registered.
  if (!getSettings().writes || !getOriginPolicy().allowsAgent()) return Promise.resolve('writes_off')
  if (queue.length >= MAX_PENDING) return Promise.resolve('queue_full')
  return new Promise((resolve) => {
    const id = nextId++
    const expiresInMs = signal ? expiryWith : expiryWithout
    const timer = setTimeout(() => settle(id, 'expired'), expiresInMs)
    const onAbort = () => settle(id, 'cancelled')
    signal?.addEventListener('abort', onAbort, { once: true })
    const cleanup = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }
    queue = [...queue, { id, request, expiresInMs, hasSignal: signal !== undefined, resolve, cleanup }]
    emit()
  })
}

/** @param {number} id @param {boolean} approved */
export function decide (id, approved) {
  if (approved && !getOriginPolicy().allowsAgent()) { denyAll(); return }
  settle(id, approved ? 'approved' : 'denied')
}

/**
 * Deny every waiting request. `denied` is the person's choice ("Deny all"); `cancelled` is
 * the page's (the feature was switched off).
 *
 * @param {'denied' | 'cancelled'} [outcome]
 */
export function denyAll (outcome = 'cancelled') {
  for (const { id } of [...queue]) settle(id, outcome)
}

/** @returns {Pending[]} */
export function getPending () {
  return queue.map(({ id, request, expiresInMs, hasSignal }) => ({ id, request, expiresInMs, hasSignal }))
}

/** @returns {Decision | null} */
export function getLastDecision () {
  return lastDecision
}

/** @param {() => void} fn */
export function subscribe (fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Test seam. @param {{ withSignal?: number, withoutSignal?: number }} [options] */
export function resetForTests ({ withSignal = EXPIRY_WITH_SIGNAL_MS, withoutSignal = EXPIRY_WITHOUT_SIGNAL_MS } = {}) {
  denyAll()
  queue = []
  lastDecision = null
  expiryWith = withSignal
  expiryWithout = withoutSignal
  emit()
}
