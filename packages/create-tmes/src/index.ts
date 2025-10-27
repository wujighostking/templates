#!/usr/bin/env node

import process from 'node:process'
import {
  commitlintAction,
  cpTemplateAction,
  create,
  createAction,
  gitHooksAction,
  lintStagedAction,
  pkgAction,
  showTemplatesAction,
} from '@tmes/cli/src/actions'
import mri from 'mri'

function main() {
  const argv = mri(process.argv.slice(2))

  const [arg_0, ...args] = argv._

  switch (arg_0) {
    case 'create':
      createAction(args[0] ?? '')
      return

    case 'pkg':
      pkgAction(args[0], args[1], { name: argv.name, add: argv.add ?? argv.a })
      return

    case 'cp':
    {
      const template = args[0]

      if (!template)
        return

      cpTemplateAction(template, args[1] ?? template)
      return
    }

    case 'ls':
      showTemplatesAction()
      return

    case 'commitlint':
      commitlintAction()
      return

    case 'git-hooks':
      gitHooksAction()
      return

    case 'lint-staged':
      lintStagedAction()
      return
  }

  create(arg_0)
}

main()
