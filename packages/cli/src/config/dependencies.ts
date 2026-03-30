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
