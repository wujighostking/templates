import { mkdirSync, rm, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { EOL, isExists, join, writeFile } from '@tmes/shared'
import _templates from '@tmes/templates' with { type: 'json' }
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { deleteTemplateAction, getListActions, setTemplateAction } from '../../src/actions'

const __dirname = fileURLToPath(import.meta.url)
const testTemplate = join(__dirname, '../../__temp/template-test')
const templates = JSON.parse(JSON.stringify(_templates, null, 2))

beforeAll(async () => {
  await createTestTemplate()

  async function createTestTemplate() {
    if (isExists(testTemplate)) return

    mkdirSync(testTemplate, { recursive: true })
    await writeFile(join(testTemplate, 'test.txt'), '')
  }
})

afterAll(async () => {
  await deleteTestTemplate()

  async function deleteTestTemplate() {
    const templatePath = join(__dirname, `../../../node_modules/@tmes/templates`)

    if (!isExists(templatePath)) return

    rmSync(join(templatePath, 'template-test'), { recursive: true })
    await writeFile(join(templatePath, 'templates.json'), JSON.stringify(templates, null, 2) + EOL)
  }
})

describe('测试模板数据', () => {
  it('获取所有的模板信息', () => {
    const templates = getListActions()

    expect(templates).toBeInstanceOf(Array)
    expect(templates.toString()).toMatchSnapshot()
  })

  it('删除不存在的模板', async () => {
    const templates = getListActions()
    await deleteTemplateAction(['test'])

    expect(getListActions()).toEqual(templates)
  })

  it('添加文件夹测试模板', async () => {
    await setTemplateAction('test', testTemplate)
    const newTemplatesList = (await import('@tmes/templates')).default

    expect(newTemplatesList).toBeInstanceOf(Array)
    expect(newTemplatesList.length).toBe(templates.length + 1)
    expect(newTemplatesList[newTemplatesList.length - 1]).toEqual({
      name: 'test',
      path: './template-test',
    })
  })
})
