import { createAction } from './actions'

interface CommandsOptions {
  command: { command: string, description?: string }
  options?: { option: string, description: string }
  action: (...args: any[]) => void
}

export const commands: CommandsOptions[] = [{
  command: {
    command: 'create <projectName>',
    description: 'Create a new project',
  },

  action: createAction,
}]
