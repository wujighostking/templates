import type { NodePath } from '@babel/core'
import type { ArrayExpression } from '@babel/types'
import * as process from 'node:process'
import { traverse } from '@babel/core'
import { generate } from '@babel/generator'
import { parse } from '@babel/parser'
import types from '@babel/types'
import {
  createSelect,
  error,
  frameworkSelection,
  isExisting,
  join,
  mkdir,
  readFile,
  repoSelection,
  rm,
  writeFile,
} from '@tm/utils'
import { execa } from 'execa'

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
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'typescript']

    writeFile(join(cwd, '.gitignore'), ['.idea', 'node_modules', 'dist'].join('\n'))
    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'type=module'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'private=true'], { cwd })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa('pnpm.cmd', ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    await execa('npx', ['tsc', '--init'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.commitlint=commitlint --edit'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'scripts.lint=eslint --fix'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.pre-commit=npx lint-staged'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'simple-git-hooks.commit-msg=pnpm commitlint'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged={}', '--json'], { cwd })
    await execa('pnpm.cmd', ['pkg', 'set', 'lint-staged.*=["eslint --fix"]', '--json'], { cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })

    mkdir(join(cwd, 'packages'))

    writeFile(join(cwd, 'pnpm-workspace.yaml'), 'packages:\n  - \'packages/*\'')
    writeFile(join(cwd, 'commitlint.config.js'), 'export default { extends: [\'@commitlint/config-conventional\'] }')
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

    writeFile(join(cwd, 'commitlint.config.js'), 'export default { extends: [\'@commitlint/config-conventional\'] }')
    writeFile(join(cwd, 'uno.config.ts'), ['import { defineConfig } from \'unocss\'', 'export default defineConfig({', '  rules: [', '    [\'center\', { \'display\': \'flex\', \'justify-content\': \'center\', \'align-items\': \'center\' }],', '  ],', '})'].join('\n'))

    mainAddUnoCss(join(cwd, 'src', 'main.ts'))
    viteConfig(join(cwd, 'vite.config.ts'))
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

function viteConfig(file: string) {
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

export async function pkgAction(dir: string, options: { name: string }) {
  const { name } = options

  const cwd = join(process.cwd(), dir ?? '', name)

  if (isExisting(cwd)) {
    console.log(error(`文件夹 ${name} 已存在`))

    return
  }

  mkdir(cwd)

  try {
    await execa('pnpm.cmd', ['init'], { cwd })

    await execa('pnpm.cmd', ['pkg', 'set', 'type=module'], { cwd })
    mkdir(join(cwd, 'src'))
    writeFile(join(cwd, 'src', 'index.ts'), '', { flag: 'w' })
  }
  catch (error) {
    console.error(error)
    rm(cwd)
  }
}
