import React from 'react'

import { action } from 'storybook/actions'
import i18n from '../i18n.js'
import { SettingsPage } from './SettingsPage.js'
import i18nDecorator from '../i18n-decorator.js'
import config from './editor/fixtures/example-config.json'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Settings Page',
  decorators: [i18nDecorator]
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Default = (args) => (
  <div className="sans-serif">
    <SettingsPage
      t={i18n.getFixedT('en', 'settings')}
      isLoading={args.isLoading}
      isSaving={args.isSaving}
      hasSaveFailed={args.hasSaveFailed}
      hasSaveSucceded={args.hasSaveSucceded}
      hasErrors={args.hasErrors}
      hasLocalChanges={args.hasLocalChanges}
      hasExternalChanges={args.hasExternalChanges}
      config={JSON.stringify(config, null, 2)}
      editorKey={Date.now()}
      onChange={action('change')}
      onReset={action('reset')}
      onSave={action('save')}
    />
  </div>
)

Default.args = { isLoading: false, isSaving: false, hasSaveFailed: false, hasSaveSucceded: false, hasErrors: false, hasLocalChanges: true, hasExternalChanges: false }
Default.argTypes = { isLoading: { control: 'boolean' }, isSaving: { control: 'boolean' }, hasSaveFailed: { control: 'boolean' }, hasSaveSucceded: { control: 'boolean' }, hasErrors: { control: 'boolean' }, hasLocalChanges: { control: 'boolean' }, hasExternalChanges: { control: 'boolean' } }
