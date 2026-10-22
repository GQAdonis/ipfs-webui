// @ts-check
import FilesExploreForm from './files-explore-form'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Files/Explore Form',
  component: FilesExploreForm,
  argTypes: {
    onBrowse: { action: 'Browse' },
    onInspect: { action: 'Inspect' }
  }
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Default = {}
