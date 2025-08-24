export const gitignore = [
  '# Editor directories and files',
  '.idea',
  '',
  '# Package Manager',
  'node_modules',
  '.pnpm-debug.log*',
  '',
  '# System',
  '.DS_Store',
  '',
  '# Bundle',
  'dist',
  'coverage',
  'packages/element-plus/version.ts',
  '',
  '# local env files',
  '*.local',
  '.eslintcache',
  'cypress/screenshots/*',
  'cypress/videos/*',
  'tmp',
  'docs/.vitepress/cache',
]

export const commitConfig = ['export default { extends: [\'@commitlint/config-conventional\'] }']

export const unoConfig = ['import { defineConfig } from \'unocss\'', 'export default defineConfig({', '  rules: [', '    [\'center\', { \'display\': \'flex\', \'justify-content\': \'center\', \'align-items\': \'center\' }],', '  ],', '})']
