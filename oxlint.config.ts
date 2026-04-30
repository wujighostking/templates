import { defineConfig } from 'oxlint'

export default defineConfig({
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-unused-expressions': 'off',
  },
  ignorePatterns: ['dist/**/*', 'packages/templates/template-*'],
})
