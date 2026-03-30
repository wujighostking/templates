import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'node',
  entry: 'src/index.ts',
  format: 'esm',
  outDir: 'dist',
  sourcemap: false,
  watch: false,
  dts: true,
})
