import { createTemplate } from './creator.ts'

export async function createNuxtApp(options: { name: string }) {
  await createTemplate('nuxt', options.name)
}
