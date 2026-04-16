import {
  join,
  isExists,
  log,
  __dirname,
  exit,
  createFolder,
  execa,
  pnpm,
  writeFile,
  shouldContinue,
  isRootPath,
} from '@tmes/shared'

export async function pkgAction(options: { dir: string; packageName: string }) {
  const { dir, packageName } = options

  const packageDir = join(__dirname, dir)

  if (!isExists(packageDir)) {
    log.warning(`文件夹 ${dir} 不存在当前目录中，请选择一个已存在的文件夹`)
    exit(1)
  }

  const pkgPath = join(packageDir, packageName)
  if (isExists(pkgPath)) {
    log.warning(`文件夹 ${packageName} 已经存在，请选择一个不存在的包名称`)
    exit(1)
  }

  try {
    const srcPath = join(pkgPath, 'src')
    await createFolder(srcPath)
    await writeFile(join(srcPath, 'index.ts'), '')

    await execa(pnpm, ['init'], { cwd: pkgPath })
    await execa(
      pnpm,
      [
        'pkg',
        'set',
        'files.0=dist',
        'type=module',
        'main=dist/index.js',
        'module=dist/index.js',
        'types=dist/index.d.ts',
      ],
      { cwd: pkgPath },
    )

    const continueAction = await shouldContinue('是否添加到 pnpm-workspace.yaml 中？')
    if (!continueAction) return

    let workspacePath = join(__dirname, 'pnpm-workspace.yaml')
    let currentDirname = __dirname

    while (!isExists(workspacePath) && !isRootPath(currentDirname)) {
      currentDirname = join(currentDirname, '..')

      workspacePath = join(currentDirname, 'pnpm-workspace.yaml')

      if (isRootPath(currentDirname)) {
        log.error('未找到 pnpm-workspace.yaml 文件')
        exit(1)
      }
    }
  } catch {}
}
