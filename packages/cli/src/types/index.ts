export interface Options {
  name: string
  mode: ModeType
  buildTool: BuildToolType
  type: ProjectType
  framework: FrameworkType
}

export type ModeType = 'monorepo' | 'polyrepo'
export type BuildToolType = 'vite' | 'tsdown' | undefined
export type ProjectType = 'web' | 'lib' | undefined
export type FrameworkType = 'react' | 'vue' | 'nest' | 'nuxt' | 'node'
