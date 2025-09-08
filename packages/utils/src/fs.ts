import type { WriteFileOptions } from 'node:fs'
import * as fs from 'node:fs'
import { EOL } from 'node:os'
import * as path from 'node:path'
import { createIgnoreParse, ignoreFile } from './ignore'

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

export function readFile(file: string) {
  return fs.readFileSync(file, { encoding: 'utf-8' })
}

export function readdir(path: string) {
  return fs.readdirSync(path)
}

let ignoreParse: ReturnType<typeof createIgnoreParse>
export function copy(src: string, dest: string, ignores?: string[], autoIgnoreFiles: boolean = true) {
  const files = readdir(src)

  if (!isExisting(dest)) {
    mkdir(dest)
  }

  if (autoIgnoreFiles) {
    const gitignorePath = join(src, '.gitignore')
    if (isExisting(gitignorePath)) {
      ;(ignores ??= []).push(...readFile(gitignorePath).split(EOL))

      ignoreParse = createIgnoreParse(ignores)
    }
  }
  else {
    ignores ??= []
    ignoreParse = createIgnoreParse(ignores)
  }

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
      copy(srcPath, destPath, ignores)
    }
  }
}

export function stat(path: string) {
  return fs.statSync(path)
}
