import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'node',
  format: 'esm',
  dts: true,
  minify: true,
  entry: './packages/cli/src/index.ts',
  outDir: './packages/cli/dist',
  watch: './packages/cli/src',
})
