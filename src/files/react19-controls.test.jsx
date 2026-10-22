import { useImperativeHandle } from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DndProvider } from 'react-dnd'
import { TestBackend } from 'react-dnd-test-backend'
import { FilesList } from './files-list/FilesList.js'
import { FilesGrid } from './files-grid/files-grid.js'

const { scrollToRow } = vi.hoisted(() => ({ scrollToRow: vi.fn() }))
vi.mock('../lib/react-store.js', () => ({ connect: (...args) => args.at(-1) }))
vi.mock('react-i18next', () => ({
  withTranslation: () => Component => props => <Component {...props} t={props.t || ((key, options) => options?.name ? `${key}:${options.name}` : key)} />,
  useTranslation: () => ({ t: key => key }),
  Trans: ({ children }) => children
}))
// Layout/window virtualization is covered by files-react19.test.js in a real
// browser. This adapter exposes the same row/focus API for operation scenarios.
vi.mock('react-virtualized', () => ({
  List: ({ ref, rowCount, rowRenderer, noRowsRenderer }) => {
    useImperativeHandle(ref, () => ({ scrollToRow, forceUpdateGrid: () => {} }), [])
    return rowCount ? Array.from({ length: rowCount }, (_, index) => rowRenderer({ index, key: String(index), style: {} })) : noRowsRenderer()
  }
}))

const cid = { toString: () => 'bafkqac3imvwgy3zao5xxe3de' }
const files = ['visible.txt', 'hidden.txt'].map(name => ({ name, cid, path: `/fixture/${name}`, size: 12, type: 'file' }))
const t = (key, options) => options?.name ? `${key}:${options.name}` : key
function props (overrides = {}) {
  return {
    files, pins: [], selected: [], filesPathInfo: { isMfs: true, isRoot: false },
    filesSorting: { by: 'name', asc: true }, t,
    onSelect: vi.fn(), onRemove: vi.fn(), onRename: vi.fn(), onNavigate: vi.fn(),
    onAddFiles: vi.fn(), onMove: vi.fn(), onSetPinning: vi.fn(), onInspect: vi.fn(),
    doDismissFailedPin: vi.fn(), handleContextMenuClick: vi.fn(), updateSorting: vi.fn(),
    ...overrides
  }
}

for (const [mode, View] of [['list', FilesList], ['grid', FilesGrid]]) {
  describe(`React 19 Files ${mode} controls`, () => {
    it('checks visible membership for select-all and retains hidden selections for Delete', () => {
      const operations = props({ selected: ['hidden.txt'], showSearch: true, filterRef: { current: 'visible' } })
      const view = render(<DndProvider backend={TestBackend}><View {...operations} /></DndProvider>)
      expect(screen.getByRole('checkbox', { name: 'selectAllEntries' })).not.toBeChecked()
      expect(screen.queryByText('hidden.txt')).toBeNull()
      fireEvent.keyDown(document.body, { key: 'Delete' })
      expect(operations.onRemove).toHaveBeenCalledWith([expect.objectContaining({ name: 'hidden.txt' })])
      fireEvent.click(screen.getByRole('checkbox', { name: 'selectAllEntries' }))
      expect(operations.onSelect).toHaveBeenCalledWith(['visible.txt'], true)
      view.unmount()
      operations.onRemove.mockClear()
      fireEvent.keyDown(document.body, { key: 'Delete' })
      expect(operations.onRemove).not.toHaveBeenCalled()
    })

    it('leaves another pane, a native button and a shadow editor in control of keyboard events', () => {
      const operations = props({ selected: ['visible.txt'] })
      render(<DndProvider backend={TestBackend}><View {...operations} /></DndProvider>)
      const button = document.createElement('button')
      button.textContent = 'Other pane'
      document.body.append(button)
      const shadowHost = document.createElement('section')
      const shadow = shadowHost.attachShadow({ mode: 'open' })
      const input = document.createElement('textarea')
      shadow.append(input)
      document.body.append(shadowHost)
      try {
        button.focus()
        fireEvent.keyDown(button, { key: 'Delete' })
        fireEvent.keyDown(button, { key: 'ArrowDown' })
        fireEvent.keyDown(button, { key: 'Tab' })
        expect(document.activeElement).toBe(button)
        fireEvent.keyDown(input, { key: 'Delete', composed: true })
        fireEvent.keyDown(document.body, { key: 'Delete', ctrlKey: true })
        expect(operations.onRemove).not.toHaveBeenCalled()
        expect(operations.onNavigate).not.toHaveBeenCalled()
      } finally {
        button.remove()
        shadowHost.remove()
      }
    })

    it('preserves row keyboard selection, rename and navigation, and disables it while fetching', () => {
      const operations = props()
      const view = render(<DndProvider backend={TestBackend}><View {...operations} /></DndProvider>)
      fireEvent.keyDown(document.body, { key: mode === 'grid' ? 'ArrowUp' : 'ArrowDown' })
      const row = within(screen.getAllByTestId(mode === 'grid' ? 'grid-file' : 'file-row')[0])
      const checkbox = row.getByRole('checkbox')
      expect(checkbox).toHaveFocus()
      fireEvent.keyDown(checkbox, { key: ' ' })
      expect(operations.onSelect).toHaveBeenCalledWith('visible.txt', true)
      fireEvent.keyDown(checkbox, { key: 'F2' })
      expect(operations.onRename).toHaveBeenCalledWith([expect.objectContaining({ name: 'visible.txt' })])
      fireEvent.keyDown(checkbox, { key: 'Enter' })
      expect(operations.onNavigate).toHaveBeenCalledWith({ path: '/fixture/visible.txt', cid })
      operations.onRename.mockClear()
      view.rerender(<DndProvider backend={TestBackend}><View {...operations} filesIsFetching /></DndProvider>)
      act(() => fireEvent.keyDown(document.body, { key: 'F2' }))
      expect(operations.onRename).not.toHaveBeenCalled()
    })
  })
}
