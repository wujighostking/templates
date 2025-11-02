import { EOL } from 'node:os'
import process from 'node:process'
import {
  ciWorkflow,
  commitConfig,
  eslintConfig,
  execa,
  gitignore,
  join,
  mkdirs,
  npmrc,
  pnpm,
  rm,
  tsconfig,
  tsconfigApp,
  tsconfigNode,
  unoConfig,
  viteVueConfig,
  vscodeSettings,
  vscodeVueExtensions,
  vueAppFile,
  vueEnvConfig,
  vueMainFile,
  webIndexHtmlConfig,
  writeFile,
} from '@tm/utils'
import { createWorkflow } from '../actions'

export async function createVueProject(dir: string) {
  const cwd = join(process.cwd(), dir)

  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss', 'unplugin-auto-import', '@antfu/eslint-config', 'eslint', 'eslint-plugin-format', '@unocss/eslint-plugin', '@vitejs/plugin-vue', 'vite', '@types/node', 'typescript']

    mkdirs([
      cwd,
      join(cwd, '.vscode'),
      join(cwd, 'public'),
      join(cwd, 'src'),
    ])

    writeFile(join(cwd, '.vscode', 'extensions.json'), vscodeVueExtensions.join(EOL))
    writeFile(join(cwd, 'src', 'main.ts'), vueMainFile.join(EOL))
    writeFile(join(cwd, 'src', 'App.vue'), vueAppFile().join(EOL))

    writeFile(join(cwd, 'README.md'), '')
    writeFile(join(cwd, '.gitignore'), gitignore.join(EOL))
    writeFile(join(cwd, 'index.html'), webIndexHtmlConfig('app', '/src/main.ts').join(EOL))
    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join(EOL))
    writeFile(join(cwd, 'vite.config.ts'), viteVueConfig(false).join(EOL))
    writeFile(join(cwd, 'env.d.ts'), vueEnvConfig.join(EOL))
    writeFile(join(cwd, 'tsconfig.json'), tsconfig.join(EOL))
    writeFile(join(cwd, 'tsconfig.app.json'), tsconfigApp({ jsx: 'preserve', types: ['vite/client'], include: ['src'] }).join(EOL))
    writeFile(join(cwd, 'tsconfig.node.json'), tsconfigNode({ include: ['vite.config.ts'] }).join(EOL))

    writeFile(join(cwd, '.nvmrc'), process.version.slice(0, 3))
    writeFile(join(cwd, '.npmrc'), npmrc.join(EOL))

    writeFile(join(cwd, 'eslint.config.js'), eslintConfig(['unocss: true,', 'vue: true,']).join(EOL))

    createWorkflow(cwd, 'ci.yml', ciWorkflow())

    writeFile(join(cwd, '.vscode', 'settings.json'), vscodeSettings.join(''))

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpm', ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, [
      'pkg',
      'set',
      'private=true',
      'type=module',
      'scripts.dev=vite',
      'scripts.build=vite build',
      'scripts.preview=vite preview',
      'scripts.commitlint=commitlint --edit',
      'scripts.lint=eslint',
      'scripts.lint:fix=eslint --fix',
      'scripts.preinstall=npx only-allow pnpm',
    ], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })
    await execa(pnpm, ['install', 'vue'], { stdio: 'inherit', cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })
  }
  catch (error) {
    console.error('执行失败:', error)
    rm(cwd)
  }
}
