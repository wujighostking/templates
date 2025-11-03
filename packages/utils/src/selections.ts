import type { ConfirmOptions, SelectOptions } from '@clack/prompts'

export const repoSelection: SelectOptions<string> = {
  message: '请选择仓库类型: ',
  options: [
    { value: 'monorepo', label: 'monorepo' },
    { value: 'polyrepo', label: 'polyrepo' },
  ],
}

export const frameworkSelection: SelectOptions<string> = {
  message: '请选择框架: ',
  options: [
    { value: 'vue', label: 'Vue' },
    { value: 'react', label: 'React' },
    { value: 'nuxt', label: 'Nuxt' },
  ],
}

export const definiteSelection: ConfirmOptions = {
  message: '是否添加到workspace',
  initialValue: false,
}

export const buildToolsSelection: SelectOptions<string> = {
  message: '请选择构建工具',
  options: [
    { value: 'vite', label: 'vite' },
    { value: 'tsdown', label: 'tsdown' },
    { value: 'nuxt', label: 'nuxt' },
  ],
}

export const projectTypeSelection: SelectOptions<string> = {
  message: '请选择项目类型',
  options: [
    { value: 'node', label: 'node' },
    { value: 'web', label: 'web' },
  ],
}

export const vueUiSelection: SelectOptions<string> = {
  message: '请选择 ui 框架',
  options: [
    { value: 'element-plus', label: 'element-plus' },
    { value: 'ant-design-vue', label: 'ant-design-vue' },
    { value: 'element-plus-x', label: 'element-plus-x' },
    { value: '', label: '无' },
  ],
}
