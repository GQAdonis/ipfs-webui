module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  env: { browser: true, node: true, es2022: true },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: { babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] } }
  },
  extends: ['standard', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:jsx-a11y/recommended'],
  plugins: ['jsx-a11y', 'import', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/jsx-uses-react': 'error',
    'react/prop-types': [0, { ignore: ['className'], customValidators: [], skipUndeclared: true }], // TODO: set this rule to error when all issues are resolved.
    'no-void': 'off'
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        babelOptions: { babelrc: false, configFile: false, parserOpts: { plugins: ['typescript', 'jsx'] } }
      },
      rules: { 'no-undef': 'off', 'no-unused-vars': 'off' }
    },
    {
      files: ['**/*.test.*', '**/*.spec.*', 'test/setup.js'],
      globals: { describe: 'readonly', it: 'readonly', test: 'readonly', expect: 'readonly', beforeAll: 'readonly', beforeEach: 'readonly', afterAll: 'readonly', afterEach: 'readonly', vi: 'readonly' }
    },
    {
      files: ['src/**/*.stories.js'],
      excludedFiles: '*.test.js',
      rules: {
        'import/no-anonymous-default-export': 'off'
      }
    }
  ]
}
