// Type only description of the retained prop-types runtime metadata used by WebUI.
// React 19 does not execute function-component propTypes; runtime validators remain unchanged.
declare module 'prop-types' {
  import type { ReactNode } from 'react'
  export interface Validator<T> {
    (props: Record<string, unknown>, propName: string, componentName: string, location: string, propFullName: string): Error | null
    readonly isRequired: Validator<NonNullable<T>>
  }
  const PropTypes: {
    string: Validator<string>
    node: Validator<ReactNode>
    bool: Validator<boolean>
    object: Validator<object>
    func: Validator<(...args: unknown[]) => unknown>
    oneOfType: (validators: ReadonlyArray<Validator<unknown>>) => Validator<unknown>
  }
  export default PropTypes
}
