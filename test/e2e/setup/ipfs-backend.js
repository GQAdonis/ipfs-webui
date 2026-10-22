// @ts-check
import { startOwnedKubo } from '../../helpers/owned-kubo.mjs'

let ipfsd = null
let ipfs = null

async function run (corsOrigins = []) {
  if (ipfsd != null && ipfs != null) {
    throw new Error('IPFS backend already running')
  }

  ipfsd = await startOwnedKubo({ corsOrigins })
  ipfs = ipfsd.api

  const { id, agentVersion } = await ipfs.id()

  return {
    rpcAddr: ipfsd.rpcAddr,
    id,
    agentVersion,
    apiOpts: {
      host: '127.0.0.1',
      port: ipfsd.ports.api,
      protocol: 'http'
    },
    kuboGateway: {
      host: '127.0.0.1',
      port: ipfsd.ports.gateway,
      protocol: 'http'
    }
  }
}

async function stop () {
  if (ipfsd) {
    await ipfsd.stop()
    ipfsd = null
    ipfs = null
  }
}

export { run, stop }
