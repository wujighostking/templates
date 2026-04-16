import { confirm } from '@clack/prompts'

export const shouldContinue = async (message: string) =>
  await confirm({ message, initialValue: false, inactive: '否', active: '是' })
