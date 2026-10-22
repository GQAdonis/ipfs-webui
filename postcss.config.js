import flexbugs from 'postcss-flexbugs-fixes'
import autoprefixer from 'autoprefixer'
import { stripIpfsCssFonts } from './scripts/strip-ipfs-css-fonts.js'
import { stripTachyonsIeClearfix } from './scripts/strip-tachyons-ie-clearfix.js'

export default {
  plugins: [
    stripIpfsCssFonts(),
    stripTachyonsIeClearfix(),
    flexbugs(),
    autoprefixer({ flexbox: 'no-2009' })
  ]
}
