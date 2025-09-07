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

export const viteNodeConfig = [
  'export default ({ mode }: { mode: string }) => ({',
  '  build: {',
  '    lib: {',
  '      entry: [\'./packages/main/src/index.ts\'],',
  '      formats: [\'es\'],',
  '      fileName: \'index\',',
  '    },',
  '    watch: mode === \'development\' ? { include: [\'packages/**/*\'] } : null,',
  '    minify: true,',
  '    sourcemap: true,',
  '  },',
  '})',
]

export const viteVueConfig = [
  'import { defineConfig } from \'vite\'',
  'import vue from \'@vitejs/plugin-vue\'',
  '',
  'export default defineConfig({',
  '  plugins: [',
  '    vue(),',
  '  ],',
  '})',
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

export const webIndexHtmlConfig = [
  '<!DOCTYPE html>',
  '<html lang="zh">',
  '  <head>',
  '    <meta charset="UTF-8">',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '    <title>Document</title>',
  '  </head>',
  '  <body>',
  '     <div id="app"></div>',
  '     <script type="module" src="./packages/main/src/index.ts"></script>',
  '  </body>',
  '</html>',
]

export const vueMainFile = [
  'import { createApp } from \'vue\'',
  'import App from \'./App.vue\'',
  '',
  'const app = createApp(App)',
  '',
  'app.mount(\'#app\')',
  '',
]

export const vueAppFile = [
  '<script setup lang="ts">',
  '',
  '</script>',
  '',
  '<template>',
  '  <div>app</div>',
  '</template>',
  '',
  '<style scoped>',
  '',
  '</style>',
  '',
]
