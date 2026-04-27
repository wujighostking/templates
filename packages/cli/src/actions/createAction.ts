import { getSelectedValue, getValue } from '@tmes/shared'

import {
  createNestApp,
  createNodeApp,
  createNuxtApp,
  createReactApp,
  createVueApp,
} from '../createApps'
import type { BuildToolType, FrameworkType, ModeType, Options, ProjectType } from '../types'

/**
 * polyrepo
 *  nest nuxt node
 *
 *  react vue
 *    vite tsdown
 *
 * monorepo
 *
 */
export async function createAction(options: Options) {
  let { name, mode, buildTool, type, framework } = options

  name ??= (await getValue({
    message: '请输入项目名称',
    placeholder: '请输入...',
    validate: (value) => (value ? undefined : '项目名称不能为空'),
  })) as string

  mode ??= (await getSelectedValue<ModeType>({
    message: '请选择项目模式',
    options: [
      { value: 'monorepo', label: 'monorepo' },
      { value: 'polyrepo', label: 'polyrepo' },
    ],
  })) as ModeType

  if (mode === 'polyrepo') {
    ;({ framework, type, buildTool } = await polyrepoSelected({ framework, type, buildTool }))

    createPolyrepoProject({ name, framework, type, buildTool })
  }
}

export function normaizeName(name: string | Options): Options | { name: string } {
  return typeof name === 'object' ? name : { name }
}

async function polyrepoSelected({
  framework,
  type,
  buildTool,
}: {
  framework?: FrameworkType
  type?: ProjectType
  buildTool?: BuildToolType
}) {
  framework ??= (await getSelectedValue<FrameworkType>({
    message: '请选择项目框架',
    options: [
      { value: 'react', label: 'react' },
      { value: 'vue', label: 'vue' },
      { value: 'nest', label: 'nest' },
      { value: 'nuxt', label: 'nuxt' },
      { value: 'node', label: 'node' },
    ],
  })) as FrameworkType

  if (framework === 'react' || framework === 'vue' || framework === 'node') {
    buildTool ??= (await getSelectedValue<BuildToolType>({
      message: '请选择项目构建工具',
      options: [
        { value: 'vite', label: 'vite' },
        { value: 'tsdown', label: 'tsdown' },
      ],
    })) as BuildToolType

    type ??= framework === 'node' ? 'lib' : 'web'
  }

  return { framework, type, buildTool }
}

async function createPolyrepoProject({
  name,
  framework,
  type,
  buildTool,
}: {
  name: string
  framework: FrameworkType
  type: ProjectType
  buildTool: BuildToolType
}) {
  if (framework === 'react') {
    createReactApp({ name, buildTool, type })
  } else if (framework === 'vue') {
    createVueApp({ name, buildTool, type })
  } else if (framework === 'nest') {
    createNestApp({ name })
  } else if (framework === 'nuxt') {
    createNuxtApp({ name })
  } else if (framework === 'node') {
    createNodeApp({ name })
  }
}
