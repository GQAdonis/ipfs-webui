import { action } from 'storybook/actions'
import RemoveModal from './RemoveModal.js'

/**
 * @type {import('@storybook/react-vite').Meta}
 */
export default {
  title: 'Files/Modals',
  component: RemoveModal,
  args: {
    onCancel: action('Cancel'),
    onSubmit: action('Submit'),
    filesCount: 4,
    foldersCount: 0,
    files: [
      {
        cid: 'QmQK3p7MmycDutWkWAzJ4hNN1YBKK9bLTDz9jTtkWf16wC',
        pinned: false
      },
      {
        cid: 'QmQK3p7MmycDutWkWAzJ4hNN1YBKK9bLTDz9jTtkWf16wC',
        pinned: false
      },
      {
        cid: 'QmQK3p7MmycDutWkWAzJ4hNN1YBKK9bLTDz9jTtkWf16wC',
        pinned: false
      },
      {
        cid: 'QmQK3p7MmycDutWkWAzJ4hNN1YBKK9bLTDz9jTtkWf16wC',
        pinned: false
      }
    ]
  }
}

/**
 * @type {import('@storybook/react-vite').StoryObj}
 */
export const Remove = {}
