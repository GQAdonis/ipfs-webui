/**
 * Drops every @font-face block from ipfs-css/ipfs.css at build time.
 *
 * ipfs-css has no font-free entry point: its 24 Inter/Montserrat @font-face
 * rules sit at the top of ipfs.css and their url() references make webpack
 * bundle ~100 font files the Promethity fork never serves (they inflate the
 * pinned CAR; the fork's faces are bundled by src/promethity/fonts.css).
 * Stripping the blocks before css-loader runs removes both the rules and the
 * file references. The @font-face blocks contain no nested braces.
 *
 * The loader is appended to the plain-css rule's `use` in config-overrides.js
 * (css-loader's `-!` @import requests bypass standalone rules), so it sees
 * every plain css file; it rewrites only ipfs-css/ipfs.css.
 */
module.exports = function stripIpfsCssFonts (source) {
  if (!/ipfs-css[\\/]ipfs\.css$/.test(this.resourcePath)) return source
  return source.replace(/@font-face\s*\{[^{}]*\}/g, '')
}
