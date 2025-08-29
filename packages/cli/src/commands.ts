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
  options?: { option: string, description: string }
  action: (...args: any[]) => void
}

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
    options: {
      option: '-n, --name <name>',
      description: 'package name',
    },
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
