import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['dist/**', '*.min.js'],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  sortPackageJson: true,
})
