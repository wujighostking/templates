import { __dirname, execa, isCancel, join, pnpm, setDirname, shouldContinue } from '@tmes/shared'

import { lintPreset } from '.'

export async function setLintPreset(name: string) {
  const projectPath = join(__dirname, name)
  setDirname(projectPath)
  await lintPreset()
}

export async function setProjectInit(name?: string) {
  if (name) {
    const projectPath = join(__dirname, name)
    setDirname(projectPath)
  }

  /**
   * 询问是否执行 git init 命令
   */
  const isInit = await shouldContinue('是否执行 git init 命令？')

  /**
   * 询问是否执行 pnpm install 立即下载依赖
   */
  const isInstall = await shouldContinue('是否立即下载依赖')

  // oxlint-disable-next-line no-unused-expressions
  isInit && !isCancel(isInit) && (await execa('git', ['init'], { cwd: __dirname }))
  if (isInstall && !isCancel(isInstall)) {
    await execa(pnpm, ['install'], { cwd: __dirname, stdio: 'inherit' })
    await execa(pnpm, ['approve-builds'], { cwd: __dirname, stdio: 'inherit' })
  }
}
