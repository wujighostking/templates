import * as process from 'node:process'
import { createSelect, error, frameworkSelection, isExisting, join, repoSelection, rm, writeFile } from '@tm/utils'
import { execa } from 'execa'

export async function createAction(dir: string) {
  async function create() {
    if (isExisting(dir)) {
      console.log(error(`目录 ${dir} 已存在`))

      return
    }

    const repoType = await createSelect(repoSelection)
    await createSelect(frameworkSelection)

    if (repoType === 'monorepo') {
      // TODO
    }
    else {
      await createProject(dir)
    }
  }

  await create()
}

async function createProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks']

    await execa('pnpm.cmd', ['create', 'vue', dir], { stdio: 'inherit' })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.commitlint=commitlint --edit'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.lint=eslint --fix'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.pre-commit=npx lint-staged'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.commit-msg=pnpm commitlint'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged.*=["eslint --fix"]', '--json'], { cwd })

    await execa('pnpm.cmd', ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })

    writeFile(join(cwd, 'commitlint.config.js'), 'export default { extends: [\'@commitlint/config-conventional\'] }')
  }
  catch (error) {
    console.error('执行失败:', error)
    rm(cwd)
  }
}
