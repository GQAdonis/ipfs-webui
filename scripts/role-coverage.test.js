// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { copyFile, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkRoleCoverage, inspectSurfaceSource } from './role-coverage.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawTokens = [...new Set([...readFileSync(join(root, 'src/promethity/tokens.css'), 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]))]
const roles = [...new Set([...readFileSync(join(root, 'src/promethity/roles.css'), 'utf8').matchAll(/(--role-[\w-]+)\s*:/g)].map(match => match[1]))]
const inspect = (source, path = 'src/shell/Shell.tsx') => inspectSurfaceSource({ source, path, rawTokens, roles })
const owned = []
afterEach(async () => { for (const path of owned.splice(0)) await rm(path, { recursive: true, force: true }) })
async function fixture () {
  const path = await mkdtemp(join(tmpdir(), 'praxis-role-coverage-'))
  owned.push(path)
  await mkdir(join(path, 'src/promethity'), { recursive: true })
  for (const file of ['tokens.css', 'roles.css']) await copyFile(join(root, 'src/promethity', file), join(path, 'src/promethity', file))
  return path
}
async function surface (root, directory, files = { 'index.jsx': "import './surface.css'; export const Surface = () => <section>Actual surface</section>", 'surface.css': '.surface { color: var(--role-text); background: var(--role-canvas); }' }) {
  await mkdir(join(root, 'src', directory), { recursive: true })
  for (const [file, source] of Object.entries(files)) await writeFile(join(root, 'src', directory, file), source)
}

describe('production Praxis role coverage syntax', () => {
  it('accepts exact aliases, inherited/currentColor styling, routes, CIDs and selector/URL fragments', () => {
    const result = inspect(`const route = '#/activity'; const cid = 'bafyreiaabbccddeeff'; const anchor = '#abc';
      const text = 'var(--role-text)'; export const Shell = () => <a href={route} style={{ color: text, backgroundColor: 'var(--role-surface)' }}><svg fill="currentColor" />{cid}{anchor}</a>`)
    expect(result.diagnostics).toEqual([])
    expect(result.references).toEqual(['--role-surface', '--role-text'])
    expect(inspect('/* #fff var(--accent) */ #abc { color: var(--role-text); filter:url("#fff"); }', 'src/activity/activity.css').diagnostics).toEqual([])
  })
  it('accepts role references in nested CSS and supported static TSX/template/DOM styling', () => {
    expect(inspect('@media (min-width: 600px) { .activity { color:var(--role-text-subtle); } }', 'src/activity/activity.css').diagnostics).toEqual([])
    // eslint-disable-next-line no-template-curly-in-string -- This is source text for the role parser.
    expect(inspect('const css = `var(--role-${"text"})` as const; export const Shell = () => <div style={{color:css}}>Shell</div>').diagnostics).toEqual([])
    expect(inspect('const el = document.createElement("div"); el.style.cssText = "color:var(--role-text);"; el.style.setProperty("--local-state", "var(--role-ai)")').diagnostics).toEqual([])
  })
  it.each([
    ['short CSS hex', '.a { color:#f00; }', 'src/shell/shell.css', 'hex-color'],
    ['alpha CSS hex', '.a { background:#102030aa; }', 'src/activity/activity.css', 'hex-color'],
    ['CSS escape', String.raw`.a { color: #\66 00; }`, 'src/shell/shell.css', 'hex-color'],
    ['raw color token', '.a { color:var(--text-muted); }', 'src/shell/shell.css', 'raw-token'],
    ['raw spacing token', '.a { gap:var(--space-3); }', 'src/shell/shell.css', 'raw-token'],
    ['raw font token', '.a { font-family:var(--font-body); }', 'src/shell/shell.css', 'raw-token'],
    ['raw token declaration', '.a { --accent: currentColor; }', 'src/shell/shell.css', 'raw-token'],
    ['escaped CSS token', String.raw`.a { color:var(--\61 ccent); }`, 'src/shell/shell.css', 'raw-token'],
    ['JS Unicode escape', String.raw`export const Shell = () => <div style={{color:'\u0023f00'}}>Shell</div>`, 'src/shell/Shell.jsx', 'hex-color'],
    ['split constant', 'const a = \'#\'; const b = \'f00\'; export const Shell = () => <div style={{color:a+b}}>Shell</div>', 'src/shell/Shell.jsx', 'hex-color'],
    ['mutable local color', 'let color = \'#f00\'; color = \'var(--role-text)\'; export const Shell = () => <div style={{color}}>Shell</div>', 'src/shell/Shell.jsx', 'hex-color'],
    ['conditional', 'export const Shell = ({selected}) => <div style={{color:selected?\'var(--role-text)\':\'#ffffff\'}}>Shell</div>', 'src/shell/Shell.jsx', 'hex-color'],
    ['split raw token', 'const token = \'--acc\' + \'ent\'; export const Shell = () => <div style={{color:\'var(\'+token+\')\'}}>Shell</div>', 'src/shell/Shell.jsx', 'raw-token'],
    // eslint-disable-next-line no-template-curly-in-string -- Deliberate runtime template parser fixture.
    ['dynamic token', 'export const Shell = ({token}) => <div style={{color:`var(--${token})`}}>Shell</div>', 'src/shell/Shell.jsx', 'dynamic-token'],
    ['unknown alias', '.a { color:var(--role-unknown); }', 'src/shell/shell.css', 'unknown-role'],
    ['SVG fill', '<svg><path fill="#f00" /></svg>', 'src/shell/state.svg', 'hex-color'],
    ['arbitrary class color', 'export const Shell = () => <div className="bg-[#f00]">Shell</div>', 'src/shell/Shell.jsx', 'hex-color'],
    ['DOM raw token', 'document.body.style.setProperty("--accent", "currentColor")', 'src/shell/shell.js', 'raw-token'],
    ['unparsed JS', 'export const Shell = () => <', 'src/shell/shell.jsx', 'unparsed-source'],
    ['unparsed CSS', '.a { color:var(--role-text);', 'src/shell/shell.css', 'unparsed-source']
  ])('rejects %s', (_name, source, path, code) => {
    expect(inspect(source, path).diagnostics.some(item => item.code === code)).toBe(true)
  })
})

describe('required future production surfaces fail closed', () => {
  it('accepts both real renderers connected to role-bearing styles and inventories their source hashes', async () => {
    const path = await fixture(); await surface(path, 'shell'); await surface(path, 'activity')
    // These deliberate test-only negative values cannot taint production lint.
    await writeFile(join(path, 'src/shell/shell.test.jsx'), 'const plantedFixture = "#fff var(--accent)"')
    const report = await checkRoleCoverage(path)
    expect(report.ok).toBe(true)
    expect(report.directories.every(directory => directory.renderers.length > 0 && directory.roles.length > 0)).toBe(true)
    expect(report.files).toHaveLength(4)
    expect(report.files.every(file => /^[a-f\d]{64}$/.test(file.sha256))).toBe(true)
  })
  it('detects a planted production hex literal in an otherwise clean fixture', async () => {
    const path = await fixture(); await surface(path, 'shell'); await surface(path, 'activity')
    await writeFile(join(path, 'src/activity/planted.css'), '.planted { background:#0c0b0a; }')
    const report = await checkRoleCoverage(path)
    expect(report.ok).toBe(false)
    expect(report.diagnostics.some(item => item.code === 'hex-color' && item.path.endsWith('planted.css'))).toBe(true)
  })
  it('rejects missing, empty, test-only, comments-only and unconnected role styling', async () => {
    const path = await fixture()
    expect((await checkRoleCoverage(path)).ok).toBe(false)
    await surface(path, 'shell', { 'shell.test.jsx': 'export const Fake = () => <div style={{color:"var(--role-text)"}} />' })
    await surface(path, 'activity', { 'activity.css': '/* var(--role-text) */' })
    expect((await checkRoleCoverage(path)).diagnostics.filter(item => item.code === 'empty-surface')).toHaveLength(2)
    await surface(path, 'shell', { 'index.jsx': 'export const Shell = () => <main>Shell</main>', 'unused.css': '.unused {color:var(--role-text)}' })
    const report = await checkRoleCoverage(path)
    expect(report.ok).toBe(false)
    expect(report.directories.find(directory => directory.path === 'src/shell').roles).toEqual([])
  })
  it('does not count an unused role string as actual styling and rejects unsupported style syntax', async () => {
    const path = await fixture(); await surface(path, 'shell', { 'index.jsx': 'const unused="var(--role-text)"; export const Shell=()=> <main>Shell</main>' }); await surface(path, 'activity')
    expect((await checkRoleCoverage(path)).ok).toBe(false)
    await surface(path, 'shell', { 'index.jsx': 'const unused={color:"var(--role-text)"}; const css="color:var(--role-ai);"; export const Shell=()=> <main>Shell</main>' })
    expect((await checkRoleCoverage(path)).directories.find(directory => directory.path === 'src/shell').roles).toEqual([])
    await writeFile(join(path, 'src/activity/styles.scss'), '$foreground:#fff;')
    expect((await checkRoleCoverage(path)).diagnostics.some(item => item.code === 'unsupported-source')).toBe(true)
  })
})
