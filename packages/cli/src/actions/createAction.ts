import { getValue } from '@tmes/shared'

interface Options {
  name: string
}

export async function createAction(options: Options) {
  let { name } = options

  if (!name) {
    name = (await getValue({
      message: '请输入项目名称',
      placeholder: '请输入...',
      validate: (value) => (value ? undefined : '项目名称不能为空'),
    })) as string
  }
}

export function normaizeName(name: string | Options): Options {
  return typeof name === 'object' ? name : { name }
}
