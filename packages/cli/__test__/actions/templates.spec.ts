import { describe, expect, it } from 'vitest'

import { getListActions } from '../../src/actions'

describe('测试模板数据', () => {
  it('获取所有的模板信息', () => {
    const templates = getListActions()

    expect(templates).toBeInstanceOf(Array)
    expect(templates.toString()).toMatchSnapshot()
  })
})
