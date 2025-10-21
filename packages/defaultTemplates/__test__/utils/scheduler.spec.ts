import { describe, expect, it } from 'vitest'
import { Scheduler } from './../../utils/scheduler'

describe('scheduler', () => {
  const scheduler = new Scheduler()

  scheduler.addTask([
    1,
    () => 2,
    new Promise(resolve => resolve(3)),
    () => new Promise(resolve => resolve(4)),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(5)
      }, 3000)
    }),
  ])
  scheduler.runTask()

  it('should work', () => {
    expect(scheduler.getResults()).resolves.toEqual([1, 2, 3, 4, 5])
  })
})
