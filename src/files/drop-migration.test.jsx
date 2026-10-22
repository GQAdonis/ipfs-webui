import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DndProvider, useDrag } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { TestBackend } from 'react-dnd-test-backend'
import { CID } from 'multiformats/cid'
import { create as digest } from 'multiformats/hashes/digest'
import { File as FileRow } from './file/File.js'
import { addNativeFiles, clearDropError, reportDropError, FileDropErrorNotice } from './native-drop.js'
import { selectedMoveOperations } from './move-selection.js'
import { Dropdown, DropdownMenu, Option } from './dropdown/Dropdown.js'
import { FileImportStatus } from './file-import-status/FileImportStatus.js'
import { ACTIONS } from '../bundles/files/consts.js'

const t = key => key
vi.mock('react-i18next', () => ({
  withTranslation: () => Component => function Translated (props) { return <Component {...props} t={props.t || t} /> },
  useTranslation: () => ({ t }),
  Trans: ({ children }) => children
}))
afterEach(clearDropError)

function backendFixture () {
  const sources = new Map()
  const targets = new Map()
  let backend
  const factory = (manager, context, options) => {
    backend = TestBackend(manager, context, options)
    for (const [method, nodes] of [['connectDragSource', sources], ['connectDropTarget', targets]]) {
      const connect = backend[method].bind(backend)
      backend[method] = (id, node, settings) => {
        nodes.set(node, id)
        const disconnect = connect(id, node, settings)
        return () => { nodes.delete(node); disconnect() }
      }
    }
    return backend
  }
  return { factory, sources, targets, get backend () { return backend } }
}

const cid = CID.createV1(0x55, digest(0, new Uint8Array()))
const row = (overrides = {}) => ({
  cid,
  size: 12,
  name: 'source.txt',
  type: 'file',
  path: '/source.txt',
  isMfs: true,
  pinned: false,
  t,
  selected: false,
  onAddFiles: vi.fn(),
  onMove: vi.fn(),
  onSelect: vi.fn(),
  onNavigate: vi.fn(),
  onSetPinning: vi.fn(),
  onDismissFailedPin: vi.fn(),
  handleContextMenuClick: vi.fn(),
  ...overrides
})

describe('React 19 file drag/drop operations', () => {
  it('moves an internal file to a writable directory through the actual hook targets', () => {
    const fixture = backendFixture()
    const onMove = vi.fn()
    const view = render(<DndProvider backend={fixture.factory}>
      <FileRow {...row()} />
      <FileRow {...row({ name: 'folder', type: 'directory', path: '/folder', onMove })} />
    </DndProvider>)
    const [source, destination] = screen.getAllByTestId('file-row')
    act(() => {
      fixture.backend.simulateBeginDrag([fixture.sources.get(source)])
      fixture.backend.simulateHover([fixture.targets.get(destination.parentElement)])
      fixture.backend.simulateDrop()
      fixture.backend.simulateEndDrag()
    })
    expect(onMove).toHaveBeenCalledExactlyOnceWith('/source.txt', '/folder/source.txt')
    view.unmount()
    expect(fixture.sources.size).toBe(0)
    expect(fixture.targets.size).toBe(0)
  })

  it('does not move into an immutable directory', () => {
    const fixture = backendFixture()
    const onMove = vi.fn()
    const view = render(<DndProvider backend={fixture.factory}>
      <FileRow {...row()} />
      <FileRow {...row({ name: 'immutable', type: 'directory', path: '/ipfs/cid', isMfs: false, onMove })} />
    </DndProvider>)
    const [source, destination] = screen.getAllByTestId('file-row')
    act(() => {
      fixture.backend.simulateBeginDrag([fixture.sources.get(source)])
      fixture.backend.simulateHover([fixture.targets.get(destination.parentElement)])
      fixture.backend.simulateDrop()
      fixture.backend.simulateEndDrag()
    })
    expect(onMove).not.toHaveBeenCalled()
    view.unmount()
  })

  it('imports a native hierarchy once into the directory selected by the drop', async () => {
    const fixture = backendFixture()
    const onAddFiles = vi.fn()
    const file = Object.assign(new File(['hello'], 'a.txt'), { filepath: 'nested/deeper/a.txt' })
    function NativeSource () {
      const [, drag] = useDrag(() => ({ type: NativeTypes.FILE, item: { files: [file], filesPromise: Promise.resolve([file]) } }))
      return <div data-testid='native-source' ref={node => { drag(node) }} />
    }
    const view = render(<DndProvider backend={fixture.factory}>
      <NativeSource />
      <FileRow {...row({ name: 'folder', type: 'directory', path: '/folder', onAddFiles })} />
    </DndProvider>)
    await act(async () => {
      fixture.backend.simulateBeginDrag([fixture.sources.get(screen.getByTestId('native-source'))])
      fixture.backend.simulateHover([fixture.targets.get(screen.getByTestId('file-row').parentElement)])
      fixture.backend.simulateDrop()
      fixture.backend.simulateEndDrag()
      await Promise.resolve()
    })
    expect(onAddFiles).toHaveBeenCalledExactlyOnceWith([{ path: 'nested/deeper/a.txt', content: file, size: 5 }], '/folder')
    view.unmount()
  })

  it('preserves selected move operations without duplicating the dragged item or writing a no-op', () => {
    const selected = [{ name: 'a', path: '/a' }, { name: 'b', path: '/b' }]
    expect(selectedMoveOperations(selected, '/a', '/folder/a')).toEqual([['/a', '/folder/a'], ['/b', '/folder/b']])
    expect(selectedMoveOperations(selected, '/c', '/folder/c')).toHaveLength(3)
    expect(selectedMoveOperations([], '/a', '/a')).toEqual([])
  })

  it('reports a failed read without writing or retrying, and keeps fallback FileList imports', async () => {
    const write = vi.fn()
    const error = new Error('read denied')
    const view = render(<FileDropErrorNotice />)
    await act(async () => { await addNativeFiles({ filesPromise: Promise.reject(error) }, write).catch(reportDropError) })
    expect(screen.getByRole('alert')).toHaveTextContent('read denied')
    expect(write).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('alert')).toBeNull()
    const file = new File(['x'], 'plain.txt')
    await addNativeFiles({ files: [file] }, write)
    expect(write).toHaveBeenCalledExactlyOnceWith([{ path: 'plain.txt', content: file, size: 1 }])
    view.unmount()
  })
})

describe('Files menu refs and keyboard behavior', () => {
  it('forwards a real DOM ref, navigates options, closes on Escape and restores the trigger', () => {
    const menu = { current: null }
    function MenuFixture () {
      const [open, setOpen] = useState(false)
      return <Dropdown><button onClick={() => setOpen(!open)}>Import</button><DropdownMenu ref={menu} open={open} onDismiss={() => setOpen(false)}>
        <Option>File</Option><Option>Folder</Option>
      </DropdownMenu></Dropdown>
    }
    const view = render(<MenuFixture />)
    const trigger = screen.getByRole('button', { name: 'Import' })
    trigger.focus()
    fireEvent.click(trigger)
    expect(menu.current).toBeInstanceOf(HTMLElement)
    expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Folder' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(trigger).toHaveFocus()
    expect(screen.queryByRole('menu')).toBeNull()
    view.unmount()
    expect(menu.current).toBeNull()
  })
})

describe('transfer progress and dismissal', () => {
  it('keeps dismissal distinct from cancelling pending hierarchy/progress', () => {
    const clear = vi.fn()
    const job = { type: ACTIONS.WRITE, status: 'Pending', start: 1, message: { progress: 50, entries: [{ path: 'folder/a.txt', size: 12, progress: 50 }] } }
    const view = render(<FileImportStatus filesPending={[job]} doFilesClear={clear} t={t} />)
    expect(screen.getByText(/50%/)).toBeInTheDocument()
    expect(screen.getByText('folder')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'filesImportStatus.closeDropdown' }))
    expect(clear).toHaveBeenCalledTimes(1)
    view.unmount()
  })
})
