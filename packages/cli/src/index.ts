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

main()
