import { describe, expect, it, vi } from 'vitest'
import { cancelPromise } from '../../utils/cancel'

describe('cancel', () => {
  it('test promise ', () => {
    const promiseLoop = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })
    const { promise } = cancelPromise(promiseLoop)

    expect(promise).resolves.toBe(1)
  })

  it('test cancel ', () => {
    const promiseLoop = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })

    const { cancel, promise } = cancelPromise(promiseLoop)
    const callback = vi.fn(res => res)
    promise.then(callback)

    cancel()
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
