import { parse } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  deleteFile,
  exit,
  isAbsolutePath,
  isExists,
  isFile,
  isString,
  join,
  log,
  writeFile,
  __dirname,
  copy,
} from '@tmes/shared'
import templates from '@tmes/templates' with { type: 'json' }

export function getListActions() {
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]!

    const templateName = template.name
    const templatePath = template.path.slice(2)

    log(templateName.padEnd(20, '-'), templatePath)
  }
}

export async function deleteTemplateAction(templateNames: string[]) {
  try {
    const _templateNameSet = new Set(templates.map((template) => template.name))

    const _templateNames = templateNames.filter((name) => {
      if (_templateNameSet.has(name)) return true

      log.warning(`模板 ${name} 不存在模板列表中，跳过删除`)
      return false
    })

    if (_templateNames.length === 0) {
      log('有效模板为空')
      exit(0)
    }

    const _templates = templates.filter((template) => !_templateNames.includes(template.name))
    const deleteTemplates = templates.filter((template) => _templateNames.includes(template.name))

    const __dirname = fileURLToPath(import.meta.url)
    await writeFile(
      join(__dirname, '../../node_modules/@tmes/templates/templates.json'),
      JSON.stringify(_templates, null, 2),
    )

    for (const template of deleteTemplates) {
      await deleteFile(join(__dirname, `../../node_modules/@tmes/templates`, template.path))
      log.success(`模板 ${template.name} 删除成功`)
    }
  } catch (err: any) {
    log.error(err?.message ?? err)
  }
}

export async function setTemplateAction(templateName: string, templatePath: string) {
  if (!templateName) {
    log.error('请提供模板名称')
    exit(1)
  }
  if (!templatePath) {
    log.error('请提供模板路径')
    exit(1)
  }

  if (templates.some((template) => template.name === templateName)) {
    log.warning(`模板 ${templateName} 已存在`)
    exit(1)
  }

  /**
   * 文件: 直接复制
   *  -文件路径存在
   *
   * 文件夹
   *  -文件夹路径存在
   *  -文件夹不为空
   *   -相对路径
   *   -绝对路径
   */

  if (!isAbsolutePath(templatePath)) {
    templatePath = join(__dirname, templatePath)
  }

  if (!isExists(templatePath)) {
    log.error(`模板路径 ${templatePath} 不存在`)
    exit(1)
  }

  if (isFile(templatePath)) {
    templates.push({ name: templateName, path: `./template-${templateName}` })

    try {
      const __dirname = fileURLToPath(import.meta.url)

      const base = parse(templatePath).base

      await copy(
        templatePath,
        join(__dirname, `../../node_modules/@tmes/templates/template-${templateName}/${base}`),
      )
      await writeFile(
        join(__dirname, '../../node_modules/@tmes/templates/templates.json'),
        JSON.stringify(templates, null, 2),
      )

      log.success(`模板 ${templateName} 设置成功`)
    } catch {
      log.error(`模板 ${templateName} 设置失败`)
    }
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
