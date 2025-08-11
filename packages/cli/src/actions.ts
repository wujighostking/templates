import * as process from 'node:process'
import { createSelect, error, isExisting, join } from '@tm/utils'
import { execa } from 'execa'
import { frameworkSelection, repoSelection } from '../../utils/src/selections'

export async function createAction(dir: string) {
  async function create() {
    if (isExisting(dir)) {
      console.log(error(`目录 ${dir} 已存在`))

      return
    }

    const repoType = await createSelect(repoSelection)
    const framework = await createSelect(frameworkSelection)
    console.log(repoType, framework)

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
  try {
    await execa('pnpm.cmd', ['create', 'vue', dir], { stdio: 'inherit' })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd: join(process.cwd(), dir) })
  }
  catch (error) {
    console.error('执行失败:', error)
  }
}
