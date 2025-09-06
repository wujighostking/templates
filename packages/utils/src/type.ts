export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export const isArray = Array.isArray

export function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '' || (isArray(value) && value.length === 0)
}

export function isBoolean(value: unknown) {
  return typeof value === 'boolean'
}

export function stringToBoolean(value: string) {
  return isString(value) && value.trim() !== 'false'
}
