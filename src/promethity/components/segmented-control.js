import React from 'react'
import classNames from 'classnames'
import { useStableId } from './use-stable-id.js'
import { FieldMeta, describedBy } from './describe.js'
import './primitives.css'

/**
 * One choice from a short list, shown as joined segments. Native radios under
 * a fieldset (APG radio group): arrow keys move and select, Tab leaves the
 * group, and the checked state is announced. The checked segment follows the
 * active-tab rule (accent-text, weight 600).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.label the group's accessible name (a legend)
 * @param {{ value: string, label: React.ReactNode, disabled?: boolean }[]} props.options
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {React.ReactNode} [props.help]
 * @param {React.ReactNode} [props.error]
 * @param {string} [props.errorLabel]
 * @param {boolean} [props.disabled]
 * @param {string} [props.name]
 * @param {string} [props.className]
 */
export const SegmentedControl = ({
  label, options, value, onChange, help, error, errorLabel, disabled, name, className
}) => {
  const base = useStableId('pm-segmented')
  const helpId = `${base}-help`
  const errorId = `${base}-error`
  const groupName = name ?? base

  return (
    <fieldset
      className={classNames('pm-segmented-field', className)}
      role='radiogroup'
      disabled={disabled}
      aria-describedby={describedBy(Boolean(help) && helpId, Boolean(error) && errorId)}
      aria-invalid={error ? true : undefined}
    >
      <legend className='pm-label'>{label}</legend>
      <div className='pm-segmented'>
        {options.map((option) => (
          <label key={option.value} className='pm-segmented-option'>
            <input
              type='radio'
              name={groupName}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
            />
            <span data-checked={value === option.value ? '' : undefined}>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldMeta helpId={helpId} errorId={errorId} help={help} error={error} errorLabel={errorLabel} />
    </fieldset>
  )
}
