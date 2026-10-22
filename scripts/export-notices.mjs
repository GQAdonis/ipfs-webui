import { copyFile, lstat, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { sha256 } from './local-artifact.mjs'

// A conservative notice superset covers installed compiler/runtime packages.
// Only license/NOTICE text is copied, never package binaries or credentials.
export async function copyExportNotices (root, kubo, directory) {
  const roots = new Set()
  const copied = new Map()
  const notices = []
  async function add (packageRoot) {
    let physical
    try { physical = await realpath(packageRoot) } catch (error) { if (error.code === 'ENOENT') return; throw error }
    if (roots.has(physical)) return
    roots.add(physical)
    let bytes
    try { bytes = await readFile(join(physical, 'package.json')) } catch (error) { if (error.code === 'ENOENT') return; throw error }
    const pkg = JSON.parse(bytes)
    if (!pkg.name || !pkg.version) return
    const names = (await readdir(physical, { withFileTypes: true })).filter(entry => entry.isFile() && /^(licen[cs]e|notice|copying)(?:[.-]|$)/i.test(entry.name)).map(entry => entry.name).sort()
    const identity = `${pkg.name.replaceAll('/', '__')}@${pkg.version}-${sha256(bytes).slice(0, 12)}`
    const files = []
    const noticeHashes = {}
    for (const name of names) {
      const path = `licenses/installed-packages/${identity}/${name}`
      noticeHashes[name] = sha256(await readFile(join(physical, name)))
      await mkdir(dirname(join(directory, path)), { recursive: true })
      await copyFile(join(physical, name), join(directory, path))
      files.push(path)
    }
    const fingerprint = JSON.stringify(noticeHashes)
    if (copied.has(identity)) {
      if (copied.get(identity) !== fingerprint) throw new Error(`Installed copies have conflicting notices: ${identity}`)
      return
    }
    copied.set(identity, fingerprint)
    notices.push({ name: pkg.name, version: pkg.version, license: pkg.license || pkg.licenses || null, packageJsonSha256: sha256(bytes), noticeFiles: files })
  }
  const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'))
  for (const path of Object.keys(lock.packages).filter(path => path.includes('node_modules/')).sort()) await add(join(root, path))
  for (const name of ['ui', 'chat', 'app', 'webmcp']) {
    const nodeModules = join(kubo, 'mcp', name, 'node_modules')
    const store = join(nodeModules, '.pnpm')
    for (const entry of (await readdir(store)).sort()) {
      if (entry.startsWith('.') || entry === 'node_modules' || !(await lstat(join(store, entry))).isDirectory()) continue
      const installed = join(store, entry, 'node_modules')
      for (const dependency of (await readdir(installed)).sort()) {
        if (dependency.startsWith('@')) {
          for (const scoped of (await readdir(join(installed, dependency))).sort()) await add(join(installed, dependency, scoped))
        } else await add(join(installed, dependency))
      }
    }
  }
  const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0
  const inventory = notices.sort((a, b) => compare(a.name, b.name) || compare(a.version, b.version) || compare(a.packageJsonSha256, b.packageJsonSha256))
  await mkdir(join(directory, 'licenses'), { recursive: true })
  await writeFile(join(directory, 'licenses/installed-packages.json'), JSON.stringify({ description: 'Conservative installed build/runtime notice inventory; not a claim that every package is bundled.', packages: inventory }, null, 2) + '\n')
  for (const [source, label] of [[root, 'webui'], [kubo, 'kubo-shared']]) {
    for (const name of ['LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE']) {
      try { await mkdir(join(directory, 'licenses', label), { recursive: true }); await copyFile(join(source, name), join(directory, 'licenses', label, name)) } catch (error) { if (error.code !== 'ENOENT') throw error }
    }
  }
  const fonts = join(kubo, 'mcp/ui/fonts')
  for (const entry of await readdir(fonts, { withFileTypes: true })) {
    if (!entry.isFile() || !/(license|notice|ofl|copying)/i.test(entry.name)) continue
    await mkdir(join(directory, 'licenses/shared-fonts'), { recursive: true })
    await copyFile(join(fonts, entry.name), join(directory, 'licenses/shared-fonts', entry.name))
  }
}
