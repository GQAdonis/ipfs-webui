import { resolve } from 'node:path'

export const HOST_EXTERNALS = [
  'react', 'react-dom', 'react-i18next', 'react-joyride', 'i18next',
  'i18next-browser-languagedetector', 'i18next-http-backend', 'i18next-icu',
  'ipfs-css', 'tachyons'
]

export function artifactConfig (directory, react) {
  return {
    root: directory,
    configFile: false,
    publicDir: false,
    base: './',
    plugins: [react()],
    build: {
      outDir: 'dist', emptyOutDir: true, minify: false,
      target: 'es2022', sourcemap: false, cssCodeSplit: false,
      lib: {
        entry: {
          index: resolve(directory, 'src/index.ts'),
          providers: resolve(directory, 'src/providers/index.ts'),
          pages: resolve(directory, 'src/pages.ts'),
          'start-exploring': resolve(directory, 'src/components/StartExploringPage.tsx'),
          forms: resolve(directory, 'src/forms.ts')
        },
        formats: ['es'], fileName: (_, name) => `${name}.js`, cssFileName: 'style'
      },
      rolldownOptions: {
        external: name => HOST_EXTERNALS.some(dependency => name === dependency || name.startsWith(`${dependency}/`)),
        output: {
          entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: asset => (asset.names?.some(name => name.endsWith('.css')) || asset.name?.endsWith('.css')) ? 'style.css' : 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
}
