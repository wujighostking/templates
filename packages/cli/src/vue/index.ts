import type { ArrayExpression, NodePath } from '@tm/utils'
import process from 'node:process'
import { commitConfig, execa, generate, join, parse, pnpm, readFile, rm, traverse, types, unoConfig, writeFile } from '@tm/utils'

export async function createVueProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss', 'unplugin-auto-import']

    await execa(pnpm, ['create', 'vue', dir], { stdio: 'inherit' })

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'scripts.commitlint=commitlint --edit', 'scripts.lint=eslint --fix'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { stdio: 'inherit', cwd })

    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join('\n'))

    mainAddUnoCss(join(cwd, 'src', 'main.ts'))
    setViteConfig(join(cwd, 'vite.config.ts'))
    addTypings(join(cwd, 'env.d.ts'))
    addGitIgnoreFile(join(cwd, '.gitignore'))

    await execa(pnpm, ['install', '-D', ...devDependencies], { stdio: 'inherit', cwd })

    await execa('npx', ['simple-git-hooks'], { stdio: 'inherit', cwd })
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
