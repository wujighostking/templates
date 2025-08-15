import type { ConfirmOptions, SelectOptions } from '@clack/prompts'
import { confirm, select } from '@clack/prompts'

export async function createSelect(selectOptions: SelectOptions<string>) {
  const { message, options } = selectOptions

  return await select({
    message,
    options,
  })
}

export async function createConfirm(confirmOptions: ConfirmOptions) {
  try {
    return await confirm({ ...confirmOptions }).then(result => typeof result === 'boolean' ? result : false)
  }
  catch {
    return false
  }
}
