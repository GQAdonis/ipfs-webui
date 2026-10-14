/**
 * upgrading to react-scripts v5 with any sort of decent sized app causes all kinds of errors
 *
 * @see https://github.com/facebook/create-react-app/issues/11756#issuecomment-1184657437
 * @see https://alchemy.com/blog/how-to-polyfill-node-core-modules-in-webpack-5
 */
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { fileURLToPath } from 'node:url'

const PURE_ESM_MODULES = [
  'ipfs-geoip',
  'ipld-explorer-components',
  '@chainsafe/is-ip',
  '@multiformats/multiaddr',
  'dag-jose',
  'uint8arrays'
]

/**
 * This function goes through the loader rules and applies modifier function to the said rule.
 * Validation can be set within the modifier function.
 *
 * @param {import('webpack').RuleSetRule[]} rules
 * @param {function} modifier defaults to identity function
 * @returns {import('webpack').RuleSetRule[]}
 */
function modifyBabelLoaderRules (rules, modifier = r => r) {
  return rules.map(rule => {
    if (rule.oneOf) {
      rule.oneOf = modifyBabelLoaderRules(rule.oneOf, modifier)
    } else if (rule.use) {
      rule.use = modifyBabelLoaderRules(rule.use, modifier)
    } else {
      rule = modifier(rule)
    }
    return rule
  })
}

/**
 * Adds exclude rules for pure ESM Modules.
 *
 * @param {import('webpack').RuleSetRule[]} rules
 * @returns {import('webpack').RuleSetRule[]}
 */
function modifyBabelLoaderRuleForBuild (rules) {
  return modifyBabelLoaderRules(rules, rule => {
    if (rule.loader && rule.loader.includes('babel-loader')) {
      if ('exclude' in rule) {
        if (!Array.isArray(rule.exclude)) {
          rule.exclude = [rule.exclude]
        }
        PURE_ESM_MODULES.forEach(module => {
          rule.exclude.push(new RegExp(`node_modules/${module}`))
        })
      }
    }
    return rule
  })
}

/**
 * Adds instrumentation plugin for code coverage in test mode.
 *
 * @param {import('webpack').RuleSetRule[]} rules
 * @returns {import('webpack').RuleSetRule[]}
 */
function modifyBabelLoaderRuleForTest (rules) {
  return modifyBabelLoaderRules(rules, rule => {
    if (rule.options && rule.options.plugins) {
      rule.options.plugins.push('istanbul')
    }
    return rule
  })
}

function webpackOverride (config) {
  const fallback = config.resolve.fallback || {}

  Object.assign(fallback, {
    stream: 'stream-browserify',
    os: 'os-browserify/browser',
    path: 'path-browserify',
    crypto: 'crypto-browserify'
  })

  config.resolve.fallback = fallback

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ])

  /**
   * NODE_ENV is overridden by react-scripts/react-app-rewired-esm,
   * so we set BUILD_ENV in the analyze script
   */
  if (process.env.BUILD_ENV === 'analyze') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true
      })
    )
  }

  config.module.rules = modifyBabelLoaderRuleForBuild(config.module.rules)

  // Strip the Inter/Montserrat @font-face blocks from ipfs-css/ipfs.css before
  // css-loader runs, so the ~100 unused font files never enter the bundle.
  // css-loader pulls @import-ed css in through requests that carry the remaining
  // loaders of the importing rule inline, so a standalone rule never sees
  // ipfs.css; appending to the plain-css rule's `use` (after css-loader and
  // postcss-loader, so it runs on the raw source first) puts the loader in that
  // inline chain instead, and raising css-loader's `importLoaders` from 1 to 2
  // makes imported css go through both postcss-loader and this loader (the CRA
  // default of 1 would stop at postcss-loader). This needs its own traversal:
  // modifyBabelLoaderRules recurses into `rule.use`, so the modifier there sees
  // loaders, never the rule carrying `test`. The css-module rule is excluded by
  // its test source (`/\.css$/` itself matches "x.module.css", so testing
  // strings does not separate the two). The loader itself no-ops for every file
  // except ipfs-css/ipfs.css.
  const stripIpfsCssFontsLoader = fileURLToPath(new URL('./strip-ipfs-css-fonts-loader.cjs', import.meta.url))
  let plainCssRulesPatched = 0
  const appendToPlainCssRule = (rules) => {
    for (const rule of rules) {
      if (rule.oneOf) {
        appendToPlainCssRule(rule.oneOf)
      } else if (rule.test instanceof RegExp && !rule.test.source.includes('module') && rule.test.test('ipfs.css') && !rule.test.test('x.scss') && Array.isArray(rule.use)) {
        rule.use = rule.use.map(entry => {
          if (typeof entry === 'object' && entry !== null && typeof entry.loader === 'string' && entry.loader.includes('/css-loader/')) {
            return { ...entry, options: { ...entry.options, importLoaders: (entry.options?.importLoaders ?? 0) + 1 } }
          }
          return entry
        })
        rule.use = [...rule.use, stripIpfsCssFontsLoader]
        plainCssRulesPatched++
      }
    }
    return rules
  }
  config.module.rules = appendToPlainCssRule(config.module.rules)
  if (plainCssRulesPatched !== 1) {
    throw new Error(`config-overrides: expected to patch exactly one plain-css rule for strip-ipfs-css-fonts-loader, patched ${plainCssRulesPatched}`)
  }

  config.module.rules.push({
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader',
    options: { presets: ['@babel/env', '@babel/preset-react'] }
  })

  config.module.rules.push({
    test: /\.m?js$/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false
    }
  })

  // Make sure .tsx and .ts extensions are properly prioritized
  // This ordering allows imports like './file.js' to resolve to './file.ts' or './file.tsx'
  config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '...']

  // Enable resolving .js imports to .ts/.tsx files without specific aliases
  config.resolve.extensionAlias = {
    '.js': ['.js', '.ts', '.tsx'],
    '.jsx': ['.jsx', '.tsx']
  }

  // Instrument for code coverage in development mode
  const REACT_APP_ENV = process.env.REACT_APP_ENV ?? process.env.NODE_ENV ?? 'development'
  if (REACT_APP_ENV === 'test') {
    config.module.rules = modifyBabelLoaderRuleForTest(config.module.rules)
    config.devtool = 'inline-source-map'
  } else if (REACT_APP_ENV === 'development') {
    config.optimization = {
      ...config.optimization,
      minimize: false,
      mangleExports: false,
      innerGraph: false,
      moduleIds: 'named'
    }
    config.devtool = 'source-map'
  }

  return config
}

const configOverride = {
  webpack: webpackOverride
}

export default configOverride
