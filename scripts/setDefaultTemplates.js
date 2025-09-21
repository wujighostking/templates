import { exec, execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'

exec('npm list -g @tmes/cli', (error) => {
  if (error) {
    const templatesPath = join(cwd(), 'packages', 'cli', 'dist', 'templates')
    if (!existsSync(templatesPath)) {
      mkdirSync(templatesPath)
    }

    cpSync(join(cwd(), 'packages', 'defaultTemplates'), templatesPath, { recursive: true })

    return
  }

  execSync('tm set packages/defaultTemplates/service service')
  execSync('tm set packages/defaultTemplates/pinia pinia')
  execSync('tm set packages/defaultTemplates/redux redux')
  execSync('tm set packages/defaultTemplates/vuex vuex')
  execSync('tm set packages/defaultTemplates/zustand zustand')
})
