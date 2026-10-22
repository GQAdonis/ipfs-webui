import { transformWithOxc } from 'vite'

// The incumbent source uses JSX in .js files. Run before Vite import analysis.
export function legacyJsx () {
  return {
    name: 'webui-legacy-jsx',
    enforce: 'pre',
    async transform (code, id) {
      const filename = id.split('?')[0]
      if (!/\/(src|test|\.storybook)\/.*\.js$/.test(filename)) return null
      return transformWithOxc(code, filename, {
        lang: 'jsx', jsx: { runtime: 'automatic' }, sourcemap: true
      })
    }
  }
}
