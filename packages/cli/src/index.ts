#!/usr/bin/env node

import { isArray } from '@tm/utils'
import { CAC } from 'cac'
import { commands } from './commands'

const cli = new CAC()

commands.forEach((_command) => {
  const { action, command, options } = _command

  const commander = cli.command(command.command, command.description)
  if (isArray(options)) {
    options.forEach(({ option = '', description = '', config }) => commander.option(option, description, config))
  }
  else {
    commander.option(options?.option ?? '', options?.description ?? '', options?.config)
  }

  commander.action(action)
})

cli.help()

try {
  cli.parse()
}
catch (error: any) {
  console.log(error.message)
}
