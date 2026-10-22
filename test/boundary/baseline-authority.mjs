import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { Blocked } from './processes.mjs'
export const baselineAuthorityPath = 'test/boundary/incumbent-source-authority.json'
export async function loadBaselineAuthority ({ root }) {
  const binding = JSON.parse(await readFile(join(root, 'test/boundary/baseline-authority.json'), 'utf8'))
  for (const entry of [binding.incumbent, binding.importedPreF2]) {
    if (entry.root !== 'webui' || entry.path.includes('..') || sha256(await readFile(join(root, entry.path))) !== entry.sha256) throw new Blocked('Immutable baseline authority bytes changed; current shell is not a substitute')
  }
  const bytes = await readFile(join(root, baselineAuthorityPath))
  return { baseline: JSON.parse(bytes), bytes, path: join(root, baselineAuthorityPath), binding }
}
