import { DecisionChangedSchema, DecisionsSnapshotRequiredSchema } from '@gqadonis/ipfs-mcp-ui'

const encoder = new TextEncoder()
/** Strict bounded framing for the two canonical hint events. No replay ID, outcome or authority. */
export async function readDecisionEvents (body, { signal, onEvent }) {
  if (!body?.getReader) throw new Error('invalid_stream')
  const reader = body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let line = ''; let data = []; let name = ''; let first = true; let skipLF = false; let frameBytes = 0
  const abort = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', abort, { once: true })
  const dispatch = () => {
    signal.throwIfAborted()
    if (!data.length && !name) return
    const raw = data.join('\n')
    if (encoder.encode(raw).length > 1024) throw new Error('event_limit')
    let value
    try { value = JSON.parse(raw) } catch { throw new Error('invalid_event') }
    const schema = name === 'ipfs.decisions.snapshot_required' ? DecisionsSnapshotRequiredSchema : name === 'ipfs.decision.changed' ? DecisionChangedSchema : undefined
    const parsed = schema?.safeParse(value)
    if (!parsed?.success || (first && name !== 'ipfs.decisions.snapshot_required')) throw new Error('invalid_event')
    first = false
    onEvent(Object.freeze({ type: name === 'ipfs.decision.changed' ? 'changed' : 'snapshot', data: Object.freeze(parsed.data) }))
    data = []; name = ''
  }
  const flushLine = endingBytes => {
    frameBytes += encoder.encode(line).length + endingBytes
    if (frameBytes > 1024) throw new Error('event_limit')
    if (line === '') { dispatch(); frameBytes = 0; return }
    if (encoder.encode(line).length > 2048) throw new Error('line_limit')
    if (!line.startsWith(':')) {
      const colon = line.indexOf(':')
      const field = colon < 0 ? line : line.slice(0, colon)
      let value = colon < 0 ? '' : line.slice(colon + 1)
      if (value.startsWith(' ')) value = value.slice(1)
      if (field === 'event') name = value
      else if (field === 'data') {
        data.push(value)
        if (encoder.encode(data.join('\n')).length > 1024) throw new Error('event_limit')
      } else if (field === 'id') throw new Error('unexpected_replay_id')
    }
    line = ''
  }
  const consume = text => {
    for (const character of text) {
      signal.throwIfAborted()
      if (skipLF) { skipLF = false; if (character === '\n') continue }
      if (character === '\r' || character === '\n') {
        flushLine(character === '\r' ? 2 : 1)
        skipLF = character === '\r'
      } else {
        line += character
        if (line.length > 2048) throw new Error('line_limit')
      }
    }
  }
  try {
    signal.throwIfAborted()
    while (true) {
      const { done, value } = await reader.read()
      signal.throwIfAborted()
      if (done) break
      if (value.byteLength > 1048576) throw new Error('chunk_limit')
      consume(decoder.decode(value, { stream: true }))
    }
    consume(decoder.decode())
    // A partial final frame is not accepted as a complete observation hint.
    if (line || name || data.length || first) throw new Error('incomplete_stream')
  } finally {
    signal.removeEventListener('abort', abort)
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
