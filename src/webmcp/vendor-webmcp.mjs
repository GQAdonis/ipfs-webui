// Vendors the built mcp/webmcp package into src/webmcp/vendor/ and records a manifest.
//
//   node src/webmcp/vendor-webmcp.mjs <path to mcp/webmcp/dist>   copy and write MANIFEST.json
//   node src/webmcp/vendor-webmcp.mjs --check                      verify the vendored files against MANIFEST.json
//
// The compiled .js files and their .d.ts files are copied (no maps). The package is
// framework-free ES modules, so the Web UI bundles them with the rest of its code; they
// import only `multiformats/cid`, which the Web UI already depends on. The .d.ts files let
// the typecheck read the API without checking the generated .js. Regenerate the tool list
// in the kubo repository first (`pnpm gen`, then `pnpm build`).
//
// MANIFEST.json records provenance: the kubo commit the package was built from (or
// "uncommitted" when mcp/webmcp had uncommitted changes), the contract version, and the hash
// of generated/tools.js. --check verifies the file hashes and that the provenance still
// matches the vendored generated/tools.js.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const target = resolve(dirname(fileURLToPath(import.meta.url)), 'vendor')
const manifestPath = join(target, 'MANIFEST.json')
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex')

function listFiles (dir, base = dir) {
  const out = []
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base))
    else if (name.endsWith('.js') || name.endsWith('.d.ts')) out.push(relative(base, full).split('\\').join('/'))
  }
  return out
}

const GENERATED = 'generated/tools.js'

function contractVersionOf (file) {
  const m = /CONTRACT_VERSION = "([^"]+)"/.exec(readFileSync(file, 'utf8'))
  if (!m) throw new Error(`no CONTRACT_VERSION in ${file}`)
  return m[1]
}

/** The commit mcp/webmcp was built from, or "uncommitted" when its tree differs from that commit. */
function kuboCommit (pkgDir) {
  const git = (...args) => execFileSync('git', ['-C', pkgDir, ...args], { encoding: 'utf8' }).trim()
  try {
    const dirty = git('status', '--porcelain', '--', '.') !== ''
    return dirty ? 'uncommitted' : git('rev-parse', 'HEAD')
  } catch (_) {
    return 'uncommitted'
  }
}

if (process.argv[2] === '--check') {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bad = Object.entries(manifest.files).filter(([name, hash]) => {
    try { return sha256(join(target, name)) !== hash } catch (_) { return true }
  })
  const present = listFiles(target)
  const extra = present.filter((name) => !(name in manifest.files))
  const problems = [...bad.map(([n]) => n), ...extra]
  if (bad.length === 0) {
    const generatedHash = sha256(join(target, GENERATED))
    if (manifest.generatedToolsSha256 !== generatedHash) problems.push('generatedToolsSha256')
    if (manifest.contractVersion !== contractVersionOf(join(target, GENERATED))) problems.push('contractVersion')
  }
  if (typeof manifest.kuboCommit !== 'string' || manifest.kuboCommit === '') problems.push('kuboCommit')
  if (problems.length > 0) {
    console.error(`vendored webmcp differs from MANIFEST.json: ${problems.join(', ')}`)
    process.exit(1)
  }
  console.log(`ok: ${Object.keys(manifest.files).length} files match MANIFEST.json (kubo ${manifest.kuboCommit}, contract ${manifest.contractVersion})`)
} else {
  const source = process.argv[2]
  if (!source) {
    console.error('usage: node src/webmcp/vendor-webmcp.mjs <path to mcp/webmcp/dist> | --check')
    process.exit(2)
  }
  const dist = resolve(source)
  const pkg = JSON.parse(readFileSync(join(dist, '..', 'package.json'), 'utf8'))
  const files = listFiles(dist)
  rmSync(target, { recursive: true, force: true })
  const hashes = {}
  for (const name of files) {
    mkdirSync(dirname(join(target, name)), { recursive: true })
    copyFileSync(join(dist, name), join(target, name))
    hashes[name] = sha256(join(target, name))
  }
  writeFileSync(manifestPath, JSON.stringify({
    package: pkg.name,
    version: pkg.version,
    entry: 'index.js',
    kuboCommit: kuboCommit(join(dist, '..')),
    contractVersion: contractVersionOf(join(dist, GENERATED)),
    generatedToolsSha256: hashes[GENERATED],
    note: 'Built from mcp/webmcp in the kubo repository. Regenerate with src/webmcp/vendor-webmcp.mjs.',
    files: hashes
  }, null, 2) + '\n')
  console.log(`vendored ${files.length} files into src/webmcp/vendor`)
}
