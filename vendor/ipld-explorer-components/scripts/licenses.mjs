import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// Include the complete locked build-input notice inventory. It is a superset
// of the bundled protocol modules, so tree shaking cannot silently drop a
// dependency's license when a later compatibility patch uses another export.
export async function copyDependencyNotices (directory) {
  const lock = JSON.parse(await readFile(join(directory, 'package-lock.json'), 'utf8'))
  const notices = []
  const output = join(directory, 'dist/licenses')
  await mkdir(output, { recursive: true })
  for (const [path, metadata] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    if (!path.includes('node_modules/')) continue
    const name = path.split('node_modules/').at(-1)
    const packageRoot = join(directory, path)
    const entries = await readdir(packageRoot, { withFileTypes: true })
    const files = entries.filter(entry => entry.isFile() && /^(licen[cs]e|notice|copying)(?:[.-]|$)/i.test(entry.name)).map(entry => entry.name).sort()
    const destination = `${name.replaceAll('/', '__')}@${metadata.version}`
    await mkdir(join(output, destination), { recursive: true })
    for (const file of files) await copyFile(join(packageRoot, file), join(output, destination, file))
    notices.push({ name, version: metadata.version, integrity: metadata.integrity, license: metadata.license, noticeFiles: files.map(file => `licenses/${destination}/${file}`) })
  }
  for (const file of ['LICENSE', 'LICENSE-MIT', 'LICENSE-APACHE']) await copyFile(join(directory, file), join(output, file))
  await writeFile(join(output, 'dependencies.json'), JSON.stringify({ description: 'Complete locked build-input notice inventory, including external host adapters.', packages: notices }, null, 2) + '\n')
}
