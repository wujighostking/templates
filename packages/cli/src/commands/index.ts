import type { CAC, Command } from 'cac'
import { createAction, normaizeName } from '../actions/createAction'

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
]
