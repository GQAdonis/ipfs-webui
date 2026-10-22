// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { classifyAgentOrigin, hasContentPath, mayProbeConsole } from './origin-classification.js'

const CID = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
const KEY = 'k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8'
describe('actual page isolation, independently of gateway hostname popularity', () => {
  it.each(['gateway.example', 'another.invalid', 'ipfs.io', 'localhost:8080', '127.0.0.1:8080'])('blocks shared content paths on %s even with session or host claims', host => {
    for (const namespace of ['ipfs', 'ipns']) {
      const result = classifyAgentOrigin({ href: `http://${host}/${namespace}/${CID}/`, consoleConfigured: true, desktopHosted: true })
      expect(result).toEqual({ allowed: false, kind: 'shared-gateway' })
    }
  })
  it.each([`/proxy/ipfs/${CID}`, '/proxy/ipns/name', `/%69pfs/${CID}`, `/%2569pfs/${CID}`, `/proxy%2fIPFS%2f${CID}`, '/proxy%5cipns%5cname', '/%zz', '/%2525252569pfs/name'])('fails closed for encoded/prefixed/ambiguous shared path %s', pathname => {
    expect(hasContentPath(pathname)).toBe(true)
    expect(classifyAgentOrigin({ href: `https://operator.example${pathname}`, consoleConfigured: true }).allowed).toBe(false)
  })
  it.each(['gateway.example', 'unknown.custom.invalid', 'localhost:8080'])('recognizes actual per-CID separation on any base host %s without granting auth', host => {
    const scheme = host.startsWith('localhost') ? 'http' : 'https'
    const result = classifyAgentOrigin({ href: `${scheme}://${CID}.ipfs.${host}/ipfs/a-content-directory` })
    expect(result).toEqual({ allowed: true, kind: 'isolated-subdomain' })
    expect(result).not.toHaveProperty('authorization')
    expect(result).not.toHaveProperty('trustedContent')
    expect(result).not.toHaveProperty('safeUrl')
  })
  it('recognizes a validated PeerID CID subdomain, without treating arbitrary ipns names as proven isolation', () => {
    expect(classifyAgentOrigin({ href: `https://${KEY}.ipns.any-gateway.example/` })).toEqual({ allowed: true, kind: 'isolated-subdomain' })
    expect(classifyAgentOrigin({ href: 'https://made-up-label.ipns.any-gateway.example/' }).allowed).toBe(false)
  })
  it.each(['https://not-a-cid.ipfs.gateway.example/', `http://${CID}.ipfs.gateway.example/`, 'https://localhost.attacker.example/', 'https://127.0.0.1.attacker.example/', 'http://localhost./'])('does not infer local/isolated trust from %s', href => {
    expect(classifyAgentOrigin({ href }).allowed).toBe(false)
  })
  it.each(['http://localhost:5001/webui/', 'http://127.0.0.1:5001/webui/', 'http://127.20.30.40:5001/', 'http://[::1]:5001/'])('permits a dedicated actual local page %s subject to other authentication', href => {
    expect(classifyAgentOrigin({ href })).toEqual({ allowed: true, kind: 'local' })
  })
  it('requires existing validated console ingress for a dedicated remote HTTPS origin', () => {
    const href = 'https://console.operator.example/app/#/files'
    expect(classifyAgentOrigin({ href })).toEqual({ allowed: false, kind: 'unconfigured-origin' })
    expect(classifyAgentOrigin({ href, consoleConfigured: true })).toEqual({ allowed: true, kind: 'configured-console' })
    expect(classifyAgentOrigin({ href: href.replace('https:', 'http:'), consoleConfigured: true }).allowed).toBe(false)
  })
  it('ignores page-supplied trust assertions and saved URL lookalikes', () => {
    expect(classifyAgentOrigin({ href: 'https://arbitrary.example/?trusted=true&safeOrigin=http://localhost:5001', trusted: true, endpoint: 'http://localhost:5001/agui', gateway: 'http://localhost:8080' }).allowed).toBe(false)
    expect(classifyAgentOrigin({ href: `https://arbitrary.example/ipfs/${CID}/?trust=local`, consoleConfigured: true }).allowed).toBe(false)
  })
  it.each(['data:text/html,x', 'javascript:void(0)', 'https://user:secret@console.example/', 'not-a-url'])('refuses invalid/opaque/credentialed origin %s', href => {
    expect(classifyAgentOrigin({ href, consoleConfigured: true, desktopHosted: true }).allowed).toBe(false)
  })
  it('consumes the existing Desktop host only for its file page, never an arbitrary remote page flag', () => {
    expect(classifyAgentOrigin({ href: 'file:///app/webui/index.html', desktopHosted: true })).toEqual({ allowed: true, kind: 'desktop' })
    expect(classifyAgentOrigin({ href: 'file:///app/webui/index.html' }).allowed).toBe(false)
    expect(classifyAgentOrigin({ href: 'https://arbitrary.example/', desktopHosted: true }).allowed).toBe(false)
  })
  it('allows only isolated/dedicated same-origin session discovery, not shared-path bootstrap', () => {
    expect(mayProbeConsole('https://console.operator.example/')).toBe(true)
    expect(mayProbeConsole(`https://${CID}.ipfs.gateway.example/`)).toBe(true)
    expect(mayProbeConsole(`http://localhost:8080/ipfs/${CID}/`)).toBe(false)
    expect(mayProbeConsole('https://arbitrary.example/proxy/%69pns/name/')).toBe(false)
    expect(mayProbeConsole('file:///app/index.html')).toBe(false)
  })
})
