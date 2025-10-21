import { describe, expect, it } from 'vitest'
import { hasChange, isBoolean, isEmpty, isFunction, isNumber, isObject, isObjectAndNotEmpty, isString } from '../../utils/type'

describe('test type function', () => {
  it('test string', () => {
    expect(isString('')).toBe(true)
    expect(isString(1)).toBe(false)
  })

  it('test boolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean('')).toBe(false)
  })

  it('test number', () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber('')).toBe(false)
  })

  it('test isEmpty', () => {
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(false)
  })

  it('test isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject('')).toBe(false)
  })

  it('test isFunctiong', () => {
    expect(isFunction('')).toBe(false)
    expect(isFunction(() => {})).toBe(true)
  })

  it('test isObjectAndNotEmpty', () => {
    expect(isObjectAndNotEmpty({})).toBe(true)
    expect(isObjectAndNotEmpty([])).toBe(false)
    expect(isObjectAndNotEmpty('')).toBe(false)
  })

  it('test hasChange', () => {
    expect(hasChange(1, 1)).toBe(false)
    expect(hasChange(1, 2)).toBe(true)
    expect(hasChange({ a: 1 }, { a: 1 })).toBe(true)

    const obj = { a: 1 }
    obj.a = 2
    expect(hasChange(obj, obj)).toBe(false)
  })
})
