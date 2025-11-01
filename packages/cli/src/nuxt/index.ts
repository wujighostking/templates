import { EOL } from 'node:os'
import process from 'node:process'
import {
  commitConfig,
  eslintConfig,
  execa,
  gitignore,
  join,
  mkdirs,
  npmrc,
  nuxtAppPageConfig,
  nuxtConfig,
  nuxtTsconfig,
  pnpm,
  rm,
  robotsTxt,
  unoConfig,
  vscodeSettings,
  vueAppFile,
  writeFile,
} from '@tm/utils'

export async function createNuxtProject(dir: string) {
  const cwd = join(process.cwd(), dir)

  try {
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
      join(cwd, 'app', 'utils'),

      join(cwd, 'server', 'middleware'),
      join(cwd, 'server', 'api'),
      join(cwd, 'server', 'routes'),
    ])

    writeFile(join(cwd, 'nuxt.config.ts'), nuxtConfig().join('\n'))

    writeFile(join(cwd, 'public', 'robots.txt'), robotsTxt.join(EOL))

    writeFile(join(cwd, 'app', 'pages', 'index.vue'), vueAppFile('<NuxtPage />').join(EOL))

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

    writeFile(join(cwd, 'eslint.config.js'), eslintConfig(['unocss: true', 'vue: true']).join(EOL))

    await execa('git', ['init'], { cwd, stdio: 'inherit' })

    // await execa(pnpm, ['dlx', '@antfu/eslint-config'], { cwd, stdio: 'inherit' })

    const dependencies = ['nuxt', 'vue', 'vue-router']
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', '@types/node', 'unocss', '@unocss/nuxt', '@antfu/eslint-config', 'eslint', 'eslint-plugin-format', '@unocss/eslint-plugin']
    await execa(pnpm, ['install', ...dependencies], { stdio: 'inherit', cwd })
    await execa(pnpm, ['install', ...devDependencies], { stdio: 'inherit', cwd })

    await execa(pnpm, ['nuxt', 'prepare'], { cwd, stdio: 'inherit' })

    await execa('npx', ['simple-git-hooks'], { cwd, stdio: 'inherit' })
  }
  catch (error: any) {
    console.log(error?.message)
    rm(cwd)
  }
}
