import { mkdirSync } from 'fs'
import process from 'node:process'

import { execa, join, pnpm, isExists, isWin, deleteFile } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await deleteFile(join(process.cwd(), './packages/cli/__test__/__temp/test-commitlint'))
})

describe('测试 tmes commitlint 命令', () => {
  it('tmes commitlint', async () => {
    const testCommitlintPath = join(process.cwd(), './packages/cli/__test__/__temp/test-commitlint')

    if (!isExists(join(testCommitlintPath, 'package.json'))) {
      mkdirSync(testCommitlintPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testCommitlintPath })
    }

    await execa(isWin() ? 'tmes.cmd' : 'tmes', ['commitlint'], { cwd: testCommitlintPath })

    expect(isExists(join(testCommitlintPath, 'commitlint.config.ts'))).toBeTruthy()
  })
})
