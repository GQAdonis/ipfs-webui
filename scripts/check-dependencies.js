import depcheck from 'depcheck'

// Retain the dependency check without Aegir's incompatible TypeScript tooling.
// Only implicit tool/config/type dependencies are ignored; missing production
// imports remain errors throughout the staged consumer migration.
const result = await depcheck(process.cwd(), {
  ignoreDirs: ['node_modules', 'build', 'storybook-static', '.git', 'public', 'vendor'],
  ignoreMatches: [
    '@types/*', 'flag-icon-css', 'ipfs', 'ipfs-css', 'tachyons', 'chart.js', 'ace-builds',
    '@babel/core', '@babel/eslint-parser', 'eslint-config-standard',
    'eslint-plugin-*', '@storybook/addon-a11y', '@storybook/addon-links',
    '@storybook/react-vite', '@vitest/coverage-v8', 'fake-indexeddb',
    'nyc', 'semantic-release', '@semantic-release/*',
    // CLI-only dependencies invoked by the locale producer and Storybook script.
    '@olizilla/lol', 'wait-on',
    'conventional-changelog-conventionalcommits',
    'os-browserify', 'path-browserify', 'stream-browserify',
    // Exact trusted sibling build aliases, validated by scripts/shared-entrypoints.js.
    '@gqadonis/ipfs-mcp-ui', '@gqadonis/ipfs-agent-chat',
    // Runtime peers of those built sibling exports; deduped to this host's pins.
    'radix-ui', '@prometheus-ags/entity-graph-react'
  ]
})

const { dependencies, devDependencies, missing, invalidFiles, invalidDirs } = result
const report = { dependencies, devDependencies, missing, invalidFiles, invalidDirs }
if (dependencies.length || devDependencies.length || Object.keys(missing).length || Object.keys(invalidFiles).length || Object.keys(invalidDirs).length) {
  console.error(JSON.stringify(report, null, 2))
  process.exitCode = 1
}
