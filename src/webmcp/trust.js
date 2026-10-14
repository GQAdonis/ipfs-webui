// Is this event a real user activation? Script that calls `element.click()` or dispatches
// an event produces `isTrusted === false`; a pointer press or key press by a person
// produces true. The approval dialog acts on Approve only for trusted events. This is a
// separate module so tests can stand in for a real press (jsdom has none).
//
// It is an accident and automation-by-script check, not a boundary: a host that drives the
// browser through the debugging protocol produces trusted events too (ADR-0002, R13).

/** @param {{ nativeEvent?: { isTrusted?: boolean }, isTrusted?: boolean }} event */
export function isTrustedEvent (event) {
  return (event.nativeEvent ?? event).isTrusted === true
}
