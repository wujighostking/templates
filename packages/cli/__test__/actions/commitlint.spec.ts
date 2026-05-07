import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { execa, join, pnpm, isExists, deleteFile, setDirname } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

import { commitlintAction } from '../../src/actions'

const __dirname = fileURLToPath(import.meta.url)
const testCommitlintPath = join(__dirname, '../../__temp/test-commitlint')

beforeAll(async () => {
  await deleteFile(testCommitlintPath)
})

describe('测试 tmes commitlint 命令', async () => {
  it('tmes commitlint', async () => {
    if (!isExists(join(testCommitlintPath, 'package.json'))) {
      mkdirSync(testCommitlintPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testCommitlintPath })
    }

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
