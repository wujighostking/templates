export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '' || (isArray(value) && value.length === 0)
}

export function isObject(value: unknown) {
  return typeof value === 'object' && value !== null
}

export function isFunction(value: unknown) {
  return typeof value === 'function'
}

export function isArray(value: unknown) {
  return Array.isArray(value)
}

export function isObjectAndNotEmpty(value: unknown) {
  return isObject(value) && !isEmpty(value)
}

export function hasChange<T = any>(newValue: T, oldValue: T) {
  return !Object.is(newValue, oldValue)
}
