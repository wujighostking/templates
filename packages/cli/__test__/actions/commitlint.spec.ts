import { mkdirSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { execa, join, pnpm, isExists, deleteFile, setDirname } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

import { commitlintAction } from '../../src/actions'

beforeAll(async () => {
  await deleteFile(join(process.cwd(), '../../__temp/test-commitlint'))
})

describe.sequential('测试 tmes commitlint 命令', async () => {
  const __dirname = fileURLToPath(import.meta.url)
  const testCommitlintPath = join(__dirname, '../../__temp/test-commitlint')
  if (!isExists(join(testCommitlintPath, 'package.json'))) {
    mkdirSync(testCommitlintPath, { recursive: true })

    await execa(pnpm, ['init'], { cwd: testCommitlintPath })
  }

  it('tmes commitlint', async () => {
    setDirname(testCommitlintPath)
    await commitlintAction()

    expect(isExists(join(testCommitlintPath, 'commitlint.config.ts'))).toBeTruthy()
  })

  it('验证 conmitlint 版本信息', async () => {
    const commitlintCliVersion = await execa(pnpm, ['view', '@commitlint/cli', 'version']).then(
      (res) => res.stdout,
    )

    const commitlintConfigConventionalVersion = await execa(pnpm, [
      'view',
      '@commitlint/config-conventional',
      'version',
    ]).then((res) => res.stdout)

    const result = await execa(pnpm, ['pkg', 'get', 'devDependencies'], {
      cwd: testCommitlintPath,
    }).then((res) => (res.stdout ? JSON.parse(res.stdout as string) : {}))

    expect(result['@commitlint/cli'].slice(1)).toBe(commitlintCliVersion)
    expect(result['@commitlint/config-conventional'].slice(1)).toBe(
      commitlintConfigConventionalVersion,
    )
  })
})
