export type JSXOptions = 'react-jsx'
  | 'react-jsxdev'
  | 'preserve'
  | 'react-native'
  | 'react'

interface TsConfigAppOptions {
  /**
   * react-jsx：触发 .js 文件，其中 JSX 更改为针对生产优化的 _jsx 调用
   * react-jsxdev：触发 .js 文件，其中 JSX 更改为仅供开发使用的 _jsx 调用
   * preserve：触发 .jsx 文件，其中 JSX 保持不变
   * react-native：触发 .js 文件，其中 JSX 保持不变
   * react：触发 .js 文件，其中 JSX 更改为等效的 React.createElement 调用
   */
  jsx?: JSXOptions
  types?: string[]
  include?: string[]
}

interface TsconfigNodeOptions {
  include?: string[]
}

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
  '.nuxt',
  '.output',
]

export const commitConfig = [
  'export default { extends: [\'@commitlint/config-conventional\'] }',
]

export const unoConfig = [
  'import { defineConfig } from \'unocss\'',
  'export default defineConfig({',
  '  rules: [',
  '    [\'center\', { \'display\': \'flex\', \'justify-content\': \'center\', \'align-items\': \'center\' }],',
  '  ],',
  '})',
]

export const workspaceConfig = ['packages:\n  - packages/*']

export const viteNodeConfig = [
  'import { defineConfig } from \'vite\'',
  'import dts from \'vite-plugin-dts\'',
  '',
  'export default defineConfig(({ mode }) => ({',
  '  build: {',
  '    lib: {',
  '      entry: [\'./packages/main/src/index.ts\'],',
  '      formats: [\'es\'],',
  '      fileName: \'index\',',
  '    },',
  '    watch: mode === \'development\' ? { include: [\'packages/**/*\'] } : null,',
  '    minify: mode === \'production\',',
  '    sourcemap: true,',
  '  },',
  '  plugins: [dts({ tsconfigPath: \'./tsconfig.app.json\', rollupTypes: true })],',
  '}))',
]

export const viteVueConfig = [
  'import { defineConfig } from \'vite\'',
  'import vue from \'@vitejs/plugin-vue\'',
  'import UnoCss from \'unocss/vite\'',
  '',
  'export default defineConfig({',
  '  plugins: [',
  '    UnoCss(),',
  '    vue(),',
  '  ],',
  '})',
  '',
]

export const viteReactConfig = [
  'import { defineConfig } from \'vite\'',
  'import react from \'@vitejs/plugin-react\'',
  'import UnoCss from \'unocss/vite\'',
  '',
  'export default defineConfig({',
  '  plugins: [',
  '    UnoCss(),',
  '    react(),',
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
  '  dts: { build: true },',
  '  minify: false,',
  '  clean: true,',
  '  sourcemap: true,',
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
  'export default defineConfig((config as UserConfig[]).map((option: UserConfig) => ({ ...option, minify: true, watch: false })))',
  '',
]

export function webIndexHtmlConfig(
  id: string,
  scriptSrc: string,
  title?: string,
) {
  id = id ?? 'app'
  scriptSrc = scriptSrc ?? '/src/main.ts'
  title = title ?? 'Document'

  return [
    '<!DOCTYPE html>',
    '<html lang="zh">',
    '  <head>',
    '    <meta charset="UTF-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `    <title>${title}</title>`,
    '  </head>',
    '  <body>',
    `     <div id="${id}"></div>`,
    `     <script type="module" src="${scriptSrc}"></script>`,
    '  </body>',
    '</html>',
  ]
}

export const vueMainFile = [
  'import { createApp } from \'vue\'',
  'import App from \'./App.vue\'',
  'import \'virtual:uno.css\'',
  '',
  'const app = createApp(App)',
  '',
  'app.mount(\'#app\')',
  '',
]

export function vueAppFile(content: string = 'app') {
  return [
    '<script setup lang="ts">',
    '',
    '</script>',
    '',
    '<template>',
    `  <div>${content}</div>`,
    '</template>',
    '',
    '<style scoped>',
    '',
    '</style>',
    '',
  ]
}

export const reactAppFile = [
  'function App() {',
  '  return (',
  '    <>',
  '       App',
  '    </>',
  '  )',
  '}',
  '',
  'export default App',
  '',
]

export const reactMainFile = [
  'import { StrictMode } from \'react\'',
  'import { createRoot } from \'react-dom/client\'',
  'import App from \'./App.tsx\'',
  'import \'virtual:uno.css\'',
  '',
  'createRoot(document.getElementById(\'root\')!).render(',
  '  <StrictMode>',
  '    <App />',
  '  </StrictMode>',
  ')',
  '',
]

export const tsconfig = [
  '{',
  '  "compilerOptions": {',
  '    "declaration": true,',
  '    "declarationMap": true',
  '  },',
  '  "references": [',
  '    { "path": "./tsconfig.app.json" },',
  '    { "path": "./tsconfig.node.json" }',
  '  ],',
  '  "files": []',
  '}',
]
export function tsconfigApp(appOptions: TsConfigAppOptions) {
  const jsx = appOptions.jsx ?? 'preserve'
  const types = JSON.stringify(appOptions.types ?? [])
  const include = JSON.stringify(appOptions.include ?? [])

  return [
    '{',
    '  "compilerOptions": {',
    '    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",',
    '    "target": "esnext",',
    `    "jsx": "${jsx}",`,
    '    "lib": ["esnext", "DOM", "DOM.Iterable"],',
    '    "moduleDetection": "force",',
    '    "useDefineForClassFields": true,',
    '    "module": "ESNext",',
    '',
    '    /* Bundler mode */',
    '    "moduleResolution": "bundler",',
    `    "types": ${types},`,
    '    "allowImportingTsExtensions": true,',
    '',
    '    /* Linting */',
    '    "strict": true,',
    '    "noFallthroughCasesInSwitch": true,',
    '    "noUnusedLocals": true,',
    '    "noUnusedParameters": true,',
    '    "noEmit": true,',
    '    "verbatimModuleSyntax": true,',
    '    "erasableSyntaxOnly": true,',
    '    "skipLibCheck": true,',
    '    "noUncheckedSideEffectImports": true',
    '  },',
    `  "include": ${include}`,
    '}',
    '',
  ]
}
export function tsconfigNode(nodeOptions: TsconfigNodeOptions) {
  const include = JSON.stringify(nodeOptions.include ?? [])

  return [
    '{',
    '  "compilerOptions": {',
    '    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",',
    '    "target": "esnext",',
    '    "lib": ["esnext"],',
    '    "moduleDetection": "force",',
    '    "module": "ESNext",',
    '',
    '    /* Bundler mode */',
    '    "moduleResolution": "bundler",',
    '    "types": ["node"],',
    '    "allowImportingTsExtensions": true,',
    '',
    '    /* Linting */',
    '    "strict": true,',
    '    "noFallthroughCasesInSwitch": true,',
    '    "noUnusedLocals": true,',
    '    "noUnusedParameters": true,',
    '    "noEmit": true,',
    '    "verbatimModuleSyntax": true,',
    '    "erasableSyntaxOnly": true,',
    '    "skipLibCheck": true,',
    '    "noUncheckedSideEffectImports": true',
    '  },',
    `  "include": ${include}`,
    '}',
    '',
  ]
}

export const npmrc = [
  'shamefully-hoist=true',
  'registry=https://registry.npmmirror.com',
]

export function nuxtConfig(isMonorepo: boolean = false) {
  const config = [
    '// https://nuxt.com/docs/api/configuration/nuxt-config',
    'export default defineNuxtConfig({',
    '  //  compatibilityDate: \'2025-07-15\',',
    '  devtools: { enabled: true },',
    '   modules: [',
    '    \'@unocss/nuxt\',',
    '  ],',
    '})',
  ]

  if (isMonorepo) {
    config[config.length - 1] = ''
    config.push(
      '  srcDir: \'packages/app/\',',
      '    dir: {',
      '      pages: \'pages\',',
      '    },',
      '',
      '  serverDir: \'packages/server/\',',
      '})',
    )
  }

  return config
}

export const nuxtAppPageConfig = [
  '<script setup lang=\'ts\'>',
  '',
  '</script>',
  '',
  '<template>',
  '  <div>',
  '    <nuxt-page />',
  '  </div>',
  '</template>',
]

export const nuxtTsconfig = [
  '{',
  '  "references": [',
  '    {',
  '      "path": ".nuxt/tsconfig.app.json"',
  '    },',
  '    {',
  '      "path": ".nuxt/tsconfig.server.json"',
  '    },',
  '    {',
  '      "path": ".nuxt/tsconfig.shared.json"',
  '    },',
  '    {',
  '      "path": ".nuxt/tsconfig.node.json"',
  '    }',
  '  ],',
  '  // https://nuxt.com/docs/guide/concepts/typescript',
  '  "files": []',
  '}',
]
