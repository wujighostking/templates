import type { UiKeys } from '@tm/utils'
import { EOL } from 'node:os'
import process from 'node:process'
import {
  ciWorkflow,
  commitConfig,
  createSelect,
  eslintConfig,
  execa,
  gitignore,
  isEmpty,
  join,
  mkdirs,
  npmrc,
  nuxtAppPageConfig,
  nuxtConfig,
  nuxtTsconfig,
  nuxtuiMap,
  pnpm,
  rm,
  robotsTxt,
  unoConfig,
  vscodeSettings,
  vueAppFile,
  vueElementPlusX,
  vueUiSelection,
  writeFile,
} from '@tm/utils'
import { createWorkflow } from '../actions'

export async function createNuxtProject(dir: string) {
  const cwd = join(process.cwd(), dir)

  const dependencies = ['nuxt', 'vue', 'vue-router', '@unocss/reset']
  const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', '@types/node', 'unocss', '@unocss/nuxt', '@antfu/eslint-config', 'eslint', 'eslint-plugin-format', '@unocss/eslint-plugin']

  try {
    const uiSelection = await createSelect(vueUiSelection) as UiKeys

    mkdirs([
      cwd,
      join(cwd, 'app'),
      join(cwd, 'server'),
      join(cwd, 'shared'),
      join(cwd, 'public'),
      join(cwd, '.vscode'),

      join(cwd, 'app', 'assets'),
      join(cwd, 'app', 'components'),
      join(cwd, 'app', 'composables'),
      join(cwd, 'app', 'pages'),
      join(cwd, 'app', 'plugins'),
      join(cwd, 'app', 'utils'),

      join(cwd, 'server', 'middleware'),
      join(cwd, 'server', 'api'),
      join(cwd, 'server', 'routes'),
    ])

    if (uiSelection === 'vue-element-plus-x') {
      writeFile(join(cwd, 'app', 'plugins', 'vue-element-plus-x.client.ts'), vueElementPlusX.join(EOL))

      dependencies.push('vue-element-plus-x')
    }

    if (!isEmpty(uiSelection) && nuxtuiMap[uiSelection]) {
      dependencies.push(nuxtuiMap[uiSelection])
    }

    writeFile(join(cwd, 'nuxt.config.ts'), nuxtConfig(false, uiSelection).join('\n'))

    writeFile(join(cwd, 'public', 'robots.txt'), robotsTxt.join(EOL))

    writeFile(join(cwd, 'app', 'pages', 'index.vue'), vueAppFile('index').join(EOL))

    writeFile(join(cwd, '.vscode', 'settings.json'), vscodeSettings.join(''))

    await execa(pnpm, ['init'], { stdio: 'inherit', cwd })

    await execa(
      pnpm,
      [
        'pkg',
        'set',
        'type=module',
        'private=true',
        'scripts.build=nuxt build',
        'scripts.dev=nuxt dev',
        'scripts.generate=nuxt generate',
        'scripts.preview=nuxt preview',
        'scripts.postinstall=nuxt prepare',
        'scripts.lint=eslint',
        'scripts.lint:fix=eslint --fix',
        'scripts.preinstall=npx only-allow pnpm',
      ],
      { stdio: 'inherit', cwd },
    )

    await execa(pnpm, [
      'pkg',
      'set',
      'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}',
      'lint-staged={"*": ["eslint --fix"]}',
      '--json',
    ], { cwd })

    writeFile(join(cwd, 'app', 'app.vue'), nuxtAppPageConfig.join(EOL))
    writeFile(join(cwd, '.gitignore'), gitignore.join(EOL))

    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join(EOL))
    writeFile(join(cwd, '.nvmrc'), process.version.slice(0, 3))
    writeFile(join(cwd, '.npmrc'), npmrc.join(EOL))
    writeFile(join(cwd, 'README.md'), '')

    writeFile(join(cwd, 'tsconfig.json'), nuxtTsconfig.join(EOL))

    writeFile(join(cwd, 'eslint.config.js'), eslintConfig(['unocss: true,', 'vue: true,']).join(EOL))

    createWorkflow(cwd, 'ci.yml', ciWorkflow())

    await execa('git', ['init'], { cwd, stdio: 'inherit' })

    await execa(pnpm, ['install', ...dependencies], { stdio: 'inherit', cwd })
    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    await execa(pnpm, ['nuxt', 'prepare'], { cwd, stdio: 'inherit' })

    await execa('npx', ['simple-git-hooks'], { cwd, stdio: 'inherit' })
  }
  catch (error: any) {
    console.log(error?.message)
    rm(cwd)
  }
}
