import { shellAccessibility } from '../../chat-runtime/shell-accessibility.mjs'
const fixtures = ['test/boundary/chat-runtime/shell-accessibility.mjs', 'test/boundary/chat-runtime/browser.mjs', 'src/shell/PhoneNavigation.jsx', 'src/shell/WorkspaceLayout.jsx', 'src/shell/PraxisWorkspace.jsx'].map(path => ({ root: 'webui', path }))
export default { schemaVersion: 1, family: 'shell', fixtures, slots: Object.fromEntries(['viewport-theme-matrix', 'keyboard-and-focus', 'axe', 'reduced-motion'].map(slot => [slot, ctx => shellAccessibility(ctx, slot)])) }
