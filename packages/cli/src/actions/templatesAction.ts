import { fileURLToPath } from 'node:url'

import { exit, isString, join, log, writeFile } from '@tmes/shared'
import templates from '@tmes/templates' with { type: 'json' }

export function getListActions() {
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]!

    const templateName = template.name
    const templatePath = template.path.slice(2)

    log(templateName.padEnd(20, '-'), templatePath)
  }
}

export function modifyTemplateAction(
  existingTemplateName: string,
  newTemplateName: string,
  options: { existingTemplateName: string; newTemplateName: string },
) {
  ;({ existingTemplateName, newTemplateName } = validateTemplateNames(
    existingTemplateName,
    newTemplateName,
    options,
  ))

  const template = templates.find((template) => template.name === existingTemplateName)

  if (!template) {
    log.error(`模板 ${existingTemplateName} 不存在`)
    exit(1)
  }

  if (existingTemplateName === newTemplateName) {
    log.warning(`模板名称 ${existingTemplateName} 与修改后的名称相同，无需修改`)
    exit(1)
  }

  template!.name = newTemplateName

  const __dirname = fileURLToPath(import.meta.url)
  writeFile(
    join(__dirname, '../../node_modules/@tmes/templates/templates.json'),
    JSON.stringify(templates, null, 2),
  )
    .then(() => {
      log.success('模板修改成功')
    })
    .catch(() => {
      log.error('模板修改失败')
    })
}
/**
 * @description 校验模板名称
 */
function validateTemplateNames(
  existingTemplateName: string,
  newTemplateName: string,
  options: { existingTemplateName: string; newTemplateName: string },
) {
  existingTemplateName = isString(options.existingTemplateName)
    ? options.existingTemplateName
    : existingTemplateName

  newTemplateName = isString(options.newTemplateName) ? options.newTemplateName : newTemplateName

  if (!existingTemplateName) {
    log.error('请提供需要修改的模板名称')
    exit(1)
  }

  if (!newTemplateName) {
    log.error('请提供修改后的模板名称')
    exit(1)
  }

  return { existingTemplateName, newTemplateName }
}
