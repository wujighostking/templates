import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { deleteFile, execa, isExists, join, pnpm, setDirname } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

import { oxfmtAction, oxlintAction } from '../../src/actions'

const __dirname = fileURLToPath(import.meta.url)
const testOxcPath = join(__dirname, '../../__temp/test-oxc')

beforeAll(async () => {
  await deleteFile(testOxcPath)
})

describe('测试 tmes oxfmt 和 tmes oxlint 命令', async () => {
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
    setDirname(testOxcPath)
    await oxlintAction()

    expect(isExists(join(testOxcPath, 'oxlint.config.ts'))).toBeTruthy()
  })
})
