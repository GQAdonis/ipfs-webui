/**
 * The sentence for a failed settings request. The copy is fixed per kind; the
 * server's own sentence (a plain-text 400 that names the missing settings
 * directory, for instance) is appended as quoted detail only for the HTTP kind.
 *
 * @param {import('i18next').TFunction} t
 * @param {import('./core/form.js').Failure | undefined} failure
 * @param {{ host?: string }} [values]
 */
export function failureText (t, failure, values = {}) {
  if (!failure) return ''
  const base = t(`failure.${failure.kind}`, { ...values, defaultValue: t('failure.generic') })
  return (failure.kind === 'http' || failure.kind === 'unavailable') && failure.detail ? `${base} ${t('failure.serverSaid', { detail: failure.detail })}` : base
}
