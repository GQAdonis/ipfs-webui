// Type surface of use-availability.js for the typechecked NavBar. The implementation
// (and the agent-chat stores it reads) are checked by the Jest suites; declaring it here
// keeps the typecheck from pulling the whole agent-chat store chain into this project.
export type AvailabilityPhase = 'disabled' | 'unconnected' | 'checking' | 'available' | 'unconfigured' | 'denied'

export interface SearchAvailability {
  phase: AvailabilityPhase
  status: unknown
  error: unknown
  connection: 'none' | 'no-endpoint' | 'no-token' | 'ready'
  /** Whether the navigation entry shows. */
  visible: boolean
  refresh: () => Promise<void>
}

export function useSearchAvailability(): SearchAvailability
