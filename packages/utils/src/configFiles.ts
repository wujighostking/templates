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

export const viteReactConfig = [
  'import { defineConfig } from \'vite\'',
  'import react from \'@vitejs/plugin-react\'',
  '',
  'export default defineConfig({',
  '  plugins: [',
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

export function webIndexHtmlConfig(id: string, scriptSrc: string, title?: string) {
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

export const reactIndexHtmlConfig = [
  '<!DOCTYPE html>',
  '<html lang="zh">',
  '  <head>',
  '    <meta charset="UTF-8">',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '    <title>Document</title>',
  '  </head>',
  '  <body>',
  '     <div id="root"></div>',
  '     <script type="module" src="/src/main.tsx"></script>',
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
  '  "references": [',
  '    { "path": "./tsconfig.app.json" },',
  '    { "path": "./tsconfig.node.json" }',
  '],',
  '"files": []',
  '}',
]
export const tsconfigApp = [
  '{',
  '  "compilerOptions": {',
  '    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",',
  '    "target": "esnext",',
  '    "jsx": "react-jsx",',
  '    "lib": ["esnext", "DOM", "DOM.Iterable"],',
  '    "moduleDetection": "force",',
  '    "useDefineForClassFields": true,',
  '    "module": "ESNext",',
  '',
  '    /* Bundler mode */',
  '    "moduleResolution": "bundler",',
  '    "types": ["vite/client"],',
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
  '  "include": ["src"]',
  '}',
  '',

]
export const tsconfigNode = [
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
  '  "include": ["vite.config.ts"]',
  '}',
  '',
]
