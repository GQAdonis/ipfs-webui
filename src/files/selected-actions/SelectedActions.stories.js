import React from 'react'
import { action } from 'storybook/actions'
import i18n from '../../i18n-decorator.js'
import SelectedActions from './SelectedActions.js'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Files',
  decorators: [i18n]
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const _SelectedActions = (args) => (
  <div className="ma3">
    <SelectedActions
      className="mb4"
      count={args.count}
      size={345345}
      unselect={action('Unselect All')}
      remove={action('Remove Files')}
      share={action('Share Files')}
      download={action('Download Files')}
      rename={action('Rename Files')}
      inspect={action('Inspect Files')}
    />
  </div>
)

_SelectedActions.args = { count: 1 }
_SelectedActions.argTypes = { count: { control: { type: 'number', min: 0 } } }
