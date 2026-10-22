import { render } from '@testing-library/react'
import { Identicon, identiconCells } from './Identicon.js'
it('retains the upstream mirrored hash geometry and palette boundary', () => {
  const result = identiconCells('hello', 14, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
  expect(result.color).toBe('c')
  expect(result.cell).toBe(2)
  expect(result.cells).toEqual([{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 1 }])
})
it('renders new CIDs declaratively without a canvas or extra root', () => {
  const view = render(<Identicon cid='hello' />)
  const before = view.container.innerHTML
  view.rerender(<Identicon cid='world' size={32} />)
  expect(view.container.innerHTML).not.toBe(before)
  expect(view.container.querySelector('svg')).toHaveAttribute('width', '32')
  expect(view.container.querySelector('canvas')).toBeNull()
})
