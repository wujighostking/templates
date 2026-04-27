import type { BuildToolType, ProjectType } from '../types'
import { createTemplate } from './creator.ts'

export function createVueApp(options: {
  name: string
  buildTool: BuildToolType
  type: ProjectType
}) {
  createTemplate('vue', options.name)
}
