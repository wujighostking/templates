import { error, execa, isExisting, join, parseYaml, readFile, stringify, tsdownBuildConfig, tsdownConfig, viteNodeConfig, viteVueConfig, vueAppFile, vueMainFile, webIndexHtmlConfig, writeFile } from '@tm/utils'

export function createBuildToolConfig(buildTool: 'vite' | 'tsdown', cwd: string, framework: string | undefined) {
  switch (buildTool) {
    case 'vite':
      createViteConfig(cwd, framework)
      break

    case 'tsdown':
      createTsdownConfig(cwd)
      break
  }
}

function createViteConfig(cwd: string, framework: string | undefined) {
  if (framework === 'vue') {
    writeFile(join(cwd, 'vite.config.ts'), viteVueConfig.join('\n'))
  }
  else {
    writeFile(join(cwd, 'vite.config.ts'), viteNodeConfig.join('\n'))
  }
}

function createTsdownConfig(cwd: string) {
  writeFile(join(cwd, 'tsdown.config.dev.ts'), tsdownConfig.join('\n'))
  writeFile(join(cwd, 'tsdown.config.build.ts'), tsdownBuildConfig.join('\n'))
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

export async function createProjectType(projectType: 'node' | 'web', cwd: string) {
  if (projectType === 'node') {
    await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
  }
  else if (projectType === 'web') {
    writeFile(join(cwd, 'index.html'), webIndexHtmlConfig.join('\n'))
    await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
  }
}

export function createApp(framework: string, cwd: string) {
  if (framework === 'vue') {
    writeFile(join(cwd, 'packages', 'main', 'src', 'App.vue'), vueAppFile.join('\n'), { flag: 'w' })
    writeFile(join(cwd, 'packages', 'main', 'src', 'index.ts'), vueMainFile.join('\n'))
  }
}
