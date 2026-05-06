import { mkdirSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { deleteFile, execa, isExists, join, pnpm, setDirname } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

import { oxfmtAction, oxlintAction } from '../../src/actions'

beforeAll(async () => {
  await deleteFile(join(process.cwd(), './__temp/test-oxc'))
})

describe.sequential('测试 tmes oxfmt 和 tmes oxlint 命令', () => {
  const __dirname = fileURLToPath(import.meta.url)
  const testOxcPath = join(__dirname, '../../__temp/test-oxc')

  it('tmes oxfmt', async () => {
    if (!isExists(join(testOxcPath, 'package.json'))) {
      mkdirSync(testOxcPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testOxcPath })
    }

    setDirname(testOxcPath)
    await oxfmtAction()

    expect(isExists(join(testOxcPath, 'oxfmt.config.ts'))).toBeTruthy()
  })

  it('tmes oxlint', async () => {
    if (!isExists(join(testOxcPath, 'package.json'))) {
      mkdirSync(testOxcPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testOxcPath })
    }

    setDirname(testOxcPath)
    await oxlintAction()

    expect(isExists(join(testOxcPath, 'oxlint.config.ts'))).toBeTruthy()
  })
})
