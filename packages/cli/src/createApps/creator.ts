import { fileURLToPath } from 'node:url'

import { copy, isExists, join, log } from '@tmes/shared'
import { templates } from '@tmes/templates'

import type { FrameworkType } from '../types'

export async function createTemplate(templateName: FrameworkType, name: string) {
  const __dirname = fileURLToPath(import.meta.url)

  const { path: templatePath } = templates.find((t) => t.name === templateName) ?? {}
  const reactTemplatePath = join(__dirname, `../../node_modules/@tmes/templates/${templatePath}`)
  if (!isExists(reactTemplatePath)) {
    log.error('请选择已存在的模板')
    process.exit(1)
  }

  await copy(reactTemplatePath, join(process.cwd(), name))

  log.success(`创建 ${templateName} 成功`)
}
