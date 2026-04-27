import type { BuildToolType, FrameworkType } from '../types'
import { createTemplate } from './creator.ts'

export async function createMonorepoApp(options: {
  name: string
  framework: FrameworkType[]
  buildTool: BuildToolType
}) {
  await createTemplate('monorepo' as FrameworkType, options.name)

  for (const framework of options.framework) {
    if (framework === 'node') {
      await createTemplate(
        `node-${options.buildTool}` as FrameworkType,
        `./${options.name}/packages/template-${framework}`,
      )
      continue
    }

    await createTemplate(framework, `./${options.name}/packages/template-${framework}`)
  }
}
