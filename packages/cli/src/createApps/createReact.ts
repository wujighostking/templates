import type { BuildToolType, ProjectType } from '../types'
import { createTemplate } from './creator.ts'

export async function createReactApp(options: {
  name: string
  buildTool: BuildToolType
  type: ProjectType
}) {
  await createTemplate('react', options.name)
}
