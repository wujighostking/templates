import { commitlintAction } from './commitlintAction'
import { githooksAction } from './githooksAction'
import { lintstagedAction } from './lintstagedAction'
import { oxfmtAction } from './oxfmtAction'
import { oxlintAction } from './oxlintAction'

export async function lintPreset() {
  await commitlintAction()
  await githooksAction()
  await lintstagedAction()
  await oxlintAction()
  await oxfmtAction()
}
