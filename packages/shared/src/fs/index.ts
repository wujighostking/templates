import { existsSync } from 'fs'
import { join as _join } from 'path'
import { cwd } from 'process'

export const __dirname = cwd()

/**
 * @description 判断当前文件是否存在
 * @param fileName 文件名
 * @returns
 */
export function isExists(fileName: string): boolean {
  try {
    return existsSync(fileName)
  } catch {
    return false
  }
}

export function join(...paths: string[]): string {
  return _join(...paths)
}
