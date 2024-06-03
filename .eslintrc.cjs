module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'standard', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    'no-unused-vars': 'error',
    'semi': ['warn', 'never'],
    'no-eval': 'off',
    'no-undef': 'off',
    'no-use-before-define': 'off',
  },
}
