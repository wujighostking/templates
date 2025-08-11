import type { SelectOptions } from '@clack/prompts'
import { select } from '@clack/prompts'

export async function createSelect(selectOptions: SelectOptions<string>) {
  const { message, options } = selectOptions

  return await select({
    message,
    options,
  })
}
