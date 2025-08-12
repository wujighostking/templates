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
  readFile,
  repoSelection,
  rm,
  writeFile,
} from '@tm/utils'
import { execa } from 'execa'

export async function createAction(dir: string) {
  async function create() {
    if (isExisting(dir)) {
      console.log(error(`目录 ${dir} 已存在`))

      return
    }

    const repoType = await createSelect(repoSelection)
    await createSelect(frameworkSelection)

    if (repoType === 'monorepo') {
      // TODO
    }
    else {
      await createProject(dir)
    }
  }

  await create()
}

async function createProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss']

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
    viteConfigAddUnoCss(join(cwd, 'vite.config.ts'))
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

function viteConfigAddUnoCss(file: string) {
  const sourceText = readFile(file)
  const ast = parse(sourceText, { sourceType: 'module' })

  traverse(ast, {
    Program(path) {
      const firstImport = path.get('body.0')

      if (firstImport.isImportDeclaration()) {
        const newImport = types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('UnoCSS'))],
          types.stringLiteral('unocss/vite'),
        )
        firstImport.insertAfter(newImport)
      }
    },

    ArrayExpression(path: NodePath<ArrayExpression>) {
      // 检查是否是 `plugins` 属性的数组
      if (types.isObjectProperty(path.parent) && 'name' in path.parent.key && path.parent.key.name === 'plugins') {
        const unoCSSNode = types.callExpression(
          types.identifier('UnoCSS'),
          [],
        )

        path.node.elements.unshift(unoCSSNode)
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
