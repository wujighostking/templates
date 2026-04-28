import type { BuildToolType, ProjectType } from '../types'
import { createTemplate } from './creator.ts'

export async function createVueApp(options: {
  name: string
  buildTool: BuildToolType
  type: ProjectType
}) {
  await createTemplate('vue', options.name)
}
