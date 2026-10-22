import { lstat, readFile, realpath } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { adoptedContractSha256, adoptedIdentity } from './requirements.mjs'
/** Link actual outer command evidence; never import a packet or reviewer PASS as phase authority. */
export async function linkFrontendPacket (path, { webui, kubo, desktop }) {
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 64 * 1024 * 1024) throw new Error('Outer packet is not a bounded current regular file')
  const bytes = await readFile(path), packet = JSON.parse(bytes)
  if (packet.kind !== 'frontend-final-packet' || packet.phaseAcceptance !== false || packet.contract?.fileSha256 !== adoptedContractSha256 || !isDeepStrictEqual(packet.contract.identity, adoptedIdentity)) throw new Error('Outer packet is a generic or different-identity claim')
  const roots = { webui, kubo, desktop, contract: kubo, ...Object.fromEntries(['ui', 'chat', 'app', 'webmcp'].map(name => [name, join(kubo, 'mcp', name)])) }
  if (!packet.sourceAfter?.files || !Object.keys(packet.sourceAfter.files).length) throw new Error('Outer packet omits actual final source hashes')
  for (const [key, hash] of Object.entries(packet.sourceAfter.files)) {
    const slash = key.indexOf('/'), name = key.slice(0, slash), file = key.slice(slash + 1)
    if (!roots[name] || !file || file.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Outer packet source escapes an owned source root')
    if (sha256(await readFile(join(roots[name], file))) !== hash) throw new Error(`Outer packet source is stale: ${key}`)
  }
  const base = await realpath(dirname(path))
  for (const command of packet.commands || []) {
    if (!command.attempted) continue
    const receipt = command.receipt
    if ((!receipt?.pid && !receipt?.spawnError) || !receipt.argv?.length || !receipt.cwd || !receipt.endedAt) throw new Error('Outer command has no actual PID/argv/exit/log receipt')
    for (const kind of ['stdout', 'stderr']) {
      const file = resolve(dirname(path), receipt[`${kind}File`]), rel = relative(base, await realpath(file))
      if (rel.startsWith('..') || isAbsolute(rel) || (await lstat(file)).isSymbolicLink() || sha256(await readFile(file)) !== receipt[`${kind}Sha256`]) throw new Error('Outer command log bytes are missing, escaped or stale')
    }
  }
  return { path, sha256: sha256(bytes), kind: packet.kind, runId: packet.runId, status: packet.status, phaseAcceptance: false,
    completePlannedPacket: packet.completePlannedPacket, sourceAfterSha256: packet.sourceAfter.sha256,
    commands: (packet.commands || []).map(({ id, attempted, status, preparation }) => ({ id, attempted, status, preparation })),
    laneReceipts: packet.laneReceipts, interpretation: 'Current byte/source/command linkage only; independent review and every live oracle remain separate.' }
}
