import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import * as icons from './icons.js'

describe('promethity icons (M11)', () => {
  it('renders a decorative Lucide stroke with the prom-icon class and no fill or viewBox override', () => {
    const { container } = render(<icons.CloseIcon className='fill-gray w2' fill='currentColor' viewBox='10 10 80 80' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('prom-icon', 'fill-gray', 'w2')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('also marks the original nav and settings icons as prom-icon, so fill-* classes never paint them solid', () => {
    const { container } = render(<icons.FolderIcon className='fill-aqua' />)
    expect(container.querySelector('svg')).toHaveClass('prom-icon', 'fill-aqua')
  })

  it('exports an icon for every upstream glyph the app used', () => {
    for (const name of ['CloseIcon', 'DotsIcon', 'PencilIcon', 'DownloadIcon', 'PublishIcon', 'TrashIcon', 'PinCloudIcon', 'PinnedIcon', 'ExternalLinkIcon', 'CopyIcon', 'ShareIcon', 'LabIcon', 'IpldIcon', 'NetworkIcon', 'CubeIcon', 'AttentionIcon', 'GenericFileIcon', 'VideoFileIcon', 'SpreadsheetFileIcon', 'AudioFileIcon', 'ImageFileIcon', 'TextFileIcon', 'ListViewIcon', 'GridViewIcon', 'ExpandChevronIcon']) {
      expect(typeof icons[name]).toBe('function')
    }
  })
})
