import { baselineAuthorityPath, loadBaselineAuthority } from '../baseline-authority.mjs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { sha256 } from '../../../scripts/local-artifact.mjs'
import { roleFixtureHashes, roleFixturePaths } from '../role-fixture-binding.mjs'

async function inputs (ctx) {
  const helperPath = join(ctx.kubo, 'mcp/ui/tests/helpers/role-contrast.mjs')
  const helper = await import(pathToFileURL(helperPath).href)
  const authority = await loadBaselineAuthority(ctx)
  const sources = await helper.loadRoleSources({ webui: ctx.root, kubo: ctx.kubo, authorityFile: { root: ctx.root, path: baselineAuthorityPath, sha256: sha256(authority.bytes) }, async readImmutable (cwd, ref, file) {
    const result = await ctx.processes.run('git', ['show', `${ref}:${file}`], { cwd, env: ctx.env, label: `UI-102-immutable-${file.includes('mcp/ui') ? 'shared' : 'webui'}-palette` })
    ctx.assert(result.exitCode === 0, 'Read actual immutable palette source using the recorded commit and path')
    return result.stdout
  } })
  const { manifest } = await ctx.getArtifact()
  for (const [host, source] of Object.entries(sources.hosts)) {
    const files = host === 'webui' ? manifest.inputs.webui.files : manifest.inputs.ui.files
    for (const field of ['tokens', 'roles']) {
      const input = source.inputs[field]
      const path = host === 'shared' ? input.path.replace(/^mcp\/ui\//, '') : input.path
      ctx.assert(files[path] === input.sha256, `${host} ${field} source is bound to the current production artifact`, input)
    }
  }
  const sharedCSS = await readFile(join(ctx.kubo, 'mcp/ui/dist/ipfs-ui.css'), 'utf8')
  ctx.assert(sha256(sharedCSS) === manifest.sharedArtifacts.ui.files['ipfs-ui.css'], 'Shared shadow-root fixture uses exact current compiled UI stylesheet bytes')
  const fixtureFiles = roleFixturePaths
  const fixtureHashes = await roleFixtureHashes({ webuiRoot: ctx.root, kuboRoot: ctx.kubo })
  await ctx.record('role-source-and-runtime-binding', {
    authority: sources.authority, hosts: Object.fromEntries(Object.entries(sources.hosts).map(([host, source]) => [host, source.inputs])),
    artifactSha256: manifest.artifactSha256, reactRuntime: manifest.reactRuntime,
    sharedArtifacts: manifest.sharedArtifacts, sharedCSSSha256: sha256(sharedCSS),
    node: { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) },
    fixtureHashes, constraints: helper.USAGE_CONSTRAINTS, pairings: helper.PAIRINGS
  })
  return { helper, sources, sharedCSS, fixtureFiles, fixtureHashes }
}

async function unchanged (ctx, input) {
  for (const [host, paths] of Object.entries(input.fixtureFiles)) for (const file of paths) {
    ctx.assert(sha256(await readFile(join(host === 'webui' ? ctx.root : ctx.kubo, file))) === input.fixtureHashes[`${host}:${file}`], `Executed ${host} role fixture source did not change during the slot: ${file}`)
  }
  for (const [host, source] of Object.entries(input.sources.hosts)) for (const field of ['tokens', 'roles']) {
    const current = source.inputs[field]
    ctx.assert(sha256(await readFile(join(host === 'webui' ? ctx.root : ctx.kubo, current.path))) === current.sha256, `${host} ${field} source did not change during the slot`)
  }
  ctx.assert(sha256(await readFile(join(ctx.kubo, 'mcp/ui/dist/ipfs-ui.css'))) === sha256(input.sharedCSS), 'Actual compiled shared CSS did not change during the slot')
  await ctx.getArtifact()
}

async function fixtures (ctx, host, files) {
  const cwd = host === 'webui' ? ctx.root : join(ctx.kubo, 'mcp/ui')
  const reportPath = join(ctx.directory, `${host}-roles-vitest.json`)
  const env = { ...ctx.env, COREPACK_ENABLE_AUTO_PIN: '0', IPFS_WEBUI_SOURCE: ctx.root }
  const result = await ctx.processes.run('pnpm', ['exec', 'vitest', 'run', ...files, '--reporter=json', `--outputFile=${reportPath}`], { cwd, env, label: `UI-102-${host}-${ctx.slot}`, timeout: 180000 })
  const bytes = await readFile(reportPath)
  const report = JSON.parse(bytes)
  ctx.assert(result.exitCode === 0 && report.success === true && report.numPassedTests > 0 && report.numFailedTests === 0 && report.numPendingTests === 0 && report.numTodoTests === 0, `${host} role assertions and negative controls actually executed without skip/todo`, { passed: report.numPassedTests })
  await ctx.record(`${host}-role-command`, { argv: result.argv, cwd: result.cwd, exitCode: result.exitCode, reportSha256: sha256(bytes) })
}

async function roleCoverage (ctx) {
  const reportPath = join(ctx.directory, 'role-coverage-report.json')
  const result = await ctx.processes.run(process.execPath, [join(ctx.root, 'scripts/check-role-coverage.mjs'), '--json', reportPath], { cwd: ctx.root, env: ctx.env, label: 'UI-102-real-surface-role-coverage', timeout: 120000 })
  const bytes = await readFile(reportPath)
  const report = JSON.parse(bytes)
  ctx.assert(result.exitCode === 0 && report.schemaVersion === 1 && report.ok === true && report.diagnostics.length === 0, 'Actual production surface role lint executed without ignored violations')
  ctx.assert(JSON.stringify(report.directories.map(directory => directory.path)) === JSON.stringify(['src/shell', 'src/activity']), 'Coverage includes both required future production directories')
  for (const directory of report.directories) ctx.assert(directory.productionFiles > 0 && directory.renderers.length > 0 && directory.roles.length > 0, `${directory.path} has actual production renderers connected to role-bearing styling`, directory)
  const { manifest } = await ctx.getArtifact()
  ctx.assert(report.files.length > 0, 'Role scan did not pass on an empty file set')
  for (const file of report.files) ctx.assert(manifest.inputs.webui.files[file.path] === file.sha256, `Role coverage inspected the exact current production source: ${file.path}`)
  for (const [file, hash] of Object.entries(report.inputs)) ctx.assert(manifest.inputs.webui.files[file] === hash, `Role scanner used the exact exported canonical definition: ${file}`)
  for (const file of ['scripts/role-coverage.mjs', 'scripts/check-role-coverage.mjs']) ctx.assert(manifest.inputs.webui.files[file] === sha256(await readFile(join(ctx.root, file))), `Executed role scanner is bound to the current production source: ${file}`)
  ctx.assert(report.toolchain.node === process.version && report.toolchain.executable === process.execPath, 'Role lint used the actual boundary Node executable/version')
  await ctx.record('role-coverage-command-and-inventory', { argv: result.argv, cwd: result.cwd, exitCode: result.exitCode, reportSha256: sha256(bytes), artifactSha256: manifest.artifactSha256, report })
}

async function browserMatrix (ctx, input, checkContrast) {
  const { helper, sources, sharedCSS } = input
  const session = await ctx.browserSession({ theme: 'dark', width: 1440, height: 1000 })
  try {
    await session.page.goto(`${session.baseURL}#/`)
    // Wait for the real production entry and its locally compiled CSS. No dev
    // page, HTTP response replacement, host token override or inline palette.
    await session.page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--role-canvas').trim() !== '')
    for (const mode of helper.MODES) {
      await session.page.emulateMedia({ colorScheme: mode.scheme })
      const observed = await session.page.evaluate(async ({ mode, roleMap, pairings, sharedCSS, sharedTokens }) => {
        document.documentElement.dataset.theme = mode.theme
        document.querySelector('[data-boundary-role-fixture]')?.remove()
        const panel = document.createElement('section')
        panel.dataset.boundaryRoleFixture = mode.id
        panel.style.cssText = 'position:relative;z-index:2147483000;padding:24px;background:var(--role-canvas);color:var(--role-text);'
        const title = document.createElement('h2')
        title.textContent = `Boundary token fixture: ${mode.id} (current production CSS)`
        panel.append(title)
        document.body.prepend(panel)
        const webui = document.createElement('section')
        panel.append(webui)
        const shadowHost = document.createElement('section')
        // Prevent accidental WebUI custom-property inheritance from hiding a
        // missing compiled shared alias. Shared declarations must supply them.
        for (const token of Object.keys(sharedTokens)) shadowHost.style.setProperty(token, 'initial')
        panel.append(shadowHost)
        const shadow = shadowHost.attachShadow({ mode: 'open' })
        const style = document.createElement('style')
        style.textContent = sharedCSS
        shadow.append(style)
        const shared = document.createElement('section')
        shared.dataset.ipfsUi = ''
        shared.dataset.theme = mode.theme === 'system' ? 'auto' : mode.theme
        shadow.append(shared)
        const result = {}
        for (const [host, scope] of [['webui', webui], ['shared', shared]]) {
          scope.style.cssText = 'display:block;padding:16px;background:var(--role-canvas);color:var(--role-text);'
          const heading = document.createElement('h3')
          heading.textContent = `${host}: ${mode.id}`
          scope.append(heading)
          const samples = []
          for (const pair of pairings) {
            const row = document.createElement('div')
            row.textContent = `${pair.usage}: ${pair.foreground} on ${pair.background} (minimum ${pair.minimum})`
            row.style.cssText = 'display:block;padding:8px;margin:4px 0;opacity:1;filter:none;'
            row.style.backgroundColor = `var(${pair.background})`
            if (pair.usage === 'focus-ring') {
              row.style.color = 'var(--role-text)'
              row.style.outline = `2px solid var(${pair.foreground})`
              row.style.outlineOffset = '-2px'
            } else if (pair.usage === 'form-edge') {
              row.style.color = 'var(--role-text)'
              row.style.border = `1px solid var(${pair.foreground})`
            } else row.style.color = `var(${pair.foreground})`
            scope.append(row)
            samples.push({ pair, row })
          }
          // Let the browser resolve the actual media/theme cascade and paint.
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          const computed = getComputedStyle(scope)
          const roleValues = Object.fromEntries(Object.keys(roleMap).map(role => [role, computed.getPropertyValue(role).trim().toLowerCase()]))
          const list = document.createElement('pre')
          list.style.cssText = 'color:var(--role-text);white-space:pre-wrap;'
          list.textContent = Object.entries(roleValues).map(([role, value]) => `${role}: ${value || '(unresolved)'}`).join('\n')
          scope.prepend(list)
          result[host] = {
            roles: roleValues,
            pairs: samples.map(({ pair, row }) => {
              const value = getComputedStyle(row)
              return { ...pair, foregroundColor: pair.usage === 'focus-ring' ? value.outlineColor : pair.usage === 'form-edge' ? value.borderTopColor : value.color, backgroundColor: value.backgroundColor, opacity: value.opacity, filter: value.filter }
            })
          }
        }
        return { mode: mode.id, schemeMatches: matchMedia(`(prefers-color-scheme: ${mode.scheme})`).matches, hosts: result }
      }, { mode, roleMap: helper.ROLE_MAP, pairings: checkContrast ? helper.PAIRINGS : [], sharedCSS, sharedTokens: sources.hosts.shared.modes[mode.id] })
      ctx.assert(observed.schemeMatches, `${mode.id}: actual browser media query matches requested system scheme`)
      for (const [host, value] of Object.entries(observed.hosts)) {
        const expected = sources.hosts[host].modes[mode.id]
        for (const role of Object.keys(helper.ROLE_MAP)) ctx.assert(value.roles[role] === helper.resolveColor(expected, role), `${host}/${mode.id}: actual computed ${role} matches its immutable-palette alias`, { actual: value.roles[role], expected: helper.resolveColor(expected, role) })
        if (checkContrast) for (const pair of value.pairs) {
          const rgb = hex => `rgb(${[1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(', ')})`
          ctx.assert(pair.foregroundColor === rgb(helper.resolveColor(expected, pair.foreground)) && pair.backgroundColor === rgb(helper.resolveColor(expected, pair.background)) && pair.opacity === '1' && pair.filter === 'none', `${host}/${mode.id}/${pair.id}: measured sample renders the intended opaque source colors`, pair)
          pair.ratio = helper.contrast(pair.foregroundColor, pair.backgroundColor)
          ctx.assert(pair.ratio >= pair.minimum, `${host}/${mode.id}/${pair.id}: rendered contrast meets its applicable threshold`, pair)
        }
      }
      await ctx.record(`computed-roles-${mode.id}`, observed)
      await ctx.screenshot(session.page, `role-${checkContrast ? 'contrast' : 'parity'}-${mode.id}`)
    }
  } finally { await session.close() }
}

export default [
  { scenario: 'UI-102', id: 'role-parity', requires: ['browser', 'daemon'], async run (ctx) {
    const input = await inputs(ctx)
    await roleCoverage(ctx)
    await fixtures(ctx, 'webui', ['src/promethity/roles.test.js', 'test/boundary/role-fixture-binding.test.js', 'scripts/role-coverage.test.js'])
    await fixtures(ctx, 'shared', ['tests/roles.test.ts'])
    await browserMatrix(ctx, input, false)
    await unchanged(ctx, input)
  } },
  { scenario: 'UI-102', id: 'role-contrast', requires: ['browser', 'daemon'], async run (ctx) {
    const input = await inputs(ctx)
    for (const [host, source] of Object.entries(input.sources.hosts)) for (const mode of input.helper.MODES) {
      const pairs = input.helper.evaluatePairs(source.modes[mode.id])
      for (const pair of pairs) ctx.assert(pair.ratio >= pair.minimum, `${host}/${mode.id}/${pair.id}: source-resolved contrast satisfies the declared usage`, pair)
      await ctx.record(`resolved-contrast-${host}-${mode.id}`, pairs)
    }
    await fixtures(ctx, 'webui', ['src/promethity/role-contrast.test.js'])
    await fixtures(ctx, 'shared', ['tests/role-contrast.test.ts'])
    await browserMatrix(ctx, input, true)
    await unchanged(ctx, input)
  } }
]
