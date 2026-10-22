import { render } from '@testing-library/react'
import CountryFlag from './CountryFlag.js'
it('keeps emoji rendering and serves SVG flags from bundled assets', () => {
  const view = render(<CountryFlag code='gb' />)
  expect(view.getByRole('img')).toHaveTextContent('\u{1F1EC}\u{1F1E7}')
  view.rerender(<CountryFlag code='gb' svg />)
  const flag = view.getByRole('img')
  expect(flag.style.backgroundImage).toMatch(/gb\.svg/)
  expect(flag.style.backgroundImage).not.toMatch(/https?:|cdnjs/)
  view.rerender(<CountryFlag code='invalid' svg />)
  expect(view.queryByRole('img')).toBeNull()
})
