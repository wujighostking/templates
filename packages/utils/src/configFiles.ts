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

export const workspaceConfig = ['packages:\n  - packages/*']

export const viteConfig = [
  'import { defineConfig } from \'vite\'',
  '',
  'export default defineConfig({})',
  '',
]

export const tsdownConfig = [
  'import type { UserConfig } from \'tsdown\'',
  'import { readdirSync } from \'node:fs\'',
  'import { defineConfig } from \'tsdown\'',
  '',
  'export const config: UserConfig = readdirSync(\'./packages\').map(dir => ({',
  '  platform: \'neutral\',',
  '  format: \'esm\',',
  '  dts: true,',
  '  minify: true,',
  '  clean: false,',
  '  sourcemap: false,',
  `  entry: \`./packages/\${dir}/src/index.ts\`,`,
  `  outDir: \`./packages/\${dir}/dist\`,`,
  `  watch: \`./packages/\${dir}/src\`,`,
  '}))',
  '',
  'export default defineConfig(config)',
  '',
]

export const tsdownBuildConfig = [
  'import type { UserConfig } from \'tsdown\'',
  'import { defineConfig } from \'tsdown\'',
  'import { config } from \'./tsdown.config.dev\'',
  '',
  'export default defineConfig((config as UserConfig[]).map((option: UserConfig) => ({ ...option, watch: false })))',
  '',
]
