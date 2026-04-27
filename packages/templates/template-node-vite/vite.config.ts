import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      formats: ['es'],
      fileName: createRequire(import.meta.url)?.('./package.json').name,
    },
  },

  plugins: [dts({ rollupTypes: true })],
})
