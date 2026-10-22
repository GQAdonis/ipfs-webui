import { decodeContextRoute, validateContextReferences } from '@gqadonis/ipfs-agent-chat/react'

export const PAGE_REFERENCE_ID = 'page_current'

/** The hash route is decoded once; known Files/Explore suffixes describe node paths only. */
export function pageReferenceFromRoute (rawRoute) {
  const decoded = decodeContextRoute(rawRoute === '' ? '/' : rawRoute)
  if (!decoded.ok) return decoded
  const { route } = decoded
  const reference = { id: PAGE_REFERENCE_ID, provenance: 'page', route }
  if (route === '/files' || route.startsWith('/files/')) {
    reference.path = route.slice('/files'.length) || '/'
    reference.path_kind = /^\/(ipfs|ipns)\//.test(reference.path) ? 'ipfs' : 'mfs'
  } else if (/^\/explore\/(ipfs|ipns)\//.test(route)) {
    reference.path = route.slice('/explore'.length)
    reference.path_kind = 'ipfs'
  }
  return validateContextReferences([reference])
}

/** One synchronous route author per existing controller. No subscription, transport or teardown.
 * Remembering the route separately from selected chips keeps removal/send/off suppression intact. */
export function createPageReferenceAdapter ({ controller }) {
  let previousRoute = Symbol('initial-page-route')
  return Object.freeze({
    update ({ route, enabled }) {
      controller.setContextReferencesEnabled(enabled === true)
      if (route === previousRoute) return
      previousRoute = route
      if (!enabled || controller.getSnapshot().disposed) return
      const candidate = pageReferenceFromRoute(route)
      const other = controller.getSnapshot().references.filter(reference => reference.id !== PAGE_REFERENCE_ID)
      if (!candidate.ok) { controller.removeReference(PAGE_REFERENCE_ID); return }
      const checked = validateContextReferences([...other, ...candidate.references])
      if (!checked.ok) { controller.removeReference(PAGE_REFERENCE_ID); return }
      controller.setReferences(checked.references)
    }
  })
}
