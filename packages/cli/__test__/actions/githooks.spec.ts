import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { execa, join, pnpm, deleteFile, isExists, setDirname } from '@tmes/shared'
import { beforeAll, describe, expect, it } from 'vitest'

import { githooksAction } from '../../src/actions'

const __dirname = fileURLToPath(import.meta.url)
const testGithooksPath = join(__dirname, '../../__temp/test-githooks')

beforeAll(async () => {
  await deleteFile(testGithooksPath)
})

describe('测试 tmes githooks 命令', async () => {
  it('验证 simple-git-hooks 版本信息', async () => {
    if (!isExists(join(testGithooksPath, 'package.json'))) {
      mkdirSync(testGithooksPath, { recursive: true })

      await execa(pnpm, ['init'], { cwd: testGithooksPath })
    }

    setDirname(testGithooksPath)
    await githooksAction()

    const simpleGitHooksVersion = await execa(pnpm, ['view', 'simple-git-hooks', 'version']).then(
      (res) => res.stdout,
    )

    const result = await execa(pnpm, ['pkg', 'get', 'devDependencies'], {
      cwd: testGithooksPath,
    }).then((res) => (res.stdout ? JSON.parse(res.stdout as string) : {}))

    expect(result["'simple-git-hooks'"].slice(1)).toBe(simpleGitHooksVersion)
  })
})
