/* global window, document, getComputedStyle, performance, requestAnimationFrame, matchMedia */

/** Observe actual computed Settings text/fill pairs, starting BEFORE a real
 * theme change. Unlike a delayed axe audit, the first frames expose unsafe
 * foreground tweens against immediately switched ancestor backgrounds. */
export async function observeThemeSwitchContrast (page, change) {
  await page.evaluate(() => {
    const rgb = text => {
      const values = text.match(/[\d.]+/g)?.map(Number) || []
      return [values[0] || 0, values[1] || 0, values[2] || 0, values[3] ?? 1]
    }
    const luminance = color => color.slice(0, 3).map(x => {
      const v = x / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
    const background = node => {
      let accumulated = [0, 0, 0, 0]
      for (let parent = node; parent; parent = parent.parentElement) {
        const color = rgb(getComputedStyle(parent).backgroundColor)
        const alpha = accumulated[3] + color[3] * (1 - accumulated[3])
        accumulated = [...accumulated.slice(0, 3).map((value, i) => alpha
          ? (value * accumulated[3] + color[i] * color[3] * (1 - accumulated[3])) / alpha
          : 0), alpha]
        if (alpha >= 0.999) return accumulated
      }
      return accumulated
    }
    window.__settingsThemeFrames = []
    window.__observeSettingsTheme = true
    const capture = () => {
      if (!window.__observeSettingsTheme) return
      window.__settingsThemeFrames.push({
        time: performance.now(),
        dark: matchMedia('(prefers-color-scheme: dark)').matches,
        nodes: [...document.querySelectorAll('.pm-theme-toggle-option span, [data-id="SettingsPage"] a.link.blue')]
          .filter(node => node.getClientRects().length).map(node => {
            const style = getComputedStyle(node)
            const bg = background(node)
            const fgLuminance = luminance(rgb(style.color))
            const bgLuminance = luminance(bg)
            return {
              text: node.textContent,
              foreground: style.color,
              background: bg,
              contrast: (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05),
              transitionProperty: style.transitionProperty,
              transitionDuration: style.transitionDuration
            }
          })
      })
      requestAnimationFrame(capture)
    }
    capture()
  })
  try {
    await change()
    await page.evaluate(() => new Promise(resolve => {
      let count = 0
      const next = () => ++count === 16 ? resolve() : requestAnimationFrame(next)
      requestAnimationFrame(next)
    }))
    return await page.evaluate(() => window.__settingsThemeFrames)
  } finally {
    await page.evaluate(() => { window.__observeSettingsTheme = false })
  }
}
