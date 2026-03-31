import { execa, isExists, join, log, pnpm, __dirname } from '@tmes/shared'

import { addDevDependency } from '../config/dependencies'

export async function lintstagedAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('lint-staged')

  try {
    await execa(pnpm, ['pkg', 'set', 'lint-staged.*=["pnpm lint:fix", "pnpm fmt"]', '--json'], {
      cwd: __dirname,
      stdio: 'inherit',
    })

    log.success('成功创建 lint-staged 配置')
  } catch {
    log.error('创建 lint-staged 配置失败')
  }
}
