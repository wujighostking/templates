import {
  execa,
  getMultiSelectedValue,
  getSelectedValue,
  getValue,
  isCancel,
  join,
  pnpm,
  __dirname,
} from '@tmes/shared'
import templates from '@tmes/templates' with { type: 'json' }

import {
  createNestApp,
  createNodeApp,
  createNuxtApp,
  createReactApp,
  createVueApp,
} from '../createApps'
import { createCustomApp } from '../createApps/createCustomApp.ts'
import { createMonorepoApp } from '../createApps/createMonorepo.ts'
import type { BuildToolType, FrameworkType, ModeType, Options, ProjectType } from '../types'
import { setLintPreset, setProjectInit } from './commonAction.ts'

const defaultTemplates = new Set<string>([
  'react',
  'vue',
  'nest',
  'nuxt',
  'node-tsdown',
  'node-vite',
  'monorepo',
])

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

  isCancel(name)

  if (!mode) {
    const hasDefaultTemplate =
      templates.filter((template) => !defaultTemplates.has(template.name)).length > 0

    mode = (await getSelectedValue<ModeType>({
      message: '请选择项目模式',
      options: [
        { value: 'monorepo', label: 'monorepo' },
        { value: 'polyrepo', label: 'polyrepo' },
        {
          value: 'custom',
          label: 'custom',
          hint: hasDefaultTemplate ? '自定义模板' : '没有自定义模板',
          disabled: !hasDefaultTemplate,
        },
      ],
    })) as ModeType
  }

  isCancel(mode)

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
  } else if (mode === 'custom') {
    await createCustomProject({ name, framework } as any)
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

  isCancel(framework)

  if (framework === 'react' || framework === 'vue' || framework === 'node') {
    buildTool ??= (await getSelectedValue<BuildToolType>({
      message: '请选择项目构建工具',
      options: [
        { value: 'vite', label: 'vite' },
        { value: 'tsdown', label: 'tsdown' },
      ],
    })) as BuildToolType

    isCancel(buildTool)

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

  await execa(pnpm, ['pkg', 'set', `name=${name}`], { cwd: join(__dirname, name) })

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

  isCancel(framework)

  framework = Array.isArray(framework) ? framework : [framework]

  if (framework.includes('react') || framework.includes('vue') || framework.includes('node')) {
    buildTool ??= (await getSelectedValue<BuildToolType>({
      message: '请选择项目构建工具',
      options: [
        { value: 'vite', label: 'vite' },
        { value: 'tsdown', label: 'tsdown' },
      ],
    })) as BuildToolType

    isCancel(buildTool)

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

  await execa(pnpm, ['pkg', 'set', `name=${name}`], { cwd: join(__dirname, name) })

  await setLintPreset(name)

  await setProjectInit()
}

async function customSelected(options: any) {
  let { framework } = options

  framework ??= await getSelectedValue({
    message: '请选择自定义模板',
    options: templates
      .map((template) => {
        if (!defaultTemplates.has(template.name)) {
          return { value: template.name, label: template.name }
        }
      })
      .filter(Boolean) as { value: string; label: string }[],
  })

  isCancel(framework)

  return { framework }
}

async function createCustomProject({
  name,
  framework,
}: {
  name: string
  framework: FrameworkType
}) {
  ;({ framework } = await customSelected({ name, framework }))

  await createCustomApp({ name, framework })
}
