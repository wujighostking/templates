import { createSelect, error, isExisting } from '@tm/utils'
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
  }

  await create()
}
