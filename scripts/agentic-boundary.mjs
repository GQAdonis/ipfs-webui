import assert from 'node:assert/strict'
import { localExportArgs } from './export-command.mjs'
import { createReadStream } from 'node:fs'
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { assertLocalWebuiExport, sha256, snapshot, treeFiles } from './local-artifact.mjs'
import { adoptedContractSha256, adoptedIdentity, contractRelativePath, aggregate, requirements, validateRegistrations } from '../test/boundary/requirements.mjs'
import { kuboInputs, laneSlots } from '../test/boundary/evidence-schema.mjs'
import { Blocked, isolatedEnvironment, Processes } from '../test/boundary/processes.mjs'
import { startOwnedKubo } from '../test/helpers/owned-kubo.mjs'
import { createSessionArtifactNames } from '../test/boundary/accessibility/session-artifacts.mjs'
import { createImmutableArtifactWriter } from '../test/boundary/immutable-artifacts.mjs'
import { createArtifactAccess } from '../test/boundary/artifact-access.mjs'
import { validateClaudeExecutable } from '../test/boundary/collaborator-inputs.mjs'
import { serveStatic } from '../test/boundary/static-host.mjs'
import { create as createRpc } from 'kubo-rpc-client'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const kubo = resolve(root, '../kubo')
const contractPath = join(kubo, contractRelativePath)
const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

export async function runBoundary ({ configPath, useCurrentExport = false, evidenceBase = join(kubo, 'evidence/agentic-ui-frontend/final-boundary') } = {}) {
  const runId = `webui-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`
  const evidence = join(resolve(evidenceBase), 'runs', runId)
  await mkdir(evidence, { recursive: true })
  const scratch = await mkdtemp(join(tmpdir(), 'promethity-agentic-boundary-'))
  const processes = new Processes(join(evidence, 'commands'))
  const manifest = { schemaVersion: 1, lane: 'WU', ownedSlots: laneSlots('WU'), runId, startedAt: new Date().toISOString(), argv: process.argv, cwd: process.cwd(), execution: 'real-local-boundary', status: 'BLOCKED', phaseStatus: 'BLOCKED', awaiting: ['UI-110 and Desktop per-host contributions require SU receipt and final lane aggregation'], scenarios: [], fixtures: [], commands: processes.commands, cleanup: [] }
  const handles = []; const sessions = new Set(); const leases = new Set()
  const sessionArtifactNames = createSessionArtifactNames()
  let contract; let config = {}; let nodePromise; let peerPromise; let browserPromise; let productionHostPromise; const staticHosts = new Set(); let before
  const env = isolatedEnvironment(join(scratch, 'cli-repo'), kubo)
  async function ownNode (label) {
    const node = await startOwnedKubo({ kubo, scratch, processes, label, makeBuildReceipt: config.makeBuildReceipt })
    handles.push(node)
    manifest.fixtures.push({ label, repo: node.repo, ports: node.ports, peerId: node.id.id, binary: node.identity, configSha256: sha256(await readFile(join(node.repo, 'config'))) })
    return node
  }
  const getNode = () => (nodePromise ||= ownNode('main'))
  const getPeer = () => (peerPromise ||= ownNode('peer'))
  const { getArtifact, getMetadata } = createArtifactAccess({
    async produce () {
      if (!useCurrentExport) await processes.run(packageManager, localExportArgs(kubo), { cwd: root, env, label: 'derive-local-production-artifact', timeout: 10 * 60 * 1000 })
    },
    verify: () => assertLocalWebuiExport({ root, kubo }),
    bind (artifact) {
      manifest.artifact = { sha256: artifact.artifactSha256, inputs: artifact.inputs, sharedArtifacts: artifact.sharedArtifacts, explorer: artifact.explorer, reactRuntime: artifact.reactRuntime, toolchain: artifact.toolchain }
    },
    async publish (artifact) {
      const node = await getNode()
      const files = await treeFiles(join(root, 'build'))
      async function * source () { for (const path of Object.keys(files)) yield { path: `webui/${path}`, content: createReadStream(join(root, 'build', path)) } }
      let imported
      const recipe = { cidVersion: 1, rawLeaves: true, hashAlg: 'sha2-256', wrapWithDirectory: true, pin: true }
      for await (const result of node.api.addAll(source(), recipe)) if (result.path === '') imported = result.cid.toString()
      assert(imported, 'Local artifact importer emitted its directory CID')
      manifest.fixtureArtifact = { cid: imported, recipe, sha256: artifact.artifactSha256, files: Object.keys(files).length }
      return `${node.gatewayUrl}/ipfs/${imported}/webui/`
    }
  })
  async function getBrowser () {
    browserPromise ||= (async () => {
      const { chromium } = await import('@playwright/test')
      try {
        const browser = await chromium.launch({ headless: true })
        manifest.browser = { version: browser.version(), executable: chromium.executablePath(), executableSha256: sha256(await readFile(chromium.executablePath())) }
        return browser
      } catch (error) { throw new Blocked(`Pinned browser unavailable; do not download a substitute: ${error.message}`) }
    })()
    return browserPromise
  }
  async function productionOrigin () {
    productionHostPromise ||= (async () => {
      await getArtifact()
      const host = await serveStatic({ directory: join(root, 'build'), port: config.hosting?.port ?? 0 })
      staticHosts.add(host)
      manifest.productionHosting = { kind: 'dedicated-static-production', baseURL: host.baseURL, source: 'exact current build bytes', authPolicy: 'unchanged actual backend CORS and bearer/session checks' }
      return host
    })()
    return new URL((await productionHostPromise).baseURL).origin
  }
  async function fixtureSession (ctx, { directory, theme = 'dark', width = 1440, height = 1000, allowedOrigins = [] } = {}) {
    const physical = await realpath(directory); const rel = relative(await realpath(scratch), physical)
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Blocked('Fixture serving is limited to this runner scratch outputs')
    const host = await serveStatic({ directory: physical }); staticHosts.add(host)
    const browser = await getBrowser(); const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, locale: 'en-US' })
    const allowed = new Set([new URL(host.baseURL).origin])
    const allowOrigin = value => {
      const url = new URL(value)
      if (!['http:', 'https:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || !url.port || url.username || url.password) throw new Blocked('Fixture egress may allow only explicit loopback collaborator origins')
      allowed.add(url.origin)
    }
    allowedOrigins.forEach(allowOrigin)
    await context.route('**/*', route => { const url = new URL(route.request().url()); return ['http:', 'https:'].includes(url.protocol) && !allowed.has(url.origin) ? route.abort('blockedbyclient') : route.continue() })
    const page = await context.newPage(); page.setDefaultTimeout(15000)
    let closed = false
    const session = {
      page,
      context,
      baseURL: host.baseURL,
      allowOrigin,
      async close () {
        if (closed) return
        closed = true; sessions.delete(session)
        try { await ctx.record(`fixture-host-${new URL(host.baseURL).port}`, { kind: 'static-test-owned-visible-host', directory: physical, baseURL: host.baseURL, theme, width, height, presentationFixture: true, traces: 'omitted', networkPayloads: 'omitted' }) } finally { await context.close(); await host.close(); staticHosts.delete(host) }
      }
    }
    sessions.add(session)
    return session
  }
  async function browserSession (ctx, { theme = 'dark', width = 1440, height = 1000, backendLease, hosting = 'shared-path', credentialBearing = !['UI-101', 'UI-114', 'UI-115'].includes(ctx.scenario) } = {}) {
    const artifactNames = sessionArtifactNames(theme, width)
    if (ctx.scenario === 'UI-111' || backendLease) credentialBearing = true
    const [{ baseURL: sharedBaseURL }, node, browser] = await Promise.all([getArtifact(), getNode(), getBrowser()])
    if (!['shared-path', 'dedicated'].includes(hosting)) throw new Blocked('Unknown production hosting mode')
    const baseURL = hosting === 'dedicated' ? `${await productionOrigin()}/` : sharedBaseURL
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, acceptDownloads: true, locale: 'en-US' })
    if (backendLease && !leases.has(backendLease)) throw new Blocked('Browser backend lease must be an owned canonical fixture handle')
    const rpcUrl = backendLease ? backendLease.descriptor.rpc_url : node.apiUrl
    await context.addInitScript(({ apiUrl, gatewayUrl, theme }) => {
      if (!localStorage.getItem('ipfsApi')) localStorage.setItem('ipfsApi', JSON.stringify(apiUrl))
      const gateway = new URL(gatewayUrl)
      localStorage.setItem('kuboGateway', JSON.stringify({ host: gateway.hostname, port: Number(gateway.port), protocol: 'http', trustlessBlockBrokerConfig: { init: { allowInsecure: true, allowLocal: true } } }))
      localStorage.setItem('explore.ipld.gatewayEnabled', 'false')
      localStorage.setItem('files.viewMode', JSON.stringify('list'))
      if (!localStorage.getItem('i18nextLng')) localStorage.setItem('i18nextLng', 'en')
      if (!localStorage.getItem('ipfs-webui:theme:v1')) localStorage.setItem('ipfs-webui:theme:v1', theme)
    }, { apiUrl: rpcUrl, gatewayUrl: node.gatewayUrl, theme })
    if (backendLease) {
      if (hosting !== 'dedicated' || !backendLease.allowedOrigins?.includes(new URL(baseURL).origin)) throw new Blocked('Positive agent production host must be explicitly allowed by the actual lease setup')
      await backendLease.credential.use(bearer => context.addInitScript(({ endpoint, bearer }) => {
        localStorage.setItem('ipfs-webui:agent-chat', JSON.stringify({ enabled: true, endpoint }))
        localStorage.setItem('ipfs-webui:agent-chat:token', bearer)
      }, { endpoint: backendLease.descriptor.endpoint, bearer }))
    }
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors = []; const failed = []
    // Credential-bearing flows deliberately have no trace/network/error-payload
    // collection: Playwright traces can retain Authorization and storage values.
    if (!credentialBearing) {
      page.on('pageerror', error => errors.push(error.message))
      page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }) })
    }
    // Browser fixtures never fetch arbitrary third-party content. This is an
    // egress rejection, not an HTTP/mock provider response substituting a node.
    const allowedOrigins = new Set([baseURL, node.apiUrl, node.gatewayUrl, rpcUrl, ...Object.values(config.backends || {}).map(backend => backend.endpoint), ...(backendLease ? [backendLease.descriptor.endpoint] : [])].map(url => new URL(url).origin))
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (['http:', 'https:'].includes(url.protocol) && !allowedOrigins.has(url.origin)) return route.abort('blockedbyclient')
      return route.continue()
    })
    if (!credentialBearing) await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
    let closed = false
    const session = {
      page,
      context,
      baseURL,
      errors,
      failed,
      async close () {
        if (closed) return
        closed = true; sessions.delete(session)
        try {
          await ctx.record(artifactNames.record, { theme, width, height, baseURL, credentialBearing, tracePolicy: credentialBearing ? 'omitted: may retain credentials' : 'unauthenticated-core-only', errors, failed })
          if (!credentialBearing) await ctx.capture(artifactNames.trace.slice(0, -4), 'zip', path => context.tracing.stop({ path }))
        } finally { await context.close() }
      }
    }
    sessions.add(session)
    return session
  }
  const interrupted = () => { manifest.interrupted = true; void processes.signalOwned('SIGTERM') }
  process.once('SIGINT', interrupted); process.once('SIGTERM', interrupted)
  try {
    if (process.env.E2E_API_URL) throw new Blocked('External/operator E2E_API_URL is not permitted')
    contract = JSON.parse(await readFile(contractPath, 'utf8'))
    manifest.adoptedOracles = contract.scenarioMatrix.map(({ id, name, oracle, negativeControl }) => ({ id, name, oracle, negativeControl }))
    if (sha256(await readFile(contractPath)) !== adoptedContractSha256 || !isDeepStrictEqual(contract.identity, adoptedIdentity) || contract.scenarioMatrix.length !== 18) throw new Blocked('Boundary registry must be reconciled with the latest adopted contract before execution')
    manifest.contract = { identity: contract.identity, fileSha256: sha256(await readFile(contractPath)), boundaryPacket: contract.boundaryPacket }
    if (configPath) {
      config = JSON.parse(await readFile(resolve(configPath), 'utf8'))
      if (config.testOnly !== true || Object.keys(config).some(key => !['testOnly', 'backends', 'leases', 'compatibilityReceipt', 'hosting', 'makeBuildReceipt'].includes(key))) throw new Blocked('Only an explicit test-only backend configuration is supported')
      if (config.makeBuildReceipt !== undefined && (typeof config.makeBuildReceipt !== 'string' || !config.makeBuildReceipt.trim())) throw new Blocked('makeBuildReceipt must name an explicit test-only receipt file')
      for (const descriptor of Object.values(config.backends || {})) {
        const url = new URL(descriptor.endpoint)
        if (descriptor.testOnly !== true || !/^[a-f0-9]{64}$/.test(descriptor.configFingerprint) || url.username || url.password || url.search || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.protocol !== 'http:' || !url.port || Object.keys(descriptor).some(key => !['testOnly', 'endpoint', 'configFingerprint'].includes(key))) throw new Blocked('Backend descriptors require a non-secret test-only loopback endpoint and public configuration fingerprint')
      }
      manifest.backendConfig = { testOnly: true, modes: Object.keys(config.leases || {}), compatibilityReceiptProvided: Boolean(config.compatibilityReceipt), makeBuildReceiptProvided: Boolean(config.makeBuildReceipt), hosting: config.hosting, configSha256: sha256(await readFile(resolve(configPath))) }
    }
    before = await snapshot(root, ['test', 'scripts', 'package.json', 'package-lock.json', 'vite.config.js', 'vitest.config.js'])
    manifest.harness = before
    manifest.kuboInputs = await kuboInputs(kubo)
    manifest.node = { version: process.version, executable: process.execPath, sha256: sha256(await readFile(process.execPath)) }
    const registrations = []
    const directory = join(root, 'test/boundary/registrations')
    for (const name of (await readdir(directory)).filter(name => name.endsWith('.mjs')).sort()) {
      const path = join(directory, name)
      const implementation = { path, sha256: sha256(await readFile(path)) }
      registrations.push(...(await import(pathToFileURL(path).href)).default.map(entry => ({ ...entry, implementation })))
    }
    validateRegistrations(registrations, contract.scenarioMatrix)
    for (const scenario of contract.scenarioMatrix) {
      const scenarioReceipt = { id: scenario.id, name: scenario.name, oracle: scenario.oracle, negativeControl: scenario.negativeControl, checks: [], status: 'BLOCKED' }
      manifest.scenarios.push(scenarioReceipt)
      if (scenario.id === 'UI-110') {
        scenarioReceipt.status = 'NOT_EXERCISED'
        scenarioReceipt.reason = 'Unowned by WU; required SU Desktop receipt is reconciled by the final lane aggregator'
        continue
      }
      for (const slot of requirements[scenario.id].filter(id => id !== 'desktop-shell-overlays')) {
        const entry = registrations.find(item => item.scenario === scenario.id && item.id === slot)
        const receipt = { id: slot, host: 'webui', requires: entry?.requires || [], implementation: entry?.implementation, attempted: false, status: 'BLOCKED', observations: [], artifacts: [] }
        scenarioReceipt.checks.push(receipt)
        if (!entry) { receipt.reason = `Required assertion ${scenario.id}/${slot} is not registered; owning feature/Desktop task must author it`; continue }
        const directory = join(evidence, scenario.id, slot)
        await mkdir(directory, { recursive: true })
        const retain = createImmutableArtifactWriter({ directory, artifacts: receipt.artifacts })
        const ctx = {
          root,
          kubo,
          scratch,
          evidence,
          directory,
          contract,
          config,
          scenario: scenario.id,
          slot,
          processes,
          env,
          assert (condition, description, details) { assert(condition, description); receipt.observations.push({ description, ...(details === undefined ? {} : { details }) }) },
          async record (name, value) {
            const bytes = JSON.stringify(value, null, 2) + '\n'
            return retain(name, 'json', bytes)
          },
          async screenshot (page, name) {
            return retain(name, 'png', await page.screenshot({ fullPage: true }))
          },
          async capture (name, extension, produce) {
            const temporary = await mkdtemp(join(scratch, 'capture-'))
            try {
              const path = join(temporary, 'capture')
              await produce(path)
              return await retain(name, extension, await readFile(path))
            } finally { await rm(temporary, { recursive: true, force: true }) }
          },
          getNode,
          getPeer,
          getArtifact,
          getMetadata,
          getBrowser,
          productionOrigin,
          async getLeaseExecutable (kind) {
            try { return await validateClaudeExecutable({ config, kind, kubo, contract, binaryIdentity: (await getNode()).identity, ctx }) } catch (error) { if (error.code === 'ENOENT') throw new Blocked(`Claude ${kind} executable/receipt input is unavailable`); throw error }
          },
          async acquireBackendLease (kind) {
            const input = await ctx.getLeaseExecutable(kind)
            const origin = await productionOrigin()
            if (!input.setup?.allowed_origins?.includes(origin)) throw new Blocked('Claude canonical lease setup must explicitly allow the actual dedicated production origin; no implicit CORS expansion')
            return ctx.startBackendLease({ setup: input.setup, releaseReceiptPath: input.releaseReceiptPath, validated: input })
          },
          async attach (path) {
            const physical = await realpath(path); const rel = relative(await realpath(evidence), physical)
            if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Blocked('Retained evidence must belong to this exact run')
            receipt.artifacts.push({ path: physical, sha256: sha256(await readFile(physical)) }); return physical
          },
          serveFixture: options => fixtureSession(ctx, options),
          async startBackendLease ({ setup, releaseReceiptPath, validated }) {
            validated ||= await ctx.getLeaseExecutable(setup?.mode)
            if (setup?.test_only !== true || setup.version !== 1 || !['builtin', 'uar'].includes(setup.mode)) throw new Blocked('Backend lease requires the canonical version1/test_only FD3 schema')
            const node = await getNode()
            if (setup.make_build_sha256 !== node.identity.sha256) throw new Blocked('Backend lease binary digest differs from the actual make-built fixture binary')
            if (setup.mode === 'uar') {
              const binding = setup.collaborator?.release_receipt
              if (!binding || !releaseReceiptPath) throw new Blocked('Real UAR lease requires its actual retained public image/source-process inspection receipt')
              const bytes = await readFile(resolve(releaseReceiptPath))
              if (bytes.length > 1024 * 1024 || sha256(bytes) !== binding.sha256) throw new Blocked('Actual public UAR release receipt bytes do not match the live lease attestation')
              const text = bytes.toString('utf8')
              if (/(?:Bearer\s+\S+|(?:TOKEN|PASSWORD|API_KEY)\s*[=:]\s*[^\s"',}]+)/i.test(text) || /"[^"]*(?:api[_-]?key|password|credential|token|authorization)[^"]*"\s*:/i.test(text)) throw new Blocked('UAR inspection receipt is not safe public evidence')
              await retain('uar-release-inspection', 'json', bytes)
              await ctx.record('uar-release-binding', binding)
            }
            const binary = validated.executable
            const lease = await processes.start(binary, ['-test.run=^TestMCPBoundaryLease$', '-test.timeout=20m'], { cwd: kubo, env: { ...env, IPFS_MCP_BOUNDARY_LEASE: '1' }, label: `${scenario.id}-backend-lease`, timeout: 21 * 60 * 1000, protectedSetup: setup })
            const descriptor = await lease.publicDescriptor
            await ctx.record('backend-public-lease', { commandReceipt: lease.record, descriptor })
            if (descriptor.status !== 'READY') { lease.closeLease(); await lease.done; throw new Blocked(`Real backend fixture ${descriptor.status}: ${descriptor.reason || 'not ready'}`) }
            if (descriptor.test_only !== true || descriptor.version !== 1 || descriptor.mode !== setup.mode || descriptor.make_build_sha256 !== node.identity.sha256 || descriptor.native_node_confirmation_available !== false || descriptor.browser_capture !== 'no_trace_or_network' || descriptor.authentication !== 'private_fd5') throw new Blocked('Backend public readiness does not match the canonical fixture authority')
            if (!/^[a-f0-9]{64}$/.test(descriptor.config_fingerprint) || !Array.isArray(descriptor.fixture_cids) || descriptor.fixture_cids.length !== 2 || !Array.isArray(descriptor.owned_pids) || descriptor.owned_pids.length !== 2 || !descriptor.owned_pids.every(pid => Number.isInteger(pid) && pid > 0)) throw new Blocked('Backend readiness is missing its bounded fixture/process identity')
            await processes.captureDescendants()
            if (!descriptor.owned_pids.every(pid => processes.owned.has(pid))) throw new Blocked('Backend fixture claimed a process outside this runner descendant lease')
            if (setup.mode === 'uar' && !isDeepStrictEqual(descriptor.collaborator?.release_receipt, setup.collaborator.release_receipt)) throw new Blocked('UAR readiness release receipt binding differs from the actual retained inspection')
            for (const field of ['rpc_url', 'endpoint', 'decisions_url']) {
              const url = new URL(descriptor[field])
              if (!['http:', 'https:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || !url.port || ['4001', '5001', '8080', '3001'].includes(url.port) || url.username || url.password || url.search || url.hash) throw new Blocked('Backend readiness exposed an invalid or non-loopback URL')
            }
            const credential = await lease.credential
            if (credential.leaseId !== descriptor.lease_id) { credential.clear(); lease.closeLease(); throw new Blocked('Private FD5 lease identity differs from public readiness') }
            const handle = { ...lease, descriptor, credential, allowedOrigins: [...setup.allowed_origins], api: createRpc({ url: descriptor.rpc_url }) }
            handle.close = async () => {
              handle.closeLease()
              const [closed, exit] = await Promise.all([handle.publicClosed, handle.done])
              credential.clear(); leases.delete(handle)
              if (closed.status !== 'CLOSED' || closed.lease_id !== descriptor.lease_id || closed.owned_children_joined !== true || exit.exitCode !== 0) throw new Blocked('Backend fixture did not join exactly its owned children')
              await ctx.record('backend-public-closed', { statuses: handle.publicStatuses, commandReceipt: handle.record, closed, helperSha256: sha256(await readFile(binary)) })
            }
            leases.add(handle)
            return handle
          },
          async rpcSnapshot (name, node) {
            node ||= await getNode()
            const value = { identity: await node.api.id(), files: [], pins: [] }
            for await (const file of node.api.files.ls('/')) value.files.push({ name: file.name, type: file.type, cid: file.cid.toString(), size: file.size })
            for await (const pin of node.api.pin.ls({ type: 'recursive' })) value.pins.push({ cid: pin.cid.toString(), type: pin.type })
            await ctx.record(name, value); return value
          },
          browserSession: options => browserSession(ctx, options),
          requireBackend (kind) {
            const descriptor = config.leases?.[kind] || config.backends?.[kind]
            if (!descriptor) throw new Blocked(`Real ${kind} test backend is not configured; a mock provider cannot satisfy ${scenario.id}`)
            return descriptor
          }
        }
        try {
          if (manifest.interrupted) throw new Blocked('Boundary interrupted; no dependent verification')
          for (const dependency of entry.requires) {
            if (dependency === 'daemon') await getNode()
            else if (dependency === 'fixture-browser') await getBrowser()
            else if (dependency === 'browser') { await getArtifact(); await getBrowser() } else if (['builtin', 'uar'].includes(dependency)) ctx.requireBackend(dependency)
            else throw new Blocked(`Unknown required collaborator: ${dependency}`)
          }
          receipt.attempted = true
          await entry.run(ctx)
          if (!receipt.observations.length) throw new Blocked('Assertion registration produced zero observations')
          if (!receipt.artifacts.length) throw new Blocked('Assertion registration produced no evidence artifact')
          receipt.status = 'PASS'
        } catch (error) {
          receipt.status = error.name === 'Blocked' ? 'BLOCKED' : error.name === 'NotExercised' ? 'NOT_EXERCISED' : 'FAIL'
          receipt.reason = error.message
        } finally {
          await writeFile(join(directory, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n')
        }
      }
      scenarioReceipt.status = aggregate(scenarioReceipt.checks)
    }
    manifest.status = aggregate(manifest.scenarios.filter(scenario => scenario.id !== 'UI-110'))
  } catch (error) { manifest.status = error.name === 'Blocked' ? 'BLOCKED' : 'FAIL'; manifest.reason = error.message } finally {
    for (const session of sessions) try { await session.close() } catch (error) { manifest.cleanup.push({ status: 'FAIL', message: error.message }) }
    for (const host of staticHosts) try { await host.close() } catch (error) { manifest.cleanup.push({ status: 'BLOCKED', message: error.message }) }
    for (const lease of leases) try { await lease.close() } catch (error) { manifest.cleanup.push({ status: 'BLOCKED', message: error.message }) }
    if (browserPromise) try { await (await browserPromise).close() } catch (error) { manifest.cleanup.push({ status: 'BLOCKED', message: error.message }) }
    for (const node of handles.reverse()) try { await node.stop() } catch (error) { manifest.cleanup.push({ status: 'FAIL', message: error.message }) }
    try { await processes.stop() } catch (error) { manifest.cleanup.push({ status: 'BLOCKED', message: error.message }) }
    if (processes.monitorError) manifest.cleanup.push({ status: 'BLOCKED', message: processes.monitorError.message })
    if (before) {
      try {
        const after = await snapshot(root, ['test', 'scripts', 'package.json', 'package-lock.json', 'vite.config.js', 'vitest.config.js'])
        if (after.sha256 !== before.sha256) { manifest.status = 'BLOCKED'; manifest.reason = 'Harness/source changed during the boundary; affected evidence is stale' }
      } catch (error) { manifest.status = 'BLOCKED'; manifest.reason = error.message }
    }
    if (manifest.artifact) {
      try { await assertLocalWebuiExport({ root, kubo }) } catch (error) { manifest.status = 'BLOCKED'; manifest.reason = `Artifact/source changed during the boundary: ${error.message}` }
    }
    if (manifest.contract && sha256(await readFile(contractPath)) !== manifest.contract.fileSha256) { manifest.status = 'BLOCKED'; manifest.reason = 'Adopted oracle bytes changed during boundary' }
    if (manifest.kuboInputs) {
      try { if ((await kuboInputs(kubo)).sha256 !== manifest.kuboInputs.sha256) { manifest.status = 'BLOCKED'; manifest.reason = 'Kubo source/lock/CLI fixture inputs changed during boundary' } } catch (error) { manifest.status = 'BLOCKED'; manifest.reason = error.message }
    }
    if (manifest.cleanup.length || manifest.interrupted) manifest.status = manifest.status === 'FAIL' ? 'FAIL' : 'BLOCKED'
    if (manifest.cleanup.length) manifest.retainedScratch = scratch
    else try { await rm(scratch, { recursive: true, force: true }) } catch (error) { manifest.status = 'BLOCKED'; manifest.cleanup.push({ status: 'BLOCKED', message: error.message }); manifest.retainedScratch = scratch }
    manifest.endedAt = new Date().toISOString()
    await writeFile(join(evidence, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
    await writeFile(join(resolve(evidenceBase), 'webui-latest.json'), JSON.stringify({ schemaVersion: 1, runId, manifest: join(evidence, 'manifest.json'), sha256: sha256(await readFile(join(evidence, 'manifest.json'))), status: manifest.status }, null, 2) + '\n')
    process.removeListener('SIGINT', interrupted); process.removeListener('SIGTERM', interrupted)
  }
  console.log(`WebUI boundary ${manifest.status}: ${join(evidence, 'manifest.json')}`)
  return manifest
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const options = {}
  while (args.length) {
    const key = args.shift()
    if (key === '--use-current-export') { options.useCurrentExport = true; continue }
    const value = args.shift()
    if (!value || !['--config', '--evidence'].includes(key)) throw new Error('Usage: npm run test:agentic-boundary -- [--config <test-only.json>] [--evidence <directory>] [--use-current-export]')
    options[key === '--config' ? 'configPath' : 'evidenceBase'] = value
  }
  const result = await runBoundary(options)
  process.exitCode = result.status === 'PASS' ? 0 : result.status === 'FAIL' ? 1 : 2
}
