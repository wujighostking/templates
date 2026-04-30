import type { FrameworkType } from '../types'
import { createTemplate } from './creator.ts'

export async function createCustomApp(options: { name: string; framework: FrameworkType }) {
  await createTemplate(options.framework, options.name)
}
