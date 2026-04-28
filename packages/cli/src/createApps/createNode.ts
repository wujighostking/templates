import type { BuildToolType, FrameworkType } from '../types'
import { createTemplate } from './creator.ts'

export async function createNodeApp(options: { name: string; buildTool: BuildToolType }) {
  if (options.buildTool === 'vite') {
    await createTemplate('node-vite' as FrameworkType, options.name)
    return
  }

  await createTemplate('node-tsdown' as FrameworkType, options.name)
}
