import {
  __dirname,
  getMultiSelectedValue,
  getSelectedValue,
  getValue,
  join,
  setDirname,
} from '@tmes/shared'

import {
  createNestApp,
  createNodeApp,
  createNuxtApp,
  createReactApp,
  createVueApp,
} from '../createApps'
import { createMonorepoApp } from '../createApps/createMonorepo.ts'
import type { BuildToolType, FrameworkType, ModeType, Options, ProjectType } from '../types'
import { setLintPreset, setProjectInit } from './commonAction.ts'
import { lintPreset } from './lintPreset.ts'

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
    ;({ framework, type, buildTool } = await polyrepoSelected({
      framework,
      type,
      buildTool,
    } as {
      framework: FrameworkType
      type: ProjectType
      buildTool: BuildToolType
    }))

    await createPolyrepoProject({ name, framework, type, buildTool })
  } else if (mode === 'monorepo') {
    ;({ framework, buildTool } = await monorepoSelected({ framework, buildTool }))

    await createMonorepoProject({ name, framework, buildTool })
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
}): Promise<{ framework: FrameworkType; type: ProjectType; buildTool: BuildToolType }> {
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
    await createReactApp({ name, buildTool, type })
  } else if (framework === 'vue') {
    await createVueApp({ name, buildTool, type })
  } else if (framework === 'nest') {
    await createNestApp({ name })
  } else if (framework === 'nuxt') {
    await createNuxtApp({ name })
  } else if (framework === 'node') {
    await createNodeApp({ name, buildTool })
  }

  await setLintPreset(name)

  await setProjectInit()
}

async function monorepoSelected(
  options: any,
): Promise<{ framework: FrameworkType[]; buildTool: BuildToolType }> {
  let { framework, buildTool } = options

  framework ??= await getMultiSelectedValue({
    message: '请选择子包项目',
    options: [
      { value: 'react', label: 'react' },
      { value: 'vue', label: 'vue' },
      { value: 'nest', label: 'nest' },
      { value: 'nuxt', label: 'nuxt' },
      { value: 'node', label: 'node' },
    ],
  })

  framework = Array.isArray(framework) ? framework : [framework]

  if (framework.includes('react') || framework.includes('vue') || framework.includes('node')) {
    buildTool ??= (await getSelectedValue<BuildToolType>({
      message: '请选择项目构建工具',
      options: [
        { value: 'vite', label: 'vite' },
        { value: 'tsdown', label: 'tsdown' },
      ],
    })) as BuildToolType

    // type ??= framework === 'node' ? 'lib' : 'web'
  }

  return { framework, buildTool }
}

async function createMonorepoProject({
  name,
  framework,
  buildTool,
}: {
  name: string
  framework: FrameworkType[]
  buildTool: BuildToolType
}) {
  await createMonorepoApp({ name, framework, buildTool })

  await setLintPreset(name)

  await setProjectInit()
}
