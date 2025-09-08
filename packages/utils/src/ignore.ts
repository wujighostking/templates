import ignore from 'ignore'

export function createIgnoreParse(files: string[]) {
  return ignore().add(files)
}

export function ignoreFile(ig: ReturnType<typeof createIgnoreParse>, file: string) {
  return ig.ignores(file)
}
