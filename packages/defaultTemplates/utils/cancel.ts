import { LOOP } from './constants'

export function cancelPromise(callback: (...args: any[]) => any) {
  let cancel = LOOP

  const promise = new Promise((resolve, reject) => {
    cancel()
    cancel = () => {
      resolve = reject = LOOP
    }

    try {
      const maybePromiseOrResult = callback()

      if (maybePromiseOrResult instanceof Promise) {
        maybePromiseOrResult.then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
      }
      else {
        resolve(maybePromiseOrResult)
      }
    }
    catch (error) {
      reject(error)
    }
  })

  return {
    cancel,
    promise,
  }
}
