import { parse, stringify } from 'yaml'

export function parseYaml(yamlString: string) {
  return parse(yamlString)
}

export function stringifyYaml(data: any) {
  return stringify(data)
}
