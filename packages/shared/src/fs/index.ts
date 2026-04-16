import {
  writeFile as _writeFile,
  readFile as _readFile,
  existsSync,
  mkdir,
  type PathLike,
  type PathOrFileDescriptor,
  type WriteFileOptions,
} from 'node:fs'
import { join as _join, parse, resolve, sep } from 'node:path'
import { cwd, exit } from 'node:process'

import { log } from '..'

export const __dirname = cwd()

/**
 * @description 判断当前文件是否存在
 * @param fileName 文件名
 * @returns
 */
export function isExists(fileName: PathLike): boolean {
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

export function createFolder(folderName: string | string[]) {
  const folderPath = join(...(Array.isArray(folderName) ? folderName : [folderName]))

  if (isExists(folderPath)) {
    log.warning('文件夹已存在')
    exit(1)
  }

  return new Promise((resolve, reject) => {
    try {
      mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          log.error(`创建文件夹失败: ${err.message}`)
          reject(err)
          exit(1)
        }

        log.success(`文件夹 ${folderName} 创建成功`)
        resolve(void 0)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function isRootPath(filePath: string) {
  const parsed = parse(resolve(filePath))
  // 根路径的特点：dir 等于 root，且 base 为空
  return parsed.dir === parsed.root && parsed.base === ''
}

export function readFile(filePath: PathOrFileDescriptor) {
  return new Promise<string>((resolve, reject) => {
    try {
      _readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        // oxlint-disable-next-line no-unused-expressions
        err ? reject(err) : resolve(data)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function parsePathToArray(dirPath: string) {
  return dirPath.split(sep).filter(Boolean)
}
