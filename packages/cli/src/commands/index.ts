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
    options: [['--name, -n [name]', '需要创建的项目名称']],
    action: (name, options) => {
      const _name = normaizeName(name)

      createAction({ name: _name, ...options })
    },
  },
]
