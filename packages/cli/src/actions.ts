import type { ArrayExpression, NodePath } from '@tmes/utils'
import * as process from 'node:process'
import {
  __dirname,
  buildToolsSelection,
  commitConfig,
  copy,
  createConfirm,
  createSelect,
  definiteSelection,
  error,
  execa,
  frameworkSelection,
  generate,
  gitignore,
  isAbsolutePath,
  isBoolean,
  isEmpty,
  isExisting,
  isString,
  join,
  mkdir,
  parse,
  parsePath,
  parseYaml,
  projectTypeSelection,
  readdir,
  readFile,
  repoSelection,
  rm,
  stringify,
  stringToBoolean,
  traverse,
  tsdownBuildConfig,
  tsdownConfig,
  types,
  unoConfig,
  viteConfig,
  viteVueConfig,
  vueAppFile,
  vueMainFile,
  warning,
  webIndexHtmlConfig,
  workspaceConfig,
  writeFile,
} from '@tm/utils'

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
      await createProject(dir)
    }
  }

  await create()
}

async function createMonoRepoProject(dir: string) {
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

    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'typescript', '@types/node', buildTool]

    if (framework === 'vue') {
      devDependencies.push('@vitejs/plugin-vue')
    }

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['pkg', 'delete', 'scripts.test'], { stdio: 'inherit', cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'type=module'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'private=true'], { cwd })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    if (isString(framework)) {
      await execa('pnpm.cmd', ['install', framework], { stdio: 'inherit', cwd })
    }

    await execa('npx', ['tsc', '--init'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.commitlint=commitlint --edit'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.lint=eslint --fix'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.pre-commit=npx lint-staged'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.commit-msg=pnpm commitlint'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged.*=["eslint --fix"]', '--json'], { cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })

    if (buildTool === 'tsdown') {
      await execa('pnpm.cmd', ['pkg', 'set', `scripts.dev=${buildTool} --config=tsdown.config.dev.ts`], { cwd })
      await execa('pnpm.cmd', ['pkg', 'set', `scripts.build=${buildTool} --config=tsdown.config.build.ts`], { cwd })
    }
    else if (buildTool === 'vite') {
      await execa('pnpm.cmd', ['pkg', 'set', `scripts.dev=${buildTool}`], { cwd })
      await execa('pnpm.cmd', ['pkg', 'set', `scripts.build=${buildTool} build`], { cwd })
      await execa('pnpm.cmd', ['pkg', 'set', `scripts.preview=${buildTool} preview`], { cwd })

      await createProjectType(projectType!, cwd)

      if (isString(framework)) {
        createApp(framework, cwd)
      }
    }
  }
  catch (err) {
    console.error(err)
    rm(cwd)
  }
}

async function createProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss', 'unplugin-auto-import']

    await execa('pnpm.cmd', ['create', 'vue', dir], { stdio: 'inherit' })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.commitlint=commitlint --edit'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.lint=eslint --fix'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.pre-commit=npx lint-staged'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.commit-msg=pnpm commitlint'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged.*=["eslint --fix"]', '--json'], { cwd })

    await execa('pnpm.cmd', ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })

    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join('\n'))

    mainAddUnoCss(join(cwd, 'src', 'main.ts'))
    setViteConfig(join(cwd, 'vite.config.ts'))
    addTypings(join(cwd, 'env.d.ts'))
    addGitIgnoreFile(join(cwd, '.gitignore'))
  }
  catch (error) {
    console.error('执行失败:', error)
    rm(cwd)
  }
}

function mainAddUnoCss(file: string) {
  const sourceText = readFile(file)
  const ast = parse(sourceText, { sourceType: 'module' })

  traverse(ast, {
    Program(path) {
      const lastImport = path.get('body.1')
      if (lastImport.isImportDeclaration()) {
        const newImport = types.importDeclaration(
          [],
          types.stringLiteral('virtual:uno.css'),
        )
        lastImport.insertAfter(newImport)
      }
    },
  })

  const targetCode = generate(ast, {
    jsescOption: {
      quotes: 'single',
    },
  }, sourceText).code

  writeFile(file, targetCode)
}

function setViteConfig(file: string) {
  const sourceText = readFile(file)
  const ast = parse(sourceText, { sourceType: 'module' })

  traverse(ast, {
    Program(path) {
      const firstImport = path.get('body.0')

      if (firstImport.isImportDeclaration()) {
        const unoCssImport = types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('UnoCSS'))],
          types.stringLiteral('unocss/vite'),
        )
        firstImport.insertAfter(unoCssImport)

        const autoImport = types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('AutoImport'))],
          types.stringLiteral('unplugin-auto-import/vite'),
        )
        firstImport.insertAfter(autoImport)
      }
    },

    ArrayExpression(path: NodePath<ArrayExpression>) {
      // 检查是否是 `plugins` 属性的数组
      if (types.isObjectProperty(path.parent) && 'name' in path.parent.key && path.parent.key.name === 'plugins') {
        const unoCSSNode = types.callExpression(
          types.identifier('UnoCSS'),
          [],
        )
        const autoImportNode = types.callExpression(
          types.identifier('AutoImport'),
          [
            types.objectExpression([
              // imports: ['vue']
              types.objectProperty(types.identifier('imports'), types.arrayExpression([types.stringLiteral('vue')])),

              // dts: "typings/auto-imports.d.ts"
              types.objectProperty(types.identifier('dts'), types.stringLiteral('typings/auto-imports.d.ts')),
            ]),
          ],
        )

        path.node.elements.unshift(unoCSSNode, autoImportNode)
      }
    },
  })

  const targetCode = generate(ast, {
    jsescOption: {
      quotes: 'single',
    },
  }, sourceText).code

  writeFile(file, targetCode)
}

function addTypings(file: string) {
  writeFile(file, `/// <reference types="./typings/auto-imports" />`, { flag: 'a' })
}

function addGitIgnoreFile(file: string) {
  writeFile(file, `typings/auto-imports.d.ts`, { flag: 'a' })
}

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
    await execa('pnpm.cmd', ['init'], { stdio: 'inherit', cwd })

    execa('pnpm.cmd', ['pkg', 'set', 'type=module'], { cwd })
    execa('pnpm.cmd', ['pkg', 'delete', 'scripts.test'], { cwd })
    execa('pnpm.cmd', ['pkg', 'set', 'main=dist/index.js'], { cwd })
    execa('pnpm.cmd', ['pkg', 'set', 'module=dist/index.js'], { cwd })
    execa('pnpm.cmd', ['pkg', 'set', 'types=dist/index.d.ts'], { cwd })

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

function pkgToWorkspace(file: string, pkg: string) {
  if (!isExisting(file)) {
    console.log(error('pnpm-workspace.yaml 文件不存在'))

    return
  }

  const sourceText = readFile(file)

  const ast = parseYaml(sourceText)

  ast.packages = [...(ast.packages || []), pkg.replaceAll('\\', '/')]

  writeFile(file, stringify(ast))
}

export function setCustomTemplateAction(dirname: string, template?: string, options?: { ignores: string[] }) {
  // region 路径名、模板名归一化
  if (!isAbsolutePath(dirname)) {
    dirname = join(process.cwd(), dirname)
  }

  if (!isExisting(dirname)) {
    console.log(`路径 ${dirname} 不存在`)

    return
  }

  if (!template) {
    template = parsePath(dirname).name
  }
  // endregion

  const templatesDir = join(__dirname, 'templates')
  if (!isExisting(templatesDir)) {
    mkdir(templatesDir)
  }

  const existingTemplates = readdir(templatesDir)
  if (existingTemplates.includes(template)) {
    console.log(error(`模板名 ${template} 已存在`))

    return
  }

  const templatePath = join(templatesDir, template)
  copy(dirname, templatePath, ['node_modules', '.git', ...(options?.ignores ?? [])])
}

export async function cpTemplateAction(template: string, projectName: string) {
  projectName ??= template

  const templatePath = join(__dirname, 'templates', template)
  if (!isExisting(templatePath)) {
    console.log(error(`模板 ${template} 不存在`))

    return
  }

  const projectPath = join(process.cwd(), projectName)
  if (isExisting(projectPath)) {
    console.log(error(`目录 ${projectName} 已存在`))

    return
  }

  try {
    copy(templatePath, projectPath)

    await execa('git', ['init'], { cwd: projectPath })
  }
  catch (error) {
    console.error(error)
    rm(projectPath)
  }
}

export function showTemplatesAction() {
  const templatesPath = join(__dirname, 'templates')

  if (!isExisting(templatesPath)) {
    console.log(warning('模板列表为空'))

    return
  }

  const templates = readdir(templatesPath)
  console.log(templates.map(t => `* ${warning(t)}`).join('\n'))
}

export function deleteTemplate(template: string) {
  const templatePath = join(__dirname, 'templates', template)

  if (!isExisting(templatePath)) {
    console.log(error(`模板 ${template} 不存在`))

    return
  }

  rm(templatePath)
}

function createBuildToolConfig(buildTool: 'vite' | 'tsdown', cwd: string, framework: string | undefined) {
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
    writeFile(join(cwd, 'vite.config.ts'), viteConfig.join('\n'))
  }
}

function createTsdownConfig(cwd: string) {
  writeFile(join(cwd, 'tsdown.config.dev.ts'), tsdownConfig.join('\n'))
  writeFile(join(cwd, 'tsdown.config.build.ts'), tsdownBuildConfig.join('\n'))
}

async function createProjectType(projectType: 'node' | 'web', cwd: string) {
  if (projectType === 'node') { /* empty */ }
  else if (projectType === 'web') {
    writeFile(join(cwd, 'index.html'), webIndexHtmlConfig.join('\n'))
    await execa('tm.cmd', ['pkg', 'packages', 'main', '--add=false'], { cwd })
  }
}

function createApp(framework: string, cwd: string) {
  if (framework === 'vue') {
    writeFile(join(cwd, 'packages', 'main', 'src', 'App.vue'), vueAppFile.join('\n'), { flag: 'w' })
    writeFile(join(cwd, 'packages', 'main', 'src', 'index.ts'), vueMainFile.join('\n'))
  }
}
