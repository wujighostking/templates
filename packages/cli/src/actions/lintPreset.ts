import { commitlintAction } from './commitlintAction'
import { githooksAction } from './githooksAction'
import { lintstagedAction } from './lintstagedAction'
import { oxfmtAction } from './oxfmtAction'
import { oxlintAction } from './oxlintAction'

export function lintPreset() {
  commitlintAction()
  githooksAction()
  lintstagedAction()
  oxlintAction()
  oxfmtAction()
}
