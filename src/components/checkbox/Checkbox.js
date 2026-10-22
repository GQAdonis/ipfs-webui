import React from 'react'
import PropTypes from 'prop-types'
import { CheckIcon as Tick } from '../../promethity/icons.js'
import './Checkbox.css'

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 * @param {React.Ref<HTMLInputElement>} [props.ref]
 * @param {React.ReactNode} [props.label]
 * @param {boolean} [props.disabled]
 * @param {boolean | null} [props.checked]
 * @param {(arg0: boolean) => void} props.onChange
 * @returns {React.ReactElement}
 */
const Checkbox = ({ className = '', style, label = '', disabled = false, checked = false, onChange = () => {}, ref, ...props }) => {
  className = `Checkbox dib sans-serif ${className}`
  if (!disabled) {
    className += ' pointer'
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const change = (event) => {
    onChange(event.target.checked)
  }

  return (
    <label className={className} style={style}>
      <input {...props} ref={ref} className='absolute' type='checkbox' checked={Boolean(checked)} disabled={disabled} onChange={change} />
      <span className='dib v-mid br1 w1 h1 pointer'>
        <Tick className='w1 h1 o-0' />
      </span>
      {Boolean(label) && <span className='v-mid pl2'>
        {label}
      </span>}
    </label>
  )
}

Checkbox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func
}

export default Checkbox
