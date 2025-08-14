import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

export const config: UserConfig = {
  platform: 'node',
  format: 'esm',
  dts: true,
  minify: true,
  clean: false,
  sourcemap: false,
  entry: './packages/cli/src/index.ts',
  outDir: './packages/cli/dist',
}

export default defineConfig(config)
