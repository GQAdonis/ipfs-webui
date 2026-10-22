// Stable assertion slots supplement, never replace, the adopted scenario oracles.
// Every missing slot remains BLOCKED; fixture and live-collaborator evidence stay distinct.
export const adoptedIdentity = Object.freeze({ projectId: 'b7047aa1-816d-44d2-8455-63814b788cec', runId: 'agentic-ui-implementation-20261020T225138Z', phaseId: 'agentic-ui-frontend', planRevision: 3, contractDigest: '0bb947b45989f4c01ef61d93ae86713e7b48847f3ac332f01f565452d012a257' })
export const adoptedContractSha256 = '66628c6f77fae20a7c950b1d5f6903e83e231492515488830aea326783bb37fb'
export const adoptedDigest = adoptedIdentity.contractDigest
export const contractRelativePath = '.kbd-orchestrator/phases/agentic-ui-frontend/adopted-contract.json'
export const requirements = {
  'UI-101': ['artifact-freshness', 'artifact-negative-controls', 'react-runtime', 'store-disposal', 'production-relative-routes'],
  'UI-102': ['role-parity', 'role-contrast', 'local-fonts', 'immutable-token-baseline'],
  'UI-103': ['eleven-presentations', 'successful-receipt-only', 'failure-and-uncertainty'],
  'UI-104': ['digest-and-identity-binding', 'exactly-once', 'native-deny-only'],
  'UI-105': ['composer-modes', 'draft-and-back', 'phone-navigation', 'suggestion-negative'],
  'UI-106': ['five-a2ui-views', 'external-sdk-host', 'origin-correlation-negative', 'inert-fallback'],
  'UI-107': ['identity-snapshot', 'idle-feed-reconcile', 'bounded-history', 'observation-no-authority'],
  'UI-108': ['reference-removal', 'both-backend-context', 'effective-run-facts', 'untrusted-framing'],
  'UI-109': ['shared-origin-guard', 'cid-copy-and-warning', 'no-implicit-fetch'],
  'UI-110': ['desktop-split-queues', 'native-focus-arm', 'ipc-csp-negative', 'native-hardware'],
  'UI-111': ['builtin-read-approve-deny', 'uar-read-approve-deny', 'backend-delay-disconnect-negative'],
  'UI-112': ['viewport-theme-matrix', 'keyboard-and-focus', 'axe', 'reduced-motion'],
  'UI-113': ['kubo-cli-families', 'documented-off-switches'],
  'UI-114': ['files-upload-hierarchy', 'files-rename-download-remove', 'files-move-copy', 'pins-real-controls', 'upload-cancellation', 'virtual-keyboard-selection', 'native-modal'],
  'UI-115': ['explore-dag-codecs', 'peer-local-connection', 'diagnostics-real-status', 'settings-edit-restore', 'locale-theme-reload'],
  'UI-116': ['authoritative-projection', 'one-controlled-composer', 'no-upload-or-execution', 'generation-retirement'],
  'UI-117': ['exact-entity-trio', 'generation-epoch-isolation', 'live-reconciliation', 'no-authority-or-persistence'],
  'UI-118': ['source-provenance', 'browser-overlays', 'shadow-overlays', 'iframe-overlays', 'desktop-shell-overlays']
}

export const requiredCollaborators = Object.freeze(['browser', 'fixture-browser', 'daemon', 'builtin', 'uar'])
export function validateRegistrations (registrations, scenarios) {
  const known = new Set(scenarios.map(item => item.id))
  const keys = new Set()
  for (const entry of registrations) {
    const key = `${entry.scenario}/${entry.id}`
    if (!known.has(entry.scenario) || !requirements[entry.scenario]?.includes(entry.id)) throw new Error(`Unknown boundary assertion slot: ${key}`)
    if (keys.has(key)) throw new Error(`Duplicate boundary assertion slot: ${key}`)
    if (typeof entry.run !== 'function' || !Array.isArray(entry.requires)) throw new Error(`Incomplete registration: ${key}`)
    if (entry.requires.some(value => !requiredCollaborators.includes(value))) throw new Error(`Unknown boundary collaborator: ${key}`)
    keys.add(key)
  }
  for (const scenario of known) if (!requirements[scenario]?.length) throw new Error(`Adopted scenario has no assertion requirements: ${scenario}`)
}

export function aggregate (checks) {
  if (!checks.length) return 'BLOCKED'
  if (checks.some(item => item.status === 'FAIL')) return 'FAIL'
  if (checks.some(item => item.status === 'BLOCKED')) return 'BLOCKED'
  if (checks.some(item => item.status === 'NOT_EXERCISED')) return 'NOT_EXERCISED'
  return checks.every(item => item.status === 'PASS') ? 'PASS' : 'BLOCKED'
}
