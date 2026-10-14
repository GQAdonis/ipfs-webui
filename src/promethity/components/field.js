import React, { createContext, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { useStableId } from './use-stable-id.js'
import { FieldMeta, describedBy } from './describe.js'
import './primitives.css'

/**
 * @typedef {Object} FieldControlProps
 * @property {string} [id]
 * @property {string} [labelId]
 * @property {string} [aria-describedby]
 * @property {boolean} [aria-invalid]
 * @property {boolean} [aria-required]
 */

const FieldContext = createContext(/** @type {FieldControlProps | null} */ (null))

/**
 * The accessibility props the control inside a Field must apply: the id the
 * label points at (and `labelId`, for a popup that needs the same name),
 * `aria-describedby` for help and error, and the invalid and required flags. Outside a Field it returns nothing, so a control can be used
 * standalone with its own `aria-label`.
 *
 * @returns {FieldControlProps}
 */
export const useFieldControl = () => useContext(FieldContext) ?? {}

/**
 * Label, control, help and error as one unit. The control is any child that
 * spreads `useFieldControl()`: `FieldInput`, `Combobox`, or a custom one.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.label
 * @param {React.ReactNode} [props.help]
 * @param {React.ReactNode} [props.error]
 * @param {string} [props.errorLabel] the hidden word read before the error text
 * @param {boolean} [props.required]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export const Field = ({ label, help, error, errorLabel, required, className, children }) => {
  const base = useStableId('pm-field')
  const controlId = `${base}-control`
  const labelId = `${base}-label`
  const helpId = `${base}-help`
  const errorId = `${base}-error`
  const hasHelp = Boolean(help)
  const hasError = Boolean(error)

  const control = useMemo(() => ({
    id: controlId,
    labelId,
    'aria-describedby': describedBy(hasHelp && helpId, hasError && errorId),
    'aria-invalid': hasError || undefined,
    'aria-required': required || undefined
  }), [controlId, labelId, helpId, errorId, hasHelp, hasError, required])

  return (
    <div className={classNames('pm-field', className)}>
      <label id={labelId} htmlFor={controlId} className='pm-label'>{label}</label>
      <FieldContext.Provider value={control}>{children}</FieldContext.Provider>
      <FieldMeta helpId={helpId} errorId={errorId} help={help} error={error} errorLabel={errorLabel} />
    </div>
  )
}

/**
 * A text input wired to its Field. Pass `type`, `value`, `onChange` and the
 * rest like a native input.
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props
 */
export const FieldInput = ({ className, ...props }) => {
  const { id, 'aria-describedby': describedByIds, 'aria-invalid': invalid, 'aria-required': required } = useFieldControl()
  return (
    <input
      className={classNames('pm-input', className)}
      id={id}
      aria-describedby={describedByIds}
      aria-invalid={invalid}
      aria-required={required}
      {...props}
    />
  )
}
