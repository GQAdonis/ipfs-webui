import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig(async context => mergeConfig(
  await viteConfig({ ...context, mode: 'test' }),
  {
    // Source parity fixtures share the same host adapters as the prebundled
    // Explorer artifact; its separate protocol build graph stays isolated.
    resolve: { dedupe: ['react', 'react-dom', 'lucide-react', 'react-inspector', 'cytoscape', 'cytoscape-dagre', 'react-i18next', 'react-joyride', 'i18next', 'i18next-browser-languagedetector', 'i18next-http-backend', 'i18next-icu', 'ipfs-css', 'tachyons'] },
    test: {
      environment: 'jsdom',
      environmentOptions: { jsdom: { url: 'http://localhost/' } },
      globals: true,
      setupFiles: ['./test/setup.js'],
      include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/**/__tests__/**/*.{js,jsx,ts,tsx}', 'test/unit/**/*.{test,spec}.{js,jsx,ts,tsx}', 'test/boundary/**/*.test.js', 'scripts/**/*.test.js'],
      exclude: ['**/node_modules/**', 'test/e2e/**', '**/*.stories.*', 'src/webmcp/vendor/**'],
      coverage: {
        provider: 'v8',
        reportsDirectory: '.nyc_output/unit',
        reporter: ['text', 'json', 'lcov', 'html'],
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/**/*.stories.*', 'src/**/__tests__/**', 'src/webmcp/vendor/**', 'src/icons/**', 'src/react-app-env.d.ts']
      }
    }
  }
))
