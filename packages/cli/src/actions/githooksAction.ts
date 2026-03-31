import { execa, __dirname, join, log, isExists, pnpm } from '@tmes/shared'

import { addDevDependency } from '../config/dependencies'

export async function githooksAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('simple-git-hooks')

  try {
    await execa(
      pnpm,
      [
        'pkg',
        'set',
        'simple-git-hooks.pre-commit=lint-staged',
        'simple-git-hooks.commit-msg=commitlint --edit',
        'scripts.prepare=simple-git-hooks',
      ],
      {
        cwd: __dirname,
      },
    )

    log.success('成功创建 simple-git-hooks 配置')
  } catch {
    log.error('创建 simple-git-hooks 配置失败')
  }
}
