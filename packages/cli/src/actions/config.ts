import { EOL } from 'node:os'
import { error, isExisting, join, nuxtConfig, parsePath, parseYaml, reactAppFile, reactMainFile, readFile, stringify, tsdownBuildConfig, tsdownConfig, viteNodeConfig, viteReactConfig, viteVueConfig, vueAppFile, vueMainFile, webIndexHtmlConfig, writeFile } from '@tm/utils'
import { pkgAction } from './project'

export function createBuildToolConfig(buildTool: 'vite' | 'tsdown' | 'nuxt', cwd: string, framework: string | undefined) {
  switch (buildTool) {
    case 'vite':
      createViteConfig(cwd, framework)
      break

    case 'tsdown':
      createTsdownConfig(cwd)
      break

    case 'nuxt':
      createNuxtConfig(cwd)
      break
  }
}

function createViteConfig(cwd: string, framework: string | undefined) {
  if (framework === 'vue') {
    writeFile(join(cwd, 'vite.config.ts'), viteVueConfig.join('\n'))
  }
  else if (framework === 'react') {
    writeFile(join(cwd, 'vite.config.ts'), viteReactConfig.join('\n'))
  }
  else {
    writeFile(join(cwd, 'vite.config.ts'), viteNodeConfig.join('\n'))
  }
}

function createTsdownConfig(cwd: string) {
  writeFile(join(cwd, 'tsdown.config.dev.ts'), tsdownConfig.join('\n'))
  writeFile(join(cwd, 'tsdown.config.build.ts'), tsdownBuildConfig.join('\n'))
}

function createNuxtConfig(cwd: string) {
  writeFile(join(cwd, 'nuxt.config.ts'), nuxtConfig(true).join(EOL))
}

export function pkgToWorkspace(file: string, pkg: string) {
  if (!isExisting(file)) {
    console.log(error('pnpm-workspace.yaml 文件不存在'))

    return
  }

  const sourceText = readFile(file)

  const ast = parseYaml(sourceText)

  ast.packages = [...(ast.packages || []), pkg.replaceAll('\\', '/')]

  writeFile(file, stringify(ast))
}

export async function createProjectType(projectType: 'node' | 'web' | 'nuxt', framework: string | undefined, cwd: string) {
  const { name: dir } = parsePath(cwd)

  if (projectType === 'node') {
    // await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
    await pkgAction(join(dir, 'packages'), 'main', { name: 'main', add: false })
  }
  else if (projectType === 'web') {
    if (framework === 'vue') {
      writeFile(
        join(cwd, 'index.html'),
        webIndexHtmlConfig('app', './packages/main/src/main.ts').join('\n'),
      )
      // await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
      await pkgAction(join(dir, 'packages'), 'main', { name: 'main', add: false })
    }
    else if (framework === 'react') {
      writeFile(
        join(cwd, 'index.html'),
        webIndexHtmlConfig('root', './packages/main/src/main.tsx').join('\n'),
      )
      // await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
      await pkgAction(join(dir, 'packages'), 'main', { name: 'main', add: false })
    }
  }
}

export function createApp(framework: string, cwd: string) {
  if (framework === 'vue') {
    writeFile(join(cwd, 'packages', 'main', 'src', 'App.vue'), vueAppFile().join('\n'), { flag: 'w' })
    writeFile(join(cwd, 'packages', 'main', 'src', 'main.ts'), vueMainFile.join('\n'))
  }
  else if (framework === 'react') {
    writeFile(join(cwd, 'packages', 'main', 'src', 'App.tsx'), reactAppFile.join('\n'), { flag: 'w' })
    writeFile(join(cwd, 'packages', 'main', 'src', 'main.tsx'), reactMainFile.join('\n'))
  }
}
