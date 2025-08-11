import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

const cwd = process.cwd()

export function isExisting(path: string): boolean {
  return fs.existsSync(join(cwd, path))
}

export function isFile(file: string): boolean {
  return fs.existsSync(file)
}

export function isDir(dir: string): boolean {
  return fs.existsSync(dir)
}

export function mkdir(dir: string) {
  return fs.mkdirSync(join(cwd, dir))
}

export function join(...paths: string[]) {
  return path.join(...paths)
}

export function writeFile(fileName: string, content: string) {
  fs.writeFileSync(fileName, content, { encoding: 'utf8' })
}

export function rm(path: string) {
  fs.rm(path, { recursive: true, force: true }, () => {})
}
