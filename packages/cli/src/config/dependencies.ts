const dependencies = new Set<string>()
const devDependencies = new Set<string>()

export function getDependencies() {
  return Array.from(dependencies)
}

export function getDevDependencies() {
  return Array.from(devDependencies)
}

export function addDependency(dep: string) {
  dependencies.add(dep)
}

export function addDevDependency(dep: string) {
  devDependencies.add(dep)
}
