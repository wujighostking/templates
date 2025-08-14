import { dirname, isAbsolute, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

export function isAbsolutePath(path: string) {
  return isAbsolute(path)
}

export function parsePath(path: string) {
  return parse(path)
}

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
