import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Switch } from '../promethity/components/index.js'
import { updateSettings } from './settings-store.js'
import { useSearchSettings } from './use-search-settings.js'

/**
 * The off switch for search (`search.enabled`). A settings page mounts it
 * wherever its other agent switches are. Turning it off hides the Search entry,
 * redirects #/search and stops every request to /index/*.
 *
 * @param {{ onText?: string, offText?: string }} props the state words, when the page shows them
 */
const SearchSettingsSwitch = ({ onText, offText }) => {
  const { t } = useTranslation('search')
  const { enabled } = useSearchSettings()
  return (
    <Switch
      checked={enabled}
      onChange={(next) => updateSettings({ enabled: next })}
      label={t('settings.label')}
      help={t('settings.help')}
      onText={onText}
      offText={offText}
    />
  )
}

SearchSettingsSwitch.propTypes = { onText: PropTypes.string, offText: PropTypes.string }

export default SearchSettingsSwitch
