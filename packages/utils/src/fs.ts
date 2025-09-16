import type { WriteFileOptions } from 'node:fs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readLine from 'node:readline'
import { createIgnoreParse, ignoreFile } from './ignore'
import { pathSep } from './path'

export function isExisting(path: string): boolean {
  return fs.existsSync(path)
}

export function isFile(file: string): boolean {
  return stat(file).isFile()
}

export function isDir(dir: string): boolean {
  return stat(dir).isDirectory()
}

export function mkdir(dir: string) {
  return fs.mkdirSync(dir)
}

export function join(...paths: string[]) {
  return path.join(...paths)
}

export function writeFile(fileName: string, content: string, options?: WriteFileOptions & object) {
  fs.writeFileSync(fileName, content, { encoding: 'utf8', ...options })
}

export function rm(path: string) {
  fs.rm(path, { recursive: true, force: true }, () => {})
}

export function rmSync(path: string) {
  fs.rmSync(path, { recursive: true, force: true })
}

export function readFile(file: string) {
  return fs.readFileSync(file, { encoding: 'utf-8' })
}

export function readdir(path: string) {
  return fs.readdirSync(path)
}

let ignoreParse: ReturnType<typeof createIgnoreParse>
const filesList: string[] = []
export async function copy(src: string, dest: string, ignores?: string[], autoIgnoreFiles: boolean = true) {
  const files = readdir(src)

  if (!isExisting(dest)) {
    mkdir(dest)
  }

  if (autoIgnoreFiles) {
    if (filesList.length === 0) {
      getFilesPath(src, ignores ?? [])
    }

    const gitignorePath = join(src, '.gitignore')
    if (isExisting(gitignorePath)) {
      await read_line(gitignorePath, (line) => {
        (ignores ??= []).push(line)

        return ignores
      })
    }
    ignoreParse = createIgnoreParse(ignores ??= [])
  }
  else {
    ignores ??= []

    ignoreParse = createIgnoreParse(ignores)
  }

  if (autoIgnoreFiles) {
    filesList.forEach((file) => {
      if (ignoreFile(ignoreParse, file)) {
        return
      }

      const srcPath = join(src, file)
      const destPath = join(dest, file)

      if (isFile(srcPath)) {
        fs.copyFileSync(srcPath, destPath)
      }
      else {
        mkdir(destPath)
      }
    })
  }
  else {
    for (const file of files) {
      if (ignoreFile(ignoreParse, file)) {
        continue
      }

      const srcPath = join(src, file)
      const destPath = join(dest, file)

      if (isFile(srcPath)) {
        fs.copyFileSync(srcPath, destPath)
      }
      else {
        await copy(srcPath, destPath, ignores, autoIgnoreFiles)
      }
    }
  }
}

export function stat(path: string) {
  return fs.statSync(path)
}

export function read_line(file: string, callback: (...args: any[]) => any) {
  return new Promise((resolve) => {
    let result: string[]
    const rl = readLine.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })

    rl.on('line', (line) => {
      if (result) {
        callback(line)
        return
      }

      result = callback(line)
    })

    rl.on('close', () => {
      resolve(result)
    })
  })
}

export function getFilesPath(src: string, ignores: string[] = []) {
  const sourceSrcLength = pathSep(src).length

  function setFilesPath(src: string) {
    const filesOrDir = readdir(src)

    filesOrDir.forEach((file) => {
      if (ignores.includes(file)) {
        return
      }

      filesList.push(join(...pathSep(join(src, file)).slice(sourceSrcLength)))

      const srcPath = join(src, file)

      if (isDir(srcPath)) {
        setFilesPath(srcPath)
      }
    })
  }

  setFilesPath(src)
}
