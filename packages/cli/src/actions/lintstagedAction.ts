import {
  execa,
  isExists,
  join,
  log,
  pnpm,
  __dirname,
  addDevDependency,
  formatDepsVersion,
} from '@tmes/shared'

export async function lintstagedAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('lint-staged')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(pnpm, ['pkg', 'set', ...deps], { cwd: __dirname })
    await execa(pnpm, ['pkg', 'set', 'lint-staged.*=["pnpm lint:fix", "pnpm fmt"]', '--json'], {
      cwd: __dirname,
    })

    log.success('成功创建 lint-staged 配置')
  } catch {
    log.error('创建 lint-staged 配置失败')
  }
}
