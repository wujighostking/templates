import { writeFile } from 'node:fs'
import { EOL } from 'node:os'

import { log } from '@tmes/shared'

import { addDevDependency } from '../config/dependencies'

const commitContext = "export default { extends: ['@commitlint/config-conventional'] }" + EOL
export function commitlintAction() {
  addDevDependency('@commitlint/cli', '@commitlint/config-conventional')
  writeFile('commitlint.config.ts', commitContext, { encoding: 'utf-8' }, (err) => {
    if (err) {
      log.error('创建 commitlint 配置失败')
      return
    }
    log.success('成功创建 commitlint 配置')
  })
}
