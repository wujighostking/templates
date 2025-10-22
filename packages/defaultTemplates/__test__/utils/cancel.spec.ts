import { describe, expect, it, vi } from 'vitest'
import { cancelPromise } from '../../utils/cancel'

describe('cancel', () => {
  it('test promise ', async () => {
    const promiseLoop = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })
    const { promise } = cancelPromise(promiseLoop)

    const res = await promise

    expect(res).toBe(1)
  })

  it('test cancel ', async () => {
    const promiseLoop = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })

    const { cancel, promise } = cancelPromise(promiseLoop)

    const callback = vi.fn(res => res)

    promise.then(callback)

    cancel()

    await vi.waitFor(() => {
      expect(callback).not.toHaveBeenCalled()
    }, { timeout: 2000 })
  })
})
