import { writeFile } from 'node:fs'
import { EOL } from 'node:os'

import { execa, log, pnpm, __dirname, formatDepsVersion, addDevDependency } from '@tmes/shared'

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
