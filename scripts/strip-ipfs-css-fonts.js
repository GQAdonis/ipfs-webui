// Vite inlines CSS imports before this PostCSS pass. Preserve source locations
// so only ipfs-css's unused Inter/Montserrat faces are removed; local Promethity
// faces and their bundled woff2 URLs remain in the asset graph.
export function stripIpfsCssFonts () {
  return {
    postcssPlugin: 'webui-strip-ipfs-css-fonts',
    Once (root) {
      root.walkAtRules('font-face', rule => {
        if (/[/\\]ipfs-css[/\\]ipfs\.css$/.test(rule.source?.input.file || '')) rule.remove()
      })
    }
  }
}
