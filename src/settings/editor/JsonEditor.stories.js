// Components
import { JsonEditor } from './JsonEditor.js'

// Fixtures
import config from './fixtures/example-config.json'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'JSON Editor',
  component: JsonEditor,
  args: {
    value: JSON.stringify(config, null, 2),
    readOnly: false
  }
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Default = {}
