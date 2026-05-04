import { mkdirSync } from 'node:fs'
import process from 'node:process'

import { deleteFile, execa, isExists, isWin, join, pnpm } from '@tmes/shared/src'
import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await deleteFile(join(process.cwd(), './packages/cli/__test__/__temp/test-oxc'))
})

describe.sequential('测试 tmes oxfmt 和 tmes oxlint 命令', () => {
  const testOxcPath = join(process.cwd(), './packages/cli/__test__/__temp/test-oxc')

  it('tmes oxfmt', async () => {
    if (!isExists(join(testOxcPath, 'package.json'))) {
      mkdirSync(testOxcPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testOxcPath })
    }

    await execa(isWin() ? 'tmes.cmd' : 'tmes', ['oxfmt'], { cwd: testOxcPath })

    expect(isExists(join(testOxcPath, 'oxfmt.config.ts'))).toBeTruthy()
  })

  it('tmes oxlint', async () => {
    if (!isExists(join(testOxcPath, 'package.json'))) {
      mkdirSync(testOxcPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testOxcPath })
    }

    await execa(isWin() ? 'tmes.cmd' : 'tmes', ['oxlint'], { cwd: testOxcPath })

    expect(isExists(join(testOxcPath, 'oxlint.config.ts'))).toBeTruthy()
  })
})
