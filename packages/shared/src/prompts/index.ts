import { confirm, select, text, type SelectOptions, type TextOptions } from '@clack/prompts'

export const shouldContinue = async (message: string) =>
  await confirm({ message, initialValue: false, inactive: '否', active: '是' })

export const getValue = async (options: TextOptions) => await text(options)

export const getSelectedValue = async <T = unknown>(options: SelectOptions<T>) =>
  await select(options)
