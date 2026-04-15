import {
  execa,
  log,
  pnpm,
  __dirname,
  formatDepsVersion,
  addDevDependency,
  writeFile,
  EOL,
} from '@tmes/shared'

const commitContext = "export default { extends: ['@commitlint/config-conventional'] }" + EOL
export async function commitlintAction() {
  addDevDependency('@commitlint/cli', '@commitlint/config-conventional')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(pnpm, ['pkg', 'set', ...deps], { cwd: __dirname })

    await writeFile('commitlint.config.ts', commitContext, (err) => {
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
