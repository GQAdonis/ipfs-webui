import { createServer } from 'node:net'
import { mkdtemp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { create } from 'kubo-rpc-client'
import { sha256 } from '../../scripts/local-artifact.mjs'
import { Blocked, delay, isolatedEnvironment, Processes } from '../boundary/processes.mjs'
import { assertMakeBuildReceipt } from '../boundary/make-build-receipt.mjs'

export const webuiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const kuboRoot = resolve(webuiRoot, '../kubo')
export async function availablePort () {
  const server = createServer()
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  const port = server.address().port
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  if ([4001, 5001, 8080, 3001].includes(port)) return availablePort()
  return port
}

export async function makeBinaryIdentity ({ kubo = kuboRoot, processes, env, makeBuildReceipt }) {
  const binary = join(kubo, 'cmd/ipfs/ipfs')
  try { if (await realpath(binary) !== binary) throw new Blocked('Kubo test binary must be the local make-built file, not a symlink') } catch (error) { throw new Blocked(`Local make-built Kubo binary unavailable: ${error.message}`) }
  if (process.env.IPFS_GO_EXEC && resolve(process.env.IPFS_GO_EXEC) !== binary) throw new Blocked('IPFS_GO_EXEC must identify this checkout cmd/ipfs/ipfs')
  const info = await processes.run('go', ['version', '-m', binary], { cwd: kubo, env, label: 'make-binary-info' })
  const missing = ['CurrentCommit=', 'taggedRelease=', 'buildOrigin='].find(field => !info.stdout.includes(field))
  if (missing && !makeBuildReceipt) throw new Blocked(`Kubo binary lacks Makefile-injected ${missing}; run the final packet make build first or supply its explicit complete makeBuildReceipt`)
  const version = await processes.run(binary, ['version', '--all'], { cwd: kubo, env, label: 'kubo-version' })
  const provenance = makeBuildReceipt
    ? await assertMakeBuildReceipt({ path: makeBuildReceipt, kubo, binary, buildInfo: info.stdout, version: version.stdout, processes, env })
    : { method: 'makefile-build-info' }
  return { binary, sha256: sha256(await readFile(binary)), buildInfo: info.stdout, version: version.stdout, provenance }
}

export async function startOwnedKubo ({ kubo = kuboRoot, processes, scratch, label = 'node', corsOrigins = [], makeBuildReceipt } = {}) {
  if (process.env.E2E_API_URL) throw new Blocked('E2E_API_URL is prohibited: tests require an owned temporary local daemon')
  let ownProcesses = false
  if (!scratch) scratch = await mkdtemp(join(tmpdir(), 'webui-owned-kubo-'))
  if (!processes) { processes = new Processes(join(scratch, 'commands')); ownProcesses = true }
  const repo = join(scratch, `${label}-repo`)
  await mkdir(repo, { recursive: false })
  const env = isolatedEnvironment(repo, kubo)
  let daemon
  try {
    const identity = await makeBinaryIdentity({ kubo, processes, env, makeBuildReceipt })
    const ports = { api: await availablePort(), gateway: await availablePort(), swarm: await availablePort() }
    const apiUrl = `http://127.0.0.1:${ports.api}`
    const gatewayUrl = `http://127.0.0.1:${ports.gateway}`
    await processes.run(identity.binary, ['init', '--profile=test'], { cwd: kubo, env, label: `${label}-init` })
    const configPath = join(repo, 'config')
    const config = JSON.parse(await readFile(configPath, 'utf8'))
    Object.assign(config.Addresses, { API: `/ip4/127.0.0.1/tcp/${ports.api}`, Gateway: `/ip4/127.0.0.1/tcp/${ports.gateway}`, Swarm: [`/ip4/127.0.0.1/tcp/${ports.swarm}`] })
    config.Bootstrap = []
    config.Discovery = { ...config.Discovery, MDNS: { Enabled: false } }
    config.Routing = { ...config.Routing, Type: 'none' }
    config.Gateway = { ...config.Gateway, NoFetch: true }
    config.AutoConf = { ...config.AutoConf, Enabled: false }
    config.Provide = { ...config.Provide, Enabled: false }
    config.API = { ...config.API, HTTPHeaders: { ...config.API?.HTTPHeaders, 'Access-Control-Allow-Origin': [apiUrl, gatewayUrl, ...corsOrigins], 'Access-Control-Allow-Methods': ['POST', 'OPTIONS', 'PUT'], 'Access-Control-Allow-Headers': ['Content-Type', 'Authorization'] } }
    await writeFile(configPath, JSON.stringify(config, null, 2) + '\n')
    daemon = await processes.start(identity.binary, ['daemon'], { cwd: kubo, env, label: `${label}-daemon`, timeout: 35 * 60 * 1000 })
    const api = create({ url: apiUrl })
    let id
    const deadline = Date.now() + 45000
    while (Date.now() < deadline) {
      if (daemon.record.exitCode !== null || daemon.record.signal) throw new Error(`Owned Kubo exited during startup: ${daemon.output().stderr}`)
      try { id = await api.id({ timeout: 1000 }); break } catch { await delay(200) }
    }
    if (!id) throw new Blocked('Owned Kubo API did not become available within 45 seconds')
    const stop = async () => {
      if (daemon.child.exitCode === null) daemon.child.kill('SIGTERM')
      await Promise.race([daemon.done, delay(5000)])
      if (daemon.child.exitCode === null && !daemon.child.signalCode) daemon.child.kill('SIGKILL')
      await daemon.done
      if (ownProcesses) { await processes.stop(); await rm(scratch, { recursive: true, force: true }) }
    }
    return { api, id, identity, repo, env, ports, apiUrl, gatewayUrl, rpcAddr: `/ip4/127.0.0.1/tcp/${ports.api}`, peerAddr: `/ip4/127.0.0.1/tcp/${ports.swarm}/p2p/${id.id}`, processes, exec: identity.binary, stop }
  } catch (error) {
    if (daemon?.child.exitCode === null) daemon.child.kill('SIGTERM')
    if (ownProcesses) { await processes.stop(); await rm(scratch, { recursive: true, force: true }) }
    throw error
  }
}
