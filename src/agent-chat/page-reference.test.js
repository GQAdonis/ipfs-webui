// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createChatController } from '@gqadonis/ipfs-agent-chat/react'
import { createPageReferenceAdapter, pageReferenceFromRoute, PAGE_REFERENCE_ID } from './page-reference.js'

const CID = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
const controllers = []
afterEach(() => controllers.splice(0).forEach(controller => controller.dispose()))
function owner () {
  const inputs = []
  let n = 0
  const controller = createChatController({
    connection: {
      generation: 'owner_fixture',
      client: {
        async * run (input) {
          inputs.push(input)
          yield { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId }
          yield { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId, outcome: { type: 'success' } }
        }
      }
    },
    ids: { thread: () => 'thread_fixture', run: () => `run_${++n}`, message: () => `message_${++n}` }
  })
  controllers.push(controller)
  return { controller, inputs, adapter: createPageReferenceAdapter({ controller }) }
}

describe('optional visible page reference authoring', () => {
  it.each([
    ['/files', { route: '/files', path: '/', path_kind: 'mfs' }],
    ['/files/caf%C3%A9', { route: '/files/café', path: '/café', path_kind: 'mfs' }],
    [`/files/ipfs/${CID}`, { route: `/files/ipfs/${CID}`, path: `/ipfs/${CID}`, path_kind: 'ipfs' }],
    ['/explore/ipns/docs.ipfs.tech', { route: '/explore/ipns/docs.ipfs.tech', path: '/ipns/docs.ipfs.tech', path_kind: 'ipfs' }],
    ['/pins', { route: '/pins' }],
    ['', { route: '/' }]
  ])('authors route %s as bounded untrusted data', (route, expected) => {
    const result = pageReferenceFromRoute(route)
    expect(result.ok).toBe(true)
    expect(result.references).toEqual([{ id: PAGE_REFERENCE_ID, provenance: 'page', ...expected }])
  })

  it.each(['/files/%2fprivate', '/files/%252fprivate', '/files/%2e%2e/private', '/files?token=fixture-private', '//user@host/path', 'file:///private'])('refuses ambiguous page route %s with no data lookup', route => {
    const result = pageReferenceFromRoute(route)
    expect(result.ok).toBe(false)
    expect(result.message).not.toContain('fixture-private')
  })

  it('constructs without work and preserves removed-page suppression across repeated updates and two sends', async () => {
    const h = owner(); const update = vi.spyOn(h.controller, 'setReferences')
    expect(h.inputs).toEqual([]); expect(update).not.toHaveBeenCalled()
    h.adapter.update({ route: '/files/notes', enabled: true })
    h.controller.removeReference(PAGE_REFERENCE_ID)
    for (let turn = 0; turn < 2; turn++) {
      h.adapter.update({ route: '/files/notes', enabled: true })
      h.controller.setDraft(`Ordinary turn ${turn}`)
      await h.controller.submit()
    }
    expect(h.inputs.every(input => input.forwardedProps?.ipfs.context === undefined)).toBe(true)
    h.adapter.update({ route: '/pins', enabled: true })
    expect(h.controller.getSnapshot().references).toEqual([{ id: PAGE_REFERENCE_ID, provenance: 'page', route: '/pins' }])
  })

  it('does not restore sent chips on same-route layout/mode/policy updates and preserves user selections on actual route changes', async () => {
    const h = owner()
    h.adapter.update({ route: '/files', enabled: true })
    h.controller.setDraft('Inspect current page'); await h.controller.submit()
    expect(h.inputs[0].forwardedProps.ipfs.context[0].id).toBe(PAGE_REFERENCE_ID)
    h.adapter.update({ route: '/files', enabled: true })
    expect(h.controller.getSnapshot().references).toEqual([])
    h.controller.setReferences([{ id: 'selected_cid', provenance: 'user', cid: CID }])
    h.adapter.update({ route: '/files/next', enabled: true })
    expect(h.controller.getSnapshot().references.map(ref => ref.id)).toEqual(['selected_cid', PAGE_REFERENCE_ID])
    h.adapter.update({ route: '/files/next', enabled: false })
    expect(h.controller.getSnapshot().references).toEqual([])
    h.adapter.update({ route: '/files/next', enabled: true })
    expect(h.controller.getSnapshot().references).toEqual([])
    h.adapter.update({ route: '/files/other', enabled: true })
    expect(h.controller.getSnapshot().references[0].path).toBe('/other')
  })

  it('never substitutes the previous page after invalid route input or an auth-generation reset', () => {
    const h = owner()
    h.adapter.update({ route: '/files', enabled: true })
    h.adapter.update({ route: '/files/%252fprivate', enabled: true })
    expect(h.controller.getSnapshot().references).toEqual([])
    h.adapter.update({ route: '/files', enabled: true })
    h.controller.updateConnection({ generation: 'new_owner_fixture', client: null })
    h.adapter.update({ route: '/files', enabled: true })
    expect(h.controller.getSnapshot().references).toEqual([])
  })
})
