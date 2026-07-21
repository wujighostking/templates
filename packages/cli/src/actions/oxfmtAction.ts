import {
  addDevDependency,
  execa,
  formatDepsVersion,
  isExists,
  join,
  log,
  pnpm,
  writeFile,
  __dirname,
} from '@tmes/shared'

export const oxfmtConfigContext = `import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['dist/**', '*.min.js'],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  sortPackageJson: true,
  sortImports: {
    order: 'asc',
    sortSideEffects: true,
  },
})
`

export async function oxfmtAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('oxfmt')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(
      pnpm,
      ['pkg', 'set', 'scripts["fmt"]=oxfmt', 'scripts["fmt:check"]=oxfmt --check', ...deps],
      {
        cwd: __dirname,
      },
    )

    await writeFile(join(__dirname, 'oxfmt.config.ts'), oxfmtConfigContext)

    log.success('成功创建 oxfmt 配置')
  } catch {
    log.error('创建 oxfmt 配置失败')
  }
}
