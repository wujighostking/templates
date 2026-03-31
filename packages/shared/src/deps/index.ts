import { execa, log, __dirname, pnpm } from '..'

const dependencies = new Set<string>()
const devDependencies = new Set<string>()

export function getDependencies() {
  return Array.from(dependencies)
}

export function getDevDependencies() {
  return Array.from(devDependencies)
}

export function addDependency(...deps: string[]) {
  deps.forEach((dep) => dependencies.add(dep))
}

export function addDevDependency(...deps: string[]) {
  deps.forEach((dep) => devDependencies.add(dep))
}

export type DepsMode = 'devDependencies' | 'dependencies'

export function formatdeps(deps: string[], versions: string[], mode: DepsMode) {
  return deps.map((dep, index) => `${mode}.${dep}=^${versions[index]}`)
}

export async function formatDepsVersion(mode: DepsMode) {
  const depsInstance = mode === 'devDependencies' ? getDevDependencies() : getDependencies()

  try {
    const promises = depsInstance.map(
      async (dependency) =>
        await execa(pnpm, ['view', dependency, 'version'], { cwd: __dirname }).then(
          (res: any) => res.stdout,
        ),
    )

    const versions = await Promise.all(promises)

    const deps = formatdeps(depsInstance, versions, mode)
    return deps
  } catch {
    log.error('获取依赖版本信息失败')
    return []
  }
}
