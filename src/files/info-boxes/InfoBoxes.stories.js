// @ts-check
import InfoBoxes from './InfoBoxes.js'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Files/Info Boxes/InfoBoxes',
  component: InfoBoxes,
  args: {
    isRoot: true,
    isCompanion: true,
    filesExist: true
  }
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Default = {
  name: 'InfoBoxes'
}
