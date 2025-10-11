import { EOL } from 'node:os'
import process from 'node:process'
import { __dirname, copy, createConfirm, error, execa, isAbsolutePath, isExisting, join, mkdir, parsePath, readdir, rm, rmSync, success, warning } from '@tm/utils'

export async function setCustomTemplateAction(dirname: string, template?: string, options?: { ignores: string[] }) {
  // region 路径名、模板名归一化
  if (!isAbsolutePath(dirname)) {
    dirname = join(process.cwd(), dirname)
  }

  if (!isExisting(dirname)) {
    console.log(`路径 ${dirname} 不存在`)

    return
  }

  if (!template) {
    template = parsePath(dirname).name
  }
  // endregion

  const templatesDir = join(__dirname, 'templates')
  if (!isExisting(templatesDir)) {
    mkdir(templatesDir)
  }

  let isForceDelete: boolean = false
  const existingTemplates = readdir(templatesDir)
  if (existingTemplates.includes(template)) {
    console.log(error(`模板名 ${template} 已存在`))

    isForceDelete = await coverOldTemplate(template)

    if (!isForceDelete)
      return
  }

  const templatePath = join(templatesDir, template)

  if (isForceDelete) {
    rmSync(templatePath)
  }

  const ignoreFiles = ['.git', 'node_modules', ...(options?.ignores ?? [])]

  await copy(dirname, templatePath, ignoreFiles)
}

export async function cpTemplateAction(template: string, projectName: string) {
  projectName ??= template

  const templatePath = join(__dirname, 'templates', template)
  if (!isExisting(templatePath)) {
    console.log(error(`模板 ${template} 不存在`))

    return
  }

  const projectPath = join(process.cwd(), projectName)
  if (isExisting(projectPath)) {
    console.log(error(`目录 ${projectName} 已存在`))

    return
  }

  try {
    await copy(templatePath, projectPath)

    await execa('git', ['init'], { cwd: projectPath })
  }
  catch (error) {
    console.error(error)
    rm(projectPath)
  }
}

export function showTemplatesAction() {
  const customTemplatesPath = join(__dirname, 'templates')
  const defaultTemplatesPath = join(__dirname, '..', 'node_modules', '@tmes', 'default-templates')

  const hasCustomTemplates = isExisting(customTemplatesPath)
  const hasDefaultTemplates = isExisting(defaultTemplatesPath)
  if (!hasCustomTemplates && !hasDefaultTemplates) {
    console.log(warning('模板列表为空'))

    return
  }

  const templates: { default: string[] | null, custom: string[] | null } = {
    custom: null,
    default: null,
  }

  if (hasCustomTemplates) {
    templates.custom = readdir(customTemplatesPath)
  }

  if (hasDefaultTemplates) {
    templates.default = readdir(defaultTemplatesPath).filter(t => t !== 'node_modules' && t !== 'package.json')
  }

  if (templates.custom) {
    console.log(success('# 自定义模板'))
    console.log(templates.custom.map(t => `*  ${warning(t)}`).join(EOL))
  }

  if (templates.default) {
    console.log(success('# 默认模板'))
    console.log(templates.default.map(t => `*  ${warning(t)}`).join(EOL))
  }
}

export function deleteTemplate(template: string) {
  const templatePath = join(__dirname, 'templates', template)

  if (!isExisting(templatePath)) {
    console.log(error(`模板 ${template} 不存在`))

    return
  }

  rm(templatePath)
}

async function coverOldTemplate(oldTemplate: string) {
  return await createConfirm({
    message: `是否覆盖已存在的模板 ${oldTemplate}`,
    initialValue: false,
  })
}
