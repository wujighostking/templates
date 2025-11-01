import { EOL } from 'node:os'
import process from 'node:process'
import { commitConfig, eslintConfig, execa, gitignore, join, mkdir, npmrc, pnpm, reactAppFile, reactMainFile, rm, tsconfig, tsconfigApp, tsconfigNode, unoConfig, viteReactConfig, vscodeSettings, webIndexHtmlConfig, writeFile } from '@tm/utils'

export async function createReactProject(dir: string) {
  const cwd = join(process.cwd(), dir)

  try {
    //  创建文件夹
    mkdir(cwd)
    mkdir(join(cwd, '.vscode'))
    mkdir(join(cwd, 'src'))
    mkdir(join(cwd, 'public'))

    writeFile(join(cwd, 'src', 'App.tsx'), reactAppFile.join('\n'))
    writeFile(join(cwd, 'src', 'main.tsx'), reactMainFile.join('\n'))

    writeFile(join(cwd, 'README.md'), '')
    writeFile(join(cwd, '.gitignore'), gitignore.join('\n'))
    writeFile(join(cwd, 'index.html'), webIndexHtmlConfig('root', '/src/main.tsx').join('\n'))
    writeFile(join(cwd, 'vite.config.ts'), viteReactConfig.join('\n'))
    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join('\n'))

    writeFile(join(cwd, '.nvmrc'), process.version.slice(0, 3))
    writeFile(join(cwd, '.npmrc'), npmrc.join(EOL))

    writeFile(join(cwd, '.vscode', 'settings.json'), vscodeSettings.join(''))

    writeFile(join(cwd, 'eslint.config.js'), eslintConfig(['unocss: true,', 'react: true,']).join(EOL))

    writeFile(join(cwd, 'tsconfig.json'), tsconfig.join('\n'))
    writeFile(join(cwd, 'tsconfig.app.json'), tsconfigApp({ jsx: 'react-jsx', types: ['vite/client'], include: ['src'] }).join('\n'))
    writeFile(join(cwd, 'tsconfig.node.json'), tsconfigNode({ include: ['vite.config.ts'] }).join('\n'))

    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss', 'typescript', '@types/node', 'vite', '@vitejs/plugin-react', '@types/react', '@types/react-dom', '@antfu/eslint-config', 'eslint', 'eslint-plugin-format', '@unocss/eslint-plugin', '@eslint-react/eslint-plugin', 'eslint-plugin-react-hooks', 'eslint-plugin-react-refresh']
    const dependencies = ['react', 'react-dom']

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['init'], { cwd })

    await execa(pnpm, ['pkg', 'delete', 'scripts.test'], { cwd })

    // await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'type=module', 'scripts.dev=vite', 'scripts.build=vite build', 'scripts.preview=vite preview', 'scripts.commitlint=commitlint --edit', 'scripts.lint=eslint', 'scripts.lint:fix=eslint --fix', 'scripts.preinstall=npx only-allow pnpm'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })
    await execa(pnpm, ['install', ...dependencies], { stdio: 'inherit', cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })
  }
  catch (error) {
    console.error('执行失败:', error)
    rm(cwd)
  }
}
