import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['dist/**', '*.min.js', 'packages/templates/template-*', '.gitattributes'],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  sortPackageJson: true,
  sortImports: {
    order: 'asc',
    sortSideEffects: true,
  },
})
