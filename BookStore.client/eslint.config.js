const js = require('@eslint/js')
const globals = require('globals')
const reactHooks = require('eslint-plugin-react-hooks')
const reactCompiler = require('eslint-plugin-react-compiler')
const { defineConfig, globalIgnores } = require('eslint/config')

module.exports = defineConfig([
  globalIgnores(['dist', 'eslint.config.js', 'babel.config.js', 'webpack.*.js']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactCompiler.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
