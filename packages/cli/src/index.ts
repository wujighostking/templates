#!/usr/bin/env node

import { CAC } from 'cac'
import pkg from '../package.json' with { type: 'json' }

function main() {
  const cli = new CAC('tmes')

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}

main()
