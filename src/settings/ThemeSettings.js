import React from 'react'
import PropTypes from 'prop-types'
import Title from './Title.js'
import ThemeToggle from '../promethity/theme-toggle.js'

/**
 * The D16 theme choice (wrapped in a Box by SettingsPage, where it is the first section): System, Dark or Light,
 * persisted by the theme store (src/promethity/theme.js). `t` is the settings
 * namespace translation function.
 *
 * @param {{ t: import('i18next').TFunction }} props
 */
const ThemeSettings = ({ t }) => (
  <div className='lh-copy charcoal'>
    <Title>{t('theme.title')}</Title>
    <p className='f6 mt0 mb3'>{t('theme.description')}</p>
    <ThemeToggle
      labels={{
        group: t('theme.title'),
        system: t('theme.system'),
        dark: t('theme.dark'),
        light: t('theme.light')
      }} />
  </div>
)

ThemeSettings.propTypes = {
  t: PropTypes.func.isRequired
}

export default ThemeSettings
