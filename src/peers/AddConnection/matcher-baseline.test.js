import { multiaddr } from '@multiformats/multiaddr'
import { Circuit, P2P, WebRTC } from '@multiformats/multiaddr-matcher'
import { describe, expect, it } from 'vitest'

// Original host lock: matcher 1.4.0, formerly hoisted via Explorer's
// @helia/block-brokers 4.0.1. Its original is-ip 2.0.2 closure is scoped to this
// matcher; host multiaddr 12.5.1 and multiformats 13.4.0 stay pinned.
// These transport fixtures retain AddConnection's incumbent matcher API.
const peer = 'QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'

describe('incumbent peer address matcher baseline', () => {
  it.each([
    `/dnsaddr/bootstrap.libp2p.io/p2p/${peer}`,
    `/ip4/147.75.109.213/udp/4001/quic/p2p/${peer}`,
    `/ip4/127.0.0.1/tcp/4001/p2p/${peer}`
  ])('preserves peer address acceptance for %s', address => {
    expect(P2P.matches(multiaddr(address))).toBe(true)
  })

  it('preserves circuit and WebRTC address forms', () => {
    const relay = `/ip4/127.0.0.1/tcp/4001/p2p/${peer}/p2p-circuit`
    expect(Circuit.matches(multiaddr(`${relay}/p2p/${peer}`))).toBe(true)
    expect(WebRTC.matches(multiaddr(`${relay}/webrtc/p2p/${peer}`))).toBe(true)
  })

  it('rejects malformed addresses when the pinned parser serializes their wire bytes', () => {
    expect(() => multiaddr('/ip4/not-an-ip/tcp/4001').bytes).toThrow()
    expect(() => multiaddr('/ip4/127.0.0.1/tcp/4001/p2p/invalid').bytes).toThrow()
  })
})
