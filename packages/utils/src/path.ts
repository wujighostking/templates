import { dirname, isAbsolute, parse, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export function isAbsolutePath(path: string) {
  return isAbsolute(path)
}

export function parsePath(path: string) {
  return parse(path)
}

export function pathSep(path: string) {
  return path.split(sep)
}

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
