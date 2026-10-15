// A minimal server-sent events reader over a fetch body. EventSource cannot
// send an Authorization header, and the admin token must travel in a header,
// never in a URL, so the change stream is read with fetch.

/**
 * Calls `onData` with the data field of every event until the body ends or the
 * signal aborts. Comment lines (keepalives) are ignored.
 *
 * @param {{ getReader: () => { read: () => Promise<{ done: boolean, value?: Uint8Array }>, cancel: () => Promise<void> } }} body
 * @param {(data: string) => void} onData
 * @param {AbortSignal} [signal]
 */
export async function readSse (body, onData, signal) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  const abort = () => { reader.cancel().catch(() => {}) }
  signal?.addEventListener('abort', abort)
  let buffer = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let split = buffer.search(/\r?\n\r?\n/)
      while (split !== -1) {
        const block = buffer.slice(0, split)
        buffer = buffer.slice(split).replace(/^\r?\n\r?\n/, '')
        const data = block.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).replace(/^ /, '')).join('\n')
        if (data !== '') onData(data)
        split = buffer.search(/\r?\n\r?\n/)
      }
    }
  } finally {
    signal?.removeEventListener('abort', abort)
  }
}
