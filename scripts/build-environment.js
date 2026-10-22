import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// Only public values consumed by the application may cross the build boundary.
export function buildEnvironment (env, mode) {
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  let revision = env.REACT_APP_GIT_REV
  if (!revision) {
    try {
      revision = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
        cwd: new URL('..', import.meta.url), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
      }).trim()
    } catch {
      revision = 'unknown'
    }
  }
  return {
    NODE_ENV: mode === 'production' ? 'production' : mode === 'test' ? 'test' : 'development',
    REACT_APP_ENV: env.REACT_APP_ENV || mode,
    REACT_APP_VERSION: env.REACT_APP_VERSION || version,
    REACT_APP_GIT_REV: revision,
    PUBLIC_URL: '.',
    DEBUG: env.DEBUG === 'true' || env.DEBUG === '1'
  }
}

export function environmentDefines (values) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]))
}
