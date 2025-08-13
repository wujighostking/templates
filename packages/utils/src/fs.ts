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
