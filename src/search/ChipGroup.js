import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useStableId } from '../promethity/components/use-stable-id.js'
import { CheckIcon } from '../promethity/icons.js'

/**
 * A group of toggle buttons for a multi-select filter. Each chip is a real
 * button with `aria-pressed`; Tab moves between chips and Space or Enter
 * toggles. The pressed state is also visible without colour: a check mark and
 * weight 600 beside the accent tint.
 *
 * @param {Object} props
 * @param {string} props.legend the group's accessible name
 * @param {{ value: string, label: string }[]} props.options
 * @param {readonly string[]} props.selected
 * @param {(value: string) => void} props.onToggle
 */
const ChipGroup = ({ legend, options, selected, onToggle }) => {
  const labelId = useStableId('sr-chips')
  return (
    <div className='sr-chipgroup' role='group' aria-labelledby={labelId}>
      <span id={labelId} className='sr-chipgroup-legend'>{legend}</span>
      <div className='sr-chips'>
        {options.map((option) => {
          const pressed = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type='button'
              className={classNames('sr-chip', pressed && 'sr-chip-on')}
              aria-pressed={pressed}
              onClick={() => onToggle(option.value)}
            >
              {pressed ? <CheckIcon aria-hidden='true' /> : null}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

ChipGroup.propTypes = {
  legend: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired
}

export default ChipGroup
