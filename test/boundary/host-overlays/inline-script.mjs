/** Preserve compiled JavaScript literally, including replacement tokens and HTML end tags. */
export function inlineClassicScript (html, moduleScript, code) {
  const first = html.indexOf(moduleScript)
  if (first < 0 || first !== html.lastIndexOf(moduleScript)) throw new Error('Expected one exact host fixture module script')
  const escaped = code.replace(/<\/script/gi, tag => '<\\/' + tag.slice(2))
  return html.replace(moduleScript, () => `<script>${escaped}</script>`)
}
