import { fireEvent, render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { FileInput } from './FileInput.js'

it('ignores a cancelled file chooser and permits choosing the same file again', () => {
  const onAddFiles = vi.fn()
  const view = render(<FileInput t={key => key} onAddFiles={onAddFiles} />)
  const input = view.container.querySelector('#file-input')
  fireEvent.change(input, { target: { files: [] } })
  expect(onAddFiles).not.toHaveBeenCalled()
  const file = new File(['fixture'], 'fixture.txt')
  fireEvent.change(input, { target: { files: [file] } })
  fireEvent.change(input, { target: { files: [file] } })
  expect(onAddFiles).toHaveBeenCalledTimes(2)
  expect(onAddFiles.mock.calls[0][0][0]).toMatchObject({ path: 'fixture.txt' })
  expect(input.value).toBe('')
})
