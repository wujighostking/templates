import process from 'node:process'
import {
  buildToolsSelection,
  commitConfig,
  createConfirm,
  createSelect,
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
  workspaceConfig,
  writeFile,
} from '@tm/utils'
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
    await execa(pnpm, ['pkg', 'set', 'files=["dist"]', '--json'], { cwd })
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

export async function createMonoRepoProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  mkdir(cwd)

  try {
    let projectType: 'node' | 'web'
    let framework: string | undefined
    const buildTool = await createSelect(buildToolsSelection) as 'vite' | 'tsdown'

    if (buildTool === 'vite') {
      projectType = await createSelect(projectTypeSelection) as 'node' | 'web'

      if (projectType === 'web') {
        const frameworkSelected = await createSelect(frameworkSelection)
        framework = isString(frameworkSelected) ? frameworkSelected : undefined
      }
    }

    createBuildToolConfig(buildTool, cwd, framework)

    writeFile(join(cwd, '.gitignore'), gitignore.join('\n'))

    mkdir(join(cwd, 'packages'))

    writeFile(join(cwd, 'pnpm-workspace.yaml'), workspaceConfig.join(''))
    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, '.nvmrc'), process.version)
    writeFile(join(cwd, '.npmrc'), '')
    writeFile(join(cwd, 'README.md'), '')

    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'typescript', '@types/node', buildTool]

    if (framework === 'vue') {
      devDependencies.push('@vitejs/plugin-vue')
    }

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['init'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'delete', 'scripts.test'], { stdio: 'inherit', cwd })
    await execa(pnpm, ['pkg', 'set', 'type=module', 'private=true', 'scripts.commitlint=commitlint --edit', 'scripts.lint=eslint --fix'], { cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { cwd })

    if (buildTool === 'tsdown') {
      await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool} --config=tsdown.config.dev.ts`, `scripts.build=${buildTool} --config=tsdown.config.build.ts`], { cwd })
    }
    else if (buildTool === 'vite') {
      await execa(pnpm, ['pkg', 'set', `scripts.build=${buildTool} build`, `scripts.preview=${buildTool} preview`], { cwd })

      await createProjectType(projectType!, cwd)

      if (isString(framework)) {
        await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool}`], { cwd })
        createApp(framework, cwd)
      }
      else {
        await execa(pnpm, ['pkg', 'set', `scripts.dev=${buildTool} build --mode=development`], { cwd })
      }
    }

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    if (isString(framework)) {
      await execa(pnpm, ['install', framework], { stdio: 'inherit', cwd })
    }

    await execa('npx', ['tsc', '--init'], { cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })
  }
  catch (err) {
    console.error(err)
    rm(cwd)
  }
}

export async function createAction(dir: string) {
  async function create() {
    if (isExisting(join(process.cwd(), dir))) {
      console.log(error(`目录 ${dir} 已存在`))

      return
    }

    const repoType = await createSelect(repoSelection)

    if (repoType === 'monorepo') {
      await createMonoRepoProject(dir)
    }
    else {
      await createSelect(frameworkSelection)
      await createVueProject(dir)
    }
  }

  await create()
}
