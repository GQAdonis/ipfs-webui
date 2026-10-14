import React from 'react'
import classNames from 'classnames'
import { useStableId } from './use-stable-id.js'
import { FieldMeta, describedBy } from './describe.js'
import './primitives.css'

/**
 * An on/off setting that applies as soon as it is chosen in its form. A
 * button with `role="switch"` (APG switch pattern): Space and Enter toggle it,
 * and the label is a real `<label>` so a click on the text toggles it too.
 * State is also a visible word, not only a thumb position.
 *
 * @param {Object} props
 * @param {boolean} props.checked
 * @param {(next: boolean) => void} props.onChange
 * @param {React.ReactNode} props.label
 * @param {React.ReactNode} [props.help]
 * @param {React.ReactNode} [props.error]
 * @param {string} [props.errorLabel]
 * @param {boolean} [props.disabled]
 * @param {string} [props.onText]
 * @param {string} [props.offText]
 * @param {string} [props.className]
 */
export const Switch = ({
  checked, onChange, label, help, error, errorLabel, disabled, onText = 'On', offText = 'Off', className
}) => {
  const base = useStableId('pm-switch')
  const labelId = `${base}-label`
  const helpId = `${base}-help`
  const errorId = `${base}-error`

  return (
    <div className={classNames('pm-switch', className)}>
      <div className='pm-switch-row'>
        <button
          type='button'
          role='switch'
          id={base}
          className='pm-switch-track'
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-describedby={describedBy(Boolean(help) && helpId, Boolean(error) && errorId)}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          onClick={() => onChange(!checked)}
        >
          <span className='pm-switch-thumb' />
        </button>
        <label id={labelId} htmlFor={base} className='pm-switch-label'>{label}</label>
        <span className='pm-switch-state' aria-hidden='true'>{checked ? onText : offText}</span>
      </div>
      <FieldMeta helpId={helpId} errorId={errorId} help={help} error={error} errorLabel={errorLabel} />
    </div>
  )
}
