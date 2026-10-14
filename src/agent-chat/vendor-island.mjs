// Vendors the built agent chat island into public/agent-chat/ and records a manifest.
//
//   node src/agent-chat/vendor-island.mjs <path to mcp/chat/dist>   copy and write MANIFEST.json
//   node src/agent-chat/vendor-island.mjs --check                   verify the vendored files against MANIFEST.json
//
// Only the entry and its chunks are copied: no source maps, no type declarations.
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/agent-chat')
const manifestPath = join(target, 'MANIFEST.json')
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex')

function listFiles (dir) {
  const out = ['ipfs-agent-chat.js']
  for (const name of readdirSync(join(dir, 'chunks')).sort()) {
    if (name.endsWith('.js')) out.push(`chunks/${name}`)
  }
  return out
}

if (process.argv[2] === '--check') {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bad = Object.entries(manifest.files).filter(([name, hash]) => sha256(join(target, name)) !== hash)
  if (bad.length > 0) {
    console.error(`vendored island differs from MANIFEST.json: ${bad.map(([n]) => n).join(', ')}`)
    process.exit(1)
  }
  console.log(`ok: ${Object.keys(manifest.files).length} files match MANIFEST.json`)
} else {
  const source = process.argv[2]
  if (!source) {
    console.error('usage: node src/agent-chat/vendor-island.mjs <path to mcp/chat/dist> | --check')
    process.exit(2)
  }
  const dist = resolve(source)
  const files = listFiles(dist)
  rmSync(target, { recursive: true, force: true })
  mkdirSync(join(target, 'chunks'), { recursive: true })
  const hashes = {}
  for (const name of files) {
    copyFileSync(join(dist, name), join(target, name))
    hashes[name] = sha256(join(target, name))
  }
  writeFileSync(manifestPath, JSON.stringify({
    package: '@gqadonis/ipfs-agent-chat',
    entry: 'ipfs-agent-chat.js',
    note: 'Built from mcp/chat in the kubo repository. Regenerate with src/agent-chat/vendor-island.mjs.',
    files: hashes
  }, null, 2) + '\n')
  console.log(`vendored ${files.length} files into public/agent-chat`)
}
