import { writeFile } from 'node:fs'
import { EOL } from 'node:os'

import { execa, log, pnpm, __dirname } from '@tmes/shared'

import { addDevDependency, getDependencies, getDevDependencies } from '../config/dependencies'

const commitContext = "export default { extends: ['@commitlint/config-conventional'] }" + EOL
export async function commitlintAction() {
  addDevDependency('@commitlint/cli', '@commitlint/config-conventional')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(pnpm, ['pkg', 'set', ...deps], { cwd: __dirname })

    writeFile('commitlint.config.ts', commitContext, { encoding: 'utf-8' }, (err) => {
      if (err) {
        log.error('创建 commitlint 配置失败')
        return
      }

      log.success('成功创建 commitlint 配置')
    })
  } catch {
    log.error('创建 commitlint 配置失败')
  }
}

type DepsMode = 'devDependencies' | 'dependencies'

function formatdeps(deps: string[], versions: string[], mode: DepsMode) {
  return deps.map((dep, index) => `${mode}.${dep}=^${versions[index]}`)
}

async function formatDepsVersion(mode: DepsMode) {
  const depsInstance = mode === 'devDependencies' ? getDevDependencies() : getDependencies()

  try {
    const promises = depsInstance.map(
      async (dependency) =>
        await execa(pnpm, ['view', dependency, 'version'], { cwd: __dirname }).then(
          (res: any) => res.stdout,
        ),
    )

    const versions = await Promise.all(promises)

    const deps = formatdeps(depsInstance, versions, mode)
    return deps
  } catch {
    log.error('获取依赖版本信息失败')
    return []
  }
}
