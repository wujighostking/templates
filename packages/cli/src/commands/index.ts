import type { CAC, Command } from 'cac'

import {
  pkgAction,
  createAction,
  normaizeName,
  commitlintAction,
  githooksAction,
  lintstagedAction,
  oxlintAction,
  oxfmtAction,
} from '../actions'

type ActionParameters = Parameters<Parameters<Command['action']>[0]>
interface CommandConfig {
  command: Parameters<CAC['command']>
  options?: Parameters<CAC['option']>[]
  action: (...args: ActionParameters) => void
}

export const commands: CommandConfig[] = [
  {
    command: ['create [name]', '创建一个新的项目', { allowUnknownOptions: true }],
    options: [
      ['--name, -n [name]', '需要创建的项目名称'],
      ['--mode, -m [mode]', '需要创建的项目模式, 可选值: "monorepo" | "polyrepo"'],
      ['--buildTool, -b [buildTool]', '需要创建的项目构建工具, 可选值: "vite" | "tsdown"'],
      ['--type, -t [type]', '需要创建的项目类型, 可选值: "web" | "lib"'],
      [
        '--framework, -f [framework]',
        '需要创建的项目框架, 可选值: "react" | "vue" | "nest" | "nuxt"',
      ],
    ],
    action: (name, options) => {
      const _name = normaizeName(name)

      createAction({ ..._name, ...options })
    },
  },
  {
    command: ['pkg [dir] [packageName]', '创建一个包到指定目录'],
    options: [
      ['--dir, -d [dir]', '需要创建包的目录'],
      ['--packageName, -p [packageName]', '需要创建包的名称'],
    ],
    action: (dir, packageName, options) => {
      pkgAction({ dir, packageName, ...options })
    },
  },
  {
    command: ['commitlint', '创建检查提交信息是否符合规范的配置'],
    action: () => {
      commitlintAction()
    },
  },
  {
    command: ['githooks', '创建 git hooks 的配置'],
    action: () => {
      githooksAction()
    },
  },
  {
    command: ['lintstaged', '创建 lint-staged 的配置'],
    action: () => {
      lintstagedAction()
    },
  },
  {
    command: ['oxlint', '创建 oxlint 的配置'],
    action: () => {
      oxlintAction()
    },
  },
  {
    command: ['oxfmt', '创建 oxfmt 的配置'],
    action: () => {
      oxfmtAction()
    },
  },
  {
    command: ['lint-preset', '创建 commitlint, githooks, lint-staged, oxlint, oxfmt 的配置'],
    action: () => {
      commitlintAction()
      githooksAction()
      lintstagedAction()
      oxlintAction()
      oxfmtAction()
    },
  },
]
