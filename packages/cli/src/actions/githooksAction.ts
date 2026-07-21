import {
  execa,
  __dirname,
  join,
  log,
  isExists,
  pnpm,
  addDevDependency,
  formatDepsVersion,
} from '@tmes/shared'

export async function githooksAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('simple-git-hooks')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(
      pnpm,
      [
        'pkg',
        'set',
        '["simple-git-hooks"]["pre-commit"]=pnpx lint-staged',
        '["simple-git-hooks"]["commit-msg"]=pnpx commitlint --edit',
        'scripts["prepare"]="simple-git-hooks"',

        ...deps,
      ],
      {
        cwd: __dirname,
        stdio: 'inherit',
      },
    )

    log.success('成功创建 simple-git-hooks 配置')
  } catch {
    log.error('创建 simple-git-hooks 配置失败')
  }
}
