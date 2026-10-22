import React from 'react'
import { action } from 'storybook/actions'

import Checkbox from './Checkbox.js'

const bigPicture = {
  transform: 'scale(5)',
  transformOrigin: 'top left'
}

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Checkbox'
}

/**
 * @type {import('@storybook/react-vite').StoryFn}
 */
export const Default = () => (
  <div>
    <Checkbox className="ma2" label="Click me!" onChange={action('Checked')} />
  </div>
)

/**
 * @type {import('@storybook/react-vite').StoryFn}
 */
export const Disabled = () => (
  <div>
    <Checkbox label="Click me!" className="ma2" disabled onChange={action('Checked')} />
  </div>
)

/**
 * @type {import('@storybook/react-vite').StoryFn}
 */
export const Big = () => (
  <div>
    <Checkbox style={bigPicture} label="Click me!" className="ma2" onChange={action('Checked')} />
  </div>
)
