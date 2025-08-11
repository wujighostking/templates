#!/usr/bin/env node

import { CAC } from 'cac'
import { commands } from './commands'

const cli = new CAC()

commands.forEach((_command) => {
  const { action, command, options } = _command

  cli.command(command.command, command.description)?.option(options?.option ?? '', options?.description ?? '').action(action)
})

cli.help()

try {
  cli.parse()
}
catch (error: any) {
  console.log(error.message)
}
