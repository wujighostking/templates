import { getSelectedValue, getValue, type ModeType } from '@tmes/shared'

interface Options {
  name: string
  mode: ModeType
  buildTool: string
  type: string
  framework: string
}

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
    mode = (await getSelectedValue({
      message: '请选择项目模式',
      options: [
        { value: 'monorepo', label: 'Monorepo' },
        { value: 'polyrepo', label: 'Polyrepo' },
      ],
    })) as ModeType
  }
}

export function normaizeName(name: string | Options): Options | { name: string } {
  return typeof name === 'object' ? name : { name }
}
