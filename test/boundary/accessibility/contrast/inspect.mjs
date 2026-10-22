/** Browser-side read-only measurement. Pass directly to locator.evaluate(). */
export function inspectElement (element) {
  const rect = value => ({ left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height })
  const parent = node => node.parentElement || node.getRootNode()?.host || null
  const identity = node => ({ tag: node.tagName, id: node.id, className: typeof node.className === 'string' ? node.className : '', role: node.getAttribute('role') })
  const properties = ['color', 'backgroundColor', 'backgroundImage', 'opacity', 'filter', 'backdropFilter', 'mixBlendMode', 'backgroundBlendMode', 'visibility', 'display', 'overflowX', 'overflowY', 'contain', 'clipPath', 'maskImage', 'textShadow', 'transform', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderLeftWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'position']
  const styleOf = (node, pseudo) => {
    const css = getComputedStyle(node, pseudo)
    return Object.fromEntries(properties.map(key => [key, css[key]]))
  }
  // CSS Overflow 3 section 3.3: the propagated element has used overflow
  // visible. Its computed overflow is applied to the viewport, not its box.
  const documentRoot = document.documentElement
  const rootStyle = getComputedStyle(documentRoot)
  const body = [...documentRoot.children].find(node => node.localName === 'body' && node.namespaceURI === 'http://www.w3.org/1999/xhtml' && getComputedStyle(node).display !== 'none')
  const bodyStyle = body && getComputedStyle(body)
  const bodyPropagates = documentRoot.localName === 'html' && documentRoot.namespaceURI === 'http://www.w3.org/1999/xhtml' && rootStyle.display !== 'none' && rootStyle.overflowX === 'visible' && rootStyle.overflowY === 'visible' && body && rootStyle.contain === 'none' && bodyStyle.contain === 'none'
  const overflowSource = rootStyle.display === 'none' ? null : bodyPropagates ? body : documentRoot
  const overflowPropagation = { source: overflowSource ? identity(overflowSource) : null, rootStyle: styleOf(documentRoot), bodyStyle: body ? styleOf(body) : null, rule: 'https://www.w3.org/TR/css-overflow-3/#overflow-propagation' }
  const ancestors = []
  for (let node = element; node; node = parent(node)) {
    const box = node.getBoundingClientRect()
    const style = styleOf(node)
    const pseudos = ['::before', '::after'].flatMap(pseudo => {
      const css = getComputedStyle(node, pseudo)
      if (['none', 'normal'].includes(css.content) || css.display === 'none') return []
      const values = Object.fromEntries(['content', 'position', 'left', 'right', 'top', 'bottom', 'width', 'height', 'boxSizing', 'transform'].map(key => [key, css[key]]))
      const number = name => /^-?[\d.]+px$/.test(css[name]) ? Number.parseFloat(css[name]) : NaN
      const left = number('left'), top = number('top'), width = number('width'), height = number('height')
      const knownGeometry = css.position === 'absolute' && css.boxSizing === 'border-box' && css.transform === 'none' && [left, top, width, height].every(Number.isFinite)
      const x = box.left + Number.parseFloat(style.borderLeftWidth) + left
      const y = box.top + Number.parseFloat(style.borderTopWidth) + top
      return [{ pseudo, ...values, style: styleOf(node, pseudo), geometry: knownGeometry ? { left: x, top: y, right: x + width, bottom: y + height, width, height } : null }]
    })
    ancestors.push({ ...identity(node), rect: rect(box), style, overflowAppliedToViewport: node === overflowSource, scrollTop: node.scrollTop, scrollLeft: node.scrollLeft, clientWidth: node.clientWidth, clientHeight: node.clientHeight, pseudos })
  }
  const placeholder = element.matches('input,textarea') && !element.value && element.placeholder
  const foregroundStyle = styleOf(element, placeholder ? '::placeholder' : undefined)
  let text = placeholder || ''
  const textRects = []
  if (placeholder) {
    const box = element.getBoundingClientRect(), css = getComputedStyle(element)
    const left = box.left + parseFloat(css.borderLeftWidth) + parseFloat(css.paddingLeft)
    const right = box.right - parseFloat(css.borderRightWidth) - parseFloat(css.paddingRight)
    const top = box.top + parseFloat(css.borderTopWidth) + parseFloat(css.paddingTop)
    const bottom = box.bottom - parseFloat(css.borderBottomWidth) - parseFloat(css.paddingBottom)
    textRects.push({ left, right, top, bottom, width: right - left, height: bottom - top, kind: 'placeholder-content-box' })
  } else {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!node.textContent.trim()) continue
      const range = document.createRange(); range.selectNodeContents(node)
      for (const box of range.getClientRects()) if (box.width && box.height) textRects.push({ ...rect(box), kind: 'text-range', text: node.textContent, owner: identity(node.parentElement), foreground: getComputedStyle(node.parentElement).color })
      text += node.textContent
    }
  }
  const deepHit = (x, y) => {
    let hit = document.elementFromPoint(x, y)
    const chain = []
    for (let depth = 0; hit && depth < 12; depth++) {
      chain.push(identity(hit))
      const next = hit.shadowRoot?.elementFromPoint(x, y)
      if (!next || next === hit) break
      hit = next
    }
    return { chain, targetOrDescendant: Boolean(hit && (hit === element || element.contains(hit))) }
  }
  const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight }
  const samples = textRects.map(box => {
    let clip = { ...viewport }
    for (const ancestor of ancestors.slice(1)) {
      if (ancestor.overflowAppliedToViewport) continue
      const xClips = ['hidden', 'clip', 'auto', 'scroll'].includes(ancestor.style.overflowX)
      const yClips = ['hidden', 'clip', 'auto', 'scroll'].includes(ancestor.style.overflowY)
      if (xClips) { clip.left = Math.max(clip.left, ancestor.rect.left + parseFloat(ancestor.style.borderLeftWidth)); clip.right = Math.min(clip.right, ancestor.rect.right - parseFloat(ancestor.style.borderRightWidth)) }
      if (yClips) { clip.top = Math.max(clip.top, ancestor.rect.top + parseFloat(ancestor.style.borderTopWidth)); clip.bottom = Math.min(clip.bottom, ancestor.rect.bottom - parseFloat(ancestor.style.borderBottomWidth)) }
    }
    const fullyVisible = box.left >= clip.left - .5 && box.right <= clip.right + .5 && box.top >= clip.top - .5 && box.bottom <= clip.bottom + .5
    const y = (box.top + box.bottom) / 2
    return { rect: box, clip, fullyVisible, hits: fullyVisible ? [.1, .5, .9].map(fraction => { const x = box.left + box.width * fraction; return { x, y, ...deepHit(x, y) } }) : [] }
  })
  return { identity: identity(element), html: element.outerHTML, text: text.trim(), placeholder: Boolean(placeholder), foregroundStyle, ancestors, textSamples: samples, viewport, overflowPropagation, windowScroll: { x: scrollX, y: scrollY }, devicePixelRatio, fontsStatus: document.fonts.status }
}

export function parseColor (value) {
  const match = value.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null
}

export function composite (front, back) {
  const alpha = front[3] + back[3] * (1 - front[3])
  return [...front.slice(0, 3).map((value, i) => alpha ? (value * front[3] + back[i] * back[3] * (1 - front[3])) / alpha : 0), alpha]
}

export function contrastRatio (a, b) {
  const luminance = color => color.slice(0, 3).map(channel => channel / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return (high + .05) / (low + .05)
}

const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

/** Conservative disposition: unsupported paint effects cannot earn PASS. */
export function assessMeasurement (snapshot) {
  const reasons = []
  if (!snapshot.textSamples.length) reasons.push('no-visible-text-geometry')
  if (snapshot.fontsStatus !== 'loaded') reasons.push('fonts-not-settled')
  if (snapshot.textSamples.some(sample => !sample.fullyVisible)) reasons.push('text-clipped-or-outside-viewport')
  if (snapshot.textSamples.some(sample => sample.fullyVisible && sample.hits.some(hit => !hit.targetOrDescendant))) reasons.push('text-hit-test-obscured')
  const fg = parseColor(snapshot.foregroundStyle.color)
  if (!fg) reasons.push('unsupported-foreground-color')
  const pseudoEvidence = []
  let background = [0, 0, 0, 0]
  for (const ancestor of snapshot.ancestors) {
    const css = ancestor.style
    if (Number(css.opacity) !== 1) reasons.push('opacity-layer')
    if (css.filter !== 'none' || css.backdropFilter !== 'none') reasons.push('filter-layer')
    if (css.mixBlendMode !== 'normal' || css.backgroundBlendMode !== 'normal') reasons.push('blend-layer')
    if (css.clipPath !== 'none' || css.maskImage !== 'none') reasons.push('mask-or-clip-path')
    if (css.visibility !== 'visible' || css.display === 'none') reasons.push('hidden-ancestor')
    if (css.transform !== 'none' && !/^matrix\(1, 0, 0, 1, [-\d.]+, [-\d.]+\)$/.test(css.transform)) reasons.push('unsupported-transform')
    if (css.backgroundImage !== 'none' && background[3] < 1) reasons.push('background-image-layer')
    if (background[3] < 1) {
      const color = parseColor(css.backgroundColor)
      if (!color) reasons.push('unsupported-background-color')
      else background = composite(background, color)
    }
    for (const pseudo of ancestor.pseudos) {
      const bg = parseColor(pseudo.style.backgroundColor)
      const paints = !['""', "''"].includes(pseudo.content) || pseudo.style.backgroundImage !== 'none' || !bg || bg[3] > 0
      if (!paints) continue
      const intersects = pseudo.geometry ? snapshot.textSamples.some(sample => overlaps(sample.rect, pseudo.geometry)) : null
      pseudoEvidence.push({ ancestor: { tag: ancestor.tag, id: ancestor.id, className: ancestor.className }, pseudo: pseudo.pseudo, geometry: pseudo.geometry, intersectsText: intersects })
      if (intersects !== false) reasons.push('pseudo-element-overlap-unresolved')
    }
  }
  if (snapshot.foregroundStyle.textShadow !== 'none') reasons.push('text-shadow')
  if (Number(snapshot.foregroundStyle.opacity) !== 1) reasons.push('foreground-opacity')
  if (snapshot.textSamples.some(sample => sample.rect.foreground && sample.rect.foreground !== snapshot.foregroundStyle.color)) reasons.push('mixed-descendant-foregrounds')
  if (background[3] < 1) reasons.push('no-opaque-background-established')
  const size = parseFloat(snapshot.foregroundStyle.fontSize), weight = parseFloat(snapshot.foregroundStyle.fontWeight)
  const threshold = size >= 24 || (size >= 18.6666667 && weight >= 700) ? 3 : 4.5
  const effectiveForeground = fg ? composite(fg, background) : null
  const ratio = effectiveForeground && background[3] === 1 ? contrastRatio(effectiveForeground, background) : null
  return { status: reasons.length ? 'UNKNOWN' : ratio >= threshold ? 'PASS' : 'FAIL', reasons: [...new Set(reasons)], foreground: fg, effectiveForeground, background, ratio, threshold, pseudoEvidence }
}
