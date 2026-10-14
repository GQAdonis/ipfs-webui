import React from 'react'
import { ErrIcon } from '../icons.js'

/**
 * Join the ids of the help and error elements that exist into one
 * `aria-describedby` value, or undefined when there are none.
 *
 * @param {...(string | false | null | undefined)} ids
 * @returns {string | undefined}
 */
export const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined

/**
 * Help and error text under a control. Both carry the ids that the control's
 * `aria-describedby` points at. The error line has an icon and a hidden
 * "Error" word, so state never rests on colour alone.
 *
 * @param {Object} props
 * @param {string} props.helpId
 * @param {string} props.errorId
 * @param {React.ReactNode} [props.help]
 * @param {React.ReactNode} [props.error]
 * @param {string} [props.errorLabel]
 */
export const FieldMeta = ({ helpId, errorId, help, error, errorLabel = 'Error' }) => (
  <>
    {help ? <p id={helpId} className='pm-help'>{help}</p> : null}
    {error
      ? (
        <p id={errorId} className='pm-error'>
          <ErrIcon size={16} />
          <span><span className='pm-sr-only'>{errorLabel}: </span>{error}</span>
        </p>
        )
      : null}
  </>
)
