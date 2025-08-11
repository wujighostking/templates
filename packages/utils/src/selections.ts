import type { SelectOptions } from '@clack/prompts'

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
  ],
}
