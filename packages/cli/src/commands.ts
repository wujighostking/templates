import {
  cpTemplateAction,
  createAction,
  deleteTemplate,
  pkgAction,
  setCustomTemplateAction,
  showTemplatesAction,
} from './actions'

interface CommandsOptions {
  command: { command: string, description?: string }
  options?: Options | Options[]
  action: (...args: any[]) => void
}
interface Options { option: string, description: string, config?: OptionConfig }
interface OptionConfig { type: string[] }

export const commands: CommandsOptions[] = [
  {
    command: {
      command: 'create <projectName>',
      description: 'Create a new project',
    },
    action: createAction,
  },
  {
    command: {
      command: 'pkg [dir] [name]',
      description: 'Add a package to project',
    },
    options: [
      {
        option: '-n, --name <name>',
        description: 'package name',
      },
      {
        option: '-a, --add [isAddWorkSpace]',
        description: 'add this package to workspace file',
      },
    ],
    action: pkgAction,
  },
  {
    command: {
      command: 'set <dirname> [templateName]',
      description: 'set custom template',
    },
    options: {
      option: '-i, --ignores [ignores]',
      description: 'ignore custom template file or directory',
      config: {
        type: ['string'],
      },
    },
    action: setCustomTemplateAction,
  },
  {
    command: {
      command: 'cp <template> [projectName]',
      description: 'copy template to current dir',
    },
    action: cpTemplateAction,
  },
  {
    command: {
      command: 'ls',
      description: 'get templates list',
    },
    action: showTemplatesAction,
  },
  {
    command: {
      command: 'delete <template>',
      description: 'delete existing template',
    },
    action: deleteTemplate,
  },
]
