import type { UserConfig } from 'tsdown'
import { readdirSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const excludes = ['defaultTemplates']
export const config: UserConfig = readdirSync('./packages').filter(dir => !excludes.includes(dir)).map(dir => ({
  platform: 'node',
  format: 'esm',
  dts: true,
  minify: true,
  clean: true,
  sourcemap: false,
  entry: `./packages/${dir}/src/index.ts`,
  outDir: `./packages/${dir}/dist`,
  watch: `./packages/${dir}/src`,
}))

export default defineConfig(config)
