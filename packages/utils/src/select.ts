import type { ConfirmOptions, SelectOptions } from '@clack/prompts'
import { confirm, select, text } from '@clack/prompts'
import { isString } from './type'

export async function createSelect(selectOptions: SelectOptions<string>) {
  const { message, options } = selectOptions

  return await select({
    message,
    options,
  })
}

export async function createConfirm(confirmOptions: ConfirmOptions) {
  try {
    return await confirm({ ...confirmOptions }).then(result => isString(result) ? result : false)
  }
  catch {
    return false
  }
}

export async function createText(message: string) {
  try {
    return await text({ message }).then(result => isString(result) ? result : '')
  }
  catch {
    return ''
  }
}
