import { reportUnauthorized } from '../agent-chat/session.js'

/**
 * The async resource bundles (peers, bandwidth, repo stats, config, ...) report a failed fetch as
 * `<BASE>_FETCH_FAILED` with the error on the action. In console session mode a 401 there means the
 * sign-in ended, so it raises "Sign in again" like every other same-origin call. Outside session mode
 * `reportUnauthorized` does nothing, so token mode is unchanged. The action always passes through.
 */
const sessionUnauthorizedBundle = {
  name: 'sessionUnauthorized',
  getMiddleware: () => () => next => action => {
    if (typeof action?.type === 'string' && action.type.endsWith('_FETCH_FAILED')) {
      reportUnauthorized(action.error ?? action.payload?.error)
    }
    return next(action)
  }
}

export default sessionUnauthorizedBundle
