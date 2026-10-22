import React from 'react'
import { action } from 'storybook/actions'
import i18n from '../../../i18n-decorator.js'
import AddByCarModal from './AddByCarModal'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Files/Modals',
  decorators: [i18n]
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const AddCar = () => (
  <div className="ma3">
    <AddByCarModal onCancel={action('Cancel')} onSubmit={action('Submit')} />
  </div>
)
