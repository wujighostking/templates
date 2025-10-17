import type { ConfirmOptions, SelectOptions, TextOptions } from '@clack/prompts'
import { confirm, select, text } from '@clack/prompts'
import { isBoolean, isString } from './type'

export async function createSelect(selectOptions: SelectOptions<string>) {
  const { message, options } = selectOptions

  return await select({
    message,
    options,
  })
}

export async function createConfirm(confirmOptions: ConfirmOptions) {
  try {
    return await confirm({ ...confirmOptions }).then(result => isBoolean(result) ? result : false, () => false)
  }
  catch {
    return false
  }
}

export async function createText(options: TextOptions) {
  try {
    return await text(options).then(result => isString(result) ? result : '')
  }
  catch {
    return ''
  }
}
