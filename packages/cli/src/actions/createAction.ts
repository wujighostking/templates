import { getSelectedValue, getValue } from '@tmes/shared'

interface Options {
  name: string
  mode: ModeType
  buildTool: string
  type: string
  framework: string
}

type ModeType = 'monorepo' | 'polyrepo'
type BuildToolType = 'vite' | 'tsdown'
type ProjectType = 'web' | 'lib'
type FrameworkType = 'react' | 'vue' | 'nest' | 'nuxt'

export async function createAction(options: Options) {
  let { name, mode, buildTool, type, framework } = options

  if (!name) {
    name = (await getValue({
      message: '请输入项目名称',
      placeholder: '请输入...',
      validate: (value) => (value ? undefined : '项目名称不能为空'),
    })) as string
  }

  if (!mode) {
    mode = (await getSelectedValue<ModeType>({
      message: '请选择项目模式',
      options: [
        { value: 'monorepo', label: 'monorepo' },
        { value: 'polyrepo', label: 'polyrepo' },
      ],
    })) as ModeType
  }

  if (!buildTool) {
    buildTool = (await getSelectedValue<BuildToolType>({
      message: '请选择项目构建工具',
      options: [
        { value: 'vite', label: 'vite' },
        { value: 'tsdown', label: 'tsdown' },
      ],
    })) as BuildToolType
  }

  if (!type) {
    type = (await getSelectedValue<ProjectType>({
      message: '请选择项目类型',
      options: [
        { value: 'web', label: 'web' },
        { value: 'lib', label: 'lib' },
      ],
    })) as ProjectType
  }

  if (!framework) {
    framework = (await getSelectedValue<FrameworkType>({
      message: '请选择项目框架',
      options: [
        { value: 'react', label: 'react' },
        { value: 'vue', label: 'vue' },
        { value: 'nest', label: 'nest' },
        { value: 'nuxt', label: 'nuxt' },
      ],
    })) as FrameworkType
  }
}

export function normaizeName(name: string | Options): Options | { name: string } {
  return typeof name === 'object' ? name : { name }
}
