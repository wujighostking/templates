import process from 'node:process'

import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  exports: true,
  sourcemap:
    process.env.npm_lifecycle_event === 'dev' ||
    process.env?.npm_lifecycle_script?.includes('watch'),
  clean: true,
})
