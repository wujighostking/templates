import { mkdirSync } from 'node:fs'
import process from 'node:process'

import { execa, join, pnpm, isExists, isWin, deleteFile } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await deleteFile(join(process.cwd(), './packages/cli/__test__/__temp/test-commitlint'))
})

describe.sequential('测试 tmes commitlint 命令', () => {
  const testCommitlintPath = join(process.cwd(), './packages/cli/__test__/__temp/test-commitlint')

  it('tmes commitlint', async () => {
    if (!isExists(join(testCommitlintPath, 'package.json'))) {
      mkdirSync(testCommitlintPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testCommitlintPath })
    }

    await execa(isWin() ? 'tmes.cmd' : 'tmes', ['commitlint'], { cwd: testCommitlintPath })

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
