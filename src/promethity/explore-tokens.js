// Token-level theming for the /explore route (webui-route-polish 1.3, D9).
//
// `ipld-explorer-components` is not patched and its version is not changed:
// the package paints panels and codec badges with inline colours and exposes
// no theming hook. The fork's wrapper therefore sets these CSS variables on
// the container it renders around the package, and the Explore seam rules in
// theme-overrides.css (`.prom-explore ...`) read them. The values are token
// references, so they follow the data-theme attribute with no JS on theme
// change. Nothing here touches the package's markup or its stylesheet.

/** @type {Readonly<Record<string, string>>} */
export const EXPLORE_TOKEN_VARS = Object.freeze({
  '--explore-panel': 'var(--surface)',
  '--explore-badge': 'var(--control)',
  '--explore-text': 'var(--text)'
})
