import React from 'react'

import i18n from '../i18n.js'
import { NavBar } from './NavBar.js'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'NavBar',
  decorators: []
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Default = {
  render: () => (
  <div className="sans-serif vh-100 bg-navy" style={{ width: 156 }}>
    <NavBar
      t={i18n.getFixedT('en', 'status')}
    />
  </div>
  )
}
