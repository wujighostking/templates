import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron({
      // 主进程入口，构建产物输出到 dist-electron/main.js
      main: {
        entry: 'src/main.ts',
      },
      // 预加载脚本，构建产物输出到 dist-electron/preload.js
      preload: {
        input: 'src/preload.ts',
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
})
