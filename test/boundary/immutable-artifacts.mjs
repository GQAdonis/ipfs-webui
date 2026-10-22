import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { safeRelativePath, sha256 } from '../../scripts/local-artifact.mjs'

/** One writer per slot. Reserve a fresh directory atomically for EVERY write,
 * including byte-identical repeats, before any asynchronous output is retained.
 * Keep the semantic basename intact for existing evidence readers. */
export function createImmutableArtifactWriter ({ directory, artifacts }) {
  let sequence = 0
  return async (name, extension, bytes) => {
    if (typeof name !== 'string' || !['json', 'png', 'zip'].includes(extension)) throw new Error('Invalid evidence artifact identity')
    const label = safeRelativePath(name.replace(/[^a-zA-Z0-9_.-]/g, '_'))
    const retained = Buffer.from(bytes)
    const records = join(directory, 'records')
    await mkdir(records, { recursive: true })
    let reserved
    let ordinal
    while (!reserved) {
      ordinal = ++sequence
      const candidate = join(records, String(ordinal).padStart(6, '0'))
      try { await mkdir(candidate); reserved = candidate } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
    }
    const path = join(reserved, `${label}.${extension}`)
    // Exclusive file creation also fails closed if anything appeared after the
    // directory reservation. Never replace bytes already claimed by a receipt.
    await writeFile(path, retained, { flag: 'wx' })
    artifacts.push({ path, sha256: sha256(retained), name: label, sequence: ordinal })
    return path
  }
}
