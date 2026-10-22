import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import istanbul from 'vite-plugin-istanbul'
import { visualizer } from 'rollup-plugin-visualizer'
import { buildEnvironment, environmentDefines } from './scripts/build-environment.js'
import { legacyJsx } from './scripts/vite-legacy-jsx.js'
import { extensionAlias } from './scripts/vite-extension-alias.js'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { sharedEntrypoints, sharedEntrypointGuard, isolateA2uiStyles } from './scripts/shared-entrypoints.js'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)))
// Injected bare shim imports may originate in trusted sibling dist files. Bind them
// to this consumer's pinned package rather than resolving from the sibling tree.
const polyfillAliases = ['buffer', 'process', 'global'].map(name => ({
  find: `vite-plugin-node-polyfills/shims/${name}`,
  replacement: fileURLToPath(import.meta.resolve(`vite-plugin-node-polyfills/shims/${name}`))
}))

/** export:local passes its explicit trusted CLI root to this same consumer config. */
export function createWebuiConfig ({ mode, kubo } = {}) {
  const shared = sharedEntrypoints(root, kubo)
  const values = buildEnvironment({ ...loadEnv(mode, root, ['REACT_APP_', 'DEBUG']), ...process.env }, mode)
  const coverage = values.REACT_APP_ENV === 'test' && !process.env.VITEST
  return {
    root,
    base: './',
    publicDir: 'public',
    plugins: [
      sharedEntrypointGuard(shared),
      isolateA2uiStyles(),
      extensionAlias(),
      legacyJsx(),
      react({ include: /\.[jt]sx?$/ }),
      // path is imported by Files. The other four mirror the incumbent IPFS
      // dependency graph's browser shims; retain until final operation coverage.
      ...(process.env.VITEST ? [] : [nodePolyfills({ include: ['path', 'stream', 'os', 'crypto', 'buffer', 'process'], globals: { Buffer: true, process: true, global: true } })]),
      ...(coverage ? [istanbul({ include: 'src/**/*', exclude: ['**/*.test.*', '**/*.stories.*', 'src/webmcp/vendor/**'], extension: ['.js', '.jsx', '.ts', '.tsx'], forceBuildInstrument: true, requireEnv: false })] : []),
      ...(process.env.WEBUI_ANALYZE === 'true' ? [visualizer({ filename: 'build/bundle-analysis.html', gzipSize: true, brotliSize: true, open: false })] : []),
      {
        name: 'webui-public-metadata',
        transformIndexHtml: html => html.replaceAll('%REACT_APP_GIT_REV%', () => values.REACT_APP_GIT_REV.replace(/[&<>"']/g, character => `&#${character.charCodeAt(0)};`))
      }
    ],
    define: environmentDefines(values),
    resolve: { alias: [...shared.aliases, ...polyfillAliases], dedupe: ['react', 'react-dom', 'radix-ui', '@prometheus-ags/entity-graph-core', '@prometheus-ags/entity-graph-react'] },
    optimizeDeps: {
      // Keep this ESM dependency in the ordinary transform pipeline, including its deep entry.
      exclude: ['@a2ui/react', '@a2ui/react/v0_9'],
      rolldownOptions: { moduleTypes: { '.js': 'jsx' } }
    },
    // Vitest must use the same pinned adaptation rather than execute the external dependency raw.
    test: { server: { deps: { inline: [/@a2ui\//, /lucide-react/, /react-inspector/, /react-virtualized/] } } },
    server: {
      host: '127.0.0.1',
      port: Number(process.env.PORT || 3000),
      strictPort: true,
      fs: { allow: [root, resolve(shared.kuboRoot, 'mcp/ui'), resolve(shared.kuboRoot, 'mcp/chat')] }
      // Session/API requests keep their same-origin behavior; no new proxy or
      // remote endpoint is enabled by this tooling migration.
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      assetsDir: 'static',
      sourcemap: coverage || mode === 'development',
      manifest: true
    }
  }
}

export default defineConfig(({ mode }) => createWebuiConfig({ mode }))
