module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['prettier', 'plugin:@next/next/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
  },
  rules: {
    'jsx-a11y/media-has-caption': 'off',
    '@next/next/no-img-element': 'off',
  },
};
