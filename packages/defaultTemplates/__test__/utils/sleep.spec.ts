import { describe, expect, it } from 'vitest'
import { sleep } from '../../utils/sleep'

describe('sleep', () => {
  it('test sleep', async () => {
    const startTime = performance.now()

    await sleep()

    const endTime = performance.now()

    expect(endTime - startTime).toBeGreaterThanOrEqual(3000)
  })
})
