import { execa, formatDepsVersion, getDepsFromPackage, join, pnpm } from '@tmes/shared'

import type { BuildToolType, FrameworkType } from '../types'
import { createTemplate } from './creator.ts'

export async function createMonorepoApp(options: {
  name: string
  framework: FrameworkType[]
  buildTool: BuildToolType
}) {
  await createTemplate('monorepo' as FrameworkType, options.name)

  for (const framework of options.framework) {
    const subpackagePath = `./${options.name}/packages/template-${framework}`

    if (framework === 'node') {
      await createTemplate(`node-${options.buildTool}` as FrameworkType, subpackagePath)
    } else {
      await createTemplate(framework, subpackagePath)
    }

    const { dependencies, devDependencies } = await getDepsFromPackage(subpackagePath)
    const devDeps = await formatDepsVersion('devDependencies', Object.keys(devDependencies))
    const deps = await formatDepsVersion('dependencies', Object.keys(dependencies))
    await execa(pnpm, ['pkg', 'set', ...devDeps, ...deps], {
      cwd: join(process.cwd(), subpackagePath),
    })
  }
}
