import { defineConfig } from 'tsdown'
import { config } from './tsdown.config.build'

export default defineConfig({
  ...config,
  watch: ['./packages/cli/src', './packages/utils/src'],
})
