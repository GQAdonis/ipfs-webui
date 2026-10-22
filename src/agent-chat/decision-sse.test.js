// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { readDecisionEvents } from './decision-sse.js'

const encoder = new TextEncoder()
const SNAPSHOT = { server_epoch: 'epoch_fixture_0123456789', revision: 'rev_fixture_1', reason: 'initial' }
const CHANGED = { id: 'cf_3pQm8vK2xR7tLw9a', state: 'succeeded', revision: 'rev_fixture_2' }
const snapshotFrame = data => frame('ipfs.decisions.snapshot_required', data ?? SNAPSHOT)
const changedFrame = data => frame('ipfs.decision.changed', data ?? CHANGED)
function frame (name, data, ending = '\n') { return `event: ${name}${ending}data: ${JSON.stringify(data)}${ending}${ending}` }
function stream (chunks) {
  return new ReadableStream({ start (controller) { for (const chunk of chunks) controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk); controller.close() } })
}
const bytesAt = (text, size) => {
  const bytes = encoder.encode(text); const chunks = []
  for (let at = 0; at < bytes.length; at += size) chunks.push(bytes.slice(at, at + size))
  return chunks
}
async function read (chunks, options = {}) {
  const onEvent = vi.fn(); const body = stream(chunks)
  await readDecisionEvents(body, { signal: new AbortController().signal, onEvent, ...options })
  expect(body.locked).toBe(false)
  return onEvent.mock.calls.map(([event]) => event)
}

describe('bounded canonical decision invalidation SSE', () => {
  it.each([1, 2, 7, 97])('handles %i-byte chunks, CRLF boundaries and split UTF-8 keepalives', async size => {
    const wire = ': keepalive 😀\r\n\r\n' + frame('ipfs.decisions.snapshot_required', SNAPSHOT, '\r\n') + frame('ipfs.decision.changed', CHANGED, '\r\n')
    expect(await read(bytesAt(wire, size))).toEqual([{ type: 'snapshot', data: SNAPSHOT }, { type: 'changed', data: CHANGED }])
  })

  it('supports LF and lone CR framing, comments and multiple data lines without changing opaque revisions', async () => {
    const wire = ': keepalive\n\n' + snapshotFrame() + 'event: ipfs.decision.changed\rdata: {\rdata: "id":"cf_3pQm8vK2xR7tLw9a",\rdata: "state":"unknown","revision":"z_before_1"}\r\r'
    expect(await read([wire])).toEqual([{ type: 'snapshot', data: SNAPSHOT }, { type: 'changed', data: { ...CHANGED, state: 'unknown', revision: 'z_before_1' } }])
  })

  it('retains only immutable canonical hints, including an overflow snapshot marker', async () => {
    const overflow = { ...SNAPSHOT, revision: 'rev_overflow_3', reason: 'overflow' }
    const events = await read([snapshotFrame(), changedFrame(), snapshotFrame(overflow)])
    expect(events.map(event => event.type)).toEqual(['snapshot', 'changed', 'snapshot'])
    expect(events[1]).toEqual({ type: 'changed', data: CHANGED })
    for (const event of events) {
      expect(Object.isFrozen(event)).toBe(true)
      expect(Object.isFrozen(event.data)).toBe(true)
      expect(event).not.toHaveProperty('execution')
      expect(event.data).not.toHaveProperty('receipt')
      expect(event.data).not.toHaveProperty('actions')
    }
  })

  it.each([
    ['changed before initial snapshot', changedFrame()],
    ['unknown event', frame('a2ui', { state: 'succeeded' })],
    ['missing event name', `data: ${JSON.stringify(SNAPSHOT)}\n\n`],
    ['malformed JSON', 'event: ipfs.decisions.snapshot_required\ndata: not-json\n\n'],
    ['invalid initial marker', snapshotFrame({ ...SNAPSHOT, reason: 'replay' })],
    ['missing snapshot epoch', snapshotFrame({ revision: 'rev_fixture_1', reason: 'initial' })]
  ])('rejects %s without admitting an event', async (_label, wire) => {
    const onEvent = vi.fn(); const body = stream([wire])
    await expect(readDecisionEvents(body, { signal: new AbortController().signal, onEvent })).rejects.toThrow()
    expect(onEvent).not.toHaveBeenCalled()
    expect(body.locked).toBe(false)
  })

  it.each([
    { ...CHANGED, execution: { state: 'succeeded' } }, { ...CHANGED, receipt: { outcome: 'succeeded' } },
    { ...CHANGED, actions: { approve: true } }, { ...CHANGED, token: 'synthetic_fixture_only' },
    { ...CHANGED, tool: 'pin_add' }, { ...CHANGED, state: 'committed' },
    { ...CHANGED, revision: '' }, { ...CHANGED, id: '../other-identity' }
  ])('rejects a noncanonical changed payload without turning it into an outcome: %j', data => {
    const onEvent = vi.fn(); const body = stream([snapshotFrame() + changedFrame(data)])
    return expect(readDecisionEvents(body, { signal: new AbortController().signal, onEvent })).rejects.toThrow()
      .then(() => {
        expect(onEvent.mock.calls.map(([event]) => event)).toEqual([{ type: 'snapshot', data: SNAPSHOT }])
        expect(body.locked).toBe(false)
      })
  })

  it.each(['id: durable_replay_1\n', 'id:\n'])('rejects replay state %j', prefix => {
    return expect(read([prefix + snapshotFrame()])).rejects.toThrow('unexpected_replay_id')
  })

  it.each(['', ': only a keepalive\n\n', snapshotFrame().slice(0, -1), snapshotFrame() + 'data: unfinished'])('rejects an empty or incomplete final frame', wire => {
    return expect(read([wire])).rejects.toThrow('incomplete_stream')
  })

  it('measures the full UTF-8 frame bound, including SSE field prefixes and separators', async () => {
    const base = snapshotFrame(); const padding = ' '.repeat(1024 - encoder.encode(base).length)
    const atLimit = base.replace('data: ', `data: ${padding}`)
    expect(encoder.encode(atLimit).length).toBe(1024)
    expect(await read([atLimit])).toEqual([{ type: 'snapshot', data: SNAPSHOT }])
    const overLimit = atLimit.replace('data: ', 'data:  ')
    expect(encoder.encode(overLimit).length).toBe(1025)
    await expect(read([overLimit])).rejects.toThrow('event_limit')
  })

  it('rejects overlong lines, excessive chunks and malformed UTF-8 with no partial changed hint', async () => {
    await expect(read(['data: ' + 'x'.repeat(2049)])).rejects.toThrow('line_limit')
    await expect(read([new Uint8Array(1048577)])).rejects.toThrow('chunk_limit')
    const onEvent = vi.fn()
    await expect(readDecisionEvents(stream([snapshotFrame(), new Uint8Array([0xff])]), { signal: new AbortController().signal, onEvent })).rejects.toThrow()
    expect(onEvent.mock.calls.map(([event]) => event)).toEqual([{ type: 'snapshot', data: SNAPSHOT }])
  })

  it('checks callback-triggered abort before another frame from the same chunk can be delivered', async () => {
    const owner = new AbortController(); const received = []; const body = stream([snapshotFrame() + changedFrame()])
    await expect(readDecisionEvents(body, { signal: owner.signal, onEvent (event) { received.push(event); owner.abort() } })).rejects.toMatchObject({ name: 'AbortError' })
    expect(received).toEqual([{ type: 'snapshot', data: SNAPSHOT }])
    expect(body.locked).toBe(false)
  })

  it('cancels a pending body read and releases the reader when its owner aborts', async () => {
    const owner = new AbortController(); const cancel = vi.fn(); const onEvent = vi.fn()
    const body = new ReadableStream({ cancel })
    const reading = readDecisionEvents(body, { signal: owner.signal, onEvent })
    const rejected = expect(reading).rejects.toMatchObject({ name: 'AbortError' })
    owner.abort(); await rejected
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(onEvent).not.toHaveBeenCalled()
    expect(body.locked).toBe(false)
  })
})
