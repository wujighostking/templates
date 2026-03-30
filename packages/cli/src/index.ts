#!/usr/bin/env node

import { CAC } from 'cac'

function main() {
  const cli = new CAC('tmes')
  cli.command('create', 'Create a new project').action(() => {
    console.log('11111')
  })

  cli.help()
  cli.parse()
}

main()
