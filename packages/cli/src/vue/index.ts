import type { ArrayExpression, NodePath } from '@tm/utils'
import { EOL } from 'node:os'
import process from 'node:process'
import { commitConfig, eslintConfig, execa, generate, isExisting, join, mkdir, npmrc, parse, pnpm, readFile, rm, traverse, types, unoConfig, vscodeSettings, writeFile } from '@tm/utils'

export async function createVueProject(dir: string) {
  const cwd = join(process.cwd(), dir)
  try {
    const devDependencies = ['@commitlint/cli', '@commitlint/config-conventional', 'lint-staged', 'simple-git-hooks', 'unocss', 'unplugin-auto-import', '@antfu/eslint-config', 'eslint', 'eslint-plugin-format', '@unocss/eslint-plugin']

    await execa(pnpm, ['create', 'vue', dir], { stdio: 'inherit' })

    await execa('git', ['init'], { stdio: 'inherit', cwd })

    // await execa('pnpx', ['@antfu/eslint-config'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'scripts.commitlint=commitlint --edit', 'scripts.lint=eslint', 'scripts.lint:fix=eslint --fix', 'scripts.preinstall=npx only-allow pnpm'], { stdio: 'inherit', cwd })

    await execa(pnpm, ['pkg', 'set', 'simple-git-hooks={"pre-commit": "npx lint-staged", "commit-msg": "pnpm commitlint"}', 'lint-staged={"*": ["eslint --fix"]}', '--json'], { stdio: 'inherit', cwd })

    if (!isExisting(join(cwd, '.vscode'))) {
      mkdir(join(cwd, '.vscode'))
    }

    writeFile(join(cwd, 'commitlint.config.js'), commitConfig.join(''))
    writeFile(join(cwd, 'uno.config.ts'), unoConfig.join('\n'))

    mainAddUnoCss(join(cwd, 'src', 'main.ts'))
    setViteConfig(join(cwd, 'vite.config.ts'))
    addTypings(join(cwd, 'env.d.ts'))
    addGitIgnoreFile(join(cwd, '.gitignore'))

    writeFile(join(cwd, '.nvmrc'), process.version.slice(0, 3))
    writeFile(join(cwd, '.npmrc'), npmrc.join(EOL))

    writeFile(join(cwd, 'eslint.config.js'), eslintConfig(['unocss: true,', 'vue: true,']).join(EOL))

    writeFile(join(cwd, '.vscode', 'settings.json'), vscodeSettings.join(''))

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

  let firstImport = true

  traverse(ast.program, {
    ImportDeclaration(node) {
      if (node.isImportDeclaration() && firstImport) {
        const newImport = types.importDeclaration(
          [],
          types.stringLiteral('virtual:uno.css'),
        )

        ast.program.body.unshift(newImport)
        firstImport = false
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

  let firstImport = true

  traverse(ast.program, {
    ImportDeclaration(node) {
      if (node.isImportDeclaration() && firstImport) {
        const unoCssImport = types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('UnoCSS'))],
          types.stringLiteral('unocss/vite'),
        )
        const autoImport = types.importDeclaration(
          [types.importDefaultSpecifier(types.identifier('AutoImport'))],
          types.stringLiteral('unplugin-auto-import/vite'),
        )

        ast.program.body.unshift(unoCssImport, autoImport)
        firstImport = false
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
