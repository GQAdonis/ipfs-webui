import type { Helia } from '@helia/interface'
import type { CID } from 'multiformats/cid'

// Codec/traversal parity needs only a blockstore. Never start a router or broker
// from the upstream unit fixture, and never touch the operator's node.
export async function createHeliaMock (): Promise<Helia> {
  const blocks = new Map<string, Uint8Array>()
  return {
    blockstore: {
      async put (cid: CID, bytes: Uint8Array) { blocks.set(cid.toString(), bytes); return cid },
      async get (cid: CID) {
        const bytes = blocks.get(cid.toString())
        if (!bytes) throw new Error('Fixture block is missing')
        return bytes
      }
    }
  } as unknown as Helia
}
