module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'puglin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsConfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['.eslintrc.js'],
}
