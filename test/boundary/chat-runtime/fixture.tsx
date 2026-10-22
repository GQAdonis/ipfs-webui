// Supplemental browser fixture of the PRODUCED public React entry. It is not a backend oracle.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AgentChat, ChatComposer, CHAT_STYLE_TEXT, createChatController, registerBundledFonts, RunInspector } from '@gqadonis/ipfs-agent-chat/react'
import negotiated from '../../../../kubo/mcp/contract/fixtures/agui/read-pin-ls-negotiated.json'
import contextRun from '../../../../kubo/mcp/contract/fixtures/agui/read-pin-ls-context-facts.json'
import { OUTPUTS } from '../../../../kubo/mcp/ui/tests/fixtures/outputs'

type Mode = 'text' | 'context' | 'a2ui' | 'a2ui-invalid' | 'inspector';
const shadow = document.getElementById('chat-host')!.attachShadow({ mode: 'open' })
const mount = document.createElement('div'); shadow.append(mount)
const requests: unknown[] = []; const calls = { navigation: 0, search: 0 }
let mode: Mode = 'text'; let sequence = 0; let generation = 0
let held = false; let release: (() => void) | undefined
let present: (next: { theme: 'light' | 'dark'; split: boolean; inspector: boolean }) => void
function client () {
  return {
    async * run (input: Record<string, any>, signal?: AbortSignal) {
      requests.push(structuredClone(input))
      if (mode === 'text') {
        yield { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId }
        if (held) await new Promise<void>(resolve => { release = resolve })
        // Deliberately uncooperative tail tests the controller's own signal/generation fence.
        yield { type: 'TEXT_MESSAGE_START', messageId: `assistant_${sequence++}`, role: 'assistant' }
        yield { type: 'TEXT_MESSAGE_CONTENT', messageId: `assistant_${sequence - 1}`, delta: 'Authoritative controller reply' }
        yield { type: 'TEXT_MESSAGE_END', messageId: `assistant_${sequence - 1}` }
        yield { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId, outcome: { type: 'success' } }
        return
      }
      const source = mode === 'a2ui' || mode === 'a2ui-invalid' ? negotiated : contextRun
      for (const raw of source.events) {
        const event: Record<string, any> = structuredClone(raw)
        if (event.threadId !== undefined) event.threadId = input.threadId
        if (event.runId !== undefined) event.runId = input.runId
        if (event.type === 'CUSTOM' && event.name === 'ipfs.run.facts') { event.value.thread_id = input.threadId; event.value.run_id = input.runId }
        if (mode === 'a2ui-invalid' && event.type === 'CUSTOM' && event.name === 'a2ui') event.value = { toolCallId: 'tc-1', messages: [{ version: 'v0.9', updateComponents: { surfaceId: 'attack', components: [{ id: 'attack', component: { UnknownExecutable: { href: 'https://boundary.invalid/inert', html: '<img src=x onerror=alert(1)>' } } }] } }] }
        yield event
      }
      if (mode === 'inspector') {
      // A new actual accepted run is used for the >200 history presentation probe.
      // The separate inspector fixture below renders only this safe typed projection.
      }
      void signal
    }
  }
}
const controller = createChatController({ connection: { generation: 'fixture_0', client: client() as never }, ids: { thread: () => `thread_${sequence++}`, run: () => `run_${sequence++}`, message: () => `message_${sequence++}` }, onGo: () => { calls.navigation++; return { accepted: true } }, onSearch: () => { calls.search++; return { accepted: true } } })
function Fixture () {
  const [view, setView] = useState({ theme: 'dark' as 'light' | 'dark', split: false, inspector: false }); present = setView
  return <>
    <style>{CHAT_STYLE_TEXT}{':host{display:block;min-height:100vh}.ac-sidebar{position:relative!important;width:100%!important;height:100%!important;min-height:600px;transform:none!important;inset:auto!important}*{box-sizing:border-box}'}</style>
    <div data-ipfs-ui="" data-theme={view.theme} className="iu-root iu-ground ac-root" style={{ display: 'block', minHeight: '100vh' }}>
    <div data-runtime-shell style={{ display: 'grid', gap: 16, gridTemplateColumns: view.split ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)' }}>
      <div><AgentChat controller={controller} open theme={view.theme} onOpenChange={() => {}} showComposer={!view.split} /></div>
      {view.split ? <section aria-label="Moved composer"><ChatComposer controller={controller} /></section> : null}
    </div>
    {view.inspector ? <RunInspector label="Supplemental bounded event inspector" snapshot={{ revision: 99, phase: 'unknown', events: Array.from({ length: 1000 }, (_, index) => ({ type: 'tool_call', tool: 'pin_ls', label: `Safe bounded event ${index}` })), dropped: 17, bytes: 100000 }} /> : null}
    </div>
  </>
}
async function start () {
  const fonts = await registerBundledFonts(); await document.fonts.ready
  createRoot(mount).render(<Fixture />)
  Object.assign(window, {
    __chatRuntime: Object.freeze({
      kind: 'supplemental-produced-entry-fixture',
      configure (next: Mode, theme: 'light' | 'dark' = 'dark') { mode = next; held = false; release?.(); release = undefined; controller.updateConnection({ generation: `fixture_${++generation}`, client: client() as never }); present({ theme, split: false, inspector: next === 'inspector' }) },
      layout (split: boolean, theme: 'light' | 'dark' = 'dark') { present({ theme, split, inspector: false }) },
      hold () { held = true },
      release () { held = false; release?.(); release = undefined },
      retire () { controller.updateConnection({ generation: `fixture_${++generation}`, client: client() as never }) },
      context (enabled: boolean) { controller.setContextReferencesEnabled(enabled) },
      facts (enabled: boolean) { controller.setRunFactsEnabled(enabled) },
      a2ui (enabled: boolean) { controller.setA2uiEnabled(enabled) },
      output (tool: keyof typeof OUTPUTS) { return structuredClone(OUTPUTS[tool][0]) },
      select () { controller.setReferences([{ id: 'page_current', provenance: 'page', route: '/files', path: '/notes', path_kind: 'mfs' }]) },
      state () { const state = controller.getSnapshot(); return { kind: 'supplemental-produced-entry-fixture', fonts, requests: structuredClone(requests), calls: { ...calls }, generation: state.generation, lifetime: state.lifetime, draft: state.draft, references: state.references, running: state.running, messages: state.chat.messages.map(message => ({ id: message.id, role: message.role, content: message.content })), inspector: state.runInspector, surfaces: Object.fromEntries(Object.entries(state.surfaceDeliveries).map(([id, value]) => [id, { status: value.status }])) } }
    })
  })
  document.documentElement.dataset.chatRuntimeReady = 'true'
}
void start()
