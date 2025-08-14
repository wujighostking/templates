import type { WriteFileOptions } from 'node:fs'
import * as fs from 'node:fs'
import * as path from 'node:path'

export function isExisting(path: string): boolean {
  return fs.existsSync(path)
}

export function isFile(file: string): boolean {
  return fs.existsSync(file)
}

export function isDir(dir: string): boolean {
  return fs.existsSync(dir)
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

export function copy(src: string, dest: string, ignores?: string[]) {
  const files = readdir(src)

  if (!isExisting(dest)) {
    mkdir(dest)
  }

  for (const file of files) {
    if (ignores?.includes(file)) {
      continue
    }
    const srcPath = join(src, file)
    const destPath = join(dest, file)

    const fileStat = stat(srcPath)

    if (fileStat.isFile()) {
      fs.copyFileSync(srcPath, destPath)
    }
    else {
      copy(srcPath, destPath)
    }
  }
}

export function stat(path: string) {
  return fs.statSync(path)
}
