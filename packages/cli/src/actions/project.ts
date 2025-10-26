import type { JSXOptions } from '@tm/utils'
import process from 'node:process'
import {
  buildToolsSelection,
  commitConfig,
  createConfirm,
  createSelect,
  createText,
  definiteSelection,
  error,
  execa,
  frameworkSelection,
  gitignore,
  isBoolean,
  isEmpty,
  isExisting,
  isString,
  join,

  mkdir,
  parsePath,
  pnpm,
  projectTypeSelection,
  repoSelection,
  rm,
  stringToBoolean,
  tsconfig,
  tsconfigApp,
  tsconfigNode,
  workspaceConfig,
  writeFile,
} from '@tm/utils'
import { createReactProject } from '../react'
import { createVueProject } from '../vue'
import { createApp, createBuildToolConfig, createProjectType, pkgToWorkspace } from './config'

export async function pkgAction(dir: string | undefined, _name: string | undefined, options: { name: string, add: boolean }) {
  /**
   * 100
   * 110
   */
  if (dir && !_name && !options.name) {
    options.name = dir
    dir = undefined
  }
  else if (dir && _name && !options.name) {
    options.name = _name
  }

  const { name, add } = options

  if (!name) {
    console.log((`请填写 ${error('-n, --name <name>')} 选项`))

    return
  }

  const cwd = join(process.cwd(), dir ?? '', name)

  if (isExisting(cwd)) {
    console.log(error(`文件夹 ${name} 已存在`))

    return
  }

  mkdir(cwd)

  try {
    await execa(pnpm, ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'type=module', 'main=dist/index.js', 'module=dist/index.js', 'types=dist/index.d.ts'], { cwd })
    await execa(pnpm, ['pkg', 'set', 'files=["dist"]', 'exports={".": {"import": "./src/index.ts", "require": "./src/index.ts"}}', '--json'], { cwd })
    await execa(pnpm, ['pkg', 'delete', 'scripts.test'], { cwd })

    mkdir(join(cwd, 'src'))
    writeFile(join(cwd, 'src', 'index.ts'), '', { flag: 'w' })

    let isAddToWorkspace: boolean | undefined
    if (isString(add)) {
      isAddToWorkspace = stringToBoolean(add)
    }
    else if (isBoolean(add)) {
      isAddToWorkspace = add
    }

    const shouldConfirm = isEmpty(isAddToWorkspace) ? await createConfirm(definiteSelection) : isAddToWorkspace

    if (shouldConfirm) {
      const filename = 'pnpm-workspace.yaml'
      let cwd = process.cwd()
      let workspacePath = join(cwd, filename)
      let workspaceIsExists = isExisting(workspacePath)
      let packageName = join('')

      while (!workspaceIsExists) {
        const { dir, base, root } = parsePath(cwd)

        cwd = dir
        packageName = join(base, packageName)

        workspacePath = join(cwd, filename)
        workspaceIsExists = isExisting(workspacePath)

        if (dir === root && !workspaceIsExists) {
          console.log(`没有找到 ${error(filename)} 文件`)

          return
        }
      }

      dir = dir ?? packageName

      if (workspaceIsExists) {
        pkgToWorkspace(workspacePath, join(dir ?? '', name))
      }
    }
  }
  catch (error) {
    console.error(error)
    rm(cwd)
  }
}

type ProjectType = 'node' | 'web'
type BuildTool = 'vite' | 'tsdown'

export async function createMonoRepoProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  mkdir(cwd)

  try {
    let projectType: ProjectType = 'node'

    let framework: string = ''
    const buildTool = await createSelect(buildToolsSelection) as BuildTool

    if (buildTool === 'vite') {
      projectType = await createSelect(projectTypeSelection) as ProjectType

      if (projectType === 'web') {
        const frameworkSelected = await createSelect(frameworkSelection)
        framework = isString(frameworkSelected) ? frameworkSelected : ''
      }
    }

    createBuildToolConfig(buildTool, cwd, framework)

    writeFile(join(cwd, '.gitignore'), gitignore.join('\n'))

    mkdir(join(cwd, 'packages'))

    writeFile(join(cwd, 'pnpm-workspace.yaml'), workspaceConfig.join(''))
    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, '.nvmrc'), process.version.slice(0, 3))
    writeFile(join(cwd, '.npmrc'), '')
    writeFile(join(cwd, 'README.md'), '')

    writeTsconfigFile({ cwd, projectType, framework, buildTool })

    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'typescript', '@types/node', buildTool]

    if (framework === 'vue') {
      devDependencies.push('@vitejs/plugin-vue')
    }
    else if (framework === 'react') {
      devDependencies.push('@types/react', '@types/react-dom', '@vitejs/plugin-react')
    }

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'delete', 'scripts.test'], { stdio: 'inherit', cwd })
    await execa(pnpm, ['pkg', 'set', 'type=module', 'private=true', 'scripts.commitlint=commitlint --edit', 'scripts.lint=eslint', 'scripts.lint:fix=eslint --fix', 'scripts.preinstall=npx only-allow pnpm'], { cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { cwd })

    if (buildTool === 'tsdown') {
      await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool} --config=tsdown.config.dev.ts`, `scripts.build=${buildTool} --config=tsdown.config.build.ts`], { cwd })
    }
    else if (buildTool === 'vite') {
      await execa(pnpm, ['pkg', 'set', `scripts.build=${buildTool} build`, `scripts.preview=${buildTool} preview`], { cwd })

      await createProjectType(projectType!, framework, cwd)

      if (framework) {
        await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool}`], { cwd })
        createApp(framework, cwd)

        devDependencies.push('unocss')
      }
      else {
        await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool} build --mode=development`], { cwd })

        devDependencies.push('vite-plugin-dts')
      }
    }

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    if (framework === 'vue') {
      await execa(pnpm, ['install', 'vue'], { stdio: 'inherit', cwd })
    }
    else if (framework === 'react') {
      await execa(pnpm, ['install', 'react', 'react-dom'], { stdio: 'inherit', cwd })
    }

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })
  }
  catch (err) {
    console.error(err)
    rm(cwd)
  }
}

export async function createPolyProject(dir: string) {
  const framework = await createSelect(frameworkSelection)

  if (framework === 'vue') {
    await createVueProject(dir)
  }
  else if (framework === 'react') {
    await createReactProject(dir)
  }
}

export async function createAction(dir: string) {
  const cwd = join(process.cwd(), dir)
  async function create() {
    if (isExisting(cwd)) {
      console.log(error(`目录 ${dir} 已存在`))

      return
    }

    const repoType = await createSelect(repoSelection)

    if (repoType === 'monorepo') {
      await createMonoRepoProject(dir)
    }
    else {
      await createPolyProject(dir)
    }
  }

  await create()

  await execa(pnpm, ['lint:fix'], { cwd, stdio: 'inherit' })
}

interface Options {
  cwd: string
  projectType: ProjectType
  framework: string
  buildTool: BuildTool
}
function writeTsconfigFile(options: Options) {
  const { cwd, projectType, framework, buildTool } = options

  let jsx: JSXOptions
  let types: string[]
  let nodeInclude: string[]

  /**
   * 1.node 项目
   *  - tsdown
   *  - vite
   * 2.web 项目
   *  - vue
   *  - react
   */
  if (projectType === 'node') {
    // todo
    if (buildTool === 'tsdown') {
      jsx = 'react-jsx'
      types = []
      nodeInclude = ['tsdown.config.build.ts', 'tsdown.config.dev.ts']
    }
    else if (buildTool === 'vite') {
      jsx = 'react-jsx'
      types = ['vite/client']
      nodeInclude = ['vite.config.ts']
    }
  }
  else if (projectType === 'web') {
    nodeInclude = ['vite.config.ts']

    if (framework === 'vue') {
      jsx = 'preserve'
      types = ['vite/client']
    }
    else if (framework === 'react') {
      jsx = 'react-jsx'
      types = ['vite/client']
    }
  }

  writeFile(join(cwd, 'tsconfig.json'), tsconfig.join('\n'))
  writeFile(join(cwd, 'tsconfig.app.json'), tsconfigApp({ jsx: jsx!, types: types!, include: ['**/src'] }).join('\n'))
  writeFile(join(cwd, 'tsconfig.node.json'), tsconfigNode({ include: nodeInclude! }).join('\n'))
}

export async function create(dir: string) {
  try {
    if (isEmpty(dir)) {
      dir = await createText({ message: '请输入项目名称', placeholder: 'project-name' })
    }

    if (isEmpty(dir)) {
      console.log(error('创建项目失败，必须输入项目名称！'))

      return
    }

    await createAction(dir)
  }
  catch (error) {
    console.log(error)
  }
}
