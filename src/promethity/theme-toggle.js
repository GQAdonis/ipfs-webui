import React from 'react'
import PropTypes from 'prop-types'
import { THEMES, setTheme } from './theme.js'
import { useTheme } from './use-theme.js'
import './theme-toggle.css'

const DEFAULT_LABELS = Object.freeze({
  group: 'Theme',
  system: 'System',
  dark: 'Dark',
  light: 'Light'
})

/**
 * The D16 theme choice: System, Dark or Light. A native radio group (APG
 * pattern), so arrow keys move between options and the checked state is
 * announced. Labels default to English; pass translated strings when
 * mounting. Every colour comes from tokens.css variables.
 */
const ThemeToggle = ({ labels = DEFAULT_LABELS }) => {
  const { theme } = useTheme()
  return (
    <div className='pm-theme-toggle' role='radiogroup' aria-label={labels.group ?? DEFAULT_LABELS.group}>
      {THEMES.map((option) => (
        <label key={option} className='pm-theme-toggle-option'>
          <input
            type='radio'
            name='pm-theme'
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          <span data-checked={theme === option ? '' : undefined}>{labels[option] ?? option}</span>
        </label>
      ))}
    </div>
  )
}

ThemeToggle.propTypes = {
  labels: PropTypes.shape({
    group: PropTypes.string,
    system: PropTypes.string,
    dark: PropTypes.string,
    light: PropTypes.string
  })
}

export default ThemeToggle
