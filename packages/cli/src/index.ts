import process from 'node:process'

import { log } from '@tmes/shared'
import { CAC } from 'cac'

import pkg from '../package.json' with { type: 'json' }
import { commands } from './commands'

function main() {
  const cli = new CAC('tmes')
  commands.forEach(({ command, options, action }) => {
    const c = cli.command(...command)

    options?.forEach((option) => c.option(...option))

    c.action(action)
  })

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}

function handleError() {
  process.on('uncaughtException', (err) => {
    log.error(err.message)
  })
}

handleError()
main()
