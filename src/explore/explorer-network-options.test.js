import { afterEach, expect, it, vi } from 'vitest'
import initHelia from '../../vendor/ipld-explorer-components/src/lib/init-helia.js'

const { create, localRouter, remoteRouter, broker } = vi.hoisted(() => ({ create: vi.fn(), localRouter: vi.fn(), remoteRouter: vi.fn(), broker: vi.fn() }))
vi.mock('../../vendor/ipld-explorer-components/node_modules/@helia/http/dist/src/index.js', () => ({ createHeliaHTTP: create }))
vi.mock('../../vendor/ipld-explorer-components/node_modules/@helia/routers/dist/src/index.js', () => ({ httpGatewayRouting: localRouter, delegatedHTTPRouting: remoteRouter }))
vi.mock('../../vendor/ipld-explorer-components/node_modules/@helia/block-brokers/dist/src/index.js', () => ({ trustlessGateway: broker }))
vi.mock('../../vendor/ipld-explorer-components/src/lib/hash-importer.js', () => ({ getHashersForCodes: vi.fn().mockResolvedValue([]) }))
vi.mock('../../vendor/ipld-explorer-components/src/lib/helpers.js', () => ({ addDagNodeToHelia: vi.fn().mockResolvedValue(undefined) }))
afterEach(() => { localStorage.removeItem('explore.ipld.gatewayEnabled'); vi.clearAllMocks() })

it('keeps the existing remote-gateway off switch effective and forwards local trustless options', async () => {
  localStorage.setItem('explore.ipld.gatewayEnabled', 'false')
  const node = {}
  const router = {}
  const blockBroker = {}
  create.mockResolvedValueOnce(node)
  localRouter.mockReturnValueOnce(router)
  broker.mockReturnValueOnce(blockBroker)
  const options = { allowLocal: true, allowInsecure: true }
  expect(await initHelia({ host: '127.0.0.1', port: '19080', protocol: 'http', trustlessBlockBrokerConfig: { init: options } })).toBe(node)
  expect(localRouter).toHaveBeenCalledExactlyOnceWith({ gateways: ['http://127.0.0.1:19080/'] })
  expect(remoteRouter).not.toHaveBeenCalled()
  expect(broker).toHaveBeenCalledExactlyOnceWith(options)
  expect(create).toHaveBeenCalledExactlyOnceWith({ routers: [router], blockBrokers: [blockBroker], hashers: [] })
})
