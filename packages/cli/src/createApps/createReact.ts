import type { BuildToolType, ProjectType } from '../types'
import { createTemplate } from './creator.ts'

export function createReactApp(options: {
  name: string
  buildTool: BuildToolType
  type: ProjectType
}) {
  createTemplate('react', options.name)
}
