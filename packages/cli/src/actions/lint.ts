import process from 'node:process'
import { commitConfig, error, execa, isExisting, join, pnpm, writeFile } from '@tm/utils'

export async function commitlintAction() {
  const cwd = process.cwd()
  const packagePath = join(cwd, 'package.json')

  if (!isExisting(packagePath)) {
    console.log(error('packages.json 文件不存在'))

    return
  }

  writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
  await execa(pnpm, ['pkg', 'set', 'scripts.commitlint=commitlint --edit'], { cwd, stdio: 'inherit' })
  await execa(pnpm, ['i', '-D', '@commitlint/cli', '@commitlint/config-conventional'], { cwd, stdio: 'inherit' })
}

export async function gitHooksAction() {
  const cwd = process.cwd()
  const packagePath = join(cwd, 'package.json')

  if (!isExisting(packagePath)) {
    console.log(error('packages.json 文件不存在'))

    return
  }

  if (!isExisting(join(cwd, '.git'))) {
    console.log(error('当前目录不是 git 仓库'))

    return
  }

  await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', '--json'], { cwd, stdio: 'inherit' })
  await execa(pnpm, ['i', 'simple-git-hooks', '-D'], { cwd, stdio: 'inherit' })
  await execa(pnpm, ['simple-git-hooks'], { cwd, stdio: 'inherit' })
}

export async function lintStagedAction() {
  const cwd = process.cwd()
  const packagePath = join(cwd, 'package.json')

  if (!isExisting(packagePath)) {
    console.log(error('packages.json 文件不存在'))

    return
  }

  await execa(pnpm, ['pkg', 'set', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { cwd, stdio: 'inherit' })
  await execa(pnpm, ['i', 'lint-staged', '-D'], { cwd, stdio: 'inherit' })
}
