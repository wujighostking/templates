import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { deleteFile, isExists, join, setDirname } from '@tmes/shared'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { createAction } from '../../src/actions'
import type { BuildToolType, FrameworkType, ProjectType } from '../../src/types'

vi.mock('@tmes/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tmes/shared')>()

  let dirname = (actual as any).__dirname

  const setDirname = (next: string) => {
    dirname = next
  }

  return {
    ...(actual as any),
    get __dirname() {
      return dirname
    },
    setDirname,
    execa: vi.fn(async () => ({ stdout: '', stderr: '' })),
    getDepsFromPackage: vi.fn(async () => ({ dependencies: {}, devDependencies: {} })),
    formatDepsVersion: vi.fn(async () => []),
    shouldContinue: vi.fn(async () => false),
  }
})

/**
 * 源码运行时 `createTemplate` 通过 `../../node_modules` 定位模板，无法在未打包的
 * 源码环境下解析到模板目录，这里按正确的路径重新实现模板拷贝。
 */
vi.mock('../../src/createApps/creator.ts', async () => {
  const { cpSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { fileURLToPath } = await import('node:url')

  const templatesRoot = join(fileURLToPath(import.meta.url), '../../../../templates')

  return {
    createTemplate: async (templateName: string, name: string) => {
      cpSync(join(templatesRoot, `template-${templateName}`), join(process.cwd(), name), {
        recursive: true,
      })
    },
  }
})

const __dirname = fileURLToPath(import.meta.url)
const testCreatePath = join(__dirname, '../../__temp/test-create')
const originalCwd = process.cwd()

const lintFiles = ['commitlint.config.ts', 'oxlint.config.ts', 'oxfmt.config.ts']

const cases: {
  title: string
  name: string
  framework: FrameworkType
  buildTool: BuildToolType
  type: ProjectType
  files: string[]
}[] = [
  {
    title: 'polyrepo 模式创建 react 项目',
    name: 'test-react',
    framework: 'react',
    buildTool: 'vite',
    type: 'web',
    files: ['package.json', 'vite.config.ts', 'index.html', 'src'],
  },
  {
    title: 'polyrepo 模式创建 vue 项目',
    name: 'test-vue',
    framework: 'vue',
    buildTool: 'vite',
    type: 'web',
    files: ['package.json', 'vite.config.ts', 'index.html', 'src'],
  },
  {
    title: 'polyrepo 模式创建 nest 项目',
    name: 'test-nest',
    framework: 'nest',
    buildTool: undefined,
    type: undefined,
    files: ['package.json', 'nest-cli.json', 'tsconfig.json'],
  },
  {
    title: 'polyrepo 模式创建 nuxt 项目',
    name: 'test-nuxt',
    framework: 'nuxt',
    buildTool: undefined,
    type: undefined,
    files: ['package.json', 'nuxt.config.ts', 'tsconfig.json'],
  },
  {
    title: 'polyrepo 模式创建 node 项目',
    name: 'test-node',
    framework: 'node',
    buildTool: 'vite',
    type: 'lib',
    files: ['package.json', 'vite.config.ts', 'tsconfig.json'],
  },
]

const monorepoSubpackages: { dir: string; files: string[] }[] = [
  { dir: 'template-react', files: ['package.json', 'vite.config.ts', 'index.html'] },
  { dir: 'template-vue', files: ['package.json', 'vite.config.ts', 'index.html'] },
  { dir: 'template-nest', files: ['package.json', 'nest-cli.json', 'tsconfig.json'] },
  { dir: 'template-nuxt', files: ['package.json', 'nuxt.config.ts', 'tsconfig.json'] },
  { dir: 'template-node', files: ['package.json', 'vite.config.ts', 'tsconfig.json'] },
]

beforeAll(async () => {
  await deleteFile(testCreatePath)
  mkdirSync(testCreatePath, { recursive: true })
  process.chdir(testCreatePath)
  setDirname(testCreatePath)
})

afterAll(async () => {
  process.chdir(originalCwd)
  // await deleteFile(testCreatePath)
})

describe('测试 createAction 命令函数', () => {
  it('应该有 create 命令', () => {
    expect(createAction).toBeDefined()
  })

  it.each(cases)('$title', async ({ name, framework, buildTool, type, files }) => {
    setDirname(testCreatePath)

    await createAction({ name, mode: 'polyrepo', framework, buildTool, type })

    const projectPath = join(testCreatePath, name)

    expect(isExists(projectPath)).toBeTruthy()

    for (const file of [...files, ...lintFiles]) {
      expect(isExists(join(projectPath, file))).toBeTruthy()
    }
  })

  it('monorepo 模式创建项目（包含全部子包）', async () => {
    setDirname(testCreatePath)

    const name = 'test-monorepo'
    const frameworks: FrameworkType[] = ['react', 'vue', 'nest', 'nuxt', 'node']

    await createAction({
      name,
      mode: 'monorepo',
      framework: frameworks,
      buildTool: 'vite',
      type: undefined,
    })

    const projectPath = join(testCreatePath, name)

    expect(isExists(projectPath)).toBeTruthy()

    // 根目录模板文件 + lint 配置
    for (const file of [
      'package.json',
      'pnpm-workspace.yaml',
      'turbo.json',
      'tsconfig.json',
      ...lintFiles,
    ]) {
      expect(isExists(join(projectPath, file))).toBeTruthy()
    }

    // 全部子包
    for (const { dir, files } of monorepoSubpackages) {
      for (const file of files) {
        expect(isExists(join(projectPath, 'packages', dir, file))).toBeTruthy()
      }
    }
  })
})
