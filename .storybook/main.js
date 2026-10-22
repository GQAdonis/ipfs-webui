/** @type {import('@storybook/react-vite').StorybookConfig} */
export default {
  stories: ['../src/**/*.stories.@(ts|js|tsx|jsx)'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-links', '@storybook/addon-a11y'],
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
  // The Vite builder loads the same gateway-relative asset, JSX and browser
  // polyfill configuration as the application. Controls/actions are in core.
  viteFinal: config => ({ ...config, base: './' })
}
