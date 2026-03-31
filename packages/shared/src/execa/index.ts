import { execa as _execa } from 'execa'

export async function execa(...args: Parameters<typeof _execa>) {
  return await _execa(...args)
}
