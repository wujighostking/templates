import { confirm, text, type TextOptions } from '@clack/prompts'

export const shouldContinue = async (message: string) =>
  await confirm({ message, initialValue: false, inactive: '否', active: '是' })

export const getValue = async (options: TextOptions) => await text(options)
