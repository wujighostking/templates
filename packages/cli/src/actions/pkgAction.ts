import { join, isExists, log, __dirname, exit, createFolder } from '@tmes/shared'

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
    await createFolder(pkgPath)
  } catch {}
}
