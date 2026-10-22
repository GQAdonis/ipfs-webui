// Tachyons 4.12.0 includes an IE 6/7 hasLayout hack. Those browsers are outside
// WebUI's supported targets; Lightning CSS correctly rejects its invalid syntax.
// Keep the standards-based clearfix pseudo-elements and every other declaration.
export function stripTachyonsIeClearfix () {
  return {
    postcssPlugin: 'webui-strip-tachyons-ie-clearfix',
    Once (root) {
      root.walkDecls('zoom', declaration => {
        const file = declaration.source?.input.file || ''
        if (/[/\\]node_modules[/\\]tachyons[/\\]css[/\\]tachyons(?:\.min)?\.css$/.test(file) &&
            declaration.parent.selector === '.cf' && declaration.value === '1' &&
            /^\s*\*$/.test(declaration.raws.before || '') && !declaration.important) {
          declaration.remove()
        }
      })
    }
  }
}
