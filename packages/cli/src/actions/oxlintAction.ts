import {
  addDevDependency,
  execa,
  formatDepsVersion,
  isExists,
  join,
  log,
  pnpm,
  __dirname,
  writeFile,
} from '@tmes/shared'

export const oxlintConfigContext = `import { defineConfig } from 'oxlint'

export default defineConfig({
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
  },
})
`
export async function oxlintAction() {
  const packagePath = join(__dirname, 'package.json')
  const isPackageExists = isExists(packagePath)

  if (!isPackageExists) {
    log.error('package.json 文件不存在')
    return
  }

  addDevDependency('oxlint')

  try {
    const deps = await formatDepsVersion('devDependencies')
    await execa(
      pnpm,
      ['pkg', 'set', 'scripts.lint=oxlint', 'scripts.lint:fix=oxlint --fix', ...deps],
      {
        cwd: __dirname,
      },
    )

    await writeFile('oxlint.config.ts', oxlintConfigContext)

    log.success('成功创建 oxlint 配置')
  } catch {
    log.error('创建 oxlint 配置失败')
  }
}
