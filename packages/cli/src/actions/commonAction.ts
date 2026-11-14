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
  const isInit = await shouldContinue('是否执行 git init 命令？', true)

  isCancel(isInit)
  /**
   * 询问是否执行 pnpm install 立即下载依赖
   */
  const isInstall = await shouldContinue('是否立即下载依赖', true)

  isCancel(isInstall)

  isInit && (await execa('git', ['init'], { cwd: __dirname }))
  if (isInstall) {
    // 第一次 install：下载依赖。非交互环境下 pnpm 10+ 会因依赖构建脚本未批准而报
    // ERR_PNPM_IGNORED_BUILDS，这里用 reject: false 允许失败，不中断流程
    await execa(pnpm, ['install'], { cwd: __dirname, stdio: 'inherit', reject: false })
    // 非交互批准所有待构建的依赖（写入 allowBuilds，并执行其 postinstall）
    await execa(pnpm, ['approve-builds', '--all'], { cwd: __dirname })
    // 第二次 install：白名单已就位，正常执行依赖构建脚本
    await execa(pnpm, ['install'], { cwd: __dirname, stdio: 'inherit' })
  }
}
