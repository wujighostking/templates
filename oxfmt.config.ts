import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['dist/**', '*.min.js', 'packages/templates/template-*'],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  sortPackageJson: true,
  sortImports: {
    order: 'asc',
    sortSideEffects: true,
  },
})
