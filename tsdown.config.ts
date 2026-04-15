import { defineConfig } from 'tsdown'

const isDev =
  process.env.NODE_ENV === 'development' || process.argv.some((arg) => arg.startsWith('--watch'))

export default defineConfig({
  platform: 'node',
  entry: 'src/index.ts',
  format: 'esm',
  outDir: 'dist',
  sourcemap: isDev,
  watch: false,
  dts: true,
  minify: true,
})
