import {
  writeFile as _writeFile,
  existsSync,
  type PathOrFileDescriptor,
  type WriteFileOptions,
} from 'node:fs'
import { join as _join } from 'node:path'
import { cwd } from 'node:process'

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

export function writeFile(
  fileName: PathOrFileDescriptor,
  data: string | NodeJS.ArrayBufferView,
  callback?: (err: NodeJS.ErrnoException | null) => void,
  options?: WriteFileOptions,
) {
  return new Promise((resolve, reject) => {
    try {
      _writeFile(fileName, data, { encoding: 'utf-8', ...(options as object) }, (err) => {
        callback?.(err)

        // oxlint-disable-next-line no-unused-expressions
        err ? reject(err) : resolve(void 0)
      })
    } catch (err) {
      reject(err)
    }
  })
}
