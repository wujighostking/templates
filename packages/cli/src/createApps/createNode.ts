import type { BuildToolType, FrameworkType } from '../types'
import { createTemplate } from './creator.ts'

export function createNodeApp(options: { name: string; buildTool: BuildToolType }) {
  if (options.buildTool === 'vite') {
    createTemplate('node-vite' as FrameworkType, options.name)
    return
  }

  createTemplate('node-tsdown' as FrameworkType, options.name)
}
