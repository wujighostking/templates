import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'

function build() {
  const templatesPath = join(cwd(), 'packages', 'cli', 'dist', 'templates')
  if (!existsSync(templatesPath)) {
    mkdirSync(templatesPath)
  }

  cpSync(join(cwd(), 'packages', 'defaultTemplates'), templatesPath, { recursive: true })
}

build()
